const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'doctor_database',
  password: 'secret',
  port: 5432,
});

app.use(bodyParser.json());

app.post('/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM doctors WHERE name = $1', [name]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Doctor not found' });
    }

    const doctor = result.rows[0];
    const validPassword = await bcrypt.compare(password, doctor.password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Doctor signup endpoint
app.post('/signup', async (req, res) => {
  const { name, surname, email, password } = req.body;

  if (!name || !surname || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new doctor into the database
    const result = await pool.query(
      'INSERT INTO doctors (name, surname, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, surname, email, hashedPassword]
    );

    const newDoctor = result.rows[0];
    res.status(200).json({ message: 'Doctor registered successfully', doctor: newDoctor });
  } catch (error) {
    console.error('Error registering doctor:', error);
    res.status(500).json({ message: 'An error occurred during signup' });
  }
});

// add patient endpoint
app.post('/add-patient', async (req, res) => {
  const { name, surname, age, birthDate, address } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO patients (name, surname, age, birth_date, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, surname, age, birthDate, address]
    );
    res.status(200).json({ message: 'Patient added successfully', patient: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding patient' });
  }
});

// get patients from the database endpoint
app.get('/patients', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, surname FROM patients');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

app.get('/patient/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await getPatientById(id); // Fetch patient details from your database
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch patient data' });
  }
});

app.get('/observations/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const observations = await getObservationsByPatientId(patientId); // Fetch observations from your database
    res.json(observations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch observations' });
  }
});

app.post('/add-observation', async (req, res) => {
  try {
    const { id_doctor, id_patient, observation, date } = req.body;
    await addObservation(id_doctor, id_patient, observation, date); // Add observation to your database
    res.json({ message: 'Observation added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add observation' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
