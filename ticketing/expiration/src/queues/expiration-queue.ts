import Queue from "bull";
import { config } from "../config/config";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
    orderId: string;
}

const QUEUE_NAME = 'order:expiration';

const expirationQueue = new Queue<Payload>(QUEUE_NAME, {
    redis: {
        host: config.REDIS_HOST
    }
});

expirationQueue.process(async (job) => {
    await new ExpirationCompletePublisher(natsWrapper.client).publish({ orderId: job.data.orderId });
});

export { expirationQueue };
