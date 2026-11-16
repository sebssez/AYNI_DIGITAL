const S = n => 'S/ ' + Number(n).toFixed(2);
const barSvg = c => `<svg viewBox="0 0 100 140"><rect x="8" y="6" width="84" height="128" rx="6" fill="${c || '#5c3720'}"/><g stroke="rgba(0,0,0,.35)" stroke-width="2" fill="rgba(255,255,255,.07)">${[0,1,2,3].map(r=>[0,1].map(k=>`<rect x="${14+k*38}" y="${12+r*30}" width="34" height="26" rx="3"/>`).join('')).join('')}</g></svg>`;

let cart = [];
try { cart = JSON.parse(localStorage.getItem('kc_cart') || '[]'); } catch {}

function saveCart() {
  localStorage.setItem('kc_cart', JSON.stringify(cart));
  renderCart();
}

window.addToCart = (producto) => {
  const existe = cart.find(i => i.id === producto.id);
  if (existe) {
    existe.q += 1;
  } else {
    cart.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      color_hex: producto.color_hex || '#5c3720',
      q: 1
    });
  }
  saveCart();
  toggleDrawer(true);
};

window.updateCartQty = (id, delta) => {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.q += delta;
  if (item.q <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
};

window.removeCartItem = (id) => {
  cart = cart.filter(i => i.id !== id);
  saveCart();
};

function toggleDrawer(open) {
  const drawer = document.getElementById('drawer');
  const shade = document.getElementById('shade');
  if (!drawer || !shade) return;
  drawer.classList.toggle('open', open);
  shade.classList.toggle('open', open);
}

function renderCart() {
  const countEl = document.getElementById('cart-count');
  const itemsEl = document.getElementById('cart-items');
  const subEl = document.getElementById('cart-sub');
  const shipEl = document.getElementById('cart-ship');

  const totalItems = cart.reduce((acc, i) => acc + i.q, 0);
  const subtotal = cart.reduce((acc, i) => acc + i.q * i.precio, 0);

  if (countEl) countEl.textContent = totalItems;
  if (subEl) subEl.textContent = S(subtotal);
  if (shipEl) {
    shipEl.textContent = subtotal >= 180
      ? '¡Tu envío es gratis!'
      : subtotal > 0 ? `Te faltan ${S(180 - subtotal)} para envío gratis.` : '';
  }

  if (!itemsEl) return;
  itemsEl.innerHTML = cart.length
    ? cart.map(i => `
      <div style="display:flex; gap:0.85rem; align-items:center; border-bottom:1px solid var(--line); padding-bottom:0.85rem;">
        <div class="art" style="width:54px; aspect-ratio:1/1; flex-shrink:0;">${barSvg(i.color_hex)}</div>
        <div style="flex:1;">
          <p class="serif" style="font-size:1.05rem;">${i.nombre}</p>
          <p style="font-size:0.85rem;">${S(i.precio)}</p>
          <div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.35rem;">
            <button class="chip" style="padding:0.15rem 0.6rem;" onclick="updateCartQty(${i.id}, -1)">−</button>
            <span>${i.q}</span>
            <button class="chip" style="padding:0.15rem 0.6rem;" onclick="updateCartQty(${i.id}, 1)">+</button>
          </div>
        </div>
        <button onclick="removeCartItem(${i.id})" style="background:none; border:0; text-decoration:underline; cursor:pointer; color:var(--ink); font-size:0.82rem;">Quitar</button>
      </div>
    `).join('')
    : '<p style="opacity:0.7;">Tu carrito está vacío.</p>';
}

async function finalizarPedido() {
  if (!cart.length) return alert('Agrega al menos un producto al carrito.');
  const token = localStorage.getItem('kc_token');
  if (!token) {
    alert('Inicia sesión para registrar tu pedido.');
    window.location.href = '/login.html';
    return;
  }

  const total = cart.reduce((acc, i) => acc + i.q * i.precio, 0);
  try {
    const res = await apiFetch('/pedidos', {
      method: 'POST',
      body: JSON.stringify({ items: cart, total })
    });
    cart = [];
    saveCart();
    alert(`¡Pedido confirmado! Tu código de seguimiento es: ${res.codigo}`);
    window.location.href = '/pedidos.html';
  } catch (err) {
    alert(err.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Control de sesión en barra superior
  const user = getUsuarioActual();
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
  if (user && user.rol === 'admin' && adminLink) {
    adminLink.style.display = 'inline-block';
  }

  // Modo oscuro manual
  const savedTheme = localStorage.getItem('kc_theme');
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('kc_theme', next);
  });

  // Menú móvil
  document.getElementById('menu-btn')?.addEventListener('click', () => {
    document.getElementById('nav-links')?.classList.toggle('mobile-open');
  });

  // Eventos del Drawer
  document.getElementById('open-cart')?.addEventListener('click', () => toggleDrawer(true));
  document.getElementById('close-cart')?.addEventListener('click', () => toggleDrawer(false));
  document.getElementById('shade')?.addEventListener('click', () => toggleDrawer(false));
  document.getElementById('checkout-btn')?.addEventListener('click', finalizarPedido);

  renderCart();
});