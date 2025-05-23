const db = require('../config/database');
const Subscription = require('../models/Subscription');

class SummaryService {
  /**
   * Get spending summary for subscriptions
   * @param {number} userId - The user ID
   * @param {object} options - Options for summary (period, startDate, endDate)
   * @returns {Promise<object>} - Spending summary
   */
  static async getSpendingSummary(userId, options = {}) {
    // Set defaults
    const period = options.period || 'monthly';
    let startDate, endDate;
    
    if (options.startDate && options.endDate) {
      startDate = new Date(options.startDate);
      endDate = new Date(options.endDate);
    } else {
      // Default period calculation
      const today = new Date();
      
      switch (period) {
        case 'monthly':
          // Current month
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          break;
        case 'quarterly':
          // Current quarter
          const quarter = Math.floor(today.getMonth() / 3);
          startDate = new Date(today.getFullYear(), quarter * 3, 1);
          endDate = new Date(today.getFullYear(), (quarter + 1) * 3, 0);
          break;
        case 'yearly':
          // Current year
          startDate = new Date(today.getFullYear(), 0, 1);
          endDate = new Date(today.getFullYear(), 11, 31);
          break;
        default:
          // Default to monthly
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      }
    }
    
    // Get active subscriptions
    const subscriptions = await Subscription.findAll(userId, { status: 'Active' });
    
    // Calculate total spending and category breakdown
    let totalSpending = 0;
    const byCategory = {};
    let defaultCurrency = 'USD';
    
    subscriptions.forEach(subscription => {
      // Get subscription cost - normalize for period
      let cost = subscription.cost;
      defaultCurrency = subscription.currency; // Use the most recent currency for simplicity
      
      // Convert cost to the right period if needed
      // For monthly summary with yearly subscription, divide by 12, etc.
      // This is a simplified calculation
      
      if (period === 'monthly') {
        switch (subscription.billing_frequency) {
          case 'Yearly':
            cost = cost / 12;
            break;
          case 'Quarterly':
            cost = cost / 3;
            break;
          case 'Biannual':
            cost = cost / 6;
            break;
          // For monthly billing, keep as is
        }
      } else if (period === 'quarterly') {
        switch (subscription.billing_frequency) {
          case 'Yearly':
            cost = cost / 4;
            break;
          case 'Monthly':
            cost = cost * 3;
            break;
          case 'Biannual':
            cost = cost / 2;
            break;
          // For quarterly billing, keep as is
        }
      } else if (period === 'yearly') {
        switch (subscription.billing_frequency) {
          case 'Monthly':
            cost = cost * 12;
            break;
          case 'Quarterly':
            cost = cost * 4;
            break;
          case 'Biannual':
            cost = cost * 2;
            break;
          // For yearly billing, keep as is
        }
      }
      
      // Add to total
      totalSpending += cost;
      
      // Add to category
      const category = subscription.category || 'Uncategorized';
      if (byCategory[category]) {
        byCategory[category] += cost;
      } else {
        byCategory[category] = cost;
      }
    });
    
    // Format the numbers to 2 decimal places
    totalSpending = parseFloat(totalSpending.toFixed(2));
    
    for (const category in byCategory) {
      byCategory[category] = parseFloat(byCategory[category].toFixed(2));
    }
    
    // Get upcoming payments (next 30 days)
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    const upcomingPayments = subscriptions
      .filter(sub => {
        const paymentDate = new Date(sub.next_payment_date);
        return paymentDate >= today && paymentDate <= thirtyDaysFromNow;
      })
      .map(sub => ({
        id: sub.id,
        name: sub.name,
        amount: sub.cost,
        dueDate: sub.next_payment_date
      }))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    return {
      totalSpending,
      currency: defaultCurrency,
      subscriptionCount: subscriptions.length,
      byCategory,
      upcomingPayments
    };
  }
  
  /**
   * Get category statistics
   * @param {number} userId - The user ID
   * @returns {Promise<Array>} - Category statistics
   */
  static async getCategoryStatistics(userId) {
    const subscriptions = await Subscription.findAll(userId);
    
    if (subscriptions.length === 0) {
      return [];
    }
    
    // Group by category
    const categoryGroups = {};
    let totalCost = 0;
    
    subscriptions.forEach(subscription => {
      const category = subscription.category || 'Uncategorized';
      if (!categoryGroups[category]) {
        categoryGroups[category] = {
          name: category,
          count: 0,
          totalCost: 0
        };
      }
      
      categoryGroups[category].count++;
      categoryGroups[category].totalCost += parseFloat(subscription.cost);
      totalCost += parseFloat(subscription.cost);
    });
    
    // Calculate percentages and format
    const categories = Object.values(categoryGroups).map(category => {
      return {
        name: category.name,
        count: category.count,
        totalCost: parseFloat(category.totalCost.toFixed(2)),
        percentage: parseFloat(((category.totalCost / totalCost) * 100).toFixed(2))
      };
    });
    
    // Sort by totalCost descending
    return categories.sort((a, b) => b.totalCost - a.totalCost);
  }
}

module.exports = SummaryService;
