// Core and third-party modules
const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config();

// App init
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change_this_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    },
  })
);

// DB connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'talentum',
});

db.connect((error) => {
  if (error) {
    console.error('Error al conectar con la base de datos:', error);
    return;
  }
  console.log('Conectado a la base de datos');
});

// --- Bootstrap DB (idempotent) ---
// Nota: Si las tablas ya existen con columnas antiguas, ejecuta src/config/db.sql para alinear el esquema.
db.query(
  `CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol VARCHAR(255) NOT NULL
  )`,
  (err) => {
    if (err) console.error(err);
    else console.log("Tabla 'roles' creada o verificada");
  }
);

db.query(
  `CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    nickname VARCHAR(255) NOT NULL,
    \`contraseña\` VARCHAR(255) NULL,
    fecha_creacion DATE NOT NULL,
    rol_id INT NOT NULL,
    UNIQUE KEY unique_email (email),
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  (err) => {
    if (err) console.error(err);
    else console.log("Tabla 'usuarios' creada o verificada");
  }
);

db.query(
  `CREATE TABLE IF NOT EXISTS cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_curso VARCHAR(255) NOT NULL,
    descripcion TEXT NULL,
    URL_curso VARCHAR(255) NOT NULL,
    duracion VARCHAR(50) NOT NULL,
    valor INT NOT NULL,
    institucion VARCHAR(255) NOT NULL,
    img_url VARCHAR(255) NULL,
    acciones VARCHAR(255) NULL
  )`,
  (err) => {
    if (err) console.error(err);
    else console.log("Tabla 'cursos' creada o verificada");
  }
);

db.query(
  `CREATE TABLE IF NOT EXISTS calificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_curso INT NOT NULL,
    calificacion TINYINT NOT NULL CHECK (calificacion BETWEEN 1 AND 10),
    detalles VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_curso) REFERENCES cursos(id) ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  (err) => {
    if (err) console.error(err);
    else console.log("Tabla 'calificaciones' creada o verificada");
  }
);

// --- Auth ---
app.post('/index', (req, res) => {
  const { email, contraseña } = req.body;
  if (!email || !contraseña) return res.status(400).send('Faltan credenciales');

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.error('Error en la consulta:', error);
      return res.status(500).send('Error interno en el servidor');
    }
    if (results.length === 0) return res.status(401).send('Credenciales incorrectas');

    const usuario = results[0];

    // Soporte legacy: si la columna contraseña contiene hash, usar bcrypt; si no, comparar texto plano
    let ok = false;
    try {
      if (usuario['contraseña']) {
        // Intentar comparar como hash; si falla por formato, fallback a comparación directa
        ok = await bcrypt
          .compare(contraseña, usuario['contraseña'])
          .catch(() => usuario['contraseña'] === contraseña);
      }
    } catch (e) {
      ok = usuario['contraseña'] === contraseña;
    }

    if (!ok) return res.status(401).send('Credenciales incorrectas');

    req.session.userId = usuario.id;
    req.session.rolId = usuario.rol_id;

    if (usuario.rol_id === 1) return res.redirect('/admin/admin.html');
    if (usuario.rol_id === 2) return res.redirect('/usuarios/perfil.html');
    return res.status(403).send('Rol no autorizado');
  });
});

app.post('/registrar', async (req, res) => {
  const { nombres, apellidos, email, telefono, nickname, contraseña, fecha_creacion, rol_id } = req.body;
  if (!nombres || !apellidos || !email || !telefono || !nickname || !contraseña || !fecha_creacion || !rol_id) {
    return res.status(400).send('Datos incompletos');
  }
  try {
    const hashed = await bcrypt.hash(contraseña, 10);
    const sql = 'INSERT INTO usuarios (nombres, apellidos, email, telefono, nickname, `contraseña`, fecha_creacion, rol_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nombres, apellidos, email, telefono, nickname, hashed, fecha_creacion, rol_id], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al crear usuario');
      }
      res.redirect('/');
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error al crear usuario');
  }
});

// --- Perfil ---
app.get('/perfil', (req, res) => {
  if (!req.session.userId) return res.redirect('/');
  res.sendFile(path.join(__dirname, 'public/usuarios/perfil.html'));
});

app.get('/api/perfil', (req, res) => {
  if (!req.session.userId) return res.status(401).send('No autenticado');
  db.query(
    'SELECT id, nombres, apellidos, email, telefono, nickname, rol_id, fecha_creacion FROM usuarios WHERE id = ?',
    [req.session.userId],
    (error, results) => {
      if (error) return res.status(500).send('Error del servidor');
      if (!results.length) return res.status(404).send('No encontrado');
      res.json(results[0]);
    }
  );
});

// --- Cursos CRUD ---
// Compatibilidad de entrada: acepta tanto camel/uppercase como snake/lowercase
function parseCursoBody(body) {
  return {
    nombre_curso: body.nombre_curso ?? body.Nombre_curso ?? body.Titulo_Curso ?? null,
    descripcion: body.descripcion ?? body.Descripcion ?? body.descripcion_Curso ?? null,
    URL_curso: body.URL_curso ?? body.Url_Curso ?? body.url_curso ?? null,
    duracion: body.duracion ?? body.Duracion ?? body.duracion_Curso ?? null,
    valor: body.valor ?? body.Valor ?? body.valor_Curso ?? null,
    institucion: body.institucion ?? body.Institucion ?? null,
    img_url: body.img_url ?? body.imgUrl ?? null,
    acciones: body.acciones ?? body.Acciones ?? null,
  };
}

app.get('/cursos', (req, res) => {
  db.query('SELECT * FROM cursos', (err, results) => {
    if (err) return res.status(500).send('Error obteniendo los cursos');
    res.json(results);
  });
});

app.post('/cursos', (req, res) => {
  const { nombre_curso, descripcion, URL_curso, duracion, valor, institucion, img_url, acciones } = parseCursoBody(req.body);
  if (!nombre_curso || !URL_curso || !duracion || valor == null || !institucion) {
    return res.status(400).send('Datos de curso incompletos');
  }
  const sql =
    'INSERT INTO cursos (nombre_curso, descripcion, URL_curso, duracion, valor, institucion, img_url, acciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(
    sql,
    [nombre_curso, descripcion, URL_curso, duracion, valor, institucion, img_url, acciones],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error agregando el curso');
      }
      res
        .status(201)
        .json({ id: result.insertId, nombre_curso, descripcion, URL_curso, duracion, valor, institucion, img_url, acciones });
    }
  );
});

app.put('/cursos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre_curso, descripcion, URL_curso, duracion, valor, institucion, img_url, acciones } = parseCursoBody(req.body);
  const sql =
    'UPDATE cursos SET nombre_curso = ?, descripcion = ?, URL_curso = ?, duracion = ?, valor = ?, institucion = ?, img_url = ?, acciones = ? WHERE id = ?';
  db.query(
    sql,
    [nombre_curso, descripcion, URL_curso, duracion, valor, institucion, img_url, acciones, id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error actualizando el curso');
      }
      res.json({ id, nombre_curso, descripcion, URL_curso, duracion, valor, institucion, img_url, acciones });
    }
  );
});

app.delete('/cursos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM cursos WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send('Error eliminando el curso');
    res.sendStatus(204);
  });
});

// Redirección a URL de curso
app.post('/ver-mas', (req, res) => {
  const cursoId = req.body.cursoId;
  db.query('SELECT * FROM cursos WHERE id = ?', [cursoId], (err, resultados) => {
    if (err) {
      console.error('Error al recuperar el curso:', err);
      res.status(500).send('Error interno del servidor');
      return;
    }
    if (!resultados.length) return res.status(404).send('Curso no encontrado');
    const curso = resultados[0];
    res.redirect(curso.URL_curso);
  });
});

// --- Calificaciones ---
app.get('/calificaciones', (req, res) => {
  db.query('SELECT * FROM calificaciones', (err, results) => {
    if (err) return res.status(500).send('Error obteniendo las calificaciones');
    res.json(results);
  });
});

app.get('/cursos/:id/calificaciones', (req, res) => {
  const cursoId = req.params.id;
  // Alias para compatibilidad con frontend existente (Calificacion, Detalles, Fecha)
  db.query(
    'SELECT id, id_usuario AS id_Usuario, id_curso, calificacion AS Calificacion, detalles AS Detalles, fecha AS Fecha FROM calificaciones WHERE id_curso = ?',
    [cursoId],
    (err, resultados) => {
      if (err) {
        console.error('Error al recuperar las calificaciones:', err);
        res.status(500).send('Error interno del servidor');
        return;
      }
      res.json(resultados);
    }
  );
});

app.post('/calificaciones', (req, res) => {
  const { id_usuario, id_curso, calificacion, detalles, fecha } = req.body;
  if (!id_usuario || !id_curso || !calificacion || !detalles || !fecha) {
    return res.status(400).send('Datos de calificación incompletos');
  }
  db.query(
    'INSERT INTO calificaciones (id_usuario, id_curso, calificacion, detalles, fecha) VALUES (?, ?, ?, ?, ?)',
    [id_usuario, id_curso, calificacion, detalles, fecha],
    (err, result) => {
      if (err) return res.status(500).send('Error agregando la calificación');
      res.status(201).json({ id: result.insertId, id_usuario, id_curso, calificacion, detalles, fecha });
    }
  );
});

app.put('/calificaciones/:id', (req, res) => {
  const { id } = req.params;
  const { id_usuario, id_curso, calificacion, detalles, fecha } = req.body;
  db.query(
    'UPDATE calificaciones SET id_usuario = ?, id_curso = ?, calificacion = ?, detalles = ?, fecha = ? WHERE id = ?',
    [id_usuario, id_curso, calificacion, detalles, fecha, id],
    (err) => {
      if (err) return res.status(500).send('Error actualizando la calificación');
      res.json({ id, id_usuario, id_curso, calificacion, detalles, fecha });
    }
  );
});

app.delete('/calificaciones/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM calificaciones WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send('Error eliminando la calificación');
    res.sendStatus(204);
  });
});

// --- Roles ---
app.get('/roles', (req, res) => {
  db.query('SELECT * FROM roles', (err, results) => {
    if (err) return res.status(500).send('Error obteniendo los roles');
    res.json(results);
  });
});

app.post('/roles', (req, res) => {
  const { rol } = req.body;
  if (!rol) return res.status(400).send('Rol requerido');
  db.query('INSERT INTO roles (rol) VALUES (?)', [rol], (err, result) => {
    if (err) return res.status(500).send('Error agregando el rol');
    res.status(201).json({ id: result.insertId, rol });
  });
});

app.put('/roles/:id', (req, res) => {
  const { rol } = req.body;
  const { id } = req.params;
  db.query('UPDATE roles SET rol = ? WHERE id = ?', [rol, id], (err) => {
    if (err) return res.status(500).send('Error actualizando el rol');
    res.json({ id, rol });
  });
});

app.delete('/roles/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM roles WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send('Error eliminando el rol');
    res.sendStatus(204);
  });
});

// --- Usuarios ---
app.get('/usuarios', (req, res) => {
  db.query(
    'SELECT id, nombres, apellidos, email, telefono, nickname, rol_id, fecha_creacion FROM usuarios',
    (err, results) => {
      if (err) return res.status(500).send('Error obteniendo los usuarios');
      res.json(results);
    }
  );
});

app.post('/usuarios', async (req, res) => {
  const { nombres, apellidos, email, contraseña, telefono, nickname, fecha_creacion, rol_id } = req.body;
  if (!nombres || !apellidos || !email || !telefono || !nickname || !fecha_creacion || !rol_id) {
    return res.status(400).send('Datos incompletos');
  }
  try {
    const hashed = contraseña ? await bcrypt.hash(contraseña, 10) : null;
    const sql =
      'INSERT INTO usuarios (nombres, apellidos, email, `contraseña`, telefono, nickname, fecha_creacion, rol_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(
      sql,
      [nombres, apellidos, email, hashed, telefono, nickname, fecha_creacion, rol_id],
      (err, result) => {
        if (err) return res.status(500).send('Error agregando el usuario');
        res.status(201).json({ id: result.insertId, nombres, apellidos, email, telefono, nickname, fecha_creacion, rol_id });
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).send('Error agregando el usuario');
  }
});

app.put('/usuarios/:id', async (req, res) => {
  const { nombres, apellidos, email, contraseña, telefono, nickname, fecha_creacion, rol_id } = req.body;
  const { id } = req.params;
  try {
    let sql, params;
    if (contraseña) {
      const hashed = await bcrypt.hash(contraseña, 10);
      sql =
        'UPDATE usuarios SET nombres = ?, apellidos = ?, email = ?, `contraseña` = ?, telefono = ?, nickname = ?, fecha_creacion = ?, rol_id = ? WHERE id = ?';
      params = [nombres, apellidos, email, hashed, telefono, nickname, fecha_creacion, rol_id, id];
    } else {
      sql =
        'UPDATE usuarios SET nombres = ?, apellidos = ?, email = ?, telefono = ?, nickname = ?, fecha_creacion = ?, rol_id = ? WHERE id = ?';
      params = [nombres, apellidos, email, telefono, nickname, fecha_creacion, rol_id, id];
    }
    db.query(sql, params, (err) => {
      if (err) return res.status(500).send('Error actualizando el usuario');
      res.json({ id, nombres, apellidos, email, telefono, nickname, fecha_creacion, rol_id });
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error actualizando el usuario');
  }
});

app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM usuarios WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send('Error eliminando el usuario');
    res.sendStatus(204);
  });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
