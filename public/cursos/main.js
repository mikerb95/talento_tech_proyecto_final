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
