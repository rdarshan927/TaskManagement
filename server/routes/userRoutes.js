const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getMe,
  generateSecret,
  enableTwoFactor,
  verifyTwoFactor,
  disableTwoFactor
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// 2FA routes
router.get('/2fa/generate', protect, generateSecret);
router.post('/2fa/enable', protect, enableTwoFactor);
router.post('/verify-2fa', verifyTwoFactor);
router.post('/2fa/disable', protect, disableTwoFactor);

module.exports = router;