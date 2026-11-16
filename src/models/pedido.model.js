const pool = require('../config/database');

const PedidoModel = {
  async crearPedido({ codigo, usuarioId, total, items }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [resPedido] = await conn.query(
        'INSERT INTO pedidos (codigo, usuario_id, total) VALUES (?, ?, ?)',
        [codigo, usuarioId, total]
      );
      const pedidoId = resPedido.insertId;

      for (const item of items) {
        await conn.query(
          'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
          [pedidoId, item.id, item.q, item.precio]
        );
        await conn.query(
          'UPDATE productos SET stock = GREATEST(stock - ?, 0) WHERE id = ?',
          [item.q, item.id]
        );
      }

      await conn.commit();
      return { id: pedidoId, codigo };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
  async listarPorUsuario(usuarioId) {
    const [rows] = await pool.query(
      'SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY creado_en DESC',
      [usuarioId]
    );
    return rows;
  },
  async listarTodos() {
    const [rows] = await pool.query(
      `SELECT p.*, u.nombre AS cliente, u.email 
       FROM pedidos p JOIN usuarios u ON p.usuario_id = u.id 
       ORDER BY p.creado_en DESC`
    );
    return rows;
  },
  async actualizarEstado(id, estado) {
    await pool.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id]);
  }
};

module.exports = PedidoModel;