function esAdmin(req, res, next) {
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso restringido a administradores.' });
  }
  next();
}

module.exports = { esAdmin };