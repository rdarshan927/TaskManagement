const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const dbConnect = require('../utils/dbConnect');

const protect = async (req, res, next) => {
  try {
    await dbConnect();
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token received:', token);
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
      
      const user = await User.findById(decoded.id).select('-password');
      console.log('User found:', user);
      
      if (!user) {
        console.log('No user found with this ID');
        res.status(401);
        throw new Error('Not authorized, no user found');
      }
      
      req.user = user;
      next();
    } else {
      console.log('No auth header or not starting with Bearer');
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
};

module.exports = { protect };