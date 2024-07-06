import { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";
import { createClient, RedisClientType } from "redis";

let io: IOServer;

export const config = {
    api: {
        bodyParser: false,
    },
};

const redisUrl = process.env.REDIS_PUBLIC_URL ?? "redis://localhost:6379";
console.log("redisUrl", redisUrl);

// Create the Redis client
const redisClient: RedisClientType = createClient({ url: redisUrl });

redisClient.on("error", (err) => console.error("Redis Client Error", err));

const socketHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!res.socket) {
        res.status(500).send("Server socket not available");
        return;
    }
    // Typecast res.socket to any to access the server property
    const httpServer = (res.socket as any).server;

    if (!io) {
        io = new IOServer(httpServer, {
            path: "/api/socket",
            addTrailingSlash: false,
            cors: {
                origin: "*",
            },
        });

        try {
            await redisClient.connect();
            await redisClient.subscribe("telegram_messages", (message) => {
                console.log("redis get message:", message);
                io.emit("new_message", JSON.parse(message));
                console.log("io emit message:", message);
            });
        } catch (error) {
            console.error("Failed to connect or subscribe to Redis:", error);
        }

        (res.socket as any).server.io = io;
    }
    res.end();
};

export default socketHandler;
