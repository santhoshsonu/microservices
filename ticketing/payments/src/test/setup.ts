import { config as commonConfig } from '@microservice-tickets/common';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
  var getCookie: (id?: string) => string[];
}

// Mock NATS connection
jest.mock('../nats-wrapper');
jest.setTimeout(10000);

// Stripe Test Secret Key
process.env.STRIPE_SECRET = 'sk_test_51Kpa25SIvYE2d8FDe9yFaDtJon6D8mUbs2Rz1D0MWAkkPEWfUC5YMIp7N0iBEWZlK5vjXpddL9GlrW96QoPuls8y00P2g69jE0';

let mongo: MongoMemoryServer;
beforeAll(async () => {
  commonConfig.JWT_KEY = 'asdadadawadw';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }

});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// Auth helper
global.getCookie = (id?: string) => {
  // Build JWT payload { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@ticketing.microservices.com'
  };

  // Create JWT
  const token = jwt.sign(payload, commonConfig.JWT_KEY!);

  // Build session Object { jwt: JWT_TOKEN }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return a string thats the cookie with encoded data
  return [`express:sess=${base64}`];
}