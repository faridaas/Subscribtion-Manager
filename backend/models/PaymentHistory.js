const db = require('../config/database');

class PaymentHistory {
  static async findBySubscriptionId(subscriptionId) {
    const query = `
      SELECT * FROM payment_history
      WHERE subscription_id = ?
      ORDER BY payment_date DESC
    `;
    
    return db.query(query, [subscriptionId]);
  }
  
  static async findById(id) {
    const query = `
      SELECT * FROM payment_history
      WHERE id = ?
      LIMIT 1
    `;
    
    const payments = await db.query(query, [id]);
    return payments[0] || null;
  }
  
  static async create(paymentData) {
    const query = `
      INSERT INTO payment_history (
        subscription_id, amount, currency, payment_date, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      paymentData.subscriptionId,
      paymentData.amount,
      paymentData.currency || 'USD',
      paymentData.paymentDate || new Date(),
      paymentData.status || 'Scheduled',
      paymentData.notes || null
    ];
    
    const result = await db.query(query, params);
    
    if (result.insertId) {
      return this.findById(result.insertId);
    }
    
    throw new Error('Failed to create payment history entry');
  }
  
  static async update(id, paymentData) {
    // Check if payment history exists
    const existing = await this.findById(id);
    
    if (!existing) {
      return null;
    }
    
    let query = 'UPDATE payment_history SET ';
    const params = [];
    const updates = [];
    
    if (paymentData.amount !== undefined) {
      updates.push('amount = ?');
      params.push(paymentData.amount);
    }
    
    if (paymentData.currency !== undefined) {
      updates.push('currency = ?');
      params.push(paymentData.currency);
    }
    
    if (paymentData.paymentDate !== undefined) {
      updates.push('payment_date = ?');
      params.push(paymentData.paymentDate);
    }
    
    if (paymentData.status !== undefined) {
      updates.push('status = ?');
      params.push(paymentData.status);
    }
    
    if (paymentData.notes !== undefined) {
      updates.push('notes = ?');
      params.push(paymentData.notes);
    }
    
    // Combine all updates
    query += updates.join(', ');
    query += ' WHERE id = ?';
    params.push(id);
    
    await db.query(query, params);
    
    // Return the updated payment history
    return this.findById(id);
  }
}

module.exports = PaymentHistory;
