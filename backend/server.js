const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const UnencryptedMessageDao = require('./dao/unencryptedDao');

const app = express();
const PORT = 3000;

// Enable CORS (so your SPA can fetch)
app.use(cors());
app.use(express.json());

// Open SQLite database (replace with your path)
const dbPath = path.join(__dirname, 'uploads/db.db');
const messageDao = new UnencryptedMessageDao(dbPath);

app.get('/getMessages', async (req, res) => {
  try {
    const messages = await messageDao.getAllMessages();
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});