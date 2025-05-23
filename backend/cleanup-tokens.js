// This script cleans up expired password reset tokens
// It should be run periodically (e.g., daily) using a scheduler

require('dotenv').config();
const PasswordReset = require('./models/PasswordReset');
const db = require('./config/database');

async function cleanupTokens() {
  try {
    // Connect to the database
    await db.connect();
    console.log('✅ Connected to database');
    
    // Clean up expired tokens
    console.log('Starting cleanup of expired password reset tokens...');
    const deletedCount = await PasswordReset.cleanupExpiredTokens();
    
    console.log(`✅ Successfully deleted ${deletedCount} expired tokens`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error cleaning up tokens:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await db.disconnect();
  }
}

// Run the cleanup
cleanupTokens();
