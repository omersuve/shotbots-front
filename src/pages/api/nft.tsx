import { NextApiRequest, NextApiResponse } from "next";
import { DappRadarNft, MagicEdenNftData, NftData } from "../../types";

const delay = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== "GET") {
            return res.status(405).json({ error: "Method not allowed. Only GET requests are allowed." });
        }

        const url = "https://nft-sales-service.dappradar.com/v3.1/collection?currency=usd&sort=volumeInFiat&order=desc&resultsPerPage=25&page=1&range=day&chainId[]=27";
        const response = await fetch(url, {
            headers: {
                "Referer": "https://dappradar.com/",
            },
        });
        const data: DappRadarNft = await response.json();

        const fetchMagicEdenData = async (nftName: string) => {
            const meUrl = `https://api-mainnet.magiceden.io/v2/unifiedSearch/xchain/collection/${encodeURIComponent(nftName)}?edge_cache=true&limit=5&blockchain=solana`;
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(meUrl)}`;
            const baseUrl = process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000";

            const response = await fetch(`${baseUrl}${proxyUrl}`, {
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6",
                    "priority": "u=1, i",
                    "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?1",
                    "sec-ch-ua-platform": "\"Android\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "Referer": "https://magiceden.io/",
                    "Referrer-Policy": "strict-origin-when-cross-origin",
                },
                body: null,
                method: "GET",
            });
            const textData = await response.text();
            try {
                return JSON.parse(textData);
            } catch (e) {
                console.error(`Failed to parse JSON for ${nftName}: ${textData}`);
                throw new Error(`Invalid JSON response for ${nftName}`);
            }
        };

        const promises: Promise<NftData | null>[] = data.results.map(async (nft, index): Promise<NftData | null> => {
            try {
                if (nft.name == "STEPN") return null;
                await delay(index * 100);
                const magicEdenData = await fetchMagicEdenData(nft.name);
                return {
                    name: nft.name,
                    logoUrl: magicEdenData.solana[0].image,
                    url: `https://magiceden.io/marketplace/${magicEdenData.solana[0].symbol}`,
                    floorPriceSol: magicEdenData.solana[0].floorPrice!,
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
                console.log(nft.name, e);
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