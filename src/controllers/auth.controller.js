const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/usuario.model');

const AuthController = {
  async registro(req, res, next) {
    try {
      const { nombre, email, password } = req.body;
      const existe = await UsuarioModel.buscarPorEmail(email);
      if (existe) return res.status(400).json({ message: 'El correo ya está registrado.' });

      const passwordHash = await bcrypt.hash(password, 10);
      const id = await UsuarioModel.crear({ nombre, email, passwordHash });
      res.status(201).json({ message: 'Usuario creado correctamente', id });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const usuario = await UsuarioModel.buscarPorEmail(email);
      if (!usuario) return res.status(401).json({ message: 'Credenciales inválidas.' });

      const valido = await bcrypt.compare(password, usuario.password);
      if (!valido) return res.status(401).json({ message: 'Credenciales inválidas.' });

      const token = jwt.sign(
        { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = AuthController;