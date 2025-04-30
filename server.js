const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL DB connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Noida@911', // ← replace with your actual password
  database: 'attendance'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
});

// Entry route
app.post('/entry', (req, res) => {
  const { name, designation, date, entry } = req.body;
  db.query(
    `INSERT INTO attendance (name, designation, date, entry) VALUES (?, ?, ?, ?)`,
    [name, designation || '-', date, entry],
    (err, result) => {
      if (err) return res.status(500).send(err.message);
      res.send({ success: true, id: result.insertId });
    }
  );
});

// Exit route
app.post('/exit', (req, res) => {
  const { name, date, exit } = req.body;
  db.query(
    `UPDATE attendance SET exit = ? WHERE name = ? AND date = ?`,
    [exit, name, date],
    (err, result) => {
      if (err) return res.status(500).send(err.message);
      res.send({ success: true });
    }
  );
});

// Get all attendance records
app.get('/attendance', (req, res) => {
  db.query(`SELECT * FROM attendance`, (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.send(results);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
