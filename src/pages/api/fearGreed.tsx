import { RedisServer } from "../../RedisServer";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const redisServer = await RedisServer.getInstance();
        const fgData = await redisServer.redisClient.get("fg_data");

        if (fgData) {
            const data = JSON.parse(fgData);
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: "Fear Greed data not found" });
        }
    } catch (error) {
        console.error("Error fetching fear greed data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
