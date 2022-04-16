
export const config: {
  NATS_URL: string | undefined;
  NATS_CLUSTER_ID: string | undefined;
  NATS_CLIENT_ID: string | undefined;
} = {
  NATS_URL: process.env.NATS_URI,
  NATS_CLUSTER_ID: process.env.NATS_CLUSTER_ID,
  NATS_CLIENT_ID: process.env.NATS_CLIENT_ID
}