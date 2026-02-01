const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class UnencryptedMessageDao {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) console.error('DB connection error:', err);
      else console.log('Connected to SQLite DB');
    });
  }

  _runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getAllMessages() {
    const sql = `
      SELECT
        m.message_id,
        m.message_text,
        m.message_type,
        m.status,
        m.sent_at,
        sender.username AS sender_name,
        receiver.username AS receiver_name
      FROM messages m
      JOIN users sender ON m.sender_id = sender.user_id
      JOIN users receiver ON m.receiver_id = receiver.user_id
      ORDER BY m.sent_at ASC
    `;

    const rows = await this._runQuery(sql);

    return rows;
  }
}

module.exports = UnencryptedMessageDao;
