import { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "node:http";
import { Socket as NetSocket } from "node:net";
import { RedisServer } from "../../../RedisServer";

interface SocketServer extends HTTPServer {
    io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
    server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO;
}

export default async function handler(_: NextApiRequest, res: NextApiResponseWithSocket) {
    if (!res.socket.server.io) {
        const io = new IOServer(res.socket.server, {
            path: "/api/socket/io",
            addTrailingSlash: false,
            cors: {
                origin: "*",
            },
        });
        res.socket.server.io = io;
        io.on("connection", socket => redisEvents(socket));
        io.on("error", e => {
            console.log("error", e);
        });
    }
    res.status(200).end();
}

export const config = {
    api: {
        bodyParser: false,
    },
};

async function redisEvents(socket: Socket) {
    const app = await RedisServer.getInstance();

    console.log("io connected!");

    await app.redisSub.subscribe("telegram_messages", (data) => {
        console.log("redis get message:", data);
        socket.emit("new_message", data);
    });
}