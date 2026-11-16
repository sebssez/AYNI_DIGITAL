const express = require('express');
const cors = require('cors');
const path = require('path');
const { manejarErrores } = require('./middlewares/error.middleware');

const authRoutes = require('./routes/auth.routes');
const productoRoutes = require('./routes/producto.routes');
const pedidoRoutes = require('./routes/pedido.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta raíz muestra el Login al iniciar la página
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);

app.use(manejarErrores);

module.exports = app;