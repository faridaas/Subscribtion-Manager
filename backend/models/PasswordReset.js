const db = require('../config/database');
const crypto = require('crypto');
const { promisify } = require('util');
const randomBytes = promisify(crypto.randomBytes);

class PasswordReset {
  /**
   * Create a password reset token for a user
   * @param {number} userId - The user ID
   * @param {string} email - The user's email
   * @returns {Promise<{token: string, expiresAt: Date}>} - The reset token and expiration
   */
  static async createToken(userId, email) {
    try {
      // Generate a random token
      const buffer = await randomBytes(32);
      const token = buffer.toString('hex');
      
      // Token expires in 1 hour
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);
      
      // Delete any existing tokens for this user
      await this.deleteTokensByEmail(email);
      
      // Store the new token
      const query = `
        INSERT INTO password_resets (user_id, email, token, expires_at)
        VALUES (?, ?, ?, ?)
      `;
      
      await db.query(query, [userId, email, token, expiresAt]);
      
      return { token, expiresAt };
    } catch (error) {
      console.error('Error creating password reset token:', error);
      throw error;
    }
  }
  
  /**
   * Find a password reset token by token string
   * @param {string} token - The reset token
   * @returns {Promise<object|null>} - The reset record or null if not found
   */
  static async findByToken(token) {
    const query = `
      SELECT * FROM password_resets
      WHERE token = ? AND expires_at > NOW()
      LIMIT 1
    `;
    
    const results = await db.query(query, [token]);
    return results[0] || null;
  }
  
  /**
   * Delete a password reset token by token string
   * @param {string} token - The reset token to delete
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteToken(token) {
    const query = `
      DELETE FROM password_resets
      WHERE token = ?
    `;
    
    const result = await db.query(query, [token]);
    return result.affectedRows > 0;
  }
  
  /**
   * Delete all password reset tokens for a specific email
   * @param {string} email - The email address
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteTokensByEmail(email) {
    const query = `
      DELETE FROM password_resets
      WHERE email = ?
    `;
    
    const result = await db.query(query, [email]);
    return result.affectedRows > 0;
  }
  
  /**
   * Clean up expired tokens
   * @returns {Promise<number>} - Number of deleted tokens
   */
  static async cleanupExpiredTokens() {
    const query = `
      DELETE FROM password_resets
      WHERE expires_at <= NOW()
    `;
    
    const result = await db.query(query, []);
    return result.affectedRows;
  }
}

module.exports = PasswordReset;
