const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const dbConnect = require('../utils/dbConnect');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Generate secret for user
const generateSecret = async (req, res) => {
  try {
    await dbConnect();
    const secret = speakeasy.generateSecret({
      name: `Task Manager App:${req.user.email}`,
      digits: 6,
      period: 30
    });
    
    req.user.twoFactorSecret = secret.base32;
    await req.user.save();
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);
    
    res.status(200).json({ secret: secret.base32, qrCode });
  } catch (error) {
    res.status(500).json({ message: 'Error generating secret' });
  }
};

// Generate backup codes
const generateBackupCodes = () => {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    codes.push(Math.random().toString(36).substring(2, 12).toUpperCase());
  }
  return codes;
};

// Verify and enable 2FA
const enableTwoFactor = async (req, res) => {
  await dbConnect();
  const { token } = req.body;
  const verified = speakeasy.totp.verify({
    secret: req.user.twoFactorSecret,
    encoding: 'base32',
    token,
    digits: 6,  
    period: 30  
  });
  
  if (verified) {
    req.user.twoFactorEnabled = true;
    // Generate backup codes
    const backupCodes = generateBackupCodes();
    req.user.backupCodes = backupCodes;
    await req.user.save();
    res.status(200).json({ success: true, backupCodes });
  } else {
    res.status(400).json({ message: 'Invalid verification code' });
  }
};

const registerUser = async (req, res) => {
  try {
    await dbConnect();
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    await dbConnect();
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (user.twoFactorEnabled) {
        return res.status(200).json({
          requiresTwoFactor: true,
          userId: user._id
        });
      } else {
        res.json({
          _id: user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
      }
    } else {
      res.status(401);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    await dbConnect();
    console.log('User from req:', req.user);
    
    res.status(200).json(req.user);
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyTwoFactor = async (req, res) => {
  try {
    await dbConnect();
    const { userId, token } = req.body;
    const isBackupCode = req.body.isBackupCode === true || req.body.isBackupCode === "true";
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    let verified = false;
    
    if (isBackupCode) {
      // Check if token matches any backup code
      const backupCodeIndex = user.backupCodes.findIndex(code => code === token);
      if (backupCodeIndex !== -1) {
        verified = true;
        // Remove the used backup code
        user.backupCodes.splice(backupCodeIndex, 1);
        await user.save();
      }
    } else {
      try {
        // Clean the token (remove spaces, ensure it's a string)
        const cleanToken = token.toString().replace(/\s+/g, '');

        // Generate expected tokens for current time window and surrounding windows
        const expectedToken = speakeasy.totp({
          secret: user.twoFactorSecret,
          encoding: 'base32'
        });

        // console.log('TOTP Verification Debug:', {
        //   providedToken: cleanToken,
        //   expectedToken: expectedToken,
        //   secret: user.twoFactorSecret.substring(0, 5) + '...',
        //   currentTime: Math.floor(Date.now() / 1000),
        //   timeStep: 30
        // });

        // Try both verification methods
        verified = speakeasy.totp.verify({
          secret: user.twoFactorSecret,
          encoding: 'base32',
          token: cleanToken,
          window: 6,
          digits: 6,  
          period: 30  
        });

        // If standard verification fails, try manual token generation and comparison
        if (!verified) {
          // Generate tokens for a wider window
          for (let i = -3; i <= 3; i++) {
            const adjustedToken = speakeasy.totp({
              secret: user.twoFactorSecret,
              encoding: 'base32',
              time: Math.floor(Date.now() / 1000) + (i * 30)
            });
            console.log(`Token for window ${i}: ${adjustedToken}`);
            if (adjustedToken === cleanToken) {
              verified = true;
              break;
            }
          }
        }
      } catch (err) {
        console.error('TOTP verification error:', err);
        return res.status(500).json({ message: 'Error during verification', details: err.message });
      }
    }
    
    if (verified) {
      // Generate JWT and send response
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ 
        message: isBackupCode ? 'Invalid backup code' : 'Invalid verification code' 
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const disableTwoFactor = async (req, res) => {
  try {    
    await dbConnect();
    // Disable 2FA
    req.user.twoFactorEnabled = false;
    req.user.twoFactorSecret = undefined;
    req.user.backupCodes = [];
    await req.user.save();
    
    res.status(200).json({ success: true, message: 'Two-factor authentication disabled' });
  } catch (error) {
    res.status(500).json({ message: 'Error disabling 2FA' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  generateSecret,
  enableTwoFactor,
  verifyTwoFactor,
  disableTwoFactor,
};