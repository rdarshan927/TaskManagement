const mongoose = require('mongoose');

// Cache the database connection
let cachedConnection = null;

async function dbConnect() {
  // If the connection is cached, return the cached connection
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using cached database connection');
    return cachedConnection;
  }

  // If not connected, create a new connection
  try {
    // Simplified options for newer MongoDB driver versions
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 75000,
      connectTimeoutMS: 60000,
    });
    
    cachedConnection = conn;
    console.log('MongoDB connected');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

module.exports = dbConnect;