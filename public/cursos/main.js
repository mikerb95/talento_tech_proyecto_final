async function viewCourse(courseName) {
    try {
        const response = await fetch('info_cursos.html');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const courseInfo = doc.getElementById(courseName);

        if (courseInfo) {
            document.getElementById('course-info').innerHTML = courseInfo.innerHTML;
        } else {
            document.getElementById('course-info').innerHTML = '<p>Curso no encontrado.</p>';
        }
    } catch (error) {
        console.error('Error fetching course information:', error);
        document.getElementById('course-info').innerHTML = '<p>Error al cargar la información del curso.</p>';
    }
}

// Asocia los botones con la función de visualización del curso
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.curso-izquierda .card button');
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const courseName = event.target.closest('.card').querySelector('h3').textContent.toLowerCase().replace(/\s+/g, '-');
            viewCourse(courseName);
        });
    });
});


//Linea para traer calificaciones y opiniones de los cursos :v

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const cursosContainer = document.querySelector('.curso');

    // Función para obtener y mostrar los cursos con calificaciones y opiniones
    function obtenerCursos() {
    fetch('/api/cursos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la red');
                }
                return response.json();
            })
            .then(cursos => {
                cursosContainer.innerHTML = '';
                cursos.forEach(curso => {
                    fetch(`/api/cursos/${curso.id}/calificaciones`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error en la red');
                            }
                            return response.json();
                        })
                        .then(calificaciones => {
                            const calificacionPromedio = Math.round(
                                (calificaciones.reduce((sum, cal) => sum + Number(cal.Calificacion || cal.calificacion || 0), 0) /
                                (calificaciones.length || 1)) || 0
                            );
                            const opiniones = calificaciones.map(cal => `<p>${cal.Detalles ?? cal.detalles ?? ''}</p>`).join('');

                            const cursoCard = document.createElement('div');
                            cursoCard.classList.add('col-md-6');
                            cursoCard.innerHTML = `
                                <div class="curso-izquierda">
                                    <div class="card">
                                        <img src="${curso.img_url ?? ''}" alt="Imagen del curso" class="card-img-top">
                                        <div class="card-body">
                                            <div class="calificacion mb-3">
                                                <h3 class="h5">Calificación</h3>
                                                <div class="stars">${'★'.repeat(calificacionPromedio)}${'☆'.repeat(5 - calificacionPromedio)}</div>
                                            </div>
                                            <div class="opiniones">
                                                <h3 class="h5">Opiniones</h3>
                                                <div class="card-text">${opiniones}</div>
                                            </div>
                                            <div class="link mt-3">
                                                <h3 class="h5">Link</h3>
                                                <a href="${curso.URL_curso}" class="btn btn-primary" target="_blank">Ver más</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                            cursosContainer.appendChild(cursoCard);
                        })
                        .catch(error => {
                            console.error('Error obteniendo las calificaciones:', error);
                        });
                });
            })
            .catch(error => {
                console.error('Error obteniendo los cursos:', error);
            });
    }

    // Inicializar la lista de cursos
    obtenerCursos();
});

