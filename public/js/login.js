const express = require('express');
const mysql = require('mysql2');
const conexion = require('./conexion');

// Crea un router para manejar las rutas de autenticación
const router = express.Router();

// Crear la tabla 'roles' si no existe
conexion.query(`
    CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rol VARCHAR(10) NOT NULL,
    )
`, err => {
    if (err) throw err;
    console.log("Tabla 'roles' creada o verificada");
});

// Crear la tabla 'usuarios' si no existe
conexion.query(`
    CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        telefono VARCHAR(10) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        contraseña VARCHAR(255) NOT NULL,
        rol_id INT,
        FOREIGN KEY (rol_id) REFERENCES roles(id)
    )
`, err => {
    if (err) throw err;
    console.log("Tabla 'usuarios' creada o verificada");
});
// Ruta de autenticación
router.post('/login', (req, res) => {
    const { email, contraseña } = req.body;
    const query = 'SELECT * FROM user WHERE email = ? AND contraseña = ?';
    conexion.query(query, [email, contraseña], (error, results) => {
        if (error) {
            console.error('Error en la consulta:', error);
            res.status(500).send('Error interno en el servidor');
            return;
        }
        if (results.length > 0) {
            const user = results[0];
            const rol = user.rol;

            if (rol === 'admin') {
                res.redirect('/admin/dashboard');
            } else if (rol === 'user') {
                res.redirect('/user/dashboard');
            } else {
                res.status(403).send('Rol no autorizado');
            }
        } else {
            res.status(401).send('Credenciales incorrectas');
        }
    });
});

// Exporta el router para usarlo en servidor.js
module.exports = router;