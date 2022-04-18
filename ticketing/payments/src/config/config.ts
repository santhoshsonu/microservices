
export const config: {
  MONGO_URL: string | undefined,
  PORT: number;
  NATS_URL: string | undefined;
  NATS_CLUSTER_ID: string | undefined;
  NATS_CLIENT_ID: string | undefined;
  STRIPE_SECRET: string | undefined;
} = {
  MONGO_URL: process.env.MONGO_URI,
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  NATS_URL: process.env.NATS_URI,
  NATS_CLUSTER_ID: process.env.NATS_CLUSTER_ID,
  NATS_CLIENT_ID: process.env.NATS_CLIENT_ID,
  STRIPE_SECRET: process.env.STRIPE_SECRET
}