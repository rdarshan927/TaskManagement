require('dotenv').config();
const app = require('./app');
const dbConnect = require('./utils/dbConnect');

const PORT = process.env.PORT || 5000;

// Connect for local development
if (process.env.NODE_ENV !== 'production') {
  dbConnect()
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
  try {
    await dbConnect();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

// Export for serverless
module.exports = app;