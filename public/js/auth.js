document.addEventListener('DOMContentLoaded', () => {
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
      window.location.href = data.usuario.rol === 'admin' ? '/admin/dashboard.html' : '/tienda.html';
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
          password: document.getElementById('password').value
        })
      });
      alert('Cuenta creada con éxito. Ahora inicia sesión.');
      window.location.href = '/login.html';
    } catch (err) {
      alert(err.message);
    }
  });
});