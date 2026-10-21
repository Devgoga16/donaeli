/* Carta con pestañas, "Arma el mejor plan" y pedido por WhatsApp. */

interface ProductoCliente {
  id: string;
  categoria: string;
  nombre: string;
  precio: number | null;
  thumb: string;
}
interface Datos {
  waNumber: string;
  productos: ProductoCliente[];
  promociones: { titulo: string; productos: Record<string, number> }[];
}

const STORAGE_KEY = "donaeli-pedido";

export function iniciarPedido() {
  const datosEl = document.getElementById("pedido-datos");
  if (!datosEl) return;
  const DATA: Datos = JSON.parse(datosEl.textContent || "{}");

  const $ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => el.querySelector<T>(s)!;
  const $$ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => [...el.querySelectorAll<T>(s)];
  const byId = Object.fromEntries(DATA.productos.map((p) => [p.id, p]));
  const money = (n: number) => "S/ " + n.toFixed(2);
  const esc = (s: string) =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
  const waUrl = (text: string) => `https://wa.me/${DATA.waNumber}?text=${encodeURIComponent(text)}`;

  /* ---------- Estado ---------- */
  let cart: Record<string, number> = {};
  try {
    cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {};
  } catch {
    cart = {};
  }
  Object.keys(cart).forEach((id) => {
    if (!byId[id] || !(cart[id] > 0)) delete cart[id];
  });

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* sin almacenamiento */
    }
  };
  const count = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const total = () => {
    const ids = Object.keys(cart);
    if (!ids.length || ids.some((id) => byId[id].precio == null)) return null;
    return ids.reduce((s, id) => s + byId[id].precio! * cart[id], 0);
  };

  function setQty(id: string, qty: number) {
    if (qty > 0) cart[id] = Math.min(qty, 99);
    else delete cart[id];
    save();
    renderCart();
    syncCards();
  }
  const add = (id: string, n = 1) => setQty(id, (cart[id] || 0) + n);

  /* ---------- Tarjetas de la carta ---------- */
  const qtyHtml = (id: string, q: number) =>
    `<span class="qty"><button type="button" data-dec="${id}" aria-label="Quitar uno">−</button><output>${q}</output><button type="button" data-inc="${id}" aria-label="Agregar uno">+</button></span>`;

  function syncCards() {
    $$("[data-controls]").forEach((el) => {
      const id = el.dataset.controls!;
      const q = cart[id] || 0;
      el.innerHTML = q ? qtyHtml(id, q) : `<button class="btn btn--primary" type="button" data-add="${id}">Agregar</button>`;
    });
  }

  function selectTab(tab: string) {
    $$("[data-tab]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === tab)));
    $$<HTMLElement>(".product[data-categoria]").forEach((card) => {
      card.hidden = tab !== "todas" && card.dataset.categoria !== tab;
    });
  }

  /* ---------- El mejor plan ---------- */
  const form = $<HTMLFormElement>("[data-builder]");
  const qtyOut = $("[data-builder-qty]");
  let planQty = 1;
  $("[data-builder-minus]").addEventListener("click", () => (qtyOut.textContent = String((planQty = Math.max(1, planQty - 1)))));
  $("[data-builder-plus]").addEventListener("click", () => (qtyOut.textContent = String((planQty = Math.min(20, planQty + 1)))));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = form.elements as unknown as { empanada: HTMLSelectElement; bebida: HTMLSelectElement; alfajor: HTMLInputElement };
    add(f.empanada.value, planQty);
    if (f.bebida.value) add(f.bebida.value, planQty);
    if (f.alfajor.checked && byId.alfajores) add("alfajores", planQty);
    toast(planQty > 1 ? `¡${planQty} planes agregados a tu pedido!` : "¡Plan agregado a tu pedido!");
  });

  /* ---------- Panel del pedido ---------- */
  const drawer = $("[data-drawer]");
  let lastFocus: HTMLElement | null = null;

  function renderCart() {
    const n = count();
    const t = total();

    $$("[data-cart-count]").forEach((el) => {
      el.textContent = String(n);
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
    $("[data-cart-list]").innerHTML = Object.keys(cart)
      .map((id) => {
        const p = byId[id];
        return `
          <li class="cart-item">
            <img src="${p.thumb}" alt="" width="60" height="60">
            <div>
              <div class="cart-item__name">${esc(p.nombre)}</div>
              <div class="cart-item__price">${p.precio != null ? money(p.precio * cart[id]) : "Precio por confirmar"}</div>
            </div>
            ${qtyHtml(id, cart[id])}
          </li>`;
      })
      .join("");
  }

  function openCart() {
    lastFocus = document.activeElement as HTMLElement | null;
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
    lastFocus?.focus();
  }

  function buildMessage() {
    const f = $<HTMLFormElement>("[data-order-form]");
    const val = (name: string) => ((f.elements.namedItem(name) as HTMLInputElement | RadioNodeList | null)?.value ?? "").trim();
    const lines = ["¡Hola Doña Eli! 👋 Quiero hacer este pedido:", ""];
    Object.keys(cart).forEach((id) => lines.push(`• ${cart[id]} × ${byId[id].nombre}`));
    const t = total();
    if (t != null) lines.push("", `Total: ${money(t)}`);
    lines.push("");
    if (val("nombre")) lines.push(`Nombre: ${val("nombre")}`);
    const entrega = val("entrega");
    lines.push(`Entrega: ${entrega}`);
    if (entrega === "Delivery" && val("direccion")) lines.push(`Dirección: ${val("direccion")}`);
    if (val("nota")) lines.push(`Comentario: ${val("nota")}`);
    lines.push("", "¡Gracias! 🥟");
    return lines.join("\n");
  }

  /* ---------- Toast ---------- */
  let toastTimer: number | undefined;
  function toast(msg: string) {
    const el = $("[data-toast]");
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => el.classList.remove("is-visible"), 2200);
    const btn = $(".cart-btn");
    btn.classList.remove("bump");
    void btn.offsetWidth;
    btn.classList.add("bump");
  }

  /* ---------- Eventos ---------- */
  document.addEventListener("click", (e) => {
    const t = (e.target as Element).closest<HTMLElement>(
      "[data-add],[data-inc],[data-dec],[data-tab],[data-promo],[data-open-cart],[data-close-cart],[data-send-order],[data-clear-cart]",
    );
    if (!t) return;
    const d = t.dataset;
    if (d.add) {
      add(d.add);
      toast(`${byId[d.add].nombre} en tu pedido ✓`);
    } else if (d.inc) add(d.inc);
    else if (d.dec) setQty(d.dec, (cart[d.dec] || 0) - 1);
    else if (d.tab) selectTab(d.tab);
    else if (d.promo) {
      const pr = DATA.promociones[+d.promo];
      Object.entries(pr.productos).forEach(([id, n]) => byId[id] && add(id, n));
      toast(`¡${pr.titulo} agregado!`);
    } else if ("openCart" in d) openCart();
    else if ("closeCart" in d) closeCart();
    else if ("sendOrder" in d) window.open(waUrl(buildMessage()), "_blank", "noopener");
    else if ("clearCart" in d) {
      cart = {};
      save();
      renderCart();
      syncCards();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) closeCart();
  });

  $("[data-order-form]").addEventListener("change", (e) => {
    const el = e.target as HTMLInputElement;
    if (el.name === "entrega") $("[data-address]").hidden = el.value !== "Delivery";
  });

  const menuBtn = $("[data-menu]");
  const nav = $("#nav");
  menuBtn.addEventListener("click", () => {
    const open = menuBtn.getAttribute("aria-expanded") !== "true";
    menuBtn.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  });
  $$("#nav a").forEach((a) =>
    a.addEventListener("click", () => {
      menuBtn.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }),
  );

  renderCart();
  syncCards();
}
