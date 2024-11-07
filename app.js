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

// Crear la tabla 'cursos' si no existe
db.query(`
    CREATE TABLE IF NOT EXISTS cursos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Nombre_curso VARCHAR(255) NOT NULL,
        URL_curso VARCHAR(255) NOT NULL,
        Duracion VARCHAR(255) NOT NULL,
        Precio VARCHAR(255) NOT NULL,
        Institucion VARCHAR(255) NOT NULL
    )
`, err => {
    if (err) throw err;
    console.log("Tabla 'cursos' creada o verificada");
});


// Crear la tabla 'calificaciones' si no existe
db.query(`
    CREATE TABLE IF NOT EXISTS calificaciones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_Usuario INT NOT NULL,
        id_curso INT NOT NULL,
        Calificacion INT NOT NULL,
        Detalles VARCHAR(255) NOT NULL,
        Fecha DATE NOT NULL
    )
`, err => {
    if (err) throw err;
    console.log("Tabla 'calificaciones' creada o verificada");
});


// Crear la tabla 'roles' si no existe
db.query(`
    CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rol VARCHAR(255) NOT NULL
    )
`, err => {
    if (err) throw err;
    console.log("Tabla 'roles' creada o verificada");
});


// Crear la tabla 'usuarios' si no existe
db.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombres VARCHAR(255) NOT NULL,
        apellidos VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefono INT NOT NULL,
        nickname VARCHAR(255) NOT NULL,
        fecha_creacion DATETIME NOT NULL,
        rol_id INT NOT NULL
    )
`, err => {
    if (err) throw err;
    console.log("Tabla 'usuarios' creada o verificada");
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



// Obtener todos los calificaciones
app.get('/calificaciones', (req, res) => {
    db.query('SELECT * FROM calificaciones', (err, results) => {
        if (err) {
            res.status(500).send('Error obteniendo los calificaciones');
            return;
        }
        res.json(results);
    });
});

// Agregar un nuevo calificaciones
app.post('/calificaciones', (req, res) => {
    const { id_Usuario, id_curso, Califiacion, Detalles, Fecha } = req.body;
    const sql = 'INSERT INTO calificaciones (id_Usuario, id_curso, Califiacion, Detalles, Fecha) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [id_Usuario, id_curso, Califiacion, Detalles, Fecha], (err, result) => {
        if (err) {
            res.status(500).send('Error agregando el calificaciones');
            return;
        }
        res.status(201).json({ id: result.insertId, id_Usuario, id_curso, Califiacion, Detalles, Fecha  });
    });
});

// Actualizar un calificaciones
app.put('/calificaciones/:id', (req, res) => {
    const { id_Usuario, id_curso, Califiacion, Detalles, Fecha } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE calificaciones SET id_Usuario = ?, id_curso = ?, Califiacion = ?, Detalles = ?, Fecha = ? WHERE id = ?';
    db.query(sql, [id_Usuario, id_curso, Califiacion, Detalles, Fecha , id], (err, result) => {
        if (err) {
            res.status(500).send('Error actualizando el calificaciones');
            return;
        }
        res.json({ id_Usuario, id_curso, Califiacion, Detalles, Fecha });
    });
});

// Eliminar un calificaciones
app.delete('/calificaciones/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM calificaciones WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send('Error eliminando el calificaciones');
            return;
        }
        res.send('calificaciones eliminado');
    });
});

// Obtener todos los roles
app.get('/roles', (req, res) => {
    db.query('SELECT * FROM roles', (err, results) => {
        if (err) {
            res.status(500).send('Error obteniendo los roles');
            return;
        }
        res.json(results);
    });
});

// Agregar un nuevo roles
app.post('/roles', (req, res) => {
    const { id_Usuario, id_curso, Califiacion, Detalles, Fecha } = req.body;
    const sql = 'INSERT INTO roles (id_Usuario, id_curso, Califiacion, Detalles, Fecha) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [id_Usuario, id_curso, Califiacion, Detalles, Fecha], (err, result) => {
        if (err) {
            res.status(500).send('Error agregando el roles');
            return;
        }
        res.status(201).json({ id: result.insertId, id_Usuario, id_curso, Califiacion, Detalles, Fecha  });
    });
});

// Actualizar un roles
app.put('/roles/:id', (req, res) => {
    const { id_Usuario, id_curso, Califiacion, Detalles, Fecha } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE roles SET id_Usuario = ?, id_curso = ?, Califiacion = ?, Detalles = ?, Fecha = ? WHERE id = ?';
    db.query(sql, [id_Usuario, id_curso, Califiacion, Detalles, Fecha , id], (err, result) => {
        if (err) {
            res.status(500).send('Error actualizando el roles');
            return;
        }
        res.json({ id_Usuario, id_curso, Califiacion, Detalles, Fecha });
    });
});

// Eliminar un roles
app.delete('/roles/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM roles WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send('Error eliminando el roles');
            return;
        }
        res.send('roles eliminado');
    });
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
