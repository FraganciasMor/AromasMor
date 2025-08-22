'use strict';

// Product catalog (no user-supplied input is executed)
const products = [
  { name: "Wan", desc: "Melón y sandía", price: 3500, category: "mujer" },
  { name: "Flores Blancas", desc: "Aroma floral elegante y suave", price: 3500, category: "mujer" },
  { name: "Vainilla Relax", desc: "Vainilla suave y relajante", price: 3500, category: "mujer" },
  { name: "Wood", desc: "Notas de madera natural", price: 3500, category: "hombre" },
  { name: "Mora y Jabuticaba", desc: "Frutos rojos y dulces exóticos", price: 3500, category: "mujer" },
  { name: "Coco y Maracuyá", desc: "Toque tropical y veraniego", price: 3500, category: "mujer" },
  { name: "Pitanga", desc: "Fruto brasileño con un toque cítrico y chispeante", price: 3500, category: "mujer" },
  { name: "Hibiscus", desc: "Flores tropicales con un perfume fresco y vibrante", price: 3500, category: "mujer" },
  { name: "Cher", desc: "Aroma dulce y sofisticado con un toque misterioso", price: 3500, category: "mujer" }
];

let currentFilter = 'todos';
const cart = {};
const elList = document.getElementById('product-list');
const elCart = document.getElementById('cart');
const elTotal = document.getElementById('total');

function sanitizeText(t){
  // Simple text sanitizer to avoid accidental HTML injection into DOM
  return String(t).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;'}[s]));
}

function renderProducts(){
  elList.innerHTML = '';
  const filtered = currentFilter === 'todos' ? products : products.filter(p => p.category === currentFilter);

  filtered.forEach((p, idx) => {
    const i = products.indexOf(p);
    const card = document.createElement('article');
    card.className = 'product';
    card.setAttribute('itemscope','');
    card.setAttribute('itemtype','https://schema.org/Product');

    card.innerHTML = `
      <h2 itemprop="name">${sanitizeText(p.name)}</h2>
      <p itemprop="description">${sanitizeText(p.desc)}</p>
      <p><strong itemprop="priceCurrency" content="ARS">$</strong>
         <strong itemprop="price" content="${p.price}">${p.price}</strong></p>
      <button class="btn-add" type="button" data-index="${i}">Agregar</button>
    `;
    elList.appendChild(card);
  });
}

function addToCart(i){
  cart[i] = (cart[i] || 0) + 1;
  renderCart();
}

function removeFromCart(i){
  if(!cart[i]) return;
  cart[i]--;
  if(cart[i] <= 0) delete cart[i];
  renderCart();
}

function renderCart(){
  elCart.innerHTML = '';
  let total = 0;
  Object.keys(cart).forEach(i => {
    const item = products[i];
    const qty = cart[i];
    total += item.price * qty;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <span>${sanitizeText(item.name)} x${qty}</span>
      <div class="cart-controls">
        <button type="button" class="btn-plus" data-index="${i}">+</button>
        <button type="button" class="btn-minus" data-index="${i}">−</button>
      </div>
    `;
    elCart.appendChild(row);
  });
  elTotal.textContent = `Total: $${total}`;
}

function buildWhatsAppUrl(){
  if(Object.keys(cart).length === 0) return null;
  let msg = 'Hola! Quiero hacer un pedido:%0A';
  Object.keys(cart).forEach(i => {
    msg += `- ${encodeURIComponent(products[i].name)} x${cart[i]}%0A`;
  });
  msg += `%0ATotal: ${encodeURIComponent(elTotal.textContent)}`;
  return `https://wa.me/542281548441?text=${msg}`;
}

function setupEvents(){
  document.querySelectorAll('.filters button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderProducts();
    });
  });

  elList.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-add');
    if(btn){
      const idx = parseInt(btn.dataset.index, 10);
      if(Number.isFinite(idx)) addToCart(idx);
    }
  });

  elCart.addEventListener('click', (e) => {
    const plus = e.target.closest('.btn-plus');
    const minus = e.target.closest('.btn-minus');
    if(plus){
      const idx = parseInt(plus.dataset.index, 10);
      if(Number.isFinite(idx)) addToCart(idx);
    } else if(minus){
      const idx = parseInt(minus.dataset.index, 10);
      if(Number.isFinite(idx)) removeFromCart(idx);
    }
  });

  const btnWA = document.getElementById('btn-whatsapp');
  btnWA.addEventListener('click', (e) => {
    const url = buildWhatsAppUrl();
    if(!url){
      e.preventDefault();
      alert('Tu carrito está vacío');
    } else {
      btnWA.setAttribute('href', url);
      btnWA.setAttribute('target','_blank');
      btnWA.setAttribute('rel','noopener');
    }
  });

  const btnEmail = document.getElementById('btn-email');
  btnEmail.addEventListener('click', (e) => {
    e.preventDefault();
    const subject = 'Consulta sobre productos MÓR';
    const body = 'Hola! Quisiera consultar sobre sus productos.';
    window.location.href = `mailto:contacto.morsplash@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  // Year in footer
  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();
}

renderProducts();
renderCart();
setupEvents();
