// Test file to directly use Outlook SMTP with nodemailer
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testOutlook() {
  console.log('Testing Outlook SMTP connection...');
  
  // Get email settings from .env
  const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE,
    EMAIL_USER,
    EMAIL_PASSWORD,
    TEST_EMAIL
  } = process.env;
  
  console.log(`Using Outlook SMTP settings:
    - Host: ${EMAIL_HOST}
    - Port: ${EMAIL_PORT}
    - Secure: ${EMAIL_SECURE}
    - User: ${EMAIL_USER}
    - Test recipient: ${TEST_EMAIL || "Not specified"}
  `);
  
  // Create transport using settings from .env file
  const transport = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: parseInt(EMAIL_PORT),
    secure: EMAIL_SECURE === 'true',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD
    },
    tls: {
      // Do not fail on invalid certificates
      rejectUnauthorized: false
    }
  });
  
  try {
    // Verify connection configuration
    await transport.verify();
    console.log('✅ SMTP connection verified successfully');
    
    // Send a test email
    const info = await transport.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
      to: TEST_EMAIL || "recipient@example.com",
      subject: "Test Email from Outlook SMTP",
      text: "This is a test email sent using Outlook SMTP configuration.",
      html: "<b>This is a test email sent using Outlook SMTP configuration.</b>"
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('The email should be delivered to the recipient inbox shortly.');
  } catch (error) {
    console.error('❌ Error:', error);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure your Outlook email and password are correct');
    console.log('2. If using 2FA, generate an app password and use that instead');
    console.log('3. Make sure your Outlook account allows "less secure apps"');
    console.log('4. Some organizations block external SMTP access');
  }
}

testOutlook();
