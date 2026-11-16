const pool = require('../config/database');

const UsuarioModel = {
  async buscarPorEmail(email) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ? AND activo = 1', [email]);
    return rows[0];
  },
  async crear({ nombre, email, passwordHash, rol = 'usuario' }) {
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, passwordHash, rol]
    );
    return result.insertId;
  },
  async listarTodos() {
    const [rows] = await pool.query(
      'SELECT id, nombre, email, rol, activo, creado_en FROM usuarios ORDER BY creado_en DESC'
    );
    return rows;
  },
  async actualizarRol(id, rol) {
    await pool.query('UPDATE usuarios SET rol = ? WHERE id = ?', [rol, id]);
  },
  async cambiarEstadoActivo(id, activo) {
    await pool.query('UPDATE usuarios SET activo = ? WHERE id = ?', [activo, id]);
  }
};

module.exports = UsuarioModel;