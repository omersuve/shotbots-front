import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== "GET") {
            return res.status(405).json({ error: "Method not allowed. Only GET requests are allowed." });
        }

        const url = "https://api.messari.io/dwh/screener/v1/static/home-assets-1d/results?page=1&pageSize=30&query=%7B%22filters%22:[%7B%22id%22:%22b1e6e1d2-1c6e-4b1e-8e9b-5e5e4b4d1f1b%22,%22label%22:%22Tags%22,%22op%22:%22in%22,%22in%22:[%22Meme%22]%7D],%22selections%22:[%22Price%22,%22Price+Change+1D%22,%22Real+Volume+1D%22,%22Circulating+Marketcap%22],%22sorts%22:[%7B%22label%22:%22Circulating+Marketcap%22,%22order%22:%22desc%22%7D]%7D&v=1";
        const response = await fetch(url);
        const data = await response.json();

        const fetchChain = async (row: any) => {
            const marketCapUrl = `https://api.dexscreener.com/latest/dex/search/?q=${row[0].name}`;
            const responseMc = await fetch(marketCapUrl);
            const dataMc: any = await responseMc.json();

            if (dataMc["pairs"] && dataMc["pairs"].length > 0) {
                const sortedPairs = dataMc["pairs"].sort((a: any, b: any) => b["liquidity"]["usd"] - a["liquidity"]["usd"]);
                const item = sortedPairs[0];
                if (item["chainId"] != "solana") return null;
                return {
                    baseAddress: item.baseToken.address,
                    logoUrl: (item.info && item.info.imageUrl) ? item.info.imageUrl : "",
                    name: row[0].name,
                    symbol: row[0].symbol.toUpperCase(), // Make symbol uppercase
                    price: row[1],
                    price_change_1d: row[2],
                    real_volume_1d: row[3],
                    circulating_marketcap: item["fdv"],
                    chainId: item["chainId"],
                    url: item["url"],
                    liquidity: item["liquidity"]["usd"],
                };
            }
            return null;
        };

        const promises = data.rows.map(async (row: any) => {
            try {
                return await fetchChain(row);
            } catch (e) {
                console.log(e);
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