require('dotenv').config();

module.exports = {
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD // This should be an App Password, not your regular Gmail password
    }
  },
  from: process.env.EMAIL_FROM || 'SubTrackr <noreply@subtrackr.com>'
}; 