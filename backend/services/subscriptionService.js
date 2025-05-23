const Subscription = require('../models/Subscription');
const Notification = require('../models/Notification');
const PaymentHistory = require('../models/PaymentHistory');

class SubscriptionService {
  /**
   * Get all subscriptions for a user with optional filters
   * @param {number} userId - The user ID
   * @param {object} filters - Optional filters for status, category, sorting
   * @returns {Promise<Array>} - List of subscriptions
   */
  static async getAllSubscriptions(userId, filters = {}) {
    return Subscription.findAll(userId, filters);
  }
  
  /**
   * Get a specific subscription by ID
   * @param {number} id - Subscription ID
   * @param {number} userId - User ID
   * @returns {Promise<object|null>} - Subscription or null if not found
   */
  static async getSubscriptionById(id, userId) {
    return Subscription.findById(id, userId);
  }
  
  /**
   * Create a new subscription
   * @param {object} subscriptionData - Subscription details
   * @param {number} userId - User ID
   * @returns {Promise<object>} - Created subscription
   */
  static async createSubscription(subscriptionData, userId) {
    // Process subscription data if needed
    // For example, convert date strings to proper format
    if (subscriptionData.nextPaymentDate) {
      subscriptionData.nextPaymentDate = new Date(subscriptionData.nextPaymentDate);
    }
    
    // Create the subscription
    const subscription = await Subscription.create(subscriptionData, userId);
    
    // Create initial payment history entry if needed
    if (subscription) {
      await PaymentHistory.create({
        subscriptionId: subscription.id,
        amount: subscription.cost,
        currency: subscription.currency,
        paymentDate: subscription.next_payment_date,
        status: 'Scheduled'
      });
      
      // Create a notification for the new subscription
      await Notification.create({
        userId,
        subscriptionId: subscription.id,
        type: 'SystemNotification',
        title: 'New Subscription Added',
        message: `You've added ${subscription.name} to your subscriptions. Next payment is due on ${new Date(subscription.next_payment_date).toLocaleDateString()}.`
      });
    }
    
    return subscription;
  }
  
  /**
   * Update an existing subscription
   * @param {number} id - Subscription ID
   * @param {number} userId - User ID
   * @param {object} subscriptionData - Updated subscription details
   * @returns {Promise<object|null>} - Updated subscription or null if not found
   */
  static async updateSubscription(id, userId, subscriptionData) {
    // Process subscription data if needed
    if (subscriptionData.nextPaymentDate) {
      subscriptionData.nextPaymentDate = new Date(subscriptionData.nextPaymentDate);
    }
    
    // Get the existing subscription for comparison
    const existingSubscription = await Subscription.findById(id, userId);
    if (!existingSubscription) {
      return null;
    }
    
    // Update the subscription
    const updatedSubscription = await Subscription.update(id, userId, subscriptionData);
    
    // If cost or payment date changed, update the payment history
    if (
      updatedSubscription && 
      (subscriptionData.cost !== undefined || subscriptionData.nextPaymentDate !== undefined) &&
      (existingSubscription.cost !== subscriptionData.cost || 
       existingSubscription.next_payment_date !== subscriptionData.nextPaymentDate)
    ) {
      // Create new payment history entry
      await PaymentHistory.create({
        subscriptionId: updatedSubscription.id,
        amount: updatedSubscription.cost,
        currency: updatedSubscription.currency,
        paymentDate: updatedSubscription.next_payment_date,
        status: 'Scheduled',
        notes: 'Updated from subscription edit'
      });
      
      // Create notification for payment update
      await Notification.create({
        userId,
        subscriptionId: updatedSubscription.id,
        type: 'SystemNotification',
        title: 'Subscription Updated',
        message: `Your ${updatedSubscription.name} subscription details have been updated.`
      });
    }
    
    return updatedSubscription;
  }
  
  /**
   * Delete a subscription
   * @param {number} id - Subscription ID
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteSubscription(id, userId) {
    // Get the subscription details before deleting
    const subscription = await Subscription.findById(id, userId);
    if (!subscription) {
      return false;
    }
    
    // Delete the subscription
    const result = await Subscription.delete(id, userId);
    
    if (result) {
      // Create a notification for the deleted subscription
      await Notification.create({
        userId,
        type: 'SystemNotification',
        title: 'Subscription Deleted',
        message: `You've successfully deleted your ${subscription.name} subscription.`
      });
    }
    
    return result;
  }
}

module.exports = SubscriptionService;
