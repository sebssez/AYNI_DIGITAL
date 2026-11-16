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
  if (!res.ok) throw new Error(data.message || 'Error en la comunicación con el servidor');
  return data;
}

function getUsuarioActual() {
  try {
    return JSON.parse(localStorage.getItem('kc_user'));
  } catch {
    return null;
  }
}