import { RedisClientType } from "@redis/client";
import { createClient as createRedisClient } from "@redis/client";

export class RedisProvider {
    private redisClient?: RedisClientType;

    public async getRedisClient(): Promise<RedisClientType> {
        if (!this.redisClient) {
            this.redisClient = createRedisClient({
                url: process.env.REDIS_PUBLIC_URL ?? "redis://localhost:6379",
            });
            await this.redisClient.connect();
        }
        return this.redisClient;
    }
}