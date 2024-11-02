const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');

const connection = require('./conexion');

// Ahora puedes usar 'connection' para realizar consultas a la base de datos


const app = express();
const PORT = 3000;



// Conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'base_de_datos'
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de la sesión
app.use(session({
    secret: 'tu_secreto_de_sesion',
    resave: false,
    saveUninitialized: true
}));

// Ruta para el inicio de sesión
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT id, contraseña FROM usuarios WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            res.status(500).send('Error al conectar a la base de datos');
            return;
        }

        if (results.length > 0) {
            const { id, contraseña: hashedPassword } = results[0];
            
            bcrypt.compare(password, hashedPassword, (err, result) => {
                if (result) {
                    req.session.userId = id;
                    res.redirect('/inicio.html'); // Redirección a la página de inicio
                } else {
                    res.status(401).send('Contraseña incorrecta');
                }
            });
        } else {
            res.status(404).send('No se encontró el usuario con ese correo electrónico');
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
