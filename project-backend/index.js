const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

db.query(`
  CREATE TABLE IF NOT EXISTS dr_pepper (
    dr_pepper_id INT AUTO_INCREMENT PRIMARY KEY,
    dr_pepper_name VARCHAR(255),
    dr_pepper_description VARCHAR(1000),
    dr_pepper_image_link VARCHAR(255)
  )
`, (err) => {
  if (err) throw err;
  console.log('dr_pepper table ensured.');
});

app.get('/dr_pepper/:dr_pepper_id', (req, res) => {
  const dr_pepper_id = req.params.dr_pepper_id;

  db.query('SELECT * FROM dr_pepper WHERE dr_pepper_id = ?', [dr_pepper_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).send('Item not found.');
    }
  });
});

app.post('/dr_pepper', (req, res) => {
  const { dr_pepper_name } = req.body;
  db.query('INSERT INTO dr_pepper (dr_pepper_name) VALUES (?)', [dr_pepper_name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, dr_pepper_name });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
