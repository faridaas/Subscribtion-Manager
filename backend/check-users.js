// Check users in the database
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function checkUsers() {
  console.log('Checking users in the database...');
  
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: DB_HOST || 'localhost',
      port: DB_PORT || 3306,
      user: DB_USER || 'root',
      password: DB_PASSWORD || '',
      database: DB_NAME || 'subscription_manager'
    });
    
    console.log('Connected to MySQL database');
    
    // Get users
    const [users] = await connection.query('SELECT id, email, first_name, last_name FROM users');
    
    if (users.length === 0) {
      console.log('No users found in the database.');
      
      // Create a test user if none exists
      console.log('Creating a test user...');
      
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await connection.query(
        `INSERT INTO users (email, password_hash, first_name, last_name) 
         VALUES (?, ?, ?, ?)`,
        ['test@example.com', hashedPassword, 'Test', 'User']
      );
      
      console.log('✅ Created test user: test@example.com (password: password123)');
    } else {
      console.log('Users in the database:');
      users.forEach(user => {
        console.log(`ID: ${user.id}, Email: ${user.email}, Name: ${user.first_name} ${user.last_name}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
    process.exit(0);
  }
}

checkUsers();
