const nodemailer = require('nodemailer');
const emailConfig = require('../config/email');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport(emailConfig.smtp);
  }

  async sendPasswordResetEmail(to, resetToken) {
    try {
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: emailConfig.from,
        to: to,
        subject: 'Reset Your Password - SubTrackr',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">Reset Your Password</h2>
            <p>You have requested to reset your password. Click the button below to proceed:</p>
            <div style="margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background-color: #4F46E5; 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 6px;
                        display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #666;">This link will expire in 1 hour for security reasons.</p>
            <p style="color: #666;">If you didn't request this, please ignore this email.</p>
            <hr style="border: 1px solid #eee; margin: 30px 0;">
            <p style="color: #888; font-size: 12px;">
              This is an automated email from SubTrackr. Please do not reply to this email.
            </p>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // Test the email configuration
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service is ready');
      return true;
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  }

  /**
   * Send email
   * @param {object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.text - Plain text content
   * @param {string} options.html - HTML content (optional)
   * @returns {Promise} - Promise that resolves with info about sent email
   */  async sendMail({ to, subject, text, html }) {
    try {
      // Set the correct from address based on the email provider
      let fromAddress = emailConfig.fromAddress;
      
      // For Mailtrap, use example.com domain
      if (emailConfig.host.includes('mailtrap')) {
        fromAddress = 'mailtrap@example.com';
      } 
      // For Gmail, use the Gmail address
      else if (emailConfig.host.includes('gmail')) {
        fromAddress = emailConfig.user;
      }
        
      const mailOptions = {
        from: `"${emailConfig.fromName}" <${fromAddress}>`,
        to,
        subject,
        text,
        html: html || text,
      };

      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send payment reminder email
   * @param {object} options - Reminder options
   * @param {string} options.email - User email
   * @param {string} options.firstName - User first name
   * @param {string} options.subscriptionName - Subscription name
   * @param {number} options.cost - Subscription cost
   * @param {string} options.currency - Currency code
   * @param {number} options.daysUntilPayment - Days until payment is due
   * @param {Date} options.paymentDate - Payment date
   */
  async sendPaymentReminder({ email, firstName, subscriptionName, cost, currency, daysUntilPayment, paymentDate }) {
    const subject = `Payment Reminder: ${subscriptionName} subscription due in ${daysUntilPayment} days`;
    
    const formattedDate = new Date(paymentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const text = `
      Hello ${firstName},
      
      This is a reminder that your ${subscriptionName} subscription payment of ${cost} ${currency} is due in ${daysUntilPayment} days, on ${formattedDate}.
      
      Log in to your account to view details or update your subscription.
      
      Thank you,
      Subscription Manager
    `;
    
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Payment Reminder</h2>
        <p>Hello ${firstName},</p>
        <p>This is a reminder that your <strong>${subscriptionName}</strong> subscription payment is due soon:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <div><strong>Amount:</strong> ${cost} ${currency}</div>
          <div><strong>Due date:</strong> ${formattedDate} (in ${daysUntilPayment} days)</div>
        </div>
        <p>Log in to your account to view details or update your subscription.</p>
        <p>Thank you,<br>Subscription Manager</p>
      </div>
    `;
    
    return this.sendMail({
      to: email,
      subject,
      text,
      html
    });
  }
}

module.exports = new EmailService();
