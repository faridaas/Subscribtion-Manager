// This script generates payment reminders and sends notifications
// It should be run daily using a scheduler like cron

require('dotenv').config();
const NotificationService = require('./services/notificationService');
const emailService = require('./services/emailService');
const db = require('./config/database');

async function testEmailConnection() {
  try {
    console.log('Testing email connection...');
    // This will test if the email server connection works
    await emailService.sendMail({
      to: process.env.TEST_EMAIL || process.env.EMAIL_USER,
      subject: 'Subscription Manager - Email Test',
      text: 'This is a test email to confirm your email settings are working correctly.',
      html: '<h3>Email Configuration Test</h3><p>If you received this email, your Subscription Manager email settings are configured correctly.</p>'
    });
    console.log('✅ Email test successful! Test email sent.');
    return true;
  } catch (error) {
    console.error('❌ Email connection test failed:', error.message);
    console.log('Please check your email configuration in .env file');
    return false;
  }
}

async function generateReminders(testOnly = false) {
  try {
    // Connect to the database first
    await db.connect();
    console.log('✅ Database connection successful');
    
    if (testOnly) {
      // Test email connection only
      await testEmailConnection();
      process.exit(0);
      return;
    }
    
    // Full reminder generation
    console.log('Starting payment reminder generation...');
    const notificationsCreated = await NotificationService.generatePaymentReminders();
    console.log(`✅ Successfully created ${notificationsCreated} payment reminders`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error generating reminders:', error);
    process.exit(1);
  }
}

// Check for command line arguments
const args = process.argv.slice(2);
const testOnly = args.includes('--test') || args.includes('-t');
const emailTestOnly = args.includes('--email-test') || args.includes('-e');

// Run the appropriate function
if (emailTestOnly) {
  console.log('Running email test only...');
  testEmailConnection().then(() => process.exit(0));
} else {
  generateReminders(testOnly);
}
