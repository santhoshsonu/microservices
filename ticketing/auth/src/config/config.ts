
export const config: {
  MONGO_URL: string,
  PORT: number;
} = {
  MONGO_URL: 'mongodb://ticketing-auth-mongo-srv:27017/auth',
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000
}