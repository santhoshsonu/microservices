import { config as commonConfig } from '@microservice-tickets/common';
import mongoose from 'mongoose';
import { app } from './app';
import { config } from './config/config';

/**
 * App port
 */
const port: number = config.PORT;

/**
 * DB connection &
 * App startup
 */
const start = async () => {
  if (!commonConfig.JWT_KEY) {
    throw new Error('Env variable: JWT_SECRET must be defined');
  }
  try {
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