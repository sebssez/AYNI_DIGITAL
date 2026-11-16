const S = n => 'S/ ' + Number(n).toFixed(2);
const barSvg = c => `<svg viewBox="0 0 100 140"><rect x="8" y="6" width="84" height="128" rx="8" fill="${c || '#3B2216'}"/><g stroke="rgba(0,0,0,.35)" stroke-width="2" fill="rgba(255,255,255,.08)">${[0,1,2,3].map(r=>[0,1].map(k=>`<rect x="${14+k*38}" y="${12+r*30}" width="34" height="26" rx="4"/>`).join('')).join('')}</g></svg>`;

// Niveles de descuento automático estilo LARQ
const TIERS = [
  { min: 80, pct: 10 },
  { min: 140, pct: 15 },
  { min: 200, pct: 20 }
];

let cart = [];
try { cart = JSON.parse(localStorage.getItem('kc_cart') || '[]'); } catch {}

function saveCart() {
  localStorage.setItem('kc_cart', JSON.stringify(cart));
  renderCart();
}

window.addToCart = (producto, sizeLabel = '70g', multiplier = 1) => {
  const key = `${producto.id}-${sizeLabel}`;
  const precioFinal = Number(producto.precio) * multiplier;
  const existe = cart.find(i => i.key === key);

  if (existe) {
    existe.q += 1;
  } else {
    cart.push({
      key,
      id: producto.id,
      nombre: `${producto.nombre} (${sizeLabel})`,
      precio: precioFinal,
      color_hex: producto.color_hex || '#3B2216',
      q: 1
    });
  }
  saveCart();
  toggleDrawer(true);
};

window.updateCartQty = (key, delta) => {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.q += delta;
  if (item.q <= 0) cart = cart.filter(i => i.key !== key);
  saveCart();
};

window.removeCartItem = (key) => {
  cart = cart.filter(i => i.key !== key);
  saveCart();
};

function toggleDrawer(open) {
  document.getElementById('drawer')?.classList.toggle('open', open);
  document.getElementById('shade')?.classList.toggle('open', open);
}

function calcularTotales() {
  const subtotal = cart.reduce((acc, i) => acc + i.q * i.precio, 0);
  let descuentoPct = 0;
  for (const t of TIERS) {
    if (subtotal >= t.min) descuentoPct = t.pct;
  }
  const ahorro = subtotal * (descuentoPct / 100);
  const totalFinal = subtotal - ahorro;
  return { subtotal, descuentoPct, ahorro, totalFinal };
}

function renderCart() {
  const countEl = document.getElementById('cart-count');
  const itemsEl = document.getElementById('cart-items');
  const subEl = document.getElementById('cart-sub');
  const discEl = document.getElementById('cart-disc');
  const msgEl = document.getElementById('tier-msg');
  const fillEl = document.getElementById('tier-fill');

  const totalItems = cart.reduce((acc, i) => acc + i.q, 0);
  const { subtotal, descuentoPct, ahorro, totalFinal } = calcularTotales();

  if (countEl) countEl.textContent = totalItems;
  if (subEl) subEl.textContent = S(totalFinal);
  if (discEl) {
    discEl.textContent = descuentoPct > 0
      ? `Descuento automático (${descuentoPct}%): -${S(ahorro)}`
      : 'Sin descuento aplicado aún';
  }

  // Actualizar barra de metas estilo LARQ
  TIERS.forEach((t, idx) => {
    const step = document.getElementById(`tier-${idx}`);
    if (step) step.classList.toggle('reached', subtotal >= t.min);
  });

  if (fillEl) {
    const pctBar = Math.min((subtotal / 200) * 100, 100);
    fillEl.style.width = `${pctBar}%`;
  }

  if (msgEl) {
    const nextTier = TIERS.find(t => subtotal < t.min);
    msgEl.textContent = nextTier
      ? `¡Te faltan ${S(nextTier.min - subtotal)} para obtener un ${nextTier.pct}% de descuento!`
      : '¡Desbloqueaste el descuento máximo del 20%!';
  }

  if (!itemsEl) return;
  itemsEl.innerHTML = cart.length
    ? cart.map(i => `
      <div style="display:flex; gap:0.85rem; align-items:center; border-bottom:1px solid var(--line); padding-bottom:0.85rem;">
        <div class="art" style="width:58px; flex-shrink:0;">${barSvg(i.color_hex)}</div>
        <div style="flex:1;">
          <p style="font-weight:600; font-size:0.95rem;">${i.nombre}</p>
          <p style="font-size:0.85rem; opacity:0.8;">${S(i.precio)}</p>
          <div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.35rem;">
            <button class="chip" style="padding:0.15rem 0.6rem;" onclick="updateCartQty('${i.key}', -1)">−</button>
            <span>${i.q}</span>
            <button class="chip" style="padding:0.15rem 0.6rem;" onclick="updateCartQty('${i.key}', 1)">+</button>
          </div>
        </div>
        <button onclick="removeCartItem('${i.key}')" style="background:none; border:0; text-decoration:underline; cursor:pointer; color:var(--ink); font-size:0.8rem;">Quitar</button>
      </div>
    `).join('')
    : '<p style="opacity:0.65; text-align:center; margin-top:2rem;">Uy, parece que tu cesta está vacía.</p>';
}

async function finalizarPedido() {
  if (!cart.length) return alert('Tu cesta está vacía.');
  const token = localStorage.getItem('kc_token');
  if (!token) {
    alert('Inicia sesión para completar tu pedido con descuento.');
    window.location.href = '/login.html';
    return;
  }

  const { totalFinal } = calcularTotales();
  try {
    const res = await apiFetch('/pedidos', {
      method: 'POST',
      body: JSON.stringify({ items: cart, total: totalFinal })
    });
    cart = [];
    saveCart();
    alert(`¡Pedido confirmado! Código de seguimiento: ${res.codigo}`);
    window.location.href = '/pedidos.html';
  } catch (err) {
    alert(err.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const user = typeof getUsuarioActual === 'function' ? getUsuarioActual() : null;
  const authLink = document.getElementById('nav-auth');
  const adminLink = document.getElementById('nav-admin');

  if (user && authLink) {
    authLink.textContent = `Salir (${user.nombre.split(' ')[0]})`;
    authLink.href = '#';
    authLink.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem('kc_token');
      localStorage.removeItem('kc_user');
      window.location.href = '/login.html';
    };
  }
  if (user && user.rol === 'admin' && adminLink) adminLink.style.display = 'inline-block';

  const savedTheme = localStorage.getItem('kc_theme');
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('kc_theme', next);
  });

  document.getElementById('open-cart')?.addEventListener('click', () => toggleDrawer(true));
  document.getElementById('close-cart')?.addEventListener('click', () => toggleDrawer(false));
  document.getElementById('shade')?.addEventListener('click', () => toggleDrawer(false));
  document.getElementById('checkout-btn')?.addEventListener('click', finalizarPedido);

  renderCart();
});