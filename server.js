// Importa el módulo Express para crear la aplicación web
const express = require('express');

// Inicializa una instancia de la aplicación Express
const app = express();

// Define el puerto en el cual correrá el servidor; usa el puerto definido en las variables de entorno o 3000 como predeterminado
const PORT = process.env.PORT || 5000;

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Middleware para servir archivos estáticos desde la carpeta 'public'
// Los archivos en 'public' serán accesibles directamente desde el navegador
app.use(express.static('public'));

// Definición de la ruta principal ("/")
// Cuando un cliente hace una solicitud GET a "/", el servidor responde con "Hello World!"
app.get('/', (req, res) => {
    res.send('Hello World!');
});


// Inicia el servidor y lo hace escuchar en el puerto especificado
// Muestra en la consola la URL del servidor cuando está corriendo
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
