const Notification = require('../models/Notification');
const NotificationSettings = require('../models/NotificationSettings');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const emailService = require('./emailService');

class NotificationService {
  /**
   * Get user notifications with optional filters
   * @param {number} userId - The user ID
   * @param {object} filters - Optional filters like read status
   * @returns {Promise<Array>} - List of notifications
   */
  static async getUserNotifications(userId, filters = {}) {
    return Notification.findAll(userId, filters);
  }
  
  /**
   * Mark notification as read
   * @param {number} notificationId - The notification ID
   * @param {number} userId - The user ID
   * @returns {Promise<boolean>} - Success status
   */
  static async markNotificationAsRead(notificationId, userId) {
    return Notification.markAsRead(notificationId, userId);
  }
  
  /**
   * Mark all notifications as read for a user
   * @param {number} userId - The user ID
   * @returns {Promise<number>} - Number of notifications marked as read
   */
  static async markAllNotificationsAsRead(userId) {
    return Notification.markAllAsRead(userId);
  }
  
  /**
   * Get notification settings for a user
   * @param {number} userId - The user ID
   * @returns {Promise<object>} - Notification settings
   */
  static async getNotificationSettings(userId) {
    let settings = await NotificationSettings.findByUserId(userId);
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = await NotificationSettings.create(userId);
    }
    
    return settings;
  }
  
  /**
   * Update notification settings for a user
   * @param {number} userId - The user ID
   * @param {object} settingsData - New settings data
   * @returns {Promise<object>} - Updated notification settings
   */
  static async updateNotificationSettings(userId, settingsData) {
    return NotificationSettings.update(userId, settingsData);
  }
  
  /**
   * Generate payment reminders for upcoming payments
   * This would typically be called by a scheduled job
   * @returns {Promise<number>} - Number of notifications created
   */
  static async generatePaymentReminders() {
    try {
      // Get all active subscriptions
      const query = `
        SELECT s.*, u.id as user_id, ns.reminder_days, ns.email_notifications
        FROM subscriptions s
        JOIN users u ON s.user_id = u.id
        JOIN notification_settings ns ON u.id = ns.user_id
        WHERE s.status = 'Active'
      `;
      
      const db = require('../config/database');
      const subscriptions = await db.query(query);
      
      let notificationsCreated = 0;
      const today = new Date();
      
      for (const subscription of subscriptions) {
        const paymentDate = new Date(subscription.next_payment_date);
        const daysDifference = Math.ceil(
          (paymentDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
        );
        
        // Create notification if payment is due in reminder_days
        if (daysDifference > 0 && daysDifference <= subscription.reminder_days) {
          await Notification.create({
            userId: subscription.user_id,
            subscriptionId: subscription.id,
            type: 'PaymentReminder',
            title: 'Payment Due Soon',
            message: `Your ${subscription.name} subscription payment of ${subscription.cost} ${subscription.currency} is due in ${daysDifference} days.`
          });
          
          notificationsCreated++;
            // Send email notification if enabled
          if (subscription.email_notifications) {
            try {
              // Get user details for the email
              const user = await User.findById(subscription.user_id);
              
              if (user && user.email) {
                await emailService.sendPaymentReminder({
                  email: user.email,
                  firstName: user.first_name || 'Subscriber',
                  subscriptionName: subscription.name,
                  cost: subscription.cost,
                  currency: subscription.currency,
                  daysUntilPayment: daysDifference,
                  paymentDate: paymentDate
                });
                console.log(`Email sent to ${user.email} about ${subscription.name} payment`);
              }
            } catch (emailError) {
              console.error('Failed to send email notification:', emailError);
              // Continue execution even if email fails
            }
          }
        }
      }
      
      return notificationsCreated;
    } catch (error) {
      console.error('Error generating payment reminders:', error);
      throw error;
    }
  }
}

module.exports = NotificationService;
