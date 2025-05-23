// Add password_resets table to the database
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function addPasswordResetsTable() {
  console.log('Adding password_resets table to the database...');
  
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: DB_HOST || 'localhost',
      port: DB_PORT || 3306,
      user: DB_USER || 'root',
      password: DB_PASSWORD || '',
      database: DB_NAME || 'subscription_manager',
      multipleStatements: true // Allow multiple SQL statements
    });
    
    console.log('Connected to MySQL database');
    
    // Read SQL file
    const sqlPath = path.join(__dirname, 'add-password-resets-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute SQL
    console.log('Executing SQL script...');
    await connection.query(sql);
    
    console.log('✅ Password resets table added successfully!');
    
  } catch (error) {
    console.error('Error adding password_resets table:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
    process.exit(0);
  }
}

addPasswordResetsTable();
