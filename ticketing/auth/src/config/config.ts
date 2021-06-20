
export const config: {
  JWT_KEY: string | undefined;
  PORT: number;
} = {
  JWT_KEY: process.env.JWT_SECRET,
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000
}