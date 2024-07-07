import { RedisClientType } from "@redis/client";
import { createClient as createRedisClient } from "@redis/client";
import { RedisSubscriber } from "./RedisSubscriber";

export class RedisProvider {
    private redisSubClient?: RedisSubscriber;

    public async getRedisSubClient(): Promise<RedisSubscriber> {
        if (!this.redisSubClient) {
            const redis = await this.getRedisClient();
            await redis.connect();
            this.redisSubClient = new RedisSubscriber(redis);
        }
        return this.redisSubClient;
    }

    private async getRedisClient(): Promise<RedisClientType> {
        console.log("creating or connecting redis...", process.env.REDIS_PUBLIC_URL ?? "redis://localhost:6379");
        return createRedisClient({
            url: process.env.REDIS_PUBLIC_URL ?? "redis://localhost:6379",
        });
    }
}