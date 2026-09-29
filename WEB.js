const U = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=75`;
const PRODUCTS = [
  {
    id: 1,
    name: "Croissant Clásico",
    category: "Cruasanes",
    price: 8000,
    kw: "croissant",
    image: U("photo-1555507036-ab1f4038808a"),
    description: "Croissant artesanal de mantequilla.",
  },
  {
    id: 2,
    name: "Croissant de Chocolate",
    category: "Cruasanes",
    price: 10000,
    kw: "chocolate,croissant",
    image: U("photo-1530610476181-d83430b64dcd"),
    description: "Croissant artesanal de mantequilla relleno de chocolate.",
  },
  {
    id: 3,
    name: "Croissant de Almendras",
    category: "Cruasanes",
    price: 12000,
    kw: "almond,croissant",
    image: U("photo-1623334044303-241021148842"),
    description: "Hojaldre dorado con crema y láminas de almendra.",
  },
  {
    id: 4,
    name: "Croissant de Pistacho",
    category: "Cruasanes",
    price: 14000,
    kw: "pistachio,pastry",
    image: U("photo-1509365465985-25d11c17e812"),
    description:
      "Croissant relleno de crema de pistacho, el favorito de la casa.",
  },
  {
    id: 5,
    name: "Baguette Artesanal",
    category: "Panadería",
    price: 9000,
    kw: "baguette",
    image: U("photo-1549931319-a545dcf3bc73"),
    description: "Corteza crujiente y miga suave, horneada al amanecer.",
  },
  {
    id: 6,
    name: "Pan de Masa Madre",
    category: "Panadería",
    price: 16000,
    kw: "sourdough,bread",
    image: U("photo-1509440159596-0249088772ff"),
    description: "Fermentación lenta de 24 horas, sabor profundo.",
  },
  {
    id: 7,
    name: "Brioche",
    category: "Panadería",
    price: 10000,
    kw: "brioche",
    image: U("photo-1620921568790-c1cf8984624c"),
    description: "Pan suave y mantecoso, perfecto para el desayuno.",
  },
  {
    id: 8,
    name: "Cinnamon Roll",
    category: "Pastelería",
    price: 11000,
    kw: "cinnamon,roll",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Cinnamon_rolls_fully_baked.jpg?width=800",
    description: "Rollo de canela tibio con glaseado cremoso.",
  },
  {
    id: 9,
    name: "Brownie de Chocolate",
    category: "Pastelería",
    price: 9000,
    kw: "brownie",
    image: U("photo-1606313564200-e75d5e30476c"),
    description: "Húmedo por dentro, con cacao intenso y corteza fina.",
  },
  {
    id: 10,
    name: "Cappuccino",
    category: "Bebidas",
    price: 9000,
    kw: "cappuccino",
    image: U("photo-1572442388796-11668a67e53d"),
    description: "Espresso con leche cremosa y espuma sedosa.",
  },
  {
    id: 11,
    name: "Croissant de Jamón y Queso",
    category: "Cruasanes",
    price: 13000,
    kw: "croissant,sandwich",
    image: U("photo-1608198093002-ad4e005484ec"),
    description:
      "Croissant horneado con jamón y queso fundido, ideal para el almuerzo.",
  },
  {
    id: 12,
    name: "Café Latte",
    category: "Bebidas",
    price: 9000,
    kw: "latte,coffee",
    image: U("photo-1561882468-9110e03e0f78"),
    description: "Espresso suave con leche vaporizada y arte latte.",
  },
];
const EMOJI = {
  Cruasanes: "🥐",
  Panadería: "🥖",
  Pastelería: "🍰",
  Bebidas: "☕",
};
const CATS = ["Todos", "Cruasanes", "Panadería", "Pastelería", "Bebidas"];

/* ====== UTILIDADES ====== */
const $ = (s) => document.querySelector(s);
const money = (n) => "$" + n.toLocaleString("es-CO");
const norm = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const byId = (id) => PRODUCTS.find((p) => p.id === +id);
const imgTag = (p) =>
  `<span class="ph">${EMOJI[p.category]}</span><img src="${p.image}" data-kw="${p.kw}" data-lock="${p.id}" loading="lazy" alt="${p.name}" onerror="imgFail(this)">`;
let state = { cat: "Todos", q: "", sort: "rec" };
let cart = {};

/* ====== CARRITO ====== */
function loadCart() {
  try {
    const c = JSON.parse(localStorage.getItem("mc_cart")) || {};
    cart = {};
    Object.keys(c).forEach((id) => {
      if (byId(id) && c[id] > 0) cart[id] = +c[id];
    });
  } catch (e) {
    cart = {};
  }
}
function saveCart() {
  try {
    localStorage.setItem("mc_cart", JSON.stringify(cart));
  } catch (e) {}
  renderCart();
}
function calculateTotal() {
  return Object.keys(cart).reduce((s, id) => s + byId(id).price * cart[id], 0);
}
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  toast(byId(id).name + " agregado al carrito");
}
function removeFromCart(id) {
  delete cart[id];
  saveCart();
}
function increaseQuantity(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
}
function decreaseQuantity(id) {
  if (!cart[id]) return;
  cart[id]--;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
}
function clearCart() {
  cart = {};
  saveCart();
}
function renderCart() {
  const ids = Object.keys(cart);
  $("#cartCount").textContent = ids.reduce((s, id) => s + cart[id], 0);
  $("#cartSub").textContent =
    $("#cartTotal").textContent =
    $("#modalTotal").textContent =
      money(calculateTotal());
  $("#btnOrder").disabled = $("#btnClear").disabled = !ids.length;
  $("#cartList").innerHTML = ids.length
    ? ids
        .map((id) => {
          const p = byId(id),
            q = cart[id];
          return `
    <li class="list-group-item px-0">
      <div class="d-flex justify-content-between"><div><strong>${p.name}</strong><div class="text-muted small">${money(p.price)}</div></div>
        <button class="btn-close" data-del="${id}" aria-label="Quitar ${p.name}"></button></div>
      <div class="d-flex justify-content-between align-items-center mt-2">
        <div class="btn-group btn-group-sm" role="group" aria-label="Cantidad">
          <button class="btn btn-outline-secondary" data-dec="${id}" aria-label="Disminuir">−</button>
          <span class="btn btn-light disabled px-3">${q}</span>
          <button class="btn btn-outline-secondary" data-inc="${id}" aria-label="Aumentar">+</button></div>
        <span class="price">Subtotal: ${money(p.price * q)}</span></div>
    </li>`;
        })
        .join("")
    : '<li class="list-group-item text-muted px-0">Tu carrito está vacío. Agrega productos del catálogo.</li>';
}

/* ====== CATÁLOGO ====== */
function filterProducts(list) {
  return state.cat === "Todos"
    ? list
    : list.filter((p) => p.category === state.cat);
}
function searchProducts(list) {
  const q = norm(state.q.trim());
  return q
    ? list.filter((p) =>
        norm(p.name + " " + p.category + " " + p.description).includes(q),
      )
    : list;
}
function sortProducts(list) {
  const l = [...list];
  if (state.sort === "asc") l.sort((a, b) => a.price - b.price);
  if (state.sort === "desc") l.sort((a, b) => b.price - a.price);
  if (state.sort === "az") l.sort((a, b) => a.name.localeCompare(b.name, "es"));
  return l;
}
function renderFilters() {
  $("#filters").innerHTML = CATS.map(
    (c) =>
      `<button type="button" class="chip ${c === state.cat ? "active" : ""}" data-cat="${c}" aria-pressed="${c === state.cat}">${c}</button>`,
  ).join("");
}
function renderProducts() {
  const list = sortProducts(searchProducts(filterProducts(PRODUCTS)));
  $("#resultCount").textContent =
    list.length + (list.length === 1 ? " resultado" : " resultados");
  $("#empty").classList.toggle("d-none", list.length > 0);
  $("#grid").innerHTML = list
    .map(
      (p) => `
    <div class="col"><article class="card pcard">
      <div class="pic">${imgTag(p)}</div>
      <div class="card-body d-flex flex-column">
        <span class="badge bg-gold align-self-start mb-2">${p.category}</span>
        <h3 class="card-title">${p.name}</h3>
        <p class="desc mb-2">${p.description}</p>
        <div class="price fs-5 mt-auto mb-2">${money(p.price)}</div>
        <button class="btn btn-gold btn-sm" data-add="${p.id}">Agregar al carrito</button>
      </div></article></div>`,
    )
    .join("");
}
function renderFeatured() {
  const p = byId(4);
  $("#featName").textContent = p.name;
  $("#featPrice").textContent = money(p.price);
  $("#featDesc").textContent = p.description;
  const img = $("#featImg");
  img.alt = p.name;
  img.dataset.kw = p.kw;
  img.dataset.lock = p.id;
  img.onerror = () => imgFail(img);
  img.src = p.image;
}
function renderCarousel() {
  const ids = [4, 1, 6, 8, 10]; // productos del carrusel superior
  $("#carInd").innerHTML = ids
    .map(
      (id, i) =>
        `<button type="button" data-bs-target="#topCarousel" data-bs-slide-to="${i}" ${i === 0 ? 'class="active" aria-current="true"' : ""} aria-label="Diapositiva ${i + 1}"></button>`,
    )
    .join("");
  $("#carInner").innerHTML = ids
    .map((id, i) => {
      const p = byId(id);
      return `
    <div class="carousel-item ${i === 0 ? "active" : ""}">
      <div class="car-slide"><span class="ph">${EMOJI[p.category]}</span><img src="${p.image.replace("w=800", "w=1400")}" data-kw="${p.kw}" data-lock="${p.id}" ${i === 0 ? "" : 'loading="lazy"'} alt="${p.name}" onerror="imgFail(this)"></div>
      <div class="carousel-caption"><h2>${p.name}</h2><p class="d-none d-sm-block">${p.description}</p><div class="price mb-2">${money(p.price)}</div>
        <button class="btn btn-gold" data-add="${p.id}"><i class="bi bi-bag-plus me-1"></i>Agregar al carrito</button></div>
    </div>`;
    })
    .join("");
}
function renderGallery() {
  $("#gallery").innerHTML = [1, 6, 8, 10]
    .map((id) => {
      const p = byId(id);
      return `<div class="col"><button class="gal pic" data-img="${p.id}" aria-label="Ampliar foto de ${p.name}">${imgTag(p)}</button></div>`;
    })
    .join("");
}

/* ====== PEDIDO ====== */
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function scheduleOrder(d) {
  const items = Object.keys(cart).map((id) => ({
    name: byId(id).name,
    qty: cart[id],
    subtotal: byId(id).price * cart[id],
  }));
  const order = Object.assign(
    {
      code: "MC-" + String(Date.now()).slice(-6),
      date: new Date().toISOString(),
      items,
      total: calculateTotal(),
    },
    d,
  );
  try {
    const all = JSON.parse(localStorage.getItem("mc_orders")) || [];
    all.push(order);
    localStorage.setItem("mc_orders", JSON.stringify(all));
  } catch (e) {}
  return order;
}
function showOrderDone(o) {
  $("#doneCode").textContent = o.code;
  $("#doneSummary").innerHTML =
    o.items
      .map(
        (i) =>
          `<div class="d-flex justify-content-between"><span>${i.qty} x ${esc(i.name)}</span><span>${money(i.subtotal)}</span></div>`,
      )
      .join("") +
    `<hr class="my-2"><div class="d-flex justify-content-between fw-bold"><span>Total</span><span>${money(o.total)}</span></div><hr class="my-2">` +
    `<div>Entrega: ${esc(o.dir)}, barrio ${esc(o.barrio)}</div><div>Pago: ${esc(o.pago)}</div><div>A nombre de: ${esc(o.nombre)}, ${esc(o.tel)}</div>`;
  $("#checkoutForm").classList.add("d-none");
  $("#orderDone").classList.remove("d-none");
  $("#checkoutLabel").textContent = "Pedido confirmado";
}
function resetCheckoutModal() {
  $("#checkoutForm").classList.remove("d-none");
  $("#orderDone").classList.add("d-none");
  $("#checkoutLabel").textContent = "Datos de tu pedido";
}
function checkout(form) {
  if (!Object.keys(cart).length) {
    toast("Tu carrito está vacío.", true);
    return false;
  }
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return false;
  }
  const order = scheduleOrder({
    nombre: $("#fNombre").value.trim(),
    tel: $("#fTel").value.trim(),
    dir: $("#fDir").value.trim(),
    barrio: $("#fBarrio").value.trim(),
    pago: $("#fPago").value,
    notas: $("#fNotas").value.trim(),
  });
  showOrderDone(order);
  clearCart();
  form.reset();
  form.classList.remove("was-validated");
  return true;
}
function toast(m, err) {
  const t = $("#toast");
  $("#toastMsg").textContent = m;
  t.classList.toggle("text-bg-danger", !!err);
  t.classList.toggle("text-bg-success", !err);
  bootstrap.Toast.getOrCreateInstance(t, { delay: 2200 }).show();
}

/* ====== EVENTOS ====== */
document.addEventListener("click", (e) => {
  const t = e.target.closest(
    "[data-add],[data-inc],[data-dec],[data-del],[data-cat],[data-img],#menu .nav-link,#btnOrder,#btnClear,#toTop",
  );
  if (!t) return;
  if (t.dataset.add) addToCart(t.dataset.add);
  else if (t.dataset.inc) increaseQuantity(t.dataset.inc);
  else if (t.dataset.dec) decreaseQuantity(t.dataset.dec);
  else if (t.dataset.del) removeFromCart(t.dataset.del);
  else if (t.dataset.cat) {
    state.cat = t.dataset.cat;
    renderFilters();
    renderProducts();
  } else if (t.dataset.img) {
    const p = byId(t.dataset.img);
    const li = $("#lightImg");
    li.src = p.image;
    li.alt = p.name;
    li.onerror = () => {
      li.onerror = null;
      li.src = "https://loremflickr.com/900/700/" + p.kw + "/all?lock=" + p.id;
    };
    bootstrap.Modal.getOrCreateInstance($("#lightbox")).show();
  } else if (t.id === "btnOrder") {
    bootstrap.Offcanvas.getOrCreateInstance($("#cart")).hide();
    setTimeout(
      () => bootstrap.Modal.getOrCreateInstance($("#checkoutModal")).show(),
      300,
    );
  } else if (t.id === "btnClear") clearCart();
  else if (t.id === "toTop") window.scrollTo({ top: 0, behavior: "smooth" });
  else if (t.matches("#menu .nav-link")) {
    const m = $("#menu");
    if (m.classList.contains("show"))
      bootstrap.Collapse.getOrCreateInstance(m).hide();
  }
});
$("#searchInput").addEventListener("input", (e) => {
  state.q = e.target.value;
  renderProducts();
});
$("#sort").addEventListener("change", (e) => {
  state.sort = e.target.value;
  renderProducts();
});
$("#checkoutModal").addEventListener("hidden.bs.modal", resetCheckoutModal);
$("#checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();
  checkout(e.target);
});
window.addEventListener(
  "scroll",
  () => $("#toTop").classList.toggle("show", window.scrollY > 400),
  { passive: true },
);

/* ====== INICIO ====== */
loadCart();
renderFilters();
renderProducts();
renderCarousel();
renderFeatured();
renderGallery();
renderCart();
