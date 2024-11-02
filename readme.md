# Instructivo para Crear la Estructura de Carpetas en una Aplicación Express.js

Este documento describe cómo crear una estructura de carpetas organizada para una aplicación Express.js.

## 1. Crear la Carpeta Principal

Primero, crea la carpeta principal para tu proyecto. Abre tu terminal y ejecuta:

```bash
mkdir my-express-app
cd my-express-app

my-express-app/
│
├── node_modules/          # Módulos de Node.js
│
├── public/                # Archivos estáticos (CSS, JS, imágenes, etc.)
│   ├── css/
│   ├── js/
│   └── images/
│
├── src/                   # Código fuente de la aplicación
│   ├── config/            # Configuraciones (como base de datos, entorno)
│   ├── controllers/       # Controladores para manejar la lógica de las rutas
│   ├── middlewares/       # Middleware personalizado
│   ├── models/            # Modelos de datos (si usas una base de datos)
│   ├── routes/            # Definiciones de rutas
│   └── views/             # Plantillas (si usas un motor de plantillas)
│
├── tests/                 # Pruebas (unitarias, integración)
│
├── .env                   # Variables de entorno
├── .gitignore             # Archivos y carpetas que Git debe ignorar
├── package.json           # Dependencias y scripts del proyecto
└── server.js              # Archivo principal que inicia la aplicación
```
