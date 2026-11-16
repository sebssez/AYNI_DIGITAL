DROP DATABASE IF EXISTS aynidigital_db;
CREATE DATABASE aynidigital_dbb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aynidigital_db;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('usuario', 'artesano', 'admin') DEFAULT 'usuario',
  activo TINYINT(1) DEFAULT 1,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  artesano_id INT NULL,
  nombre VARCHAR(120) NOT NULL,
  categoria VARCHAR(60) NOT NULL,
  porcentaje_cacao INT DEFAULT 70,
  notas_cata VARCHAR(255),
  precio DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 10,
  color_hex VARCHAR(20) DEFAULT '#3B2216',
  activo TINYINT(1) DEFAULT 1,
  FOREIGN KEY (artesano_id) REFERENCES usuarios(id) ON DELETE SET NULL
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

-- Productos iniciales de catálogo base
INSERT INTO productos (nombre, categoria, porcentaje_cacao, notas_cata, precio, stock, color_hex) VALUES
('La Convención Reserve', 'Tabletas de origen', 70, 'Frutos rojos, nuez tostada', 28.00, 25, '#3B2216'),
('Quillabamba Pure 85%', 'Tabletas de origen', 85, 'Café, tabaco dulce', 32.00, 18, '#23140D'),
('Andean Milk & Sal de Maras', 'Tabletas de origen', 55, 'Caramelo, vainilla orgánica', 26.00, 30, '#6B4226'),
('Colección Bombones Amazónicos', 'Bombones', 65, 'Ganache de maracuyá y aguaymanto', 78.00, 12, '#5C3317'),
('Nibs Tostados PureRoast', 'Cacao en polvo & nibs', 100, 'Crujientes, amargor limpio', 34.00, 20, '#4A2A1A'),
('Edición Limitada Ayni Box', 'Regalos', 70, 'Seis tabletas de origen seleccionadas', 149.00, 10, '#153E5C');