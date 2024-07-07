import { RedisProvider } from "./RedisProvider";
import { RedisSubscriber } from "./RedisSubscriber";
import { RedisClientType } from "@redis/client";
import Pusher from "pusher";

export class RedisServer {
    private static _instance?: RedisServer;

    public readonly redisSub: RedisSubscriber;
    public readonly redisClient: RedisClientType;
    public readonly pusher: Pusher;

    private constructor(redisSub: RedisSubscriber, redisClient: RedisClientType, pusher: Pusher) {
        this.redisSub = redisSub;
        this.redisClient = redisClient;
        this.pusher = pusher;
    }

    public static async getInstance(): Promise<RedisServer> {
        if (!this._instance) this._instance = await this.new();
        return this._instance;
    }

    private static async new(): Promise<RedisServer> {
        const redisProvider = new RedisProvider();
        const redisSub = await redisProvider.getRedisSubClient();
        const redisClient = await redisProvider.getMainRedisClient();
        const pusher = await redisProvider.getPusher();
        return new RedisServer(redisSub, redisClient, pusher);
    }
}