const router = require('express').Router();
const PedidoController = require('../controllers/pedido.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { esAdmin } = require('../middlewares/role.middleware');

router.post('/', verificarToken, PedidoController.crear);
router.get('/mis-pedidos', verificarToken, PedidoController.misPedidos);
router.get('/', verificarToken, esAdmin, PedidoController.listarTodos);
router.put('/:id/estado', verificarToken, esAdmin, PedidoController.cambiarEstado);

module.exports = router;