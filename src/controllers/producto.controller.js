const ProductoModel = require('../models/producto.model');

const ProductoController = {
  async listar(req, res, next) {
    try {
      const productos = await ProductoModel.listarActivos();
      res.json(productos);
    } catch (err) {
      next(err);
    }
  },
  async crear(req, res, next) {
    try {
      const id = await ProductoModel.crear(req.body);
      res.status(201).json({ message: 'Producto agregado', id });
    } catch (err) {
      next(err);
    }
  },
  async eliminar(req, res, next) {
    try {
      await ProductoModel.eliminar(req.params.id);
      res.json({ message: 'Producto eliminado' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ProductoController;