
export const config: {
  MONGO_URL: string | undefined,
  PORT: number;
} = {
  MONGO_URL: process.env.MONGO_URI,
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000
}