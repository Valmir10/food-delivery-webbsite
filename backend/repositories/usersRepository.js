const db = require("../db/database");

const createUser = (email, passwordHash, name) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users (email, password_hash, name)
      VALUES (?, ?, ?)
    `;
    db.run(sql, [email, passwordHash, name], function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, email, name, role FROM users WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
};
