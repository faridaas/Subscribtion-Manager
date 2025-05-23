const PasswordReset = require('../models/PasswordReset');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Middleware to verify password reset token
 * This checks if the token exists and hasn't expired before allowing
 * password reset operations
 */
exports.verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return next(new ErrorResponse('Reset token is required', 400));
    }

    // Check if token exists and is valid
    const resetRecord = await PasswordReset.findByToken(token);

    if (!resetRecord) {
      return next(new ErrorResponse('Invalid or expired reset token', 400));
    }

    // Add the reset record to the request for use in later middleware or controller
    req.resetRecord = resetRecord;
    next();
  } catch (error) {
    next(new ErrorResponse('Error verifying reset token', 500));
  }
};

/**
 * Clean up expired reset tokens from the database
 * This can be used periodically to remove old tokens
 */
exports.cleanupExpiredTokens = async (req, res, next) => {
  try {
    await PasswordReset.cleanupExpiredTokens();
    next();
  } catch (error) {
    // Just log the error but don't block the request
    console.error('Error cleaning up expired tokens:', error);
    next();
  }
};
