const app = require('./app');
const config = require('./config/app');
const db = require('./config/database');

// Connect to database
db.connect()
  .then(() => {
    console.log('Connected to MySQL database');
    
    // Start the server
    const PORT = config.port || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${config.environment} mode on port ${PORT}`);
    });
    
    // Handle unhandled rejections
    process.on('unhandledRejection', (err) => {
      console.log('UNHANDLED REJECTION! Shutting down...');
      console.log(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });
