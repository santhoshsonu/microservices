import express from 'express';
import { json } from 'body-parser';

import { errorHandler } from './middlewares/error-handler';
import { authRouter } from './routes/auth';

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
  return next(new Error());
});

/**
 * Global Error handler middleware
 */
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});