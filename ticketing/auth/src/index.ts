import { json } from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import { errorHandler } from './middlewares/error-handler';
import { authRouter } from './routes/auth';
import { NotFoundError } from './utils/errors/not-found-error';


/**
 * App port
 */
const port: number = 3000;

const app = express();
app.use(json());

/**
 * App routes
 */
app.use('/api/users/', authRouter);

/**
 * catch 404 errors and pass to global error hanlder
 */
app.use((_req: express.Request, _res: express.Response, next: express.NextFunction) => {
  return next(new NotFoundError());
});

/**
 * Global Error handler middleware
 */
app.use(errorHandler);

/**
 * DB connection &
 * App startup
 */
const start = async () => {
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