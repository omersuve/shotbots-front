import { RedisServer } from "../../RedisServer";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const redisServer = await RedisServer.getInstance();
        const memecoinData = await redisServer.redisClient.get("memecoin_data");

        if (memecoinData) {
            const data = JSON.parse(memecoinData);
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: "Memecoin data not found" });
        }
    } catch (error) {
        console.error("Error fetching memecoin data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
