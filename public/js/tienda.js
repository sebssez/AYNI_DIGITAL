const CATALOGO_LARQ = [
  { id: 1, nuevo: true, categoria: 'Textiles y Tejidos', porcentaje_cacao: 100, nombre: 'Chullo Cusqueño Tradicional', tags: 'Baby Alpaca · Tinte Cochinilla · Telar Manual', precio: 85, precioAntes: 98, color_hex: '#8B2635' },
  { id: 2, nuevo: true, categoria: 'Cerámica', porcentaje_cacao: 100, nombre: 'Torito de Pucará Ceremonial', tags: 'Arcilla Roja · Esmaltado a Mano · Puno', precio: 65, precioAntes: 78, color_hex: '#A0522D' },
  { id: 3, nuevo: false, categoria: 'Textiles y Tejidos', porcentaje_cacao: 100, nombre: 'Manta Ceremonial Chinchero', tags: 'Lana de Oveja · Iconografía Ancestral', precio: 220, precioAntes: null, color_hex: '#5C2C16' },
  { id: 4, nuevo: true, categoria: 'Arte Popular', porcentaje_cacao: 100, nombre: 'Retablo Ayacuchano Costumbrista', tags: 'Cedro · Pasta de Papa · Pintado a Pulso', precio: 140, precioAntes: 165, color_hex: '#1E4D6B' },
  { id: 5, nuevo: false, categoria: 'Joyería', porcentaje_cacao: 95, nombre: 'Aretes Filigrana Chakana', tags: 'Plata 950 · Crisocola Natural · Hecho a Mano', precio: 110, precioAntes: 125, color_hex: '#2E8B57' },
  { id: 6, nuevo: false, categoria: 'Joyería', porcentaje_cacao: 95, nombre: 'Pulsera Tejida con Dije Inca', tags: 'Hilo Encerado · Plata Quemada · Ajustable', precio: 58, precioAntes: null, color_hex: '#374151' },
  { id: 7, nuevo: true, categoria: 'Regalos', porcentaje_cacao: 100, nombre: 'Cofre Colección Maestros Andinos', tags: 'Torito + Chullo + Certificado de Autor', precio: 189, precioAntes: 220, color_hex: '#153E5C' },
  { id: 8, nuevo: false, categoria: 'Cerámica', porcentaje_cacao: 100, nombre: 'Set Mate Burilado Huanca', tags: 'Calabaza Seca · Tallado a Buril · Quinual', precio: 55, precioAntes: null, color_hex: '#4A3520' }
];

let productosData = [];
let catFiltro = 'Todos';
const seleccionTamano = {}; // Guarda si el usuario eligió Estándar o Grande en cada tarjeta

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
      tags: p.notas_cata || 'Hecho a Mano · Comercio Justo',
      precioAntes: i % 2 === 0 ? Number(p.precio) + 12 : null
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
    const sel = seleccionTamano[p.id] || { label: 'Estándar', mult: 1 };
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
            <button class="size-pill ${sel.label === 'Estándar' ? 'active' : ''}" onclick="cambiarTamano(${p.id}, 'Estándar', 1)">Estándar</button>
            <button class="size-pill ${sel.label === 'Grande' ? 'active' : ''}" onclick="cambiarTamano(${p.id}, 'Grande', 1.6)">Grande</button>
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