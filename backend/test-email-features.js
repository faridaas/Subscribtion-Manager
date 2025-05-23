// filepath: test-email-features.js
require('dotenv').config();
const emailService = require('./services/emailService');
const AuthService = require('./services/authService');
const NotificationService = require('./services/notificationService');
const db = require('./config/database');

/**
 * Test all email-related functionality
 */
async function testEmailFeatures() {
  try {
    // Connect to the database
    await db.connect();
    console.log('✅ Connected to database');
    
    // Get command line arguments
    const args = process.argv.slice(2);
    const testEmail = args[0] || process.env.TEST_EMAIL || process.env.EMAIL_USER;
    
    if (!testEmail) {
      console.error('❌ No test email provided. Please provide a test email as argument or in .env file');
      process.exit(1);
    }
    
    // Check for Gmail App Password
    if (process.env.EMAIL_HOST.includes('gmail') && process.env.EMAIL_PASSWORD.length < 16) {
      console.warn('⚠️  Warning: You appear to be using Gmail without an App Password.');
      console.warn('   For Gmail accounts with 2FA enabled, you must use an App Password.');
      console.warn('   Generate one at: https://myaccount.google.com/apppasswords');
    }
    
    console.log(`Starting email tests using: ${testEmail}`);
    
    // Test basic email sending
    console.log('\n🧪 Testing basic email functionality...');
    try {
      await emailService.sendMail({
        to: testEmail,
        subject: 'Subscription Manager - Test Basic Email',
        text: 'This is a test email to confirm your email server connection is working.',
        html: '<h3>Test Email</h3><p>If you received this email, your email configuration is working correctly.</p>'
      });
      console.log('✅ Basic email test successful!');
    } catch (error) {
      console.error('❌ Basic email test failed:', error);
    }
    
    // Test payment reminder email
    console.log('\n🧪 Testing payment reminder email...');
    try {
      await emailService.sendPaymentReminder({
        email: testEmail,
        firstName: 'Test User',
        subscriptionName: 'Netflix',
        cost: 15.99,
        currency: 'USD',
        daysUntilPayment: 3,
        paymentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      });
      console.log('✅ Payment reminder email test successful!');
    } catch (error) {
      console.error('❌ Payment reminder email test failed:', error);
    }
    
    // Test password reset email
    console.log('\n🧪 Testing password reset email...');
    try {
      await AuthService.requestPasswordReset(testEmail);
      console.log('✅ Password reset email test initiated!');
      console.log('Note: If the email does not exist in the database, no email will be sent (but no error will occur)');
    } catch (error) {
      console.error('❌ Password reset email test failed:', error);
    }
    
    // Test reminder generation functionality
    console.log('\n🧪 Testing reminder generation...');
    try {
      const count = await NotificationService.generatePaymentReminders();
      console.log(`✅ Generated ${count} payment reminders`);
    } catch (error) {
      console.error('❌ Reminder generation test failed:', error);
    }
    
    console.log('\n✅ All tests completed! Check the specified email inbox for test emails.');
  } catch (error) {
    console.error('An error occurred during testing:', error);
  } finally {
    // Close database connection
    await db.disconnect();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run the tests
testEmailFeatures();
