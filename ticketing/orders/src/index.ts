import { config as commonConfig } from '@microservice-tickets/common';
import mongoose from 'mongoose';
import { app } from './app';
import { config } from './config/config';
import { natsWrapper } from './nats-wrapper';

/**
 * App port
 */
const port: number = config.PORT;

/**
 * DB connection &
 * NATS connection &
 * App startup
 */
const start = async () => {
  if (!commonConfig.JWT_KEY) {
    throw new Error('Env variable: JWT_SECRET must be defined');
  }
  if (!config.MONGO_URL) {
    throw new Error('Env variable: MONGO_URI must be defined');
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

    await mongoose.connect(config.MONGO_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
    console.log(`Connected to database ${config.MONGO_URL}`);
  } catch (err) { console.log(err); };

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

};

start();