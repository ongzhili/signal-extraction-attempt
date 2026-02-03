const fs = require("fs");
const Database = require('better-sqlite3');

const RECIPIENT_SELF = 2;
const RECIPIENT_SIGNAL = 3;

class DecryptedDAO {
  constructor(dbFile) {
    this.dbFile = dbFile;
    this.db = null;
  }
  open() {

    this.db = new Database(this.dbFile, {
      fileMustExist: true
    });

    console.log(`[*] Opened database: ${this.dbFile}`);
  }

  getMessages(toRecipientId) {
    if (!this.db) throw new Error("Database not opened");

    const stmt = this.db.prepare(`
      SELECT 
        m.body,
        CASE 
          WHEN r._id = ? THEN 'You'
          ELSE r.profile_joined_name
        END AS sender_name
      FROM message m
      JOIN recipient r ON r._id = m.from_recipient_id
      LEFT JOIN groups g ON g._id = r._id
      WHERE m.to_recipient_id = ?
        AND m.body IS NOT NULL
        AND m.body != ''
    `);

    const rows = stmt.all(RECIPIENT_SELF, toRecipientId);
    console.log(`[*] Messages for recipient_id=${toRecipientId}:`, rows);

    return rows;
  }

  getRecipients() {
    if (!this.db) throw new Error("Database not opened");

    const stmt = this.db.prepare(`
      SELECT 
        r._id AS id,
        CASE 
          WHEN r.type = 3 THEN g.title
          ELSE r.profile_joined_name
        END AS name
      FROM recipient r
      LEFT JOIN groups g ON g.recipient_id = r._id
      WHERE r.type != 4
        AND r._id NOT IN (?, ?)
    `);

    const recipients = stmt.all(RECIPIENT_SELF, RECIPIENT_SIGNAL);

    console.log(`[*] Recipient Data=${recipients}`, recipients)

    return recipients;
  }

  close() {
    if (this.db) {
      this.db.close();
      console.log(`[*] Closed database: ${this.dbFile}`);
    }
  }
}

module.exports = DecryptedDAO;