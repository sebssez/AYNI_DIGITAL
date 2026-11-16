const router = require('express').Router();
const ProductoController = require('../controllers/producto.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { esAdmin } = require('../middlewares/role.middleware');

router.get('/', ProductoController.listar);
router.post('/', verificarToken, esAdmin, ProductoController.crear);
router.delete('/:id', verificarToken, esAdmin, ProductoController.eliminar);

module.exports = router;
