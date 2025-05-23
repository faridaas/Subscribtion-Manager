const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findById(id) {
    const query = `
      SELECT id, email, first_name, last_name, created_at, updated_at
      FROM users
      WHERE id = ?
      LIMIT 1
    `;
    
    const users = await db.query(query, [id]);
    return users[0] || null;
  }
  
  static async findByEmail(email) {
    const query = `
      SELECT id, email, password_hash, first_name, last_name, created_at, updated_at 
      FROM users
      WHERE email = ?
      LIMIT 1
    `;
    
    const users = await db.query(query, [email]);
    return users[0] || null;
  }
  
  static async create(userData) {
    const { email, password, firstName, lastName } = userData;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES (?, ?, ?, ?)
    `;
    
    const result = await db.query(query, [email, passwordHash, firstName, lastName]);
    
    if (result.insertId) {
      return this.findById(result.insertId);
    }
    
    throw new Error('Failed to create user');
  }
    static async comparePassword(hashedPassword, password) {
    return bcrypt.compare(password, hashedPassword);
  }
  
  /**
   * Update user's password
   * @param {number} userId - The user ID
   * @param {string} newPassword - The new password to set
   * @returns {Promise<boolean>} - Success status
   */
  static async updatePassword(userId, newPassword) {
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    
    const query = `
      UPDATE users
      SET password_hash = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    const result = await db.query(query, [passwordHash, userId]);
    return result.affectedRows > 0;
  }
}

module.exports = User;
