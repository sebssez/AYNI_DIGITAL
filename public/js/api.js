const API_BASE = '/api';

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('kc_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Error en el servidor');
  return data;
}

function getUsuarioActual() {
  try {
    return JSON.parse(localStorage.getItem('kc_user'));
  } catch {
    return null;
  }
}

// Guardia de autenticación: obliga a iniciar sesión si no hay token
function protegerPagina(rolesPermitidos = []) {
  const token = localStorage.getItem('kc_token');
  const user = getUsuarioActual();

  if (!token || !user) {
    window.location.href = '/login.html';
    return null;
  }

  if (rolesPermitidos.length && !rolesPermitidos.includes(user.rol)) {
    alert('No tienes permisos para acceder a esta sección.');
    window.location.href = '/index.html';
    return null;
  }

  return user;
}
// Control global del Modo Oscuro / Claro
function aplicarTema(tema) {
  document.documentElement.setAttribute('data-theme', tema);
  localStorage.setItem('kc_theme', tema);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = tema === 'dark' ? '☀' : '◐';
}

document.addEventListener('DOMContentLoaded', () => {
  const temaGuardado = localStorage.getItem('kc_theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  aplicarTema(temaGuardado);

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const actual = document.documentElement.getAttribute('data-theme');
    aplicarTema(actual === 'dark' ? 'light' : 'dark');
  });
});