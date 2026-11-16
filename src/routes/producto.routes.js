const router = require('express').Router();
const ProductoController = require('../controllers/producto.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { permitirRoles } = require('../middlewares/role.middleware');

router.get('/', ProductoController.listar);
router.get('/mis-productos', verificarToken, permitirRoles('artesano', 'admin'), ProductoController.misProductos);
router.post('/', verificarToken, permitirRoles('artesano', 'admin'), ProductoController.crear);
router.delete('/:id', verificarToken, permitirRoles('artesano', 'admin'), ProductoController.eliminar);

module.exports = router;