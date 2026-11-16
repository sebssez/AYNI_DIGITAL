const PRODUCTOS_RESPALDO = [
  { id: 1, categoria: 'Tabletas de origen', porcentaje_cacao: 70, nombre: 'La Convención', notas_cata: 'Frutos rojos, nuez tostada', precio: 28, color_hex: '#5c3720' },
  { id: 2, categoria: 'Tabletas de origen', porcentaje_cacao: 85, nombre: 'Quillabamba Intenso', notas_cata: 'Café, tabaco dulce', precio: 32, color_hex: '#3d2214' },
  { id: 3, categoria: 'Tabletas de origen', porcentaje_cacao: 55, nombre: 'Leche Andina', notas_cata: 'Caramelo, vainilla', precio: 26, color_hex: '#7a4a2b' },
  { id: 4, categoria: 'Bombones', porcentaje_cacao: 60, nombre: 'Caja de 12 bombones', notas_cata: 'Ganache de maracuyá y sal', precio: 78, color_hex: '#6a3a1f' },
  { id: 5, categoria: 'Bombones', porcentaje_cacao: 70, nombre: 'Trufas de lúcuma', notas_cata: 'Cremosas, notas de miel', precio: 44, color_hex: '#8a5a30' },
  { id: 6, categoria: 'Cacao en polvo & nibs', porcentaje_cacao: 100, nombre: 'Nibs tostados', notas_cata: 'Crujientes, amargor limpio', precio: 34, color_hex: '#4a2a1a' },
  { id: 7, categoria: 'Cacao en polvo & nibs', porcentaje_cacao: 100, nombre: 'Cacao en polvo puro', notas_cata: 'Profundo, sin azúcar', precio: 30, color_hex: '#321b10' },
  { id: 8, categoria: 'Regalos', porcentaje_cacao: 70, nombre: 'Caja degustación', notas_cata: 'Seis tabletas de origen', precio: 149, color_hex: '#8B4513' }
];

let listaProductos = [];
let categoriaActual = 'Todos';

async function cargarTienda() {
  const grid = document.getElementById('grid-productos');
  const filtersEl = document.getElementById('filtros-categoria');
  const searchEl = document.getElementById('buscador-tienda');
  if (!grid) return;

  try {
    listaProductos = await apiFetch('/productos');
    if (!listaProductos.length) listaProductos = PRODUCTOS_RESPALDO;
  } catch {
    listaProductos = PRODUCTOS_RESPALDO;
  }

  const categorias = ['Todos', ...new Set(listaProductos.map(p => p.categoria))];
  if (filtersEl) {
    filtersEl.innerHTML = categorias.map(c =>
      `<button class="chip ${c === categoriaActual ? 'on' : ''}" data-cat="${c}">${c}</button>`
    ).join('');

    filtersEl.onclick = (e) => {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      categoriaActual = btn.dataset.cat;
      [...filtersEl.children].forEach(b => b.classList.toggle('on', b === btn));
      dibujarGrid(searchEl?.value || '');
    };
  }

  searchEl?.addEventListener('input', (e) => dibujarGrid(e.target.value));
  dibujarGrid();
}

function dibujarGrid(texto = '') {
  const grid = document.getElementById('grid-productos');
  const filtrados = listaProductos.filter(p => {
    const matchCat = categoriaActual === 'Todos' || p.categoria === categoriaActual;
    const matchTxt = p.nombre.toLowerCase().includes(texto.toLowerCase()) ||
                     (p.notas_cata || '').toLowerCase().includes(texto.toLowerCase());
    return matchCat && matchTxt;
  });

  grid.innerHTML = filtrados.map(p => `
    <article class="card">
      <div>
        <div class="art">
          ${barSvg(p.color_hex)}
          <span class="badge-pct">${p.porcentaje_cacao}% cacao</span>
        </div>
        <h3 class="serif" style="font-size:1.3rem; margin-top:0.75rem;">${p.nombre}</h3>
        <p style="font-size:0.88rem; opacity:0.75;">${p.notas_cata || ''}</p>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem;">
        <strong>${S(p.precio)}</strong>
        <button class="btn" style="padding:0.45rem 1rem; font-size:0.85rem;" onclick='addToCart(${JSON.stringify(p)})'>
          Agregar
        </button>
      </div>
    </article>
  `).join('');
}

document.addEventListener('DOMContentLoaded', cargarTienda);