const { Pool } = require('pg');

const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'doctor_database',
  password: 'secret',
  port: 5432,
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

const db = require('./database');

const getDoctors = async () => {
  try {
    const res = await db.query('SELECT * FROM doctors');
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  }
};

getDoctors();
