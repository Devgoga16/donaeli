(function () {
  "use strict";

  const DATA = window.DONA_ELI;
  const CFG = DATA.config;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const byId = Object.fromEntries(DATA.productos.map((p) => [p.id, p]));
  const STORAGE_KEY = "donaeli-pedido";

  /* ---------- Utilidades ---------- */
  const money = (n) => "S/ " + n.toFixed(2);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const tbd = (txt = "Por confirmar") => `<span class="tbd">${txt}</span>`;
  const waNumber = (CFG.whatsapp || "").replace(/\D/g, "");
  const waUrl = (text) => `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
  const orderName = (p) =>
    p.categoria !== "empanadas" ? p.nombre : p.nombre === "Mixta" ? "Empanada mixta" : `Empanada de ${p.nombre}`;

  /* ---------- Datos de contacto ---------- */
  function fillConfig() {
    $$("[data-config]").forEach((el) => {
      const key = el.dataset.config;
      const val = CFG[key];
      if (key === "whatsapp") {
        el.innerHTML = waNumber ? esc("+" + waNumber.replace(/^(\d{2})(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3 $4")) : tbd("Número por confirmar");
      } else if (key === "direccion") {
        el.innerHTML = val ? esc(val) : `${esc(CFG.zona)} · ${tbd("Dirección por confirmar")}`;
      } else {
        el.innerHTML = val ? esc(val) : tbd();
      }
    });
    $$("[data-config-hide]").forEach((el) => { if (!CFG[el.dataset.configHide]) el.hidden = true; });

    const hello = "¡Hola Doña Eli! 👋 Quiero hacer un pedido de empanadas.";
    $$("[data-wa-link]").forEach((a) => (a.href = waUrl(hello)));
    $$("[data-ig-link]").forEach((a) => (a.href = `https://www.instagram.com/${CFG.instagram}/`));
    $$("[data-map-link]").forEach((a) => {
      if (CFG.mapaUrl) a.href = CFG.mapaUrl;
      else { a.removeAttribute("href"); a.removeAttribute("target"); }
    });
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  /* ---------- Rayos del logo en la portada ---------- */
  function drawRays() {
    const g = $(".rays g");
    if (!g) return;
    const cx = 300, cy = 300, n = 23;
    let out = "";
    for (let i = 0; i < n; i++) {
      const a = Math.PI + (Math.PI * (i + 0.5)) / n;
      const long = i % 2 === 0;
      const r1 = long ? 150 : 175, r2 = long ? 290 : 250;
      const cut = r1 + (r2 - r1) * (long ? 0.62 : 0.55);
      const pt = (r) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r].map((v) => v.toFixed(1));
      const [x1, y1] = pt(r1), [x2, y2] = pt(cut - 6), [x3, y3] = pt(cut + 6), [x4, y4] = pt(r2);
      out += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><line x1="${x3}" y1="${y3}" x2="${x4}" y2="${y4}"/>`;
    }
    g.innerHTML = out;
  }

  /* ---------- Pedido (estado) ---------- */
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { cart = {}; }
  Object.keys(cart).forEach((id) => { if (!byId[id] || !(cart[id] > 0)) delete cart[id]; });

  const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) { /* sin almacenamiento */ } };
  const count = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const total = () => {
    const ids = Object.keys(cart);
    if (!ids.length || ids.some((id) => byId[id].precio == null)) return null;
    return ids.reduce((s, id) => s + byId[id].precio * cart[id], 0);
  };

  function setQty(id, qty) {
    if (qty > 0) cart[id] = Math.min(qty, 99);
    else delete cart[id];
    save();
    renderCart();
    syncCards();
  }
  const add = (id, n = 1) => setQty(id, (cart[id] || 0) + n);

  /* ---------- Carta ---------- */
  let activeTab = "todas";

  function renderTabs() {
    const tabs = [{ id: "todas", nombre: "Todo" }, ...DATA.categorias];
    $("[data-tabs]").innerHTML = tabs
      .map((t) => {
        const n = t.id === "todas" ? DATA.productos.length : DATA.productos.filter((p) => p.categoria === t.id).length;
        return `<button class="tab" role="tab" type="button" data-tab="${t.id}" aria-selected="${t.id === activeTab}">${esc(t.nombre)}<span class="tab__n">${n}</span></button>`;
      })
      .join("");
  }

  function cardControls(p) {
    const q = cart[p.id] || 0;
    if (!q) return `<button class="btn btn--primary" type="button" data-add="${p.id}">Agregar</button>`;
    return `<span class="qty"><button type="button" data-dec="${p.id}" aria-label="Quitar uno">−</button><output>${q}</output><button type="button" data-inc="${p.id}" aria-label="Agregar uno">+</button></span>`;
  }

  function renderProducts() {
    const list = DATA.productos.filter((p) => activeTab === "todas" || p.categoria === activeTab);
    $("[data-products]").innerHTML = list
      .map((p, i) => `
        <article class="product" style="animation-delay:${i * 50}ms">
          <div class="product__img"><img src="${p.foto}" alt="${esc(p.nombre)}" loading="lazy" width="640" height="480"></div>
          ${p.etiqueta ? `<span class="product__label">${esc(p.etiqueta)}</span>` : ""}
          <div class="product__body">
            <h3 class="product__name">${esc(p.nombre)}</h3>
            <p class="product__desc">${esc(p.descripcion)}</p>
            <div class="product__foot">
              ${p.precio != null ? `<span class="product__price">${money(p.precio)}</span>` : `<span class="product__price product__price--tbd">Precio por confirmar</span>`}
              <span data-controls="${p.id}">${cardControls(p)}</span>
            </div>
          </div>
        </article>`)
      .join("");
  }

  function syncCards() {
    $$("[data-controls]").forEach((el) => (el.innerHTML = cardControls(byId[el.dataset.controls])));
  }

  /* ---------- El mejor plan ---------- */
  function setupBuilder() {
    const form = $("[data-builder]");
    const emp = $("[data-builder-empanada]");
    const beb = $("[data-builder-bebida]");
    const qtyOut = $("[data-builder-qty]");
    let qty = 1;

    emp.innerHTML = DATA.productos.filter((p) => p.categoria === "empanadas").map((p) => `<option value="${p.id}">${esc(p.nombre)}</option>`).join("");
    beb.innerHTML = DATA.productos.filter((p) => p.categoria === "bebidas").map((p) => `<option value="${p.id}">${esc(p.nombre)}</option>`).join("") + `<option value="">Sin bebida</option>`;

    $("[data-builder-minus]").addEventListener("click", () => { qty = Math.max(1, qty - 1); qtyOut.textContent = qty; });
    $("[data-builder-plus]").addEventListener("click", () => { qty = Math.min(20, qty + 1); qtyOut.textContent = qty; });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      add(emp.value, qty);
      if (beb.value) add(beb.value, qty);
      if (form.alfajor.checked) add("alfajores", qty);
      toast(qty > 1 ? `¡${qty} planes agregados a tu pedido!` : "¡Plan agregado a tu pedido!");
    });
  }

  /* ---------- Promociones ---------- */
  function renderPromos() {
    const box = $("[data-promos]");
    if (!DATA.promociones.length) {
      box.innerHTML = `
        <div class="promo promo--empty">
          <div>
            <h3>Promos y novedades</h3>
            <p>Combos, campañas y sabores nuevos los anunciamos primero en Instagram.</p>
          </div>
          <a class="btn btn--outline btn--sm" href="https://www.instagram.com/${CFG.instagram}/" target="_blank" rel="noopener">Ver novedades</a>
        </div>`;
      return;
    }
    box.innerHTML = DATA.promociones
      .map((pr, i) => `
        <article class="promo">
          <p class="tag">Promo</p>
          <h3>${esc(pr.titulo)}</h3>
          ${pr.detalle ? `<p>${esc(pr.detalle)}</p>` : ""}
          ${pr.precio != null ? `<span class="promo__price">${money(pr.precio)}</span>` : ""}
          ${pr.vigencia ? `<span class="promo__vig">${esc(pr.vigencia)}</span>` : ""}
          ${pr.productos ? `<button class="btn btn--primary btn--sm" type="button" data-promo="${i}">Agregar al pedido</button>` : ""}
        </article>`)
      .join("");
    box.addEventListener("click", (e) => {
      const b = e.target.closest("[data-promo]");
      if (!b) return;
      const pr = DATA.promociones[b.dataset.promo];
      Object.entries(pr.productos).forEach(([id, n]) => byId[id] && add(id, n));
      toast(`¡${pr.titulo} agregado!`);
    });
  }

  /* ---------- Panel del pedido ---------- */
  const drawer = $("[data-drawer]");
  let lastFocus = null;

  function renderCart() {
    const ids = Object.keys(cart);
    const n = count();
    const t = total();

    $$("[data-cart-count]").forEach((el) => {
      el.textContent = n;
      el.classList.toggle("is-visible", n > 0);
    });
    $$("[data-cart-total]").forEach((el) => {
      const inBar = el.classList.contains("orderbar__total");
      el.textContent = t != null ? money(t) : inBar ? "" : "Por confirmar";
      el.classList.toggle("is-tbd", t == null);
    });
    document.body.classList.toggle("has-items", n > 0);
    $("[data-orderbar]").classList.toggle("is-visible", n > 0 && !drawer.classList.contains("is-open"));

    $("[data-cart-empty]").hidden = n > 0;
    $("[data-order-form]").hidden = n === 0;
    $("[data-cart-foot]").hidden = n === 0;
    $("[data-cart-list]").innerHTML = ids
      .map((id) => {
        const p = byId[id];
        return `
          <li class="cart-item">
            <img src="${p.foto}" alt="">
            <div>
              <div class="cart-item__name">${esc(orderName(p))}</div>
              <div class="cart-item__price">${p.precio != null ? money(p.precio * cart[id]) : "Precio por confirmar"}</div>
            </div>
            <span class="qty"><button type="button" data-dec="${id}" aria-label="Quitar uno">−</button><output>${cart[id]}</output><button type="button" data-inc="${id}" aria-label="Agregar uno">+</button></span>
          </li>`;
      })
      .join("");
  }

  function openCart() {
    lastFocus = document.activeElement;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    renderCart();
    setTimeout(() => $(".drawer__close").focus(), 50);
  }
  function closeCart() {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    renderCart();
    if (lastFocus) lastFocus.focus();
  }

  function buildMessage() {
    const f = $("[data-order-form]");
    const lines = ["¡Hola Doña Eli! 👋 Quiero hacer este pedido:", ""];
    Object.keys(cart).forEach((id) => lines.push(`• ${cart[id]} × ${orderName(byId[id])}`));
    const t = total();
    if (t != null) lines.push("", `Total: ${money(t)}`);
    lines.push("");
    const nombre = f.nombre.value.trim();
    if (nombre) lines.push(`Nombre: ${nombre}`);
    const entrega = f.entrega.value;
    lines.push(`Entrega: ${entrega}`);
    const dir = f.direccion.value.trim();
    if (entrega === "Delivery" && dir) lines.push(`Dirección: ${dir}`);
    const nota = f.nota.value.trim();
    if (nota) lines.push(`Comentario: ${nota}`);
    lines.push("", "¡Gracias! 🥟");
    return lines.join("\n");
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $("[data-toast]");
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2200);
    const btn = $(".cart-btn");
    btn.classList.remove("bump");
    void btn.offsetWidth;
    btn.classList.add("bump");
  }

  /* ---------- Eventos ---------- */
  function bind() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-add],[data-inc],[data-dec],[data-tab],[data-open-cart],[data-close-cart],[data-send-order],[data-clear-cart]");
      if (!t) return;
      const d = t.dataset;
      if (d.add) { add(d.add); toast(`${orderName(byId[d.add])} en tu pedido ✓`); }
      else if (d.inc) add(d.inc);
      else if (d.dec) setQty(d.dec, (cart[d.dec] || 0) - 1);
      else if (d.tab) {
        activeTab = d.tab;
        $$("[data-tab]").forEach((b) => b.setAttribute("aria-selected", b.dataset.tab === activeTab));
        renderProducts();
      }
      else if ("openCart" in d) openCart();
      else if ("closeCart" in d) closeCart();
      else if ("sendOrder" in d) window.open(waUrl(buildMessage()), "_blank", "noopener");
      else if ("clearCart" in d) { cart = {}; save(); renderCart(); syncCards(); }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) closeCart();
    });

    $("[data-order-form]").addEventListener("change", (e) => {
      if (e.target.name === "entrega") $("[data-address]").hidden = e.target.value !== "Delivery";
    });

    const menuBtn = $("[data-menu]");
    const nav = $("#nav");
    menuBtn.addEventListener("click", () => {
      const open = menuBtn.getAttribute("aria-expanded") !== "true";
      menuBtn.setAttribute("aria-expanded", open);
      nav.classList.toggle("is-open", open);
    });
    $$("#nav a").forEach((a) => a.addEventListener("click", () => {
      menuBtn.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }));
  }

  /* ---------- Inicio ---------- */
  fillConfig();
  drawRays();
  renderTabs();
  renderProducts();
  setupBuilder();
  renderPromos();
  renderCart();
  bind();
})();
