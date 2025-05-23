const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const config = require('../config/app');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// Protect routes - verify JWT token
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  
  // Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Or from cookie (if your frontend stores it there)
  else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }
  
  // Check if token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  
  try {
    // Verify token
    const decoded = await promisify(jwt.verify)(token, config.jwt.secret);
    
    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorResponse('User not found', 401));
    }
    
    // Grant access to protected route
    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});
