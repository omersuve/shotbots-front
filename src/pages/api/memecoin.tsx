import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== "GET") {
            return res.status(405).json({ error: "Method not allowed. Only GET requests are allowed." });
        }

        const url = "https://api.messari.io/dwh/screener/v1/static/home-assets-1d/results?page=1&pageSize=25&query=%7B%22filters%22:[%7B%22op%22:%22%3E%22,%22value%22:0,%22label%22:%22Price+Change+1D%22,%22id%22:%22homepage-gainers%22%7D,%7B%22id%22:%22b1e6e1d2-1c6e-4b1e-8e9b-5e5e4b4d1f1b%22,%22label%22:%22Tags%22,%22op%22:%22in%22,%22in%22:[%22Meme%22]%7D],%22selections%22:[%22Price%22,%22Price+Change+1D%22,%22Real+Volume+1D%22,%22Circulating+Marketcap%22],%22sorts%22:[%7B%22label%22:%22Price+Change+1D%22,%22order%22:%22desc%22%7D]%7D&v=1";
        const response = await fetch(url);
        const data = await response.json();

        const priceThreshold = 0.1; // Define a price threshold (e.g., 10%)

        const fetchMarketCapData = async (symbol: string, price: number, row: any) => {
            const marketCapUrl = `https://api.dexscreener.com/latest/dex/search/?q=${symbol}`;
            const responseMc = await fetch(marketCapUrl);
            const dataMc: any = await responseMc.json();

            // Check if the pairs array is not empty
            if (dataMc["pairs"] && dataMc["pairs"].length > 0) {
                // Sort pairs by FDV in descending order
                const sortedPairs = dataMc["pairs"].sort((a: any, b: any) => b["fdv"] - a["fdv"]);

                // Filter pairs based on price threshold and sort by liquidity
                const filteredAndSortedPairs = sortedPairs
                  .filter((item: any) => {
                      const dexPrice = parseFloat(item.priceUsd);
                      const priceDifference = Math.abs(dexPrice - price) / price;
                      const isEqualSymbols = item.baseToken ? item.baseToken.symbol == symbol : false;
                      const chain = item.chainId == "base" || item.chainId == "solana" || item.chainId == "ethereum";
                      return isEqualSymbols && priceDifference <= priceThreshold && chain && item["liquidity"] && item["liquidity"]["usd"] > item["fdv"] / 2000;
                  })
                  .sort((a: any, b: any) => b["liquidity"]["usd"] - a["liquidity"]["usd"]);

                // Select the pair with the highest liquidity
                if (filteredAndSortedPairs.length > 0) {
                    const item = filteredAndSortedPairs[0];
                    if (item["fdv"] < 50000) return null;
                    return {
                        baseAddress: item.baseToken.address,
                        logoUrl: (item.info && item.info.imageUrl) ? item.info.imageUrl : "",
                        name: row[0].name,
                        symbol: symbol, // Make symbol uppercase
                        price: row[1],
                        price_change_1d: row[2],
                        real_volume_1d: row[3],
                        circulating_marketcap: item["fdv"],
                        chainId: item["chainId"],
                        url: item["url"],
                        liquidity: item["liquidity"]["usd"],
                    };
                }
            }
            return null;
        };

        const promises = data.rows.map(async (row: any) => {
            try {
                if (row[3] < 50000) return null; // Volume > 50k$
                const symbol = row[0].symbol.toUpperCase();
                const price = row[1]; // Get the price from the original data
                return await fetchMarketCapData(symbol, price, row);
            } catch (e) {
                return null;
            }
        });

        const results = await Promise.all(promises);
        const validResults = results.filter(result => result !== null);

        res.status(200).json(validResults);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
