import { RedisServer } from "../../RedisServer";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const redisServer = await RedisServer.getInstance();
        const topMemecoinData = await redisServer.redisClient.get("top_memecoin_data");

        if (topMemecoinData) {
            const data = JSON.parse(topMemecoinData);
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: "Top memecoin data not found" });
        }
    } catch (error) {
        console.error("Error fetching top memecoin data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
