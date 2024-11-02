const express = require('express');
const connection = require('./conexion'); // Importa la conexión desde conexion.js
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static('public'));

// Configuración de la sesión
app.use(session({
    secret: 'tu_secreto_de_sesion',
    resave: false,
    saveUninitialized: true
}));

// Ruta para registrar un usuario
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)';
        connection.query(sql, [name, email, hashedPassword], (err, result) => {
            if (err) {
                res.status(500).send('Error al registrar el usuario');
                return;
            }
            res.status(201).json({ id: result.insertId, name, email });
        });
    } catch (error) {
        res.status(500).send('Error al registrar el usuario');
        console.error('Error al registrar el usuario:', error);
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
