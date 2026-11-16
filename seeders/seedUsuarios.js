require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../src/config/database');

const cuentasPrueba = [
  // 2 Administradores
  { nombre: 'Sebastián Admin', email: 'admin1@kallpacacao.pe', pass: 'Admin123*', rol: 'admin' },
  { nombre: 'Dirección General', email: 'admin2@kallpacacao.pe', pass: 'Admin123*', rol: 'admin' },

  // 3 Artesanos (Compra y Venta)
  { nombre: 'Taller La Convención', email: 'artesano1@kallpacacao.pe', pass: 'Artesano123*', rol: 'artesano' },
  { nombre: 'Cacao Quillabamba', email: 'artesano2@kallpacacao.pe', pass: 'Artesano123*', rol: 'artesano' },
  { nombre: 'Finca Alto Urubamba', email: 'artesano3@kallpacacao.pe', pass: 'Artesano123*', rol: 'artesano' },

  // 3 Usuarios (Solo Compra)
  { nombre: 'Lucía Paredes', email: 'lucia@cliente.com', pass: 'Usuario123*', rol: 'usuario' },
  { nombre: 'Diego Mendoza', email: 'diego@cliente.com', pass: 'Usuario123*', rol: 'usuario' },
  { nombre: 'Valeria Quispe', email: 'valeria@cliente.com', pass: 'Usuario123*', rol: 'usuario' }
];

async function ejecutarSeeder() {
  try {
    console.log('Insertando usuarios, artesanos y administradores...');

    for (const u of cuentasPrueba) {
      const hash = await bcrypt.hash(u.pass, 10);
      await pool.query(
        `INSERT INTO usuarios (nombre, email, password, rol, activo) 
         VALUES (?, ?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), password = VALUES(password), rol = VALUES(rol)`,
        [u.nombre, u.email, hash, u.rol]
      );
    }

    console.log('¡Base de cuentas cargada con éxito!');
    process.exit(0);
  } catch (err) {
    console.error('Error al cargar el seeder:', err.message);
    process.exit(1);
  }
}

ejecutarSeeder();