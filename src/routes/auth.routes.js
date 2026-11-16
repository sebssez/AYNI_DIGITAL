const router = require('express').Router();
const AuthController = require('../controllers/auth.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { permitirRoles } = require('../middlewares/role.middleware');

router.post('/registro', AuthController.registro);
router.post('/login', AuthController.login);

// Rutas exclusivas del Administrador
router.get('/usuarios', verificarToken, permitirRoles('admin'), AuthController.listarUsuarios);
router.put('/usuarios/:id/rol', verificarToken, permitirRoles('admin'), AuthController.cambiarRol);

module.exports = router;