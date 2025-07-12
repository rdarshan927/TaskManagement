require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/task-manager';

// Create cached connection variable
let cachedConnection = null;

// Connect to MongoDB
const connectToDatabase = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }
  
  try {
    const connection = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('Connected to MongoDB');
    cachedConnection = connection;
    return connection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

// For local development
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

// Middleware to connect to database before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ message: 'Database connection failed' });
  }
});

// Export the Express app for Vercel
module.exports = app;