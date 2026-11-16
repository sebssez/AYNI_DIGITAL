const pool = require('../config/database');

const ProductoModel = {
  async listarActivos() {
    const [rows] = await pool.query('SELECT * FROM productos WHERE activo = 1 ORDER BY id ASC');
    return rows;
  },
  async crear({ nombre, categoria, porcentaje_cacao, notas_cata, precio, stock, color_hex }) {
    const [result] = await pool.query(
      'INSERT INTO productos (nombre, categoria, porcentaje_cacao, notas_cata, precio, stock, color_hex) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, categoria, porcentaje_cacao, notas_cata, precio, stock, color_hex || '#5c3720']
    );
    return result.insertId;
  },
  async eliminar(id) {
    await pool.query('UPDATE productos SET activo = 0 WHERE id = ?', [id]);
  }
};

module.exports = ProductoModel;