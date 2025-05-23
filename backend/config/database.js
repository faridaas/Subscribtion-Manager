const mysql = require('mysql2/promise');
const config = require('./app');

// Database connection config
const dbConfig = {
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create the connection pool
const pool = mysql.createPool(dbConfig);

// Test the connection
async function connect() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

module.exports = {
  connect,
  pool,
  query: async (sql, params) => {
    try {
      const [rows, fields] = await pool.execute(sql, params);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  disconnect: async () => {
    try {
      await pool.end();
      console.log('Database connection pool closed');
      return true;
    } catch (error) {
      console.error('Error closing database connection:', error);
      throw error;
    }
  }
};
