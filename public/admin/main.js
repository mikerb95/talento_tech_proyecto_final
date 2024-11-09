const apiUrl = 'http://localhost:5000/cursos'; // Cambiar a la URL de tu backend para cursos

document.addEventListener('DOMContentLoaded', () => {
    obtenerCursos();

    document.getElementById('formularioCurso').addEventListener('submit', event => {
        event.preventDefault();
        agregarCurso();
    });
});

// Función para obtener todos los cursos
async function obtenerCursos() {
    try {
        const response = await fetch(apiUrl);
        const cursos = await response.json();
        mostrarCursos(cursos);
    } catch (error) {
        console.error('Error obteniendo los cursos:', error);
    }
}

// Función para mostrar los cursos en la página
function mostrarCursos(cursos) {
    const listaCursos = document.getElementById('cursosTbody');
    listaCursos.innerHTML = '';

    cursos.forEach(curso => {
        const filaCurso = document.createElement('tr');
        filaCurso.innerHTML = `
            <td>${curso.Nombre_curso}</td>
            <td>${curso.URL_curso}</td>
            <td>${curso.Duracion}</td>
            <td>${curso.Valor}</td>
            <td>${curso.Institucion}</td>
            <td>${curso.Acciones}>/td>
            <td class="action-buttons">
                <button class="edit-btn" onclick="editarCurso(${curso.id}, '${curso.Nombre_curso}', '${curso.URL_curso}', '${curso.Duracion}', ${curso.Valor}, '${curso.Institucion},${curso.Acciones}')">Editar</button>
                <button class="delete-btn" onclick="eliminarCurso(${curso.id})">Eliminar </button>
            </td>
        `;
        listaCursos.appendChild(filaCurso);
    });
}

// Función para agregar un nuevo curso
async function agregarCurso() {
    const Nombre_curso = document.getElementById('Nombre_curso').value;
    const URL_curso = document.getElementById('URL_curso').value;
    const Duracion = document.getElementById('Duracion').value;
    const Valor = document.getElementById('Valor').value;
    const Institucion = document.getElementById('Institucion').value;
   

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Nombre_curso, URL_curso, Duracion, Valor, Institucion, Acciones })
        });
        if (response.ok) {
            obtenerCursos();
            resetearFormulario();
        }
    } catch (error) {
        console.error('Error agregando el curso:', error);
    }
}

// Función para eliminar un curso
async function eliminarCurso(id) {
    try {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        obtenerCursos();
    } catch (error) {
        console.error('Error eliminando el curso:', error);
    }
}

// Función para editar un curso
function editarCurso(id, Nombre_curso, URL_curso, Duracion, Valor, Institucion) {
    document.getElementById('Nombre_curso').value = Nombre_curso;
    document.getElementById('URL_curso').value = URL_curso;
    document.getElementById('Duracion').value = Duracion;
    document.getElementById('Valor').value = Valor;
    document.getElementById('Institucion').value = Institucion;
    document.getElementById('Acciones').value = Acciones;

    const botonEnvio = document.querySelector('#formularioCurso button');
    botonEnvio.textContent = 'Actualizar Curso';
    botonEnvio.onclick = async (event) => {
        event.preventDefault();
        try {
            await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Nombre_curso: document.getElementById('Nombre_curso').value,
                    URL_curso: document.getElementById('URL_curso').value,
                    Duracion: document.getElementById('Duracion').value,
                    Valor: document.getElementById('Valor').value,
                    Institucion: document.getElementById('Institucion').value,
                    Acciones: document.getElementById('Acciones').value,
                })
            });
            obtenerCursos();
            resetearFormulario();
        } catch (error) {
            console.error('Error actualizando el curso:', error);
        }
    };
}

// Función para resetear el formulario y el botón
function resetearFormulario() {
    document.getElementById('formularioCurso').reset();
    const botonEnvio = document.querySelector('#formularioCurso button');
    botonEnvio.textContent = 'Agregar Curso';
    botonEnvio.onclick = (event) => {
        event.preventDefault();
        agregarCurso();
    };
}
