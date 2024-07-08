import { RedisProvider } from "./RedisProvider";
import { RedisClientType } from "@redis/client";

export class RedisServer {
    private static _instance?: RedisServer;

    public readonly redisClient: RedisClientType;

    private constructor(redisClient: RedisClientType) {
        this.redisClient = redisClient;
    }

    public static async getInstance(): Promise<RedisServer> {
        if (!this._instance) this._instance = await this.new();
        return this._instance;
    }

    private static async new(): Promise<RedisServer> {
        const redisProvider = new RedisProvider();
        const redisClient = await redisProvider.getRedisClient();
        return new RedisServer(redisClient);
    }
}