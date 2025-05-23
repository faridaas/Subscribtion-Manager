// Test file to directly use Gmail SMTP with nodemailer
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testGmail() {
  console.log('Testing Gmail SMTP connection...');
  
  // Get email settings from .env
  const {
    EMAIL_USER,
    EMAIL_PASSWORD,
    TEST_EMAIL
  } = process.env;
  
  console.log(`Using Gmail SMTP settings:
    - Gmail Account: ${EMAIL_USER}
    - Sending to: ${TEST_EMAIL || "Not specified"}
  `);
  
  // Create transport using Gmail settings
  const transport = nodemailer.createTransport({
    service: 'gmail',  // Using the built-in Gmail service config
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD  // This should be an app password if 2FA is enabled
    }
  });
  
  try {
    // Verify connection configuration
    await transport.verify();
    console.log('✅ SMTP connection verified successfully');
    
    // Send a test email
    const info = await transport.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
      to: TEST_EMAIL || EMAIL_USER,  // Send to TEST_EMAIL or self if not specified
      subject: "Test Email from Gmail SMTP",
      text: "This is a test email sent using Gmail SMTP configuration.",
      html: `<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #4285F4;">Gmail SMTP Test Successful!</h2>
        <p>This email confirms that your Subscription Manager application can successfully send emails using Gmail's SMTP server.</p>
        <p>You can now use email features like:</p>
        <ul>
          <li>Payment reminders</li>
          <li>Password reset links</li>
          <li>Account notifications</li>
        </ul>
        <p>Date and time: ${new Date().toLocaleString()}</p>
      </div>`
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('The email should be delivered to the recipient inbox shortly.');
  } catch (error) {
    console.error('❌ Error:', error);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure your Gmail email and app password are correct');
    console.log('2. You need to use an "App Password", not your regular password:');
    console.log('   - Go to https://myaccount.google.com/apppasswords');
    console.log('   - Select "Mail" and your device type');
    console.log('   - Use the generated 16-character password');
    console.log('3. Make sure your Gmail account has less secure app access enabled or use App Passwords');
    console.log('4. Check if you need to verify unusual activity in your Gmail account');
  }
}

// Run the test
testGmail();
