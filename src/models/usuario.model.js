const pool = require('../config/database');

const UsuarioModel = {
  async buscarPorEmail(email) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0];
  },
  async crear({ nombre, email, passwordHash, rol = 'cliente' }) {
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, passwordHash, rol]
    );
    return result.insertId;
  }
};

module.exports = UsuarioModel;