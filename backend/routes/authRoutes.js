const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { verifyResetToken, cleanupExpiredTokens } = require('../middlewares/resetToken');

// Register user
router.post(
  '/register',
  [
    check('email')
      .isEmail()
      .withMessage('Please provide a valid email address'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    check('firstName')
      .trim()
      .not()
      .isEmpty()
      .withMessage('First name is required'),
    check('lastName')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Last name is required')
  ],
  authController.register
);

// Logout user (stateless, just clears cookie if present)
router.post('/logout', authController.logout);

// Login user
router.post(
  '/login',
  [
    check('email')
      .isEmail()
      .withMessage('Please provide a valid email address'),
    check('password')
      .not()
      .isEmpty()
      .withMessage('Password is required')
  ],
  authController.login
);

// Logout user
router.post('/logout', protect, authController.logout);

// Get current user (protected route)
router.get('/me', protect, authController.getCurrentUser);

// Request password reset
router.post(
  '/reset-password-request',
  [
    check('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
  ],
  cleanupExpiredTokens,  // Clean up expired tokens before creating a new one
  authController.resetPasswordRequest
);

// Reset password
router.post(
  '/reset-password',
  [
    check('token')
      .not()
      .isEmpty()
      .withMessage('Token is required'),
    check('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters')
  ],
  cleanupExpiredTokens,  // Clean up expired tokens first
  verifyResetToken,      // Verify the token is valid
  authController.resetPassword
);

module.exports = router;
