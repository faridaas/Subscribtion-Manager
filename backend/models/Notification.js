const db = require('../config/database');

class Notification {
  static async findAll(userId, filters = {}) {
    let query = `
      SELECT * FROM notifications
      WHERE user_id = ?
    `;
    
    const params = [userId];
    
    // Apply filters if provided
    if (filters.read !== undefined) {
      query += ' AND is_read = ?';
      params.push(filters.read ? 1 : 0);
    }
    
    // Sort by creation date (newest first)
    query += ' ORDER BY created_at DESC';
    
    return db.query(query, params);
  }
  
  static async findById(id, userId) {
    const query = `
      SELECT * FROM notifications
      WHERE id = ? AND user_id = ?
      LIMIT 1
    `;
    
    const notifications = await db.query(query, [id, userId]);
    return notifications[0] || null;
  }
  
  static async create(notificationData) {
    const query = `
      INSERT INTO notifications (
        user_id, subscription_id, type, title, message
      ) VALUES (?, ?, ?, ?, ?)
    `;
    
    const params = [
      notificationData.userId,
      notificationData.subscriptionId || null,
      notificationData.type,
      notificationData.title,
      notificationData.message
    ];
    
    const result = await db.query(query, params);
    
    if (result.insertId) {
      return this.findById(result.insertId, notificationData.userId);
    }
    
    throw new Error('Failed to create notification');
  }
  
  static async markAsRead(id, userId) {
    // Check if notification exists and belongs to user
    const existing = await this.findById(id, userId);
    
    if (!existing) {
      return false;
    }
    
    const query = `
      UPDATE notifications 
      SET is_read = 1
      WHERE id = ? AND user_id = ?
    `;
    
    const result = await db.query(query, [id, userId]);
    return result.affectedRows > 0;
  }
  
  static async markAllAsRead(userId) {
    const query = `
      UPDATE notifications 
      SET is_read = 1
      WHERE user_id = ? AND is_read = 0
    `;
    
    const result = await db.query(query, [userId]);
    return result.affectedRows;
  }
}

module.exports = Notification;
