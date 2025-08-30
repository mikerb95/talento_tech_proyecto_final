const apiUrl = 'http://localhost:5000/api/perfil';

document.addEventListener('DOMContentLoaded', () => {
    cargarPerfil();
});

async function cargarPerfil() {
    try {
        const res = await fetch(apiUrl, { credentials: 'include' });
        if (!res.ok) {
            console.error('No autenticado');
            return;
        }
        const usuario = await res.json();
        const cont = document.querySelector('.container');
        if (cont) {
            const info = document.createElement('div');
            info.className = 'alert alert-info mt-3';
            info.textContent = `Bienvenido, ${usuario.nombres} ${usuario.apellidos} (${usuario.email})`;
            cont.prepend(info);
        }
    } catch (e) {
        console.error('Error cargando perfil', e);
    }
}
