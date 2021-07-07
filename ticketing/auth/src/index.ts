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
  if (!config.JWT_KEY) {
    throw new Error('Env variable: JWT_SECRET must be defined');
  }
  try {
    await mongoose.connect('mongodb://ticketing-auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
    console.log('Connected to database');
  } catch (err) { console.log(err); };

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

};

start();