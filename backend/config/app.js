require('dotenv').config();

module.exports = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    name: process.env.DB_NAME || 'subscription_manager',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'W@2915djkq#',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    cookieExpiresIn: process.env.JWT_COOKIE_EXPIRES_IN || 7, // days
  },

  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || 'abdelaziz.test123@gmail.com',
    password: process.env.EMAIL_PASSWORD || 'abdelaziz123',
    fromAddress: process.env.EMAIL_FROM_ADDRESS || 'notifications@subscriptionmanager.com',
    fromName: process.env.EMAIL_FROM_NAME || 'Subscription Manager'
  }
};
