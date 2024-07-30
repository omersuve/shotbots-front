import { RedisServer } from "../../RedisServer";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const redisServer = await RedisServer.getInstance();
        const priceData = await redisServer.redisClient.get("price_data");

        if (priceData) {
            const data = JSON.parse(priceData);
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: "Price data not found" });
        }
    } catch (error) {
        console.error("Error fetching price data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
