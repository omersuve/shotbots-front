import { RedisClientType } from "@redis/client";

export class RedisSubscriber {
    /**
     * Redis connection
     * @private
     */
    private readonly subscriber: RedisClientType;

    constructor(redis: RedisClientType) {
        this.subscriber = redis;
    }

    public async subscribe(channel: string, handler: (data: any) => void) {
        await this.subscriber.subscribe(channel, message => {
            const data: any = JSON.parse(message);
            handler(data);
        });
    }
}