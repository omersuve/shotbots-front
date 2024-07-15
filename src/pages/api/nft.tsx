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

        // const fetchMagicEdenData = async (nftName: string) => {
        //     const meUrl = `https://api-mainnet.magiceden.io/v2/unifiedSearch/xchain/collection/${encodeURIComponent(nftName)}?edge_cache=true&limit=5&blockchain=solana`;
        //     const proxyUrl = `/api/proxy?url=${encodeURIComponent(meUrl)}`;
        //     const baseUrl = process.env.BASE_URL_PROD ?? "http://localhost:3000";
        //     try {
        //         const response = await fetch(`${baseUrl}${proxyUrl}`, {
        //             headers: {
        //                 "accept": "application/json, text/plain, */*",
        //                 "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6",
        //                 "priority": "u=1, i",
        //                 "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
        //                 "sec-ch-ua-mobile": "?1",
        //                 "sec-ch-ua-platform": "\"Android\"",
        //                 "sec-fetch-dest": "empty",
        //                 "sec-fetch-mode": "cors",
        //                 "sec-fetch-site": "same-site",
        //                 "Referer": "https://magiceden.io/",
        //                 "Referrer-Policy": "strict-origin-when-cross-origin",
        //             },
        //             body: null,
        //             method: "GET",
        //         });
        //         return await response.json();
        //     } catch (e) {
        //         console.error(e);
        //         throw new Error(`Normal - Invalid JSON response for ${nftName}`);
        //     }
        // };

        // const fetchMagicEdenSupplyData = async (nftName: string) => {
        //     const meSupplyUrl = `https://api-mainnet.magiceden.io/rpc/getCollectionHolderStats/${encodeURIComponent(nftName)}?edge_cache=true`;
        //     const proxyUrl = `/api/proxy?url=${encodeURIComponent(meSupplyUrl)}`;
        //     const baseUrl = process.env.BASE_URL_PROD ?? "http://localhost:3000";
        //     try {
        //         const response = await fetch(`${baseUrl}${proxyUrl}`, {
        //             headers: {
        //                 "accept": "application/json, text/plain, */*",
        //                 "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6",
        //                 "priority": "u=1, i",
        //                 "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
        //                 "sec-ch-ua-mobile": "?1",
        //                 "sec-ch-ua-platform": "\"Android\"",
        //                 "sec-fetch-dest": "empty",
        //                 "sec-fetch-mode": "cors",
        //                 "sec-fetch-site": "same-site",
        //                 "Referer": "https://magiceden.io/",
        //                 "Referrer-Policy": "strict-origin-when-cross-origin",
        //             },
        //             body: null,
        //             method: "GET",
        //         });
        //         return await response.json();
        //     } catch (e) {
        //         console.error(e);
        //         throw new Error(`Supply - Invalid JSON response for ${nftName}`);
        //     }
        // };

        const promises: Promise<NftData | null>[] = data.results.map(async (nft, index): Promise<NftData | null> => {
            try {
                if (nft.name == "STEPN") return null;
                // const magicEdenData = await fetchMagicEdenData(nft.name);
                // const magicEdenSupplyData = await fetchMagicEdenSupplyData(magicEdenData.solana[0].symbol); // Another fetch operation

                // if (magicEdenSupplyData.results.totalSupply == 0) return null;

                return {
                    name: nft.name,
                    logoUrl: nft.logo,
                    url: `https://magiceden.io/marketplace/${NFT_NAME_MAP.get(nft.slug) ?? nft.slug}`,
                    // floorPriceSol: magicEdenData.solana[0].floorPrice!,
                    avgPrice: nft.avgPriceInFiat,
                    // totalSupply: magicEdenSupplyData.results.totalSupply, // Use the other response
                    // uniqueHolders: magicEdenSupplyData.results.uniqueHolders, // Use the other response
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