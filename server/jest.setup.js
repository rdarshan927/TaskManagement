// Global setup for all tests
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo;

beforeAll(async () => {
  // Start in-memory MongoDB server
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  
  // Set JWT secret for testing
  process.env.JWT_SECRET = 'test-jwt-secret';
  
  await mongoose.connect(uri);
  console.log('Connected to in-memory database');
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
  console.log('Disconnected from in-memory database');
});

// Only clear the database ONCE at the beginning, not between tests
beforeAll(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  console.log('Database cleared at start');
});