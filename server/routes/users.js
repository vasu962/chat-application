// routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create a user
router.post('/', (req, res) => {
  const { name, email, phone, role } = req.body;
  const query = 'INSERT INTO users (name, email, phone, role) VALUES (?, ?, ?, ?)';
  db.query(query, [name, email, phone, role], (err, result) => {
    if (err) throw err;
    res.send('User created');
  });
});

// Read all users
router.get('/', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update a user
router.put('/:id', (req, res) => {
  const { name, email, phone, role } = req.body;
  const query = 'UPDATE users SET name = ?, email = ?, phone = ?, role = ? WHERE id = ?';
  db.query(query, [name, email, phone, role, req.params.id], (err, result) => {
    if (err) throw err;
    res.send('User updated');
  });
});

// Delete a user
router.delete('/:id', (req, res) => {
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send('User deleted');
  });
});

module.exports = router;
