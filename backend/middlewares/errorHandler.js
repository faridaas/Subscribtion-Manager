const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  // Log error for developers
  console.error(err);
  
  // MySQL duplicate key error
  if (err.errno === 1062) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }
  
  // MySQL foreign key constraint error
  if (err.errno === 1216 || err.errno === 1451 || err.errno === 1452) {
    const message = 'Resource not found or constraint violated';
    error = new ErrorResponse(message, 400);
  }
  
  // MySQL data too long error
  if (err.errno === 1406) {
    const message = 'Input exceeds field limit';
    error = new ErrorResponse(message, 400);
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again.';
    error = new ErrorResponse(message, 401);
  }
  
  if (err.name === 'TokenExpiredError') {
    const message = 'Your token has expired. Please log in again.';
    error = new ErrorResponse(message, 401);
  }
  
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
