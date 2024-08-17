// backend/server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow the frontend to connect
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({
  origin: 'http://localhost:3000', // Allow the frontend to connect
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

app.post('/register', (req, res) => {
  const { name, email, phone, role, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = `INSERT INTO users (name, email, phone, role, password) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [name, email, phone, role, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to register' });
    res.json({ message: 'User registered successfully' });
  });
});

app.post('/', (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(400).json({ error: 'User not found' });

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id }, 'your-secret-key', { expiresIn: '1h' });
    res.json({ token, userId: user.id });
  });
});

app.get('/users', (req, res) => {
  const query = `SELECT id, name, email, phone, role FROM users`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone, role } = req.body;

  const query = `UPDATE users SET name = ?, email = ?, phone = ?, role = ? WHERE id = ?`;
  db.query(query, [name, email, phone, role, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'User updated successfully' });
  });
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM users WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'User deleted successfully' });
  });
});

app.get('/', (req, res) => {
  res.send('Chat Server Running');
});

app.get('/messages', (req, res) => {
  const query = `SELECT * FROM messages ORDER BY timestamp ASC`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('sendMessage', ({ senderId, receiverId, content }) => {
    const query = `INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)`;
    db.query(query, [senderId, receiverId, content], (err, result) => {
      if (err) return console.error(err);

      io.emit('receiveMessage', { senderId, receiverId, content, timestamp: new Date() });
    });
  });

  socket.on('setUserStatus', ({ userId, status }) => {
    const query = `UPDATE users SET online = ? WHERE id = ?`;
    db.query(query, [status, userId], (err, result) => {
      if (err) return console.error(err);

      io.emit('updateUserStatus', { userId, status });
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
