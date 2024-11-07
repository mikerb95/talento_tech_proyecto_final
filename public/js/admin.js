const express = require('express');
const mysql = require('mysql2');
 
// Conexión a la base de datos de conexion
const conexion = require('./conexion');

//Crear la tabla'Cursos' si no existe
db.query(`
    CREATE TABLE cursos (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        Nombre_curso VARCHAR(255) NOT NULL,
        URL_curso VARCHAR(255) NOT NULL,
        Duracion VARCHAR(255) NOT NULL,
        Valor INT(11) NOT NULL,
        Institucion VARCHAR(255) NOT NULL,
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
`, (err, results) => {
    if (err) {
        console.error('Error creando la tabla:', err.stack);
        return;
    }
    console.log('Tabla "cursos" creada correctamente');
});
const app = express();
const PORT = 5000;

// Configuración de body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    const sql = 'INSERT INTO cursos (Nombre_curso, URL_curso, Duracion, Precio, Institucion ) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [Nombre_curso, URL_curso, Duracion, Valor, Institucion], (err, result) => {
        if (err) {
            res.status(500).send('Error agregando el curso');
            return;
        }
        res.status(201).json({ id: result.insertId, Nombre_curso, URL_curso, Duracion, Precio, Institucion  });
    });
});
// Actualizar un curso
app.put('/cursos/:id', (req, res) => {
    const { Nombre_curso, URL_curso, Duracion, Valor, Institucion } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE cursos SET nombre_curso = ?, URL_curso = ?, Duracion = ?, Precio = ?, Institucion = ? WHERE id = ?';
    db.query(sql, [Nombre_curso, URL_curso, Duracion, Valor, Institucion , id], (err, result) => {
        if (err) {
            res.status(500).send('Error actualizando el curso');
            return;
        }
        res.json({ id, Nombre_curso, URL_curso, Duracion, Valor, Institucion  });
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
