import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== "GET") {
            return res.status(405).json({ error: "Method not allowed. Only GET requests are allowed." });
        }

        const url = "https://api.messari.io/dwh/screener/v1/static/home-assets-1d/results?page=1&pageSize=20&query=%7B%22filters%22:[%7B%22op%22:%22%3E%22,%22value%22:0,%22label%22:%22Price+Change+1D%22,%22id%22:%22homepage-gainers%22%7D,%7B%22id%22:%22b1e6e1d2-1c6e-4b1e-8e9b-5e5e4b4d1f1b%22,%22label%22:%22Tags%22,%22op%22:%22in%22,%22in%22:[%22Meme%22]%7D],%22selections%22:[%22Price%22,%22Price+Change+1D%22,%22Real+Volume+1D%22,%22Circulating+Marketcap%22],%22sorts%22:[%7B%22label%22:%22Price+Change+1D%22,%22order%22:%22desc%22%7D]%7D&v=1";
        const response = await fetch(url);
        const data = await response.json();

        const formattedData: any[] = [];

        for (const row of data.rows) {
            const symbol = row[0].symbol.toUpperCase();
            const price = row[1]; // Get the price from the original data

            const priceThreshold = 0.1; // Define a price threshold (e.g., 5%)
            const marketCapUrl = `https://api.dexscreener.com/latest/dex/search/?q=${symbol}`;
            const responseMc = await fetch(marketCapUrl);
            const dataMc: any = await responseMc.json();

            // Check if the pairs array is not empty
            if (dataMc["pairs"] && dataMc["pairs"].length > 0) {
                // Sort pairs by FDV in descending order
                const sortedPairs = dataMc["pairs"].sort((a: any, b: any) => b["fdv"] - a["fdv"]);

                // Find the pair with the closest price match within the threshold
                for (const item of sortedPairs) {
                    const dexPrice = parseFloat(item.priceUsd);
                    const priceDifference = Math.abs(dexPrice - price) / price;

                    if (!item["liquidity"]) continue;
                    const liquidity = item["liquidity"]["usd"];

                    if (priceDifference <= priceThreshold && liquidity > item["fdv"] / 2000) {
                        formattedData.push({
                            id: row[0].id,
                            name: row[0].name,
                            symbol: symbol, // Make symbol uppercase
                            price: row[1],
                            price_change_1d: row[2],
                            real_volume_1d: row[3],
                            circulating_marketcap: item["fdv"],
                            chainId: item["chainId"],
                            url: item["url"],
                        });
                        break; // Move to the next row once a match is found
                    }
                }
            }
        }

        res.status(200).json(formattedData);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
}