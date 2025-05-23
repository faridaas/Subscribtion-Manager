const db = require('../config/database');

class Subscription {
  static async findAll(userId, filters = {}) {
    let query = `
      SELECT * FROM subscriptions
      WHERE user_id = ?
    `;
    
    const params = [userId];
    
    // Apply filters if provided
    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }
    
    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }
    
    // Apply sorting
    if (filters.sort) {
      const sortField = this.validateSortField(filters.sort);
      const sortOrder = filters.order?.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
      query += ` ORDER BY ${sortField} ${sortOrder}`;
    } else {
      query += ' ORDER BY next_payment_date ASC';
    }
    
    return db.query(query, params);
  }
  
  static async findById(id, userId) {
    const query = `
      SELECT * FROM subscriptions
      WHERE id = ? AND user_id = ?
      LIMIT 1
    `;
    
    const subscriptions = await db.query(query, [id, userId]);
    return subscriptions[0] || null;
  }
  
  static async create(subscriptionData, userId) {
    const query = `
      INSERT INTO subscriptions (
        user_id, name, description, cost, currency, 
        billing_frequency, next_payment_date, category, 
        status, notes, website
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      userId,
      subscriptionData.name,
      subscriptionData.description || null,
      subscriptionData.cost,
      subscriptionData.currency || 'USD',
      subscriptionData.billingFrequency,
      subscriptionData.nextPaymentDate,
      subscriptionData.category || null,
      subscriptionData.status || 'Active',
      subscriptionData.notes || null,
      subscriptionData.website || null
    ];
    
    const result = await db.query(query, params);
    
    if (result.insertId) {
      return this.findById(result.insertId, userId);
    }
    
    throw new Error('Failed to create subscription');
  }
  
  static async update(id, userId, subscriptionData) {
    // First check if subscription exists and belongs to user
    const existing = await this.findById(id, userId);
    
    if (!existing) {
      return null;
    }
    
    // Build update query dynamically based on provided fields
    let query = 'UPDATE subscriptions SET ';
    const params = [];
    const updates = [];
    
    // Only update fields that are provided
    if (subscriptionData.name !== undefined) {
      updates.push('name = ?');
      params.push(subscriptionData.name);
    }
    
    if (subscriptionData.description !== undefined) {
      updates.push('description = ?');
      params.push(subscriptionData.description);
    }
    
    if (subscriptionData.cost !== undefined) {
      updates.push('cost = ?');
      params.push(subscriptionData.cost);
    }
    
    if (subscriptionData.currency !== undefined) {
      updates.push('currency = ?');
      params.push(subscriptionData.currency);
    }
    
    if (subscriptionData.billingFrequency !== undefined) {
      updates.push('billing_frequency = ?');
      params.push(subscriptionData.billingFrequency);
    }
    
    if (subscriptionData.nextPaymentDate !== undefined) {
      updates.push('next_payment_date = ?');
      params.push(subscriptionData.nextPaymentDate);
    }
    
    if (subscriptionData.category !== undefined) {
      updates.push('category = ?');
      params.push(subscriptionData.category);
    }
    
    if (subscriptionData.status !== undefined) {
      updates.push('status = ?');
      params.push(subscriptionData.status);
    }
    
    if (subscriptionData.notes !== undefined) {
      updates.push('notes = ?');
      params.push(subscriptionData.notes);
    }
    
    if (subscriptionData.website !== undefined) {
      updates.push('website = ?');
      params.push(subscriptionData.website);
    }
    
    // Always update the updatedAt timestamp
    updates.push('updated_at = NOW()');
    
    // Combine all updates
    query += updates.join(', ');
    query += ' WHERE id = ? AND user_id = ?';
    params.push(id, userId);
    
    await db.query(query, params);
    
    // Return the updated subscription
    return this.findById(id, userId);
  }
  
  static async delete(id, userId) {
    // First check if subscription exists and belongs to user
    const existing = await this.findById(id, userId);
    
    if (!existing) {
      return false;
    }
    
    const query = `
      DELETE FROM subscriptions
      WHERE id = ? AND user_id = ?
    `;
    
    const result = await db.query(query, [id, userId]);
    return result.affectedRows > 0;
  }
  
  static validateSortField(field) {
    const allowedFields = [
      'name', 'cost', 'next_payment_date', 'created_at', 'status', 'category'
    ];
    
    if (!allowedFields.includes(field)) {
      return 'next_payment_date';
    }
    
    return field;
  }
}

module.exports = Subscription;
