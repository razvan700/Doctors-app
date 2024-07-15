const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'doctor_database',
  password: 'secret',
  port: 5432,
});

const addDoctor = async (name, surname, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const text = 'INSERT INTO doctors (name, surname, email, password) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [name, surname, email, hashedPassword];

  try {
    const res = await pool.query(text, values);
    console.log('Doctor added:', res.rows[0]);
  } catch (err) {
    console.error('Error adding doctor:', err);
  } finally {
    pool.end();
  }
};

addDoctor('John2', 'Doe', 'john.d@example.com', 'sec');

