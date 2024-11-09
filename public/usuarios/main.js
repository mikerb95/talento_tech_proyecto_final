const apiUrl ='https://localhost:5000/perfil';

document.addEventListener('DOMContentLoaded', () => {
    obtenerLibros();

    document.getElementById('formularioLibro').addEventListener('submit', event => {
        event.preventDefault();
        agregarLibro();
    });
});

// Función para obtener todos los libros
async function obtenerLibros() {
    try {
        const response = await fetch(apiUrl);
        const libros = await response.json();
        mostrarLibros(libros);
    } catch (error) {
        console.error('Error obteniendo los libros:', error);
    }
}