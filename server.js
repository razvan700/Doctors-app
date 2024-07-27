const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

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

const upload = multer({ dest: 'uploads/' });
const WIT_AI_TOKEN = 'TUFIGYZIBBZPEBPGYMHDRGK6IA47TZTY'; // Replace with your Wit.ai token

// Explicitly set the path to the FFmpeg binary
//ffmpeg.setFfmpegPath('C:\\ffmpeg\\bin\\ffmpeg.exe'); // Ensure this path is correct

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

    res.status(200).json({ message: 'Login successful', doctorId: doctor.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/signup', async (req, res) => {
  const { name, surname, email, password } = req.body;

  if (!name || !surname || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
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
    console.log(`Fetching patient data for ID: ${id}`);
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [parseInt(id, 10)]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching patient data:', error);
    res.status(500).json({ message: 'Failed to fetch patient data' });
  }
});

app.get('/observations/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    console.log(`Fetching observations for patient ID: ${patientId}`);
    const result = await pool.query('SELECT * FROM doctor_notes WHERE patient_id = $1', [parseInt(patientId, 10)]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching observations:', error);
    res.status(500).json({ message: 'Failed to fetch observations' });
  }
});

app.post('/add-observation', async (req, res) => {
  try {
    const { doctor_id, patient_id, observation, date } = req.body;
    const result = await pool.query(
      'INSERT INTO doctor_notes (doctor_id, patient_id, observation, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
      [doctor_id, patient_id, observation, date]
    );
    res.status(200).json({ message: 'Observation added successfully', observation: result.rows[0] });
  } catch (error) {
    console.error('Error adding observation:', error);
    res.status(500).json({ message: 'Failed to add observation' });
  }
});

app.post('/convert', upload.single('file'), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join(__dirname, 'uploads', `${req.file.filename}.wav`);

  console.log('Input path:', inputPath);
  console.log('Output path:', outputPath);

  ffmpeg(inputPath)
    .toFormat('wav')
    .on('end', async () => {
      console.log('File has been converted to wav format');

      // Check if the file exists
      if (!fs.existsSync(outputPath)) {
        console.error('Converted file does not exist');
        return res.status(500).json({ error: 'Converted file does not exist' });
      }

      const fileBuffer = fs.readFileSync(outputPath);

      try {
        const { default: fetch } = await import('node-fetch');

        const response = await fetch('https://api.wit.ai/speech?v=20220101', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${WIT_AI_TOKEN}`,
            'Content-Type': 'audio/wav',
          },
          body: fileBuffer,
        });

        const rawResponse = await response.text();  // Get the raw response text
        console.log('Raw Wit.ai response:', rawResponse);

        // Extract JSON objects using a regular expression
        const jsonRegex = /{(?:[^{}]|{[^{}]*})*}/g;
        const jsonObjects = rawResponse.match(jsonRegex);

        const results = jsonObjects.map(part => {
          try {
            return JSON.parse(part, (key, value) => {
              if (key === 'tokens' && Array.isArray(value)) {
                return value.map(token => ({
                  ...token,
                  token: JSON.stringify(token.token),  // Convert tokens to string if they are objects
                }));
              }
              return value;
            });
          } catch (error) {
            console.error('Error parsing part:', part, error);
            return null;
          }
        }).filter(obj => obj && Object.keys(obj).length > 0);

        console.log('Parsed Wit.ai responses:', results);

        // Cleanup
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);

        res.json(results);
      } catch (error) {
        console.error('Error sending audio to Wit.ai', error);
        res.status(500).json({ error: 'Error sending audio to Wit.ai' });
      }
    })
    .on('error', (err) => {
      console.error('Error converting file', err);
      res.status(500).json({ error: 'Error converting file' });
    })
    .save(outputPath);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
