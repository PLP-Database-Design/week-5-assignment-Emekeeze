require('dotenv').config(); // Load environment variables
const express = require('express');
const mysql = require('mysql2');


const app = express();

// Middleware to parse JSON
app.use(express.json()); 



// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}); 

// Test database connection
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the database.'); 
});
 
// Define a route for the root URL
// app.get('/', (req, res) => {
   //  res.send('Welcome to the Hospital API!');
  //});
  
// Question 1: Retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  console.log('Executing query:', query);  // Log the query for debugging
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database Query Error: ', err);  // Log error if query fails
      return res.status(500).json({ error: err.message }); 
    }

    console.log('Query Results:', results);  // Log the results for debugging
    if (results.length === 0) {
      return res.status(404).json({ message: 'No patients found' });
    }

    res.json(results);  // Send the results as the response
  });
});
 
  

// Question 2: Retrieve all providers


// Question 3: Filter patients by First Name
app.get('/patients/:firstName', (req, res) => {
  const { firstName } = req.params;
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  db.query(query, [firstName], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Question 4: Retrieve all providers by their specialty
app.get('/providers/specialty/:specialty', (req, res) => {
  const { specialty } = req.params;
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  db.query(query, [specialty], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
}); 

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
