const PedidoModel = require('../models/pedido.model');
const { generarCodigoPedido } = require('../utils/codigoPedido');

const PedidoController = {
  async crear(req, res, next) {
    try {
      const { items, total } = req.body;
      if (!items || !items.length) {
        return res.status(400).json({ message: 'El carrito está vacío.' });
      }
      const codigo = generarCodigoPedido();
      const pedido = await PedidoModel.crearPedido({
        codigo,
        usuarioId: req.user.id,
        total,
        items
      });
      res.status(201).json({ message: 'Pedido registrado con éxito', ...pedido });
    } catch (err) {
      next(err);
    }
  },
  async misPedidos(req, res, next) {
    try {
      const pedidos = await PedidoModel.listarPorUsuario(req.user.id);
      res.json(pedidos);
    } catch (err) {
      next(err);
    }
  },
  async listarTodos(req, res, next) {
    try {
      const pedidos = await PedidoModel.listarTodos();
      res.json(pedidos);
    } catch (err) {
      next(err);
    }
  },
  async cambiarEstado(req, res, next) {
    try {
      await PedidoModel.actualizarEstado(req.params.id, req.body.estado);
      res.json({ message: 'Estado actualizado' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = PedidoController;