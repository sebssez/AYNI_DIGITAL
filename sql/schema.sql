CREATE DATABASE IF NOT EXISTS kallpa_cacao_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kallpa_cacao_db;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('cliente', 'admin') DEFAULT 'cliente',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  categoria VARCHAR(60) NOT NULL,
  porcentaje_cacao INT DEFAULT 70,
  notas_cata VARCHAR(255),
  precio DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 10,
  color_hex VARCHAR(20) DEFAULT '#5c3720',
  activo TINYINT(1) DEFAULT 1
);

CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  usuario_id INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  estado ENUM('Pendiente', 'Confirmado', 'Enviado', 'Entregado', 'Cancelado') DEFAULT 'Pendiente',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE detalle_pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Productos iniciales de muestra
INSERT INTO productos (nombre, categoria, porcentaje_cacao, notas_cata, precio, stock, color_hex) VALUES
('La Convención', 'Tabletas de origen', 70, 'Frutos rojos, nuez tostada', 28.00, 25, '#5c3720'),
('Quillabamba Intenso', 'Tabletas de origen', 85, 'Café, tabaco dulce', 32.00, 18, '#3d2214'),
('Leche Andina', 'Tabletas de origen', 55, 'Caramelo, vainilla natural', 26.00, 30, '#7a4a2b'),
('Caja de 12 bombones', 'Bombones', 60, 'Ganache de maracuyá y sal de Maras', 78.00, 12, '#6a3a1f'),
('Trufas de lúcuma', 'Bombones', 70, 'Cremosas, notas de miel andina', 44.00, 15, '#8a5a30'),
('Nibs tostados', 'Cacao en polvo & nibs', 100, 'Crujientes, amargor limpio', 34.00, 20, '#4a2a1a'),
('Cacao en polvo puro', 'Cacao en polvo & nibs', 100, 'Profundo, sin azúcar añadida', 30.00, 22, '#321b10'),
('Caja degustación', 'Regalos', 70, 'Seis tabletas de origen seleccionadas', 149.00, 10, '#8B4513');