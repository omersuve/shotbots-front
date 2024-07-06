import { RedisProvider } from "./RedisProvider";
import { RedisSubscriber } from "./RedisSubscriber";

export class RedisServer {
    private static _instance?: RedisServer;

    public readonly redisSub: RedisSubscriber;

    private constructor(redisSub: RedisSubscriber) {
        this.redisSub = redisSub;
    }

    public static async getInstance(): Promise<RedisServer> {
        if (!this._instance) this._instance = await this.new();
        return this._instance;
    }

    private static async new(): Promise<RedisServer> {
        const redisProvider = new RedisProvider();
        const redisSub = await redisProvider.getRedisSubClient();
        return new RedisServer(redisSub);
    }
}