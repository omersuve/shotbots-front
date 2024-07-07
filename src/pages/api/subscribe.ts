import { NextApiRequest, NextApiResponse } from "next";
import { RedisServer } from "../../RedisServer";
import Pusher from "pusher";

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
});

let isConnected = false;

async function connectRedis() {
    const app = await RedisServer.getInstance();

    console.log("redis connected!");

    await app.redisSub.subscribe("telegram_messages", async (data: any) => {
        console.log("redis get message:", data);

        // Store the message in a Redis list
        await app.redisClient.lPush("latest_messages", data);
        // Trim the list to the last 10 messages
        await app.redisClient.lTrim("latest_messages", 0, 9);

        await pusher.trigger("my-channel", "my-event", {
            message: data,
        });
    });
    console.log("redis subscribed to telegram_messages");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!isConnected) {
        await connectRedis();
        isConnected = true;
        console.log("Redis subscription setup completed");
    }
    res.status(200).json({ message: "Redis subscription active" });
}
