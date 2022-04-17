import { currentUserMiddleware, errorHandler, NotFoundError } from '@microservice-tickets/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import { paymentsRouter } from './routes/payments';

const app = express();

// Traffic is proxied through Ingress Nginx 
// Set Express to trust the proxy
app.set('trust proxy', true);

app.use(json());

// Allow cookies to be set only for https requests
// except for running test suites
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
}));

/**
 * Middlewares
 */
app.use(currentUserMiddleware);

/**
 * App routes
 */
app.use('/api/payments', paymentsRouter);

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

export { app };
