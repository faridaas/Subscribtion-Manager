const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const authConfig = require('../config/auth');
const emailService = require('./emailService');

class AuthService {
  /**
   * Register a new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} - Created user and token
   */
  static async registerUser(userData) {
    const { email, password, firstName, lastName } = userData;
    
    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }
    
    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName
    });
    
    // Generate token
    const token = authConfig.generateToken(user.id);
    
    // Remove password hash from response
    delete user.password_hash;
    
    return { user, token };
  }
  
  /**
   * Login a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} - User and token
   */
  static async loginUser(email, password) {
    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Check if password matches
    const isMatch = await User.comparePassword(user.password_hash, password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    
    // Generate token
    const token = authConfig.generateToken(user.id);
    
    // Remove password hash from response
    delete user.password_hash;
      return { user, token };
  }
  
  /**
   * Request a password reset
   * @param {string} email - The email address to send the reset link to
   * @returns {Promise<boolean>} - Success status
   */
  static async requestPasswordReset(email) {
    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      // Return true even if user doesn't exist (for security)
      return true;
    }
    
    // Generate password reset token
    const { token, expiresAt } = await PasswordReset.createToken(user.id, user.email);
    
    // Send email with reset link
    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${token}`;
    
    await emailService.sendMail({
      to: user.email,
      subject: 'Subscription Manager - Reset Your Password',
      text: `Hello ${user.first_name || 'there'},\n\nYou requested a password reset. Please click the link below to set a new password:\n\n${resetLink}\n\nThis link will expire in 1 hour. If you didn't request this, please ignore this email.\n\nRegards,\nSubscription Manager Team`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p>Hello ${user.first_name || 'there'},</p>
          <p>You requested a password reset. Please click the button below to set a new password:</p>
          <div style="margin: 20px 0;">
            <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
          <p style="color: #777;">This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Regards,<br>Subscription Manager Team</p>
        </div>
      `
    });
    
    return true;
  }
  
  /**
   * Reset password using token
   * @param {string} token - The reset token
   * @param {string} newPassword - The new password
   * @returns {Promise<boolean>} - Success status
   */
  static async resetPassword(token, newPassword) {
    // Find the token record
    const resetRecord = await PasswordReset.findByToken(token);
    
    if (!resetRecord) {
      throw new Error('Invalid or expired token');
    }
    
    // Update user's password
    await User.updatePassword(resetRecord.user_id, newPassword);
    
    // Remove the used token
    await PasswordReset.deleteToken(token);
    
    return true;
  }
}

module.exports = AuthService;
