const pool = require('../config/database');

const ProductoModel = {
  async listarActivos() {
    const [rows] = await pool.query(
      `SELECT p.*, u.nombre AS artesano_nombre 
       FROM productos p 
       LEFT JOIN usuarios u ON p.artesano_id = u.id 
       WHERE p.activo = 1 ORDER BY p.id DESC`
    );
    return rows;
  },
  async listarPorArtesano(artesanoId) {
    const [rows] = await pool.query(
      'SELECT * FROM productos WHERE artesano_id = ? AND activo = 1 ORDER BY id DESC',
      [artesanoId]
    );
    return rows;
  },
  async crear({ artesano_id, nombre, categoria, porcentaje_cacao, notas_cata, precio, stock, color_hex }) {
    const [result] = await pool.query(
      `INSERT INTO productos (artesano_id, nombre, categoria, porcentaje_cacao, notas_cata, precio, stock, color_hex) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [artesano_id || null, nombre, categoria, porcentaje_cacao, notas_cata, precio, stock, color_hex || '#3B2216']
    );
    return result.insertId;
  },
  async eliminar(id, user) {
    if (user.rol === 'admin') {
      await pool.query('UPDATE productos SET activo = 0 WHERE id = ?', [id]);
    } else {
      // Un artesano solo puede eliminar sus propios productos
      await pool.query('UPDATE productos SET activo = 0 WHERE id = ? AND artesano_id = ?', [id, user.id]);
    }
  }
};

module.exports = ProductoModel;