const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const DecryptedDAO = require('./dao/decryptedDbDao');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dbFile = path.join(__dirname, 'uploads/signal.db');
const secretFile = path.join(__dirname, 'uploads/secret.txt');
const messageDao = new DecryptedDAO(dbFile, secretFile);
messageDao.open();

app.get("/getMessages", (req, res) => {
  try {
    const toRecipientId = req.query.recipient;

    if (!toRecipientId) {
      return res.status(400).json({ error: "recipient is required" });
    }

    const messages = messageDao.getMessages(toRecipientId);
    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.get('/getRecipients', async (req, res) => {
  try {
    const recipients = messageDao.getRecipients();
    res.json({ recipients });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recipients" });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

