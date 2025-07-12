require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Improve MongoDB connection options
const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 15000, // Increased from default 30s
      socketTimeoutMS: 45000,
      // These options help with Vercel's serverless environment
      connectTimeoutMS: 30000,
      // Remove the deprecated options:
      // keepAlive: true,
      // keepAliveInitialDelay: 300000
    });
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

// Connect for local development
if (process.env.NODE_ENV !== 'production') {
  connectToDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('Server failed to start:', err);
      process.exit(1);
    });
}

// For serverless environment - connect to database before handling requests
app.use(async (req, res, next) => {
  // Skip reconnection if already connected
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

// Export for serverless
module.exports = app;