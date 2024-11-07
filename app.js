const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

// Configuración de body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la conexión a la base de datos
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

// Rutas para manejar la información de los cursos

// Obtener todos los cursos
app.get('/cursos', (req, res) => {
    db.query('SELECT * FROM cursos', (err, results) => {
        if (err) {
            res.status(500).send('Error obteniendo los cursos');
            return;
        }
        res.json(results);
    });
});

// Agregar un nuevo curso
app.post('/cursos', (req, res) => {
    const { nombre_curso, URL_curso, Duracion, Precio, Institucion } = req.body;
    const sql = 'INSERT INTO cursos (nombre_curso, URL_curso, Duracion, Precio, Institucion ) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nombre_curso, URL_curso, Duracion, Precio, Institucion], (err, result) => {
        if (err) {
            res.status(500).send('Error agregando el curso');
            return;
        }
        res.status(201).json({ id: result.insertId, nombre_curso, URL_curso, Duracion, Precio, Institucion  });
    });
});

// Actualizar un curso
app.put('/cursos/:id', (req, res) => {
    const { nombre_curso, URL_curso, Duracion, Precio, Institucion } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE cursos SET nombre_curso = ?, URL_curso = ?, Duracion = ?, Precio = ?, Institucion = ? WHERE id = ?';
    db.query(sql, [nombre_curso, URL_curso, Duracion, Precio, Institucion , id], (err, result) => {
        if (err) {
            res.status(500).send('Error actualizando el curso');
            return;
        }
        res.json({ id, nombre_curso, URL_curso, Duracion, Precio, Institucion  });
    });
});

// Eliminar un curso
app.delete('/cursos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM cursos WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send('Error eliminando el curso');
            return;
        }
        res.send('Curso eliminado');
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
