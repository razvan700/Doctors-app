const { Pool } = require('pg');
const bcrypt = require('bcrypt'); // Assuming bcrypt is used for password hashing

const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'doctor_database',
  password: 'secret',
  port: 5432,
});

const addPatientAndObservation = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Add a new patient
    const insertPatientQuery = `
      INSERT INTO patients (name, surname, age, birth_date, address)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;
    const patientValues = ['John', 'Doe', 30, '02/02/1994', '123 Main St'];
    const patientResult = await client.query(insertPatientQuery, patientValues);
    const patientId = patientResult.rows[0].id;

    // Add an observation for the patient
    const insertObservationQuery = `
      INSERT INTO doctor_notes (doctor_id, patient_id, observation)
      VALUES ($1, $2, $3);
    `;
    const doctorId = 1; // Replace with the actual doctorId
    const observation = 'Patient shows signs of improvement.';
    const observationValues = [doctorId, patientId, observation];
    await client.query(insertObservationQuery, observationValues);

    await client.query('COMMIT');
    console.log('Patient and observation added successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding patient and observation:', error);
  } finally {
    client.release();
  }
};

addPatientAndObservation();
