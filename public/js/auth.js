document.addEventListener('DOMContentLoaded', () => {
  // Si ya inició sesión y entra a login.html, redirigir según su rol
  const userActivo = getUsuarioActual();
  if (userActivo && window.location.pathname.includes('login.html')) {
    redirigirPorRol(userActivo.rol);
  }

  const formLogin = document.getElementById('form-login');
  const formRegistro = document.getElementById('form-registro');

  formLogin?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: document.getElementById('email').value,
          password: document.getElementById('password').value
        })
      });
      localStorage.setItem('kc_token', data.token);
      localStorage.setItem('kc_user', JSON.stringify(data.usuario));
      redirigirPorRol(data.usuario.rol);
    } catch (err) {
      alert(err.message);
    }
  });

  formRegistro?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/auth/registro', {
        method: 'POST',
        body: JSON.stringify({
          nombre: document.getElementById('nombre').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
          rol: document.getElementById('rol').value
        })
      });
      alert('Cuenta creada correctamente. Ahora inicia sesión.');
      window.location.href = '/login.html';
    } catch (err) {
      alert(err.message);
    }
  });
});

function redirigirPorRol(rol) {
  if (rol === 'admin') window.location.href = '/admin/dashboard.html';
  else if (rol === 'artesano') window.location.href = '/artesano/panel.html';
  else window.location.href = '/index.html';
}