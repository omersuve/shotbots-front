import { NextApiRequest, NextApiResponse } from "next";
import { RedisServer } from "../../RedisServer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const app = await RedisServer.getInstance();
    const messages = await app.redisClient.lRange("latest_pump", 0, 9);
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
