Sesiones y contraseñas
- Usa SESSION_SECRET fuerte y un Session Store (Redis/MySQL) en producción.
- Contraseñas se almacenan con bcrypt en la columna `usuarios.contraseña` (valor hasheado).

CORS y límites
- Si separas dominios frontend/backend, configura CORS explícito.
- Limita requests en /index y /registrar con rate limiting.

Entradas de usuario
- Valida y sanitiza entradas (express-validator) antes de insertar/actualizar.
