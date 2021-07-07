
export const config: {
  MONGO_URL: string,
  JWT_KEY: string | undefined;
  PORT: number;
} = {
  MONGO_URL: 'mongodb://ticketing-auth-mongo-srv:27017/auth',
  JWT_KEY: process.env.JWT_SECRET,
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000
}