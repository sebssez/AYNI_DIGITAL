const router = require('express').Router();
const PedidoController = require('../controllers/pedido.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { permitirRoles } = require('../middlewares/role.middleware');

// Cualquier usuario autenticado (usuario, artesano o admin) puede comprar
router.post('/', verificarToken, PedidoController.crear);
router.get('/mis-pedidos', verificarToken, PedidoController.misPedidos);

// Solo Admin gestiona todos los pedidos globales
router.get('/', verificarToken, permitirRoles('admin'), PedidoController.listarTodos);
router.put('/:id/estado', verificarToken, permitirRoles('admin'), PedidoController.cambiarEstado);

module.exports = router;