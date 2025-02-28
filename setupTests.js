require("dotenv").config({ path: ".env.testing" });
process.env.NODE_ENV = "testing";

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(mongoUri);
  }
});

afterAll(async () => {
  await mongoose.disconnect();

  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
