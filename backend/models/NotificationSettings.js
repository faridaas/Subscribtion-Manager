const db = require('../config/database');

class NotificationSettings {
  static async findByUserId(userId) {
    const query = `
      SELECT * FROM notification_settings
      WHERE user_id = ?
      LIMIT 1
    `;
    
    const settings = await db.query(query, [userId]);
    return settings[0] || null;
  }
  
  static async create(userId, settings = {}) {
    const query = `
      INSERT INTO notification_settings (
        user_id, email_notifications, push_notifications, reminder_days
      ) VALUES (?, ?, ?, ?)
    `;
    
    const params = [
      userId,
      settings.emailNotifications !== undefined ? settings.emailNotifications : true,
      settings.pushNotifications !== undefined ? settings.pushNotifications : false,
      settings.reminderDays || 7
    ];
    
    const result = await db.query(query, params);
    
    if (result.insertId) {
      return this.findByUserId(userId);
    }
    
    throw new Error('Failed to create notification settings');
  }
  
  static async update(userId, settings) {
    // Check if settings exist
    const existing = await this.findByUserId(userId);
    
    if (!existing) {
      return this.create(userId, settings);
    }
    
    const query = `
      UPDATE notification_settings 
      SET 
        email_notifications = ?,
        push_notifications = ?,
        reminder_days = ?,
        updated_at = NOW()
      WHERE user_id = ?
    `;
    
    const params = [
      settings.emailNotifications !== undefined ? settings.emailNotifications : existing.email_notifications,
      settings.pushNotifications !== undefined ? settings.pushNotifications : existing.push_notifications,
      settings.reminderDays !== undefined ? settings.reminderDays : existing.reminder_days,
      userId
    ];
    
    await db.query(query, params);
    
    return this.findByUserId(userId);
  }
}

module.exports = NotificationSettings;
