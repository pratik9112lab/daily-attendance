const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Add Entry
app.post('/entry', (req, res) => {
  const { name, designation, date, entry } = req.body;
  db.run(
    `INSERT INTO attendance (name, designation, date, entry) VALUES (?, ?, ?, ?)`,
    [name, designation, date, entry],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.send({ success: true, id: this.lastID });
    }
  );
});

// Update Exit Time
app.post('/exit', (req, res) => {
  const { name, date, exit } = req.body;
  db.run(
    `UPDATE attendance SET exit = ? WHERE name = ? AND date = ?`,
    [exit, name, date],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.send({ success: true });
    }
  );
});

// Get all records
app.get('/attendance', (req, res) => {
  db.all(`SELECT * FROM attendance`, (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.send(rows);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
