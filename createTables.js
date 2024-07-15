const { Pool } = require('pg');

const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'doctor_database',
  password: 'secret',
  port: 5432,
});

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        surname VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        surname VARCHAR(100) NOT NULL,
        age INT NOT NULL,
        birth_date DATE NOT NULL,
        address TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS doctor_notes (
        id SERIAL PRIMARY KEY,
        doctor_id INT NOT NULL REFERENCES doctors(id),
        patient_id INT NOT NULL REFERENCES patients(id),
        observation TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tables created successfully');
  } catch (err) {
    console.error('Error creating tables', err);
  } finally {
    pool.end();
  }
};

createTables();
