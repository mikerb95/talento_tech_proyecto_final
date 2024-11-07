//referenciamos mysql
const mysql = require('mysql2');

// Datos de conexión a la base de datos
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'base_de_datos'
});

//conectamos con la base de datos

conexion.connect((error)=> {
    if(error) {
        console.error('Error al conectar con la base de datos:', error);
        return;
    }
    console.log('Conectado a la base de datos');
});

//exportamos la conexión para utilizarla en otros archivos
module.exports = conexion;
