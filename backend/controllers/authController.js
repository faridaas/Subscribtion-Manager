const { validationResult } = require('express-validator');
const User = require('../models/User');
const NotificationSettings = require('../models/NotificationSettings');
const Notification = require('../models/Notification');
const authConfig = require('../config/auth');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// Register user
exports.register = asyncHandler(async (req, res, next) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { email, password, firstName, lastName } = req.body;

  // Check if user exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return next(new ErrorResponse('Email already in use', 400));
  }

  // Create user
  const user = await User.create({
    email,
    password,
    firstName,
    lastName
  });

  // Create default notification settings
  await NotificationSettings.create(user.id);

  // Create welcome notification
  await Notification.create({
    userId: user.id,
    type: 'SystemNotification',
    title: 'Welcome to Subscription Manager',
    message: 'Thank you for joining! Start tracking your subscriptions today.'
  });

  // Generate token
  const token = authConfig.generateToken(user.id);

  // Remove password hash from response
  delete user.password_hash;

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user,
    token
  });
});

// Logout user
exports.logout = asyncHandler(async (req, res, next) => {
  // Clear JWT cookie if it exists
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Login user
exports.login = asyncHandler(async (req, res, next) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findByEmail(email);
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await User.comparePassword(user.password_hash, password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Generate token
  const token = authConfig.generateToken(user.id);

  // Remove password hash from response
  delete user.password_hash;

  res.status(200).json({
    success: true,
    message: 'Login successful',
    user,
    token
  });
});

// Get current user
exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    user
  });
});

// Request password reset
exports.resetPasswordRequest = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  
  const AuthService = require('../services/authService');

  try {
    // Use the actual authService to handle the reset request
    await AuthService.requestPasswordReset(email);
    
    // Always return the same response regardless of whether the email exists
    // for security reasons
    res.status(200).json({
      success: true,
      message: 'If that email exists in our system, a password reset link has been sent'
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    // Still return success for security reasons
    res.status(200).json({
      success: true,
      message: 'If that email exists in our system, a password reset link has been sent'
    });
  }
});

// Reset password
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { token, newPassword } = req.body;
  
  const AuthService = require('../services/authService');
  
  try {
    // The token has already been verified by middleware
    // We can use the reset record from the request
    const resetRecord = req.resetRecord;
    
    // Use the authService to handle the password reset
    await AuthService.resetPassword(token, newPassword);
    
    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    return next(new ErrorResponse(error.message || 'Failed to reset password. Token may be invalid or expired.', 400));
  }
});

// Logout user
exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});
