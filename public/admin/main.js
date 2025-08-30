const apiUrl = '/api/cursos'; // Relative path for Vercel

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
            <td>${curso.nombre_curso ?? ''}</td>
            <td>${curso.descripcion ?? ''}</td>
            <td>${curso.URL_curso ?? ''}</td>
            <td>${curso.duracion ?? ''}</td>
            <td>${curso.valor ?? ''}</td>
            <td>${curso.institucion ?? ''}</td>
            <td>${curso.acciones ?? ''}</td>
            <td class="action-buttons">
                <button class="edit-btn btn btn-warning btn-sm" onclick="editarCurso(${curso.id}, '${curso.nombre_curso ?? ''}', '${(curso.descripcion ?? '').replace(/'/g, "&#39;")}', '${curso.URL_curso ?? ''}', '${curso.duracion ?? ''}', ${curso.valor ?? 0}, '${curso.institucion ?? ''}', '${curso.acciones ?? ''}')">Editar</button>
                <a class="btn btn-info btn-sm" target="_blank" href="${curso.URL_curso ?? '#'}">Abrir</a>
                <button class="delete-btn btn btn-danger btn-sm" onclick="eliminarCurso(${curso.id})">Eliminar</button>
            </td>
        `;
        listaCursos.appendChild(filaCurso);
    });
}

// Función para agregar un nuevo curso
async function agregarCurso() {
    const nombre_curso = document.getElementById('Titulo_Curso').value;
    const descripcion = document.getElementById('descripcion_Curso').value;
    const URL_curso = document.getElementById('Url_Curso').value;
    const duracion = document.getElementById('duracion_Curso').value;
    const valor = document.getElementById('valor_Curso').value;
    const institucion = document.getElementById('institucion').value;
    const acciones = document.getElementById('acciones').value;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre_curso, descripcion, URL_curso, duracion, valor, institucion, acciones })
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
function editarCurso(id, nombre_curso, descripcion, URL_curso, duracion, valor, institucion, acciones) {
    document.getElementById('Titulo_Curso').value = nombre_curso;
    document.getElementById('descripcion_Curso').value = descripcion;
    document.getElementById('Url_Curso').value = URL_curso;
    document.getElementById('duracion_Curso').value = duracion;
    document.getElementById('valor_Curso').value = valor;
    document.getElementById('institucion').value = institucion;
    document.getElementById('acciones').value = acciones;

    const botonEnvio = document.querySelector('#formularioCurso button');
    botonEnvio.textContent = 'Actualizar Curso';
    botonEnvio.onclick = async (event) => {
        event.preventDefault();
        try {
        await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
            nombre_curso: document.getElementById('Titulo_Curso').value,
            descripcion: document.getElementById('descripcion_Curso').value,
            URL_curso: document.getElementById('Url_Curso').value,
            duracion: document.getElementById('duracion_Curso').value,
            valor: document.getElementById('valor_Curso').value,
            institucion: document.getElementById('institucion').value,
            acciones: document.getElementById('acciones').value
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

