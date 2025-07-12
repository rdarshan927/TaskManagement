const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost', 'http://localhost:80', 'http://client', 'http://localhost:3000', 'http://localhost:5173', 'https://taskrd927.netlify.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

module.exports = app;