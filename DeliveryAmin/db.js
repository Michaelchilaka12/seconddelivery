require('dotenv').config();
const { Pool } = require('pg');

// Create a pool instance
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Disable SSL verification
      },
});

// Function to query the database
const query = (text, params) => pool.query(text, params);

module.exports = {
  query,
};
