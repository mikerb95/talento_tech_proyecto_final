const mysql = require('mysql2');

// Datos de conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'base_de_datos'
});

// Verificar conexión
connection.connect(err => {
    if (err) {
        console.error('Conexión fallida: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos MySQL como id ' + connection.threadId);
});

module.exports = connection;
