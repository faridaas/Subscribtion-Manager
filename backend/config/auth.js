const jwt = require('jsonwebtoken');
const config = require('./app');

module.exports = {
  // Generate JWT token
  generateToken: (userId) => {
    return jwt.sign({ id: userId }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  },
  
  // Verify JWT token
  verifyToken: (token) => {
    return jwt.verify(token, config.jwt.secret);
  }
};
