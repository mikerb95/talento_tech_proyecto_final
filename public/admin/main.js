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
    const listaCursos = document.getElementById('course-list');
    listaCursos.innerHTML = '';

    cursos.forEach(curso => {
        const filaCurso = document.createElement('tr');
        filaCurso.innerHTML = `
            <td>${curso.Nombre_curso}</td>
            <td>${curso.Descripcion}</td>
            <td>${curso.URL_curso}</td>
            <td>${curso.Duracion}</td>
            <td>${curso.Valor}</td>
            <td>${curso.Institucion}</td>
            <td>${curso.Acciones}</td>
            <td class="action-buttons">
                <button class="edit-btn btn btn-warning btn-sm" onclick="editarCurso(${curso.id}, '${curso.Nombre_curso}', '${curso.Descripcion}', '${curso.URL_curso}', '${curso.Duracion}', ${curso.Valor}, '${curso.Institucion}', '${curso.Acciones}')">Editar</button>
                <button class="delete-btn btn btn-danger btn-sm" onclick="eliminarCurso(${curso.id})">Eliminar</button>
            </td>
        `;
        listaCursos.appendChild(filaCurso);
    });
}

// Función para agregar un nuevo curso
async function agregarCurso() {
    const Nombre_curso = document.getElementById('Titulo_Curso').value;
    const Descripcion = document.getElementById('descripcion_Curso').value;
    const URL_curso = document.getElementById('Url_Curso').value;
    const Duracion = document.getElementById('duracion_Curso').value;
    const Valor = document.getElementById('valor_Curso').value;
    const Institucion = document.getElementById('institucion').value;
    const Acciones = document.getElementById('acciones').value;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Nombre_curso, Descripcion, URL_curso, Duracion, Valor, Institucion, Acciones })
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
function editarCurso(id, Nombre_curso, Descripcion, URL_curso, Duracion, Valor, Institucion, Acciones) {
    document.getElementById('Titulo_Curso').value = Nombre_curso;
    document.getElementById('descripcion_Curso').value = Descripcion;
    document.getElementById('Url_Curso').value = URL_curso;
    document.getElementById('duracion_Curso').value = Duracion;
    document.getElementById('valor_Curso').value = Valor;
    document.getElementById('institucion').value = Institucion;
    document.getElementById('acciones').value = Acciones;

    const botonEnvio = document.querySelector('#formularioCurso button');
    botonEnvio.textContent = 'Actualizar Curso';
    botonEnvio.onclick = async (event) => {
        event.preventDefault();
        try {
            await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Nombre_curso: document.getElementById('Titulo_Curso').value,
                    Descripcion: document.getElementById('descripcion_Curso').value,
                    URL_curso: document.getElementById('Url_Curso').value,
                    Duracion: document.getElementById('duracion_Curso').value,
                    Valor: document.getElementById('valor_Curso').value,
                    Institucion: document.getElementById('institucion').value,
                    Acciones: document.getElementById('acciones').value
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

