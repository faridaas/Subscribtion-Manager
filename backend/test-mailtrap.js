// Test file to directly use Mailtrap with nodemailer
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testMailtrap() {
  console.log('Testing direct Mailtrap connection...');
  
  // Create transport using the exact settings from Mailtrap
  var transport = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
        user: "api",
        pass: "cc2c5b7b4b641e9e0f7f50eb5a5c3dfe"
    }
    });  try {
    // Send a test email
    const info = await transport.sendMail({
      from: '"Subscription Manager" <mailtrap@mailtrap.com>',
      to: process.env.TEST_EMAIL || "recipient@example.com",
      subject: "Test Email from Mailtrap",
      text: "This is a test email sent directly using Mailtrap configuration.",
      html: "<b>This is a test email sent directly using Mailtrap configuration.</b>"
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    console.log('Mailtrap should have received the test email. Check your inbox at https://mailtrap.io');
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

testMailtrap();
