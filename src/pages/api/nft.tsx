import { NextApiRequest, NextApiResponse } from "next";
import { DappRadarNft, NftData } from "../../types";
import { NFT_NAME_MAP } from "../../utils/nftNameMap";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== "GET") {
            return res.status(405).json({ error: "Method not allowed. Only GET requests are allowed." });
        }
        const url = "https://nft-sales-service.dappradar.com/v3.1/collection?currency=usd&sort=volumeInFiat&order=desc&resultsPerPage=10&page=1&range=day&chainId[]=27";
        const response = await fetch(url, {
            headers: {
                "Referer": "https://dappradar.com/",
            },
        });
        const data: DappRadarNft = await response.json();

        const promises: Promise<NftData | null>[] = data.results.map(async (nft, index): Promise<NftData | null> => {
            try {
                if (nft.name == "STEPN") return null;
                return {
                    name: nft.name,
                    logoUrl: nft.logo,
                    url: `https://magiceden.io/marketplace/${NFT_NAME_MAP.get(nft.slug) ?? nft.slug}`,
                    avgPrice: nft.avgPriceInFiat,
                    avgPriceChange: nft.avgPriceChange,
                    volumeUsd: nft.volumeInFiat,
                    volumeChange: nft.volumeChange,
                    traders: nft.tradersCount,
                    tradersChange: nft.tradersCountChange,
                    sales: nft.salesCount,
                    salesChange: nft.salesCountChange,
                    chainId: "solana",
                };
            } catch (e) {
                console.log(nft.name, "returned null!", e);
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