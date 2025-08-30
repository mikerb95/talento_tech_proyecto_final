document.addEventListener('DOMContentLoaded', () => {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="/">
          <img src="/images/Logo.png" alt="Talentum" class="me-2" style="height:40px;width:auto;" />
          <span class="fw-bold">Talentum</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link" href="/">Inicio</a></li>
            <li class="nav-item"><a class="nav-link" href="/cursos/cursos.html">Cursos</a></li>
            <li class="nav-item"><a class="nav-link" href="/usuarios/perfil.html">Mi cuenta</a></li>
            <li class="nav-item"><a class="nav-link" href="/admin/admin.html">Admin</a></li>
          </ul>
          <div class="d-flex gap-2">
            <a href="/registrar.html" class="btn btn-outline-light btn-sm">Registrarse</a>
            <a href="/index.html" class="btn btn-light btn-sm text-dark">Ingresar</a>
          </div>
        </div>
      </div>
    </nav>
  `;

  const footer = document.createElement('footer');
  footer.className = 'site-footer bg-dark text-white mt-5';
  footer.innerHTML = `
    <div class="container py-4">
      <div class="row g-4 align-items-center">
        <div class="col-md-4 d-flex align-items-center">
          <img src="/images/Logo.png" alt="Talentum" style="height:40px;width:auto;" class="me-2" />
          <div>
            <div class="fw-bold">Talentum</div>
            <small class="text-white-50">Descubre tu talento, transforma tu futuro.</small>
          </div>
        </div>
        <div class="col-md-4">
          <ul class="list-unstyled mb-0 small">
            <li><a class="text-white text-decoration-none" href="/">Inicio</a></li>
            <li><a class="text-white text-decoration-none" href="/cursos/cursos.html">Cursos</a></li>
            <li><a class="text-white text-decoration-none" href="/usuarios/perfil.html">Mi cuenta</a></li>
            <li><a class="text-white text-decoration-none" href="/admin/admin.html">Admin</a></li>
          </ul>
        </div>
        <div class="col-md-4 text-md-end">
          <small class="d-block">&copy; <span id="year"></span> Talentum. Todos los derechos reservados.</small>
        </div>
      </div>
    </div>
  `;

  document.body.prepend(header);
  document.body.append(footer);

  // Año dinámico
  const y = footer.querySelector('#year');
  if (y) y.textContent = new Date().getFullYear();

  // Activar enlace según ruta
  const path = location.pathname.replace(/index\.html$/, '/');
  document.querySelectorAll('.navbar .nav-link').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) {
      a.classList.add('active');
    }
  });
});
