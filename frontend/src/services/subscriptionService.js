const API_URL = 'http://localhost:5000/api';

export const subscriptionService = {
  async getAllSubscriptions() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/subscriptions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscriptions');
    }

    const data = await response.json();
    return data.subscriptions;
  },

  async createSubscription(subscriptionData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: subscriptionData.appName,
        description: subscriptionData.description,
        cost: parseFloat(subscriptionData.fee.replace('$', '')),
        billingFrequency: subscriptionData.billingCycle,
        nextPaymentDate: subscriptionData.nextPaymentDate,
        category: subscriptionData.category || 'Uncategorized',
        status: subscriptionData.status || 'Active'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create subscription');
    }

    const data = await response.json();
    return data.subscription;
  },

  async updateSubscription(id, subscriptionData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/subscriptions/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: subscriptionData.appName,
        description: subscriptionData.description,
        cost: parseFloat(subscriptionData.fee.replace('$', '')),
        billingFrequency: subscriptionData.billingCycle,
        nextPaymentDate: subscriptionData.nextPaymentDate,
        category: subscriptionData.category || 'Uncategorized',
        status: subscriptionData.status || 'Active'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update subscription');
    }

    const data = await response.json();
    return data.subscription;
  },

  async deleteSubscription(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/subscriptions/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete subscription');
    }

    return true;
  }
};