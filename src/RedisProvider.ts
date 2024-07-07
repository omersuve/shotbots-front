import { RedisClientType } from "@redis/client";
import { createClient as createRedisClient } from "@redis/client";
import { RedisSubscriber } from "./RedisSubscriber";
import Pusher from "pusher";

export class RedisProvider {
    private redisSubClient?: RedisSubscriber;
    private redisClient?: RedisClientType;
    private pusher?: Pusher;

    public async getRedisSubClient(): Promise<RedisSubscriber> {
        if (!this.redisSubClient) {
            const redis = await this.getRedisClient();
            await redis.connect();
            this.redisSubClient = new RedisSubscriber(redis);
            await this.redisSubClient.subscribe("telegram_messages", async (data: any) => {
                await this.redisClient!.lPush("latest_messages", JSON.stringify(data));
                await this.redisClient!.lTrim("latest_messages", 0, 9);
                await this.pusher!.trigger("my-channel", "my-event", {
                    message: JSON.stringify(data),
                });
            });
        }
        return this.redisSubClient;
    }

    public async getMainRedisClient(): Promise<RedisClientType> {
        if (!this.redisClient) {
            this.redisClient = await this.getRedisClient();
            await this.redisClient.connect();
        }
        return this.redisClient;
    }

    public async getPusher(): Promise<Pusher> {
        if (!this.pusher) {
            this.pusher = new Pusher({
                appId: process.env.PUSHER_APP_ID!,
                key: process.env.PUSHER_KEY!,
                secret: process.env.PUSHER_SECRET!,
                cluster: process.env.PUSHER_CLUSTER!,
                useTLS: true,
            });
        }
        return this.pusher;
    }

    private async getRedisClient(): Promise<RedisClientType> {
        return createRedisClient({
            url: process.env.REDIS_PUBLIC_URL ?? "redis://localhost:6379",
        });
    }
}