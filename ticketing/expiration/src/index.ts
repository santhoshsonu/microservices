import { config } from './config/config';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

/**
 * NATS connection &
 * App startup
 */
const start = async () => {
  if (!config.REDIS_HOST) {
    throw new Error('Env variable: REDIS_HOST must be defined');
  }
  if (!config.NATS_CLUSTER_ID) {
    throw new Error('Env variable: NATS_CLUSTER_ID must be defined');
  }
  if (!config.NATS_CLIENT_ID) {
    throw new Error('Env variable: NATS_CLIENT_ID must be defined');
  }
  if (!config.NATS_URL) {
    throw new Error('Env variable: NATS_URL must be defined');
  }

  try {

    await natsWrapper.connect(config.NATS_CLUSTER_ID,
      config.NATS_CLIENT_ID,
      config.NATS_URL);

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });

    process.on('SIGTERM', () => natsWrapper.client.close());
    process.on('SIGINT', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) { console.log(err); };

};

start();
