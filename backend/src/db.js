const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

pool.on('connect', client => {
  client.query('SET search_path TO public');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
