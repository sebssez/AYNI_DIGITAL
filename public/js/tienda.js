const CATALOGO_LARQ = [
  { id: 1, nuevo: true, categoria: 'Tabletas de origen', porcentaje_cacao: 70, nombre: 'La Convención Reserve', tags: 'Antioxidante · Cosecha Única · Sin Lecitina', precio: 28, precioAntes: 34, color_hex: '#3B2216' },
  { id: 2, nuevo: true, categoria: 'Tabletas de origen', porcentaje_cacao: 85, nombre: 'Quillabamba Pure 85%', tags: 'Alto Cacao · Energía Limpia · Vegano', precio: 32, precioAntes: 38, color_hex: '#23140D' },
  { id: 3, nuevo: false, categoria: 'Tabletas de origen', porcentaje_cacao: 55, nombre: 'Andean Milk & Sal de Maras', tags: 'Cremoso · Caña Orgánica', precio: 26, precioAntes: null, color_hex: '#6B4226' },
  { id: 4, nuevo: true, categoria: 'Bombones', porcentaje_cacao: 65, nombre: 'Colección Bombones Amazónicos', tags: 'Maracuyá · Aguaymanto · Café', precio: 78, precioAntes: 89, color_hex: '#5C3317' },
  { id: 5, nuevo: false, categoria: 'Cacao en polvo & nibs', porcentaje_cacao: 100, nombre: 'Nibs Tostados PureRoast™', tags: 'Crujiente · Superfood · 0% Azúcar', precio: 34, precioAntes: 40, color_hex: '#4A2A1A' },
  { id: 6, nuevo: false, categoria: 'Cacao en polvo & nibs', porcentaje_cacao: 100, nombre: 'Cacao Ceremonial Cusco', tags: 'Prensado en Frío · Grado Ceremonial', precio: 42, precioAntes: null, color_hex: '#2C1A12' },
  { id: 7, nuevo: true, categoria: 'Regalos', porcentaje_cacao: 70, nombre: 'Edición Limitada Ayni Box', tags: '6 Tabletas + Guía de Cata', precio: 149, precioAntes: 175, color_hex: '#153E5C' },
  { id: 8, nuevo: false, categoria: 'Bombones', porcentaje_cacao: 72, nombre: 'Trufas de Lúcuma & Cacao', tags: 'Textura Fundente · Sin Conservantes', precio: 44, precioAntes: null, color_hex: '#7A4A2B' }
];

let productosData = [];
let catFiltro = 'Todos';
const seleccionTamano = {}; // Guarda si el usuario eligió 70g o 140g en cada tarjeta

async function iniciarCatalogo() {
  const grid = document.getElementById('grid-productos');
  const filtrosEl = document.getElementById('filtros-categoria');
  const buscadorEl = document.getElementById('buscador-tienda');
  if (!grid) return;

  try {
    const apiData = await apiFetch('/productos');
    productosData = apiData.length ? apiData.map((p, i) => ({
      ...p,
      nuevo: i < 3,
      tags: p.notas_cata || 'Cacao Fino · Comercio Directo',
      precioAntes: i % 2 === 0 ? Number(p.precio) + 6 : null
    })) : CATALOGO_LARQ;
  } catch {
    productosData = CATALOGO_LARQ;
  }

  const categorias = ['Todos', ...new Set(productosData.map(p => p.categoria))];
  if (filtrosEl) {
    filtrosEl.innerHTML = categorias.map(c =>
      `<button class="chip ${c === catFiltro ? 'on' : ''}" data-cat="${c}">${c}</button>`
    ).join('');

    filtrosEl.onclick = (e) => {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      catFiltro = btn.dataset.cat;
      [...filtrosEl.children].forEach(b => b.classList.toggle('on', b === btn));
      renderCards(buscadorEl?.value || '');
    };
  }

  buscadorEl?.addEventListener('input', (e) => renderCards(e.target.value));
  renderCards();
}

window.cambiarTamano = (id, label, mult) => {
  seleccionTamano[id] = { label, mult };
  const buscadorEl = document.getElementById('buscador-tienda');
  renderCards(buscadorEl?.value || '');
};

function renderCards(query = '') {
  const grid = document.getElementById('grid-productos');
  if (!grid) return;

  const filtrados = productosData.filter(p => {
    const okCat = catFiltro === 'Todos' || p.categoria === catFiltro;
    const okTxt = p.nombre.toLowerCase().includes(query.toLowerCase()) ||
                  (p.tags || '').toLowerCase().includes(query.toLowerCase());
    return okCat && okTxt;
  });

  grid.innerHTML = filtrados.map(p => {
    const sel = seleccionTamano[p.id] || { label: '70g', mult: 1 };
    const precioActual = Number(p.precio) * sel.mult;
    const precioAntiguo = p.precioAntes ? Number(p.precioAntes) * sel.mult : null;

    return `
      <article class="product-card">
        <div>
          <div class="art">
            ${barSvg(p.color_hex)}
            ${p.nuevo ? '<span class="tag-new">Nuevo</span>' : ''}
          </div>
          <div style="display:flex; justify-content:space-between; align-items:baseline; margin-top:0.85rem;">
            <h3 style="font-size:1.1rem; font-family:inherit;">${p.nombre}</h3>
          </div>
          <div class="size-pills">
            <button class="size-pill ${sel.label === '70g' ? 'active' : ''}" onclick="cambiarTamano(${p.id}, '70g', 1)">70 g</button>
            <button class="size-pill ${sel.label === '140g' ? 'active' : ''}" onclick="cambiarTamano(${p.id}, '140g', 1.8)">140 g</button>
          </div>
          <p class="feature-tags">${p.tags}</p>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:0.5rem; border-top:1px solid var(--line);">
          <div>
            ${precioAntiguo ? `<span style="text-decoration:line-through; opacity:0.5; font-size:0.85rem; margin-right:0.35rem;">${S(precioAntiguo)}</span>` : ''}
            <strong style="font-size:1.05rem;">${S(precioActual)}</strong>
          </div>
          <button class="btn btn-accent" style="padding:0.5rem 1.05rem; font-size:0.82rem;"
            onclick='addToCart(${JSON.stringify(p)}, "${sel.label}", ${sel.mult})'>
            Añadir
          </button>
        </div>
      </article>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', iniciarCatalogo);