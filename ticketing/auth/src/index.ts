import express from 'express';
import { json } from 'body-parser';
import { authRouter } from './routes/auth';

const port: number = 3000;
const app = express();
app.use(json());

app.use('/api/users/', authRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});