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

// Servir archivos estáticos del frontend ultra rápido
app.use(express.static(path.join(__dirname, '../public')));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/libros', productoRoutes); // Alias opcional
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);

app.use(manejarErrores);

module.exports = app;