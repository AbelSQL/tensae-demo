/* ============================================================
   Tensae Deli & Bakery — app (hash router, cart, pay-at-cashier checkout)
   ============================================================ */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const main = $("#main");
  const money = (n) => BRAND.symbol + n.toFixed(2);
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const catById = (id) => CATEGORIES.flatMap((g) => g.items).find((c) => c.id === id);
  const DRINK_CATS = CATEGORIES[0].items.map((c) => c.id);
  const isDrink = (p) => DRINK_CATS.includes(p.cat);
  const optSet = (p) => (p.options ? OPTION_SETS[p.options] || [] : []);
  const visible = (p) => !!p && !p.hidden;
  // Pick products for artwork; falls back to other menu items if some were removed or hidden.
  const pickArt = (ids, n = ids.length) => {
    const list = ids.map(byId).filter(visible);
    return list.length ? list : PRODUCTS.filter(visible).slice(0, n);
  };

  /* ---------- icons ---------- */
  const I = {
    chev: `<svg class="chev" viewBox="0 0 16 16" fill="currentColor"><path d="M4.3 6.3a1 1 0 0 1 1.4 0L8 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4l-3 3a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 0-1.4Z"/></svg>`,
    plus: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M8 3v10M3 8h10"/></svg>`,
    minus: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M3 8h10"/></svg>`,
    pin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5a7 7 0 0 0-7 7c0 5.25 7 12 7 12s7-6.75 7-12a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/></svg>`,
    cash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.8"/><path d="M6 9.5v5M18 9.5v5"/></svg>`,
    card: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 9.5h19M6 15h4"/></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3-4.6-4.5 6.4-.9L12 2.8Z"/></svg>`,
    leaf: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 3S8 2 5 10c-1.5 4 .5 7 .5 7S3 19 3 21h2c0-1 2-3 2-3s3 2 7 .5C22 15.5 20 3 20 3Zm-9 12c2-4 5-6 7-7-3 2-5 4-7 7Z"/></svg>`,
    gift: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13M12 8S10.5 3 8 4s0 4 4 4Zm0 0s1.5-5 4-4 0 4-4 4Z"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
    cake: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 21V12a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9M2 21h20M4 15c2 1.5 4 1.5 5.3 0 1.4 1.5 4 1.5 5.4 0 1.3 1.5 3.3 1.5 5.3 0M12 10V7M12 5a1 1 0 0 0 1-1c0-1-1-2-1-2s-1 1-1 2a1 1 0 0 0 1 1Z"/></svg>`,
    table: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 10h19M5 10v10M19 10v10M5 15h14"/><path d="M9.5 4.5h5l-.6 5.5h-3.8z"/></svg>`,
    bag: `<svg viewBox="0 0 32 32" fill="currentColor"><path d="M9 10V9a7 7 0 0 1 14 0v1h4l-1.6 17.2A2 2 0 0 1 23.4 29H8.6a2 2 0 0 1-2-1.8L5 10h4Zm2 0h10V9a5 5 0 0 0-10 0v1Z"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>`,
    bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>`,
    cup: (s) => `<svg viewBox="0 0 24 32" width="${Math.round(22 * s)}" height="${Math.round(30 * s)}"><path d="M3 6h18l-2 24H5L3 6Zm-1-4h20v3H2V2Z"/></svg>`,
    bagEmpty: `<svg class="empty-art" viewBox="0 0 200 160"><ellipse cx="100" cy="148" rx="70" ry="8" fill="#000" opacity=".08"/><path d="M50 50h100l-8 96H58Z" fill="#dce8f6"/><path d="M70 50v-8a30 30 0 0 1 60 0v8" fill="none" stroke="#1f5fae" stroke-width="7" stroke-linecap="round"/><circle cx="100" cy="98" r="20" fill="#1f5fae"/><rect x="89" y="97" width="22" height="8" rx="1.5" fill="#fff"/><rect x="93" y="90" width="14" height="6" rx="1.5" fill="#fff"/><rect x="99" y="84" width="2" height="5" fill="#fff"/></svg>`,
  };

  /* ---------- storage ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("eg_" + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem("eg_" + k, JSON.stringify(v)); } catch {} },
  };
  let cart = store.get("cart", []).filter((l) => l && byId(l.id));
  // Older saved orders may use a topping name we've since renamed.
  cart.forEach((l) => { if (l.opts && Array.isArray(l.opts.toppings)) l.opts.toppings = l.opts.toppings.map((t) => (t === "Cold Foam" ? "Velvet Milk Foam" : t)); });
  // Order mode: pick up at the counter, or dine in at a table (set by scanning a table QR code).
  const MAX_TABLE = 99, TABLE_TTL = 4 * 3600 * 1000; // a table session lasts 4 hours
  const validTable = (n) => Number.isInteger(n) && n >= 1 && n <= MAX_TABLE;
  let mode = store.get("mode", null);
  if (!mode || mode.type !== "table" || !validTable(mode.table) || Date.now() - mode.at > TABLE_TTL) mode = { type: "pickup" };
  const atTable = () => mode.type === "table";
  function setMode(type, table) {
    mode = type === "table" ? { type, table, at: Date.now() } : { type: "pickup" };
    store.set("mode", mode); updateBag();
  }
  const saveCart = () => { store.set("cart", cart); updateBag(); };

  /* ---------- pricing ---------- */
  function defaultOpts(p) {
    const o = { qty: 1 };
    if (isDrink(p)) {
      o.size = p.size || "T";
      o.milk = p.milk || "2% Milk";
      if (p.shots != null) o.shots = p.shots;
      o.syrups = [];
      o.toppings = [];
      if (p.art.type === "iced") o.ice = "Regular Ice";
      if (["hot", "mug", "macchiato"].includes(p.art.type)) o.temp = "Regular";
    } else if (p.cat === "breakfast") {
      o.warm = "Warmed";
    }
    optSet(p).forEach((f) => { o[f.key] = f.type === "select" ? f.choices[0].name : ""; });
    return o;
  }
  function unitPrice(p, o) {
    let n = p.price;
    const base = defaultOpts(p);
    if (o.size) n += SIZES.find((s) => s.id === o.size).add - SIZES.find((s) => s.id === base.size).add;
    if (o.milk) n += CUSTOM.milkUpcharge[o.milk] || 0;
    optSet(p).forEach((f) => { if (f.type === "select") n += (f.choices.find((c) => c.name === o[f.key]) || { add: 0 }).add; });
    if (o.shots != null && o.shots > base.shots) n += (o.shots - base.shots) * (CUSTOM.shotPrice ?? 0.9);
    if (o.syrups) n += o.syrups.length * (CUSTOM.syrupPrice ?? 0.6);
    (o.toppings || []).forEach((t) => { n += CUSTOM.toppingUpcharge[t] || 0; });
    return Math.max(n, 0);
  }
  function optLabels(p, o) {
    const d = defaultOpts(p), out = [];
    if (o.size) { const s = SIZES.find((x) => x.id === o.size); out.push(`${s.name} ${s.oz}`); }
    if (o.milk && o.milk !== d.milk) out.push(o.milk);
    if (o.shots != null && o.shots !== d.shots) out.push(`${o.shots} shot${o.shots === 1 ? "" : "s"}`);
    (o.syrups || []).forEach((s) => out.push(s));
    (o.toppings || []).forEach((t) => out.push(t));
    if (o.ice && o.ice !== d.ice) out.push(o.ice);
    if (o.temp && o.temp !== d.temp) out.push(o.temp);
    if (o.warm) out.push(o.warm);
    optSet(p).forEach((f) => { if (o[f.key]) out.push(f.type === "text" ? `“${o[f.key]}”` : o[f.key]); });
    return out;
  }
  // Rebuild options from the menu so only real choices are used (protects prices and the staff screen).
  function cleanOpts(p, raw) {
    const d = defaultOpts(p), o = JSON.parse(JSON.stringify(d));
    raw = raw && typeof raw === "object" ? raw : {};
    const pick = (k, list) => { if (k in d && list.includes(raw[k])) o[k] = raw[k]; };
    o.qty = Number.isInteger(raw.qty) ? Math.min(20, Math.max(1, raw.qty)) : 1;
    if ("size" in d && SIZES.some((x) => x.id === raw.size)) o.size = raw.size;
    pick("milk", ["No Milk", ...CUSTOM.milk]);
    pick("ice", CUSTOM.ice); pick("temp", CUSTOM.temps); pick("warm", ["Warmed", "Not warmed"]);
    if ("shots" in d && Number.isInteger(raw.shots)) o.shots = Math.min(6, Math.max(0, raw.shots));
    if (d.syrups) o.syrups = Array.isArray(raw.syrups) ? CUSTOM.syrups.filter((x) => raw.syrups.includes(x)) : [];
    if (d.toppings) o.toppings = Array.isArray(raw.toppings) ? CUSTOM.toppings.filter((x) => raw.toppings.includes(x)) : [];
    optSet(p).forEach((f) => {
      const v = raw[f.key];
      if (f.type === "select") { if (f.choices.some((c) => c.name === v)) o[f.key] = v; }
      else if (typeof v === "string") o[f.key] = v.slice(0, f.max);
    });
    return o;
  }

  // Talk to the order server (server.py)
  // Demo/showcase build (no server): orders are simulated in the browser and never sent anywhere.
  const DEMO = typeof DEMO_MODE !== "undefined" && DEMO_MODE === true;
  function demoApi(path, method, body) {
    const orders = store.get("demoOrders", {});
    const fail = (msg) => { const e = new Error(msg); e.status = 400; return Promise.reject(e); };
    if (method === "POST" && path === "orders") {
      const bad = body.items.map((l) => byId(l.id)).find((p) => !p || p.soldOut || p.hidden);
      if (bad) return fail(`Sorry, ${bad ? bad.name : "an item"} isn't available right now.`);
      const id = Array.from({ length: 32 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");
      const o = { id, code: String(1000 + Math.floor(Math.random() * 9000)), created: Date.now(), method: body.method, table: body.table, status: "new", paid: false };
      orders[id] = o; store.set("demoOrders", orders);
      return Promise.resolve({ ...o, updated: o.created });
    }
    const m = path.match(/^orders\/([0-9a-f]{32})$/);
    if (method === "GET" && m && orders[m[1]]) {
      const o = orders[m[1]], s = (Date.now() - o.created) / 1000;
      const status = s < 15 ? "new" : s < 45 ? "preparing" : "ready"; // the demo "kitchen" moves orders along
      return Promise.resolve({ ...o, status, updated: Date.now() });
    }
    return fail("The back office isn't included in this preview. It's available in the full version of the website.");
  }

  async function api(path, { method = "GET", body, auth } = {}) {
    if (DEMO) return demoApi(path, method, body);
    const headers = {};
    if (body) headers["Content-Type"] = "application/json";
    if (auth) headers.Authorization = "Bearer " + auth;
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 12000);
    let res;
    try {
      res = await fetch("api/" + path, { method, headers, body: body ? JSON.stringify(body) : undefined, signal: ctl.signal, cache: "no-store" });
    } catch {
      throw new Error("We couldn't reach the order system. Check your internet connection and try again.");
    } finally { clearTimeout(timer); }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const e = new Error(res.status === 404 && !data.error ? "The order system isn't running." : data.error || "Something went wrong. Please try again.");
      e.status = res.status; throw e;
    }
    return data;
  }

  const lineKey = (id, o) => id + "|" + JSON.stringify({ ...o, qty: 0 });
  const cartCount = () => cart.reduce((n, l) => n + l.opts.qty, 0);
  function totals() {
    const sub = cart.reduce((n, l) => n + unitPrice(byId(l.id), l.opts) * l.opts.qty, 0);
    const tax = sub * BRAND.taxRate;
    return { sub, tax, total: sub + tax };
  }

  /* ---------- chrome ---------- */
  function updateBag() {
    const c = cartCount();
    $$("[data-bag-count]").forEach((el) => (el.textContent = c));
    $$("[data-table-chip]").forEach((el) => { el.hidden = !atTable(); if (atTable()) el.querySelector("b").textContent = mode.table; });
  }
  function bumpBag() {
    const b = $("[data-bag-link]");
    b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
  }
  let toastT;
  function toast(msg) {
    const t = $("[data-toast]");
    t.innerHTML = I.check + "<span></span>";
    t.querySelector("span").textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("is-on"), 2400);
  }

  // Modal: "How are you ordering?" and "Visit us"
  const modal = $("[data-modal]");
  function visitCard() {
    return `<div class="visit-card">${I.pin}<div>
      <strong>${LOCATION.name}</strong><small>${LOCATION.address}</small><small>${LOCATION.hours}</small>
      ${LOCATION.phone ? `<a href="tel:${LOCATION.phone.replace(/[^+\d]/g, "")}">${LOCATION.phone}</a>` : ""}
      ${LOCATION.mapUrl ? `<a href="${LOCATION.mapUrl}" target="_blank" rel="noopener">Get directions</a>` : ""}
    </div></div>`;
  }
  function modeBody() {
    const max = Math.max(LOCATION.tables, atTable() ? mode.table : 0);
    const cur = atTable() ? mode.table : 1;
    return `<div class="mode-opts">
      <button class="mode-opt ${atTable() ? "" : "is-on"}" data-mode="pickup">
        <span class="mode-opt__icon">${I.bag}</span>
        <span><strong>Pick up at the counter</strong><small>Order ahead, get a 4-digit pickup code and pay at the cashier.</small></span>
        <span class="mode-opt__tick">${I.check}</span>
      </button>
      <div class="mode-opt ${atTable() ? "is-on" : ""}">
        <span class="mode-opt__icon">${I.table}</span>
        <span><strong>Dine in at a table</strong><small>We'll bring your order to your table. Pay at the cashier.</small>
          <span class="mode-table">
            <span class="field"><label for="f-table" class="sr-only">Table number</label>
              <select id="f-table" data-table-select>${Array.from({ length: max }, (_, i) => `<option value="${i + 1}" ${i + 1 === cur ? "selected" : ""}>Table ${i + 1}</option>`).join("")}</select>${I.chev}</span>
            <button class="btn btn--primary" data-mode="table">Order to this table</button>
          </span>
        </span>
      </div>
    </div>
    <p class="mode-hint">Sitting down? Scan the QR code on your table and your table number is filled in for you.</p>`;
  }
  function openModal(kind) {
    const visit = kind === "visit";
    $("#modal-title").textContent = visit ? "Visit us" : "How are you ordering?";
    $("[data-modal-body]").innerHTML = visit
      ? `${visitCard()}<p class="mode-hint">Order ahead online and pay at the cashier, or scan the QR code on your table to order from your seat.</p>
         <a class="btn btn--primary btn--lg btn--block" href="#/menu" data-close-modal>See the menu</a>`
      : modeBody() + visitCard();
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    setTimeout(() => { const f = $("[data-modal] button, [data-modal] a"); if (f) f.focus(); }, 50);
  }
  function closeModal() { modal.hidden = true; document.body.style.overflow = ""; }
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-mode]")) { closeDrawer(); openModal("mode"); }
    if (e.target.closest("[data-open-visit]")) { closeDrawer(); openModal("visit"); }
    if (e.target.closest("[data-close-modal]")) closeModal();
    const m = e.target.closest("[data-mode]");
    if (m) {
      if (m.dataset.mode === "table") setMode("table", +$("[data-table-select]").value);
      else setMode("pickup");
      closeModal();
      toast(atTable() ? `Ordering for Table ${mode.table}` : "Ordering for pickup at the counter");
      if (/^#\/(cart|menu)/.test(location.hash)) render();
    }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  // Drawer
  const drawer = $("[data-drawer]"), burger = $("[data-burger]");
  function closeDrawer() { drawer.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); }
  burger.addEventListener("click", () => {
    const open = drawer.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });

  // Footer: contact details and social links come from the shop settings
  function renderFooter() {
  $("[data-footer-visit]").innerHTML = `
    <li>${escapeHtml(LOCATION.address)}</li><li>${escapeHtml(LOCATION.hours)}</li>
    ${LOCATION.phone ? `<li><a href="tel:${LOCATION.phone.replace(/[^+\d]/g, "")}">${escapeHtml(LOCATION.phone)}</a></li>` : ""}
    ${LOCATION.email ? `<li><a href="mailto:${escapeHtml(LOCATION.email)}">${escapeHtml(LOCATION.email)}</a></li>` : ""}`;
  const socialIcons = {
    instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8Z"/></svg>`,
    tiktok: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.3 2.2 1.6 3.6 3.7 3.8v3.1a7 7 0 0 1-3.7-1.2v6.4a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v3.2a2.8 2.8 0 1 0 2 2.7V3h3Z"/></svg>`,
  };
  $("[data-social]").innerHTML = Object.entries(SOCIAL).filter(([, url]) => /^https:\/\//.test(url))
    .map(([k, url]) => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener" aria-label="${k[0].toUpperCase() + k.slice(1)}">${socialIcons[k]}</a>`).join("");
  }
  renderFooter();

  /* ============================================================
     PAGES
     ============================================================ */

  const group = (...ids) => `<div class="art-group">${pickArt(ids).map((p) => drawProduct(p)).join("")}</div>`;

  /* ---------- Animated homepage scenes ---------- */
  const BEAN = `<svg viewBox="0 0 20 28" aria-hidden="true"><ellipse cx="10" cy="14" rx="9" ry="13" fill="#6a3b22"/><path d="M10 2c-4.5 6 4.5 18 0 24" stroke="#3a1f12" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`;
  const SPARK = `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0c1 6 4 9 10 10-6 1-9 4-10 10-1-6-4-9-10-10 6-1 9-4 10-10Z" fill="currentColor"/></svg>`;
  // Floating beans and sprinkles: x = % from left, s = size px, d = seconds per trip, w = delay
  const DRIFT = [
    { k: "bean", x: 6, s: 22, d: 14, w: 0 }, { k: "bean", x: 82, s: 18, d: 16, w: -6 },
    { k: "bean", x: 44, s: 15, d: 19, w: -10 }, { k: "bean", x: 93, s: 20, d: 13, w: -3 },
    { k: "bean", x: 24, s: 16, d: 17, w: -13 },
    { k: "spr", x: 16, c: "#f2c84b", d: 11, w: -2 }, { k: "spr", x: 60, c: "#e8798f", d: 12, w: -7 },
    { k: "spr", x: 34, c: "#1f5fae", d: 10, w: -4 }, { k: "spr", x: 72, c: "#f2c84b", d: 15, w: -11 },
    { k: "spr", x: 52, c: "#e8798f", d: 13, w: -9 },
  ];
  function driftLayer() {
    return `<div class="drift" aria-hidden="true">${DRIFT.map((b) => b.k === "bean"
      ? `<span class="drift__bean" style="left:${b.x}%;width:${b.s}px;animation-duration:${b.d}s;animation-delay:${b.w}s">${BEAN}</span>`
      : `<span class="drift__spr" style="left:${b.x}%;background:${b.c};animation-duration:${b.d}s;animation-delay:${b.w}s"></span>`).join("")}</div>`;
  }
  // A row of floating products. Hot drinks get rising steam; cakes get twinkling sparkles.
  function scene(ids, { sparkles = false } = {}) {
    return `<div class="scene">
      ${driftLayer()}
      <div class="scene__row">${pickArt(ids).map((p, i) => {
        const steam = p.art.type === "hot" || p.art.type === "macchiato" || p.art.type === "mug"
          ? `<svg class="steam" viewBox="0 0 60 80" aria-hidden="true"><path d="M18 78c-10-12 10-20 0-34s8-22 0-36"/><path d="M32 78c-10-12 10-20 0-34s8-22 0-36"/><path d="M46 78c-10-12 10-20 0-34s8-22 0-36"/></svg>` : "";
        return `<div class="bob bob--${i + 1}">${steam}${drawProduct(p)}</div>`;
      }).join("")}</div>
      ${sparkles ? `<div class="sparkles" aria-hidden="true">${[1, 2, 3, 4, 5].map((n) => `<span class="spark spark--${n}">${SPARK}</span>`).join("")}</div>` : ""}
    </div>`;
  }

  function pageHome() {
    const favs = PRODUCTS.filter((p) => p.featured && visible(p)).slice(0, 4);
    const cats = CATEGORIES.flatMap((g) => g.items).filter((c) => PRODUCTS.some((p) => p.cat === c.id && visible(p)));
    return `
    <div class="home page-enter">
      <section class="hero">
        <div class="hero__inner">
          <div class="hero__copy">
            <p class="eyebrow">${atTable() ? `Welcome to Table ${mode.table}` : "Bakery &amp; café"}</p>
            <h1>Cakes worth celebrating. Coffee worth the trip.</h1>
            <p class="hero__lead">Our signature Gebretensae cake, fresh pastries every morning and espresso made the way our regulars love it. Order online and pay at the cashier.</p>
            <div class="hero__btns">
              <a class="btn btn--primary btn--lg" href="#/menu">Order now</a>
              <a class="btn btn--outline btn--lg" href="#/menu/cakes">Celebration cakes</a>
            </div>
            <ul class="hero__how">
              <li><b>1</b>Choose from the menu</li>
              <li><b>2</b>Get a 4-digit code</li>
              <li><b>3</b>Pay at the cashier</li>
            </ul>
          </div>
          <div class="hero__art"><div class="hero__plate">${scene(["cappuccino", "gebretensae-slice", "iced-caramel-macchiato"], { sparkles: true })}</div></div>
        </div>
      </section>

      <section class="band">
        <div class="band__head"><h2>Browse the menu</h2><a class="link-btn" href="#/menu">Full menu →</a></div>
        <div class="cat-cards">${cats.map((c) => {
          const first = PRODUCTS.find((p) => p.cat === c.id && visible(p));
          const n = PRODUCTS.filter((p) => p.cat === c.id && visible(p)).length;
          return `<a class="cat-card" href="#/menu/${c.id}"><span class="art-frame">${drawProduct(first)}</span><span><strong>${c.name}</strong><small>${n} items</small></span></a>`;
        }).join("")}</div>
      </section>

      <section class="band">
        <div class="band__head"><h2>Customer favorites</h2><a class="link-btn" href="#/menu">See everything →</a></div>
        <div class="prod-grid prod-grid--4">${favs.map(prodCard).join("")}</div>
      </section>

      <section class="feature feature--navy">
        <div class="feature__inner">
          <div class="feature__copy">
            <p class="eyebrow">Dining in?</p>
            <h2>Order right from your table</h2>
            <p>Scan the QR code on your table with your phone camera. The menu opens with your table number already filled in. Order what you like and we'll bring it over. Pay at the cashier whenever you're ready.</p>
            ${atTable() ? `<a class="btn btn--light btn--lg" href="#/menu">Order for Table ${mode.table}</a>` : `<button class="btn btn--light btn--lg" data-open-mode>Choose my table</button>`}
          </div>
          <div class="feature__qr" aria-hidden="true">
            <div class="qr-mock"><span></span><span></span><span></span><i></i></div>
            <div class="qr-mock__label">Table <b>${atTable() ? mode.table : 7}</b></div>
          </div>
        </div>
      </section>

      <section class="feature feature--cream">
        <div class="feature__inner">
          <div class="feature__art feature__art--scene">${scene(["chocolate-cake", "fruit-cake", "vanilla-cake"], { sparkles: true })}</div>
          <div class="feature__copy">
            <p class="eyebrow">Celebration cakes</p>
            <h2>Birthdays, weddings and everything in between</h2>
            <p>Choose a Chocolate, Vanilla or Fruit-layered cake in 6", 8" or 10" and add your own message. Whole cakes are made to order, so please give us at least 24 hours.</p>
            <a class="btn btn--primary btn--lg" href="#/menu/cakes">Order a cake</a>
          </div>
        </div>
      </section>

      <section class="band visit">
        <div class="visit__card">
          <div><p class="eyebrow">Visit us</p><h2>${escapeHtml(LOCATION.name)}</h2>
            <p>${escapeHtml(LOCATION.address)}</p><p>${escapeHtml(LOCATION.hours)}</p>
            ${LOCATION.phone ? `<p><a href="tel:${LOCATION.phone.replace(/[^+\d]/g, "")}">${escapeHtml(LOCATION.phone)}</a></p>` : ""}</div>
          <div class="visit__btns">
            ${LOCATION.mapUrl ? `<a class="btn btn--primary btn--lg" href="${escapeHtml(LOCATION.mapUrl)}" target="_blank" rel="noopener">Get directions</a>` : ""}
            <a class="btn btn--outline btn--lg" href="#/coffee">Our story</a>
          </div>
        </div>
      </section>
      <p class="legal-note">Prices and availability may change. Payment is taken at the cashier, never online.</p>
    </div>`;
  }

  function catBar(active) {
    const cats = CATEGORIES.flatMap((g) => g.items);
    return `<nav class="cat-bar" aria-label="Menu categories"><div class="cat-bar__inner">
      <a href="#/menu" class="${!active ? "is-active" : ""}">All</a>
      ${cats.map((c) => `<a href="#/menu/${c.id}" class="${active === c.id ? "is-active" : ""}">${c.name}</a>`).join("")}
    </div></nav>`;
  }

  function tableBanner() {
    return atTable() ? `<div class="table-banner">
      <span class="table-banner__icon">${I.table}</span>
      <div><strong>You're ordering for Table ${mode.table}</strong><span>We'll bring your order to your table. Pay at the cashier when you're ready.</span></div>
      <button class="link-btn" data-open-mode>Change</button>
    </div>` : "";
  }

  function prodCard(p) {
    return `<a class="prod-card ${p.soldOut ? "is-soldout" : ""}" href="#/product/${p.id}">
      <span class="art-frame">${drawProduct(p)}${p.soldOut ? `<span class="badge-new badge-sold">Sold out</span>` : p.isNew ? `<span class="badge-new">New</span>` : ""}</span>
      <span class="prod-card__body">
        <span class="prod-card__name">${p.name}</span>
        <span class="prod-card__desc">${p.desc}</span>
        <span class="prod-card__foot"><b>${money(p.price)}</b><span class="prod-card__add" aria-hidden="true">${I.plus}</span></span>
      </span>
    </a>`;
  }

  function menuSection(c, h = "h2") {
    const items = PRODUCTS.filter((p) => p.cat === c.id && visible(p));
    if (!items.length) return "";
    const subs = [...new Set(items.map((p) => p.sub))];
    return `<section class="menu__section" id="sec-${c.id}">
      <${h} class="menu__title">${c.name}</${h}>
      ${subs.map((s) => `${subs.length > 1 ? `<h3 class="menu__sub">${s}</h3>` : ""}
        <div class="prod-grid">${items.filter((p) => p.sub === s).map(prodCard).join("")}</div>`).join("")}
    </section>`;
  }

  function pageMenu() {
    return `${catBar()}
    <div class="menu page-enter">
      ${tableBanner()}
      <header class="menu__head"><h1>Tensae Menu</h1><p>Everything is made fresh in our kitchen. Tap an item to choose options and add it to your order.</p></header>
      ${CATEGORIES.flatMap((g) => g.items).map((c) => menuSection(c)).join("")}
      <p class="allergy-note">${I.info}<span>Food allergy? Our kitchen uses wheat, milk, eggs, soy and nuts. <a href="#/allergens">Read our allergen information</a> or ask our staff.</span></p>
    </div>`;
  }

  function pageCategory(catId) {
    const cat = catById(catId);
    if (!cat) return pageNotFound();
    return `${catBar(catId)}
    <div class="menu page-enter">
      ${tableBanner()}
      ${menuSection(cat, "h1")}
      <p class="allergy-note">${I.info}<span>Food allergy? <a href="#/allergens">Read our allergen information</a> or ask our staff before ordering.</span></p>
    </div>`;
  }

  /* ---------- Product ---------- */
  let pdState = null;

  function selectField(label, key, options, value) {
    return `<div class="field"><label for="f-${key}">${label}</label>
      <select id="f-${key}" data-opt="${key}">${options.map((o) => `<option ${o === value ? "selected" : ""}>${o}</option>`).join("")}</select>${I.chev}</div>`;
  }

  function pageProduct(id, editIdx) {
    const p = byId(id);
    if (!visible(p)) return pageNotFound();
    const cat = catById(p.cat);
    const editing = editIdx != null && cart[editIdx] && cart[editIdx].id === id;
    pdState = { p, opts: editing ? JSON.parse(JSON.stringify(cart[editIdx].opts)) : defaultOpts(p), editIdx: editing ? editIdx : null };
    const o = pdState.opts;
    const drink = isDrink(p);

    const sizesHtml = o.size ? `
      <div class="opt-group">
        <h2 class="opt-title">Cup size</h2>
        <div class="sizes" role="radiogroup" aria-label="Cup size">
          ${SIZES.map((s) => `
            <button class="size ${o.size === s.id ? "is-active" : ""}" data-size="${s.id}" role="radio" aria-checked="${o.size === s.id}">
              <strong>${s.name}</strong><small>${s.oz}</small>
            </button>`).join("")}
        </div>
      </div>` : "";

    let customHtml = "";
    if (drink) {
      customHtml = `
      <div class="opt-group">
        <h2 class="opt-title">Milk &amp; espresso</h2>
        <div class="custom">
          ${selectField("Milk", "milk", p.milk === "No Milk" ? ["No Milk", ...CUSTOM.milk] : CUSTOM.milk, o.milk)}
          ${o.shots != null ? `
            <div class="stepper"><span>Espresso shots</span>
              <div class="stepper__ctl">
                <button class="icon-btn" data-shots="-1" aria-label="Fewer shots" ${o.shots <= 0 ? "disabled" : ""}>${I.minus}</button>
                <b data-shots-val>${o.shots}</b>
                <button class="icon-btn" data-shots="1" aria-label="More shots" ${o.shots >= 6 ? "disabled" : ""}>${I.plus}</button>
              </div></div>` : ""}
          ${o.ice ? selectField("Ice", "ice", CUSTOM.ice, o.ice) : ""}
          ${o.temp ? selectField("Temperature", "temp", CUSTOM.temps, o.temp) : ""}
        </div>
      </div>
      <div class="opt-group">
        <h2 class="opt-title">Extras</h2>
        <div class="custom">
          <div class="field"><label>Flavor syrups <span class="muted">· ${money(CUSTOM.syrupPrice ?? 0.6)} each</span></label>
            <div class="chips">${CUSTOM.syrups.map((s) => `<button class="chip ${o.syrups.includes(s) ? "is-on" : ""}" data-chip="syrups" data-val="${s}" aria-pressed="${o.syrups.includes(s)}">${s}</button>`).join("")}</div></div>
          <div class="field"><label>Toppings</label>
            <div class="chips">${CUSTOM.toppings.map((t) => `<button class="chip ${o.toppings.includes(t) ? "is-on" : ""}" data-chip="toppings" data-val="${t}" aria-pressed="${o.toppings.includes(t)}">${t}${CUSTOM.toppingUpcharge[t] ? ` +${money(CUSTOM.toppingUpcharge[t])}` : ""}</button>`).join("")}</div></div>
        </div>
      </div>`;
    } else if (o.warm) {
      customHtml = `
      <div class="opt-group">
        <h2 class="opt-title">How would you like it?</h2>
        <div class="custom">${selectField("Warming", "warm", ["Warmed", "Not warmed"], o.warm)}</div>
      </div>`;
    }
    if (optSet(p).length) {
      customHtml += `
      <div class="opt-group">
        <h2 class="opt-title">Your cake</h2>
        <div class="custom">${optSet(p).map((f) => f.type === "select"
          ? `<div class="field"><label for="f-${f.key}">${f.label}</label>
              <select id="f-${f.key}" data-opt="${f.key}">${f.choices.map((c) => `<option value="${escapeHtml(c.name)}" ${c.name === o[f.key] ? "selected" : ""}>${c.name}${c.add ? ` (+${money(c.add)})` : ""}</option>`).join("")}</select>${I.chev}</div>`
          : `<div class="field"><label for="f-${f.key}">${f.label}</label>
              <input id="f-${f.key}" data-opt="${f.key}" maxlength="${f.max}" placeholder="${f.placeholder}" value="${escapeHtml(o[f.key])}" />
              <div class="cake-msg-count"><span data-count-for="${f.key}">${(o[f.key] || "").length}</span>/${f.max}</div></div>`).join("")}
          <p class="muted" style="margin:14px 0 0;font-size:14px">Whole cakes are made to order. Please allow at least 24 hours—we'll confirm your pickup time.</p>
        </div>
      </div>`;
    }

    return `
    <div class="pd page-enter">
      <nav class="pd-crumbs" aria-label="Breadcrumb"><a href="#/menu">Tensae Menu</a><span>/</span><a href="#/menu/${cat.id}">${cat.name}</a></nav>
      <div class="pd__grid">
        <div class="pd__media"><div class="pd__art" data-pd-art>${drawProduct(p)}</div></div>
        <div class="pd__info">
          ${p.isNew ? `<span class="badge-new badge-new--inline">New</span>` : ""}
          <h1>${p.name}</h1>
          <p class="pd-desc">${p.desc}</p>
          <p class="pd-from">${o.size ? "From " : ""}${money(p.price)}${o.size ? ` <span class="muted">· ${SIZES.find((s) => s.id === (p.size || "T")).name}</span>` : ""}</p>
          ${tableBanner()}
          ${sizesHtml}
          ${customHtml}
          <p class="allergy-note">${I.info}<span>Allergy information: ${drink ? "dairy milk and almond milk (tree nuts) are used at our coffee bar; oat milk may contain gluten." : "our bakery items are typically made with wheat (gluten), eggs and milk, and may contain nuts or soy."} <a href="#/allergens">More about allergens</a>.</span></p>
          <div class="pd-buy">
            <div class="qty" aria-label="Quantity">
              <button class="icon-btn" data-qty="-1" aria-label="Decrease quantity" ${o.qty <= 1 ? "disabled" : ""}>${I.minus}</button>
              <b data-qty-val>${o.qty}</b>
              <button class="icon-btn" data-qty="1" aria-label="Increase quantity" ${o.qty >= 20 ? "disabled" : ""}>${I.plus}</button>
            </div>
            <button class="btn btn--primary btn--lg pd-buy__btn" data-add ${p.soldOut ? "disabled" : ""}>
              <span>${p.soldOut ? "Sold out right now" : pdState.editIdx != null ? "Update order" : "Add to order"}</span><span data-pd-price>${money(unitPrice(p, o))}</span>
            </button>
          </div>
        </div>
      </div>
    </div>`;
  }

  function mountProduct() {
    const { p, opts: o } = pdState;
    const refreshPrice = () => {
      $("[data-pd-price]").textContent = money(unitPrice(p, o) * o.qty);
    };
    $$("[data-size]").forEach((b) => b.addEventListener("click", () => {
      o.size = b.dataset.size;
      $$("[data-size]").forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-checked", x === b); });
      const sc = SIZES.find((s) => s.id === o.size).scale;
      $("[data-pd-art] svg").style.transform = `scale(${0.82 + (sc - 0.7) * 0.6})`;
      refreshPrice();
    }));
    $$("[data-opt]").forEach((s) => s.addEventListener(s.tagName === "INPUT" ? "input" : "change", () => {
      o[s.dataset.opt] = s.value.trim() ? s.value : "";
      const c = $(`[data-count-for="${s.dataset.opt}"]`); if (c) c.textContent = s.value.length;
      refreshPrice();
    }));
    $$("[data-chip]").forEach((c) => c.addEventListener("click", () => {
      const arr = o[c.dataset.chip], v = c.dataset.val, i = arr.indexOf(v);
      i >= 0 ? arr.splice(i, 1) : arr.push(v);
      c.classList.toggle("is-on", i < 0); c.setAttribute("aria-pressed", i < 0);
      refreshPrice();
    }));
    $$("[data-shots]").forEach((b) => b.addEventListener("click", () => {
      o.shots = Math.min(6, Math.max(0, o.shots + +b.dataset.shots));
      $("[data-shots-val]").textContent = o.shots;
      $$("[data-shots]").forEach((x) => (x.disabled = (x.dataset.shots === "-1" && o.shots <= 0) || (x.dataset.shots === "1" && o.shots >= 6)));
      refreshPrice();
    }));
    $$("[data-qty]").forEach((b) => b.addEventListener("click", () => {
      o.qty = Math.min(20, Math.max(1, o.qty + +b.dataset.qty));
      $("[data-qty-val]").textContent = o.qty;
      $$("[data-qty]").forEach((x) => (x.disabled = (x.dataset.qty === "-1" && o.qty <= 1) || (x.dataset.qty === "1" && o.qty >= 20)));
      refreshPrice();
    }));
    refreshPrice();
    $("[data-add]").addEventListener("click", () => {
      const add = () => {
        if (pdState.editIdx != null) cart.splice(pdState.editIdx, 1);
        const key = lineKey(p.id, o);
        const existing = cart.find((l) => lineKey(l.id, l.opts) === key);
        if (existing) existing.opts.qty += o.qty;
        else cart.push({ id: p.id, opts: JSON.parse(JSON.stringify(o)) });
        saveCart(); bumpBag();
        if (pdState.editIdx != null) { location.hash = "#/cart"; toast("Your order was updated"); }
        else toast(`${o.qty > 1 ? o.qty + " × " : ""}${p.name} added to your order`);
      };
      add();
    });
  }

  /* ---------- Cart & checkout ---------- */
  let checkout = store.get("checkout", { method: "store", pay: "counter", time: "asap", name: "", phone: "", note: "" });

  function timeSlots() {
    const out = [{ v: "asap", t: "As soon as possible (about 8–12 min)" }];
    const d = new Date(); d.setSeconds(0, 0);
    d.setMinutes(Math.ceil((d.getMinutes() + 20) / 15) * 15);
    for (let i = 0; i < 8; i++) {
      out.push({ v: d.toISOString(), t: d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) });
      d.setMinutes(d.getMinutes() + 15);
    }
    return out;
  }

  function pageCart() {
    if (!cart.length) {
      return `
      <div class="empty page-enter">
        ${I.bagEmpty}
        <h2>Nothing here yet</h2>
        <p>Pick something delicious from the menu and it will show up here, ready to send to our kitchen.</p>
        <a class="btn btn--primary btn--lg" href="#/menu">Add items</a>
      </div>`;
    }
    const tbl = atTable();
    const t = totals();
    const slots = timeSlots();
    return `
    <div class="cart-head page-enter"><div class="cart-head__inner">
      <div><h1>Your order <span class="count-pill">${cartCount()}</span></h1><p>${tbl ? `Check your items and send your order to the kitchen. We'll bring it to Table ${mode.table}.` : "Check your items, choose a pickup time and pay when you arrive."}</p></div>
      <a class="btn btn--outline" href="#/menu">Add more items</a>
    </div></div>
    <div class="cart">
      <div class="cart-items">
        ${cart.map((l, i) => {
          const p = byId(l.id);
          return `<div class="cart-item">
            <a class="art-frame" href="#/product/${p.id}">${drawProduct(p)}</a>
            <div>
              <h3>${p.name}</h3>${p.soldOut || p.hidden ? `<p class="line-warn">${I.info} Sorry, this is ${p.soldOut ? "sold out" : "no longer available"}. Please remove it.</p>` : ""}
              <div class="opts">${optLabels(p, l.opts).map((x) => `<span>${escapeHtml(x)}</span>`).join("") || `<span>${escapeHtml(catById(p.cat).name)}</span>`}</div>
              <div class="cart-item__actions">
                <a class="link-btn" href="#/product/${p.id}?edit=${i}">Edit</a>
                <button class="link-btn" data-remove="${i}">Remove</button>
              </div>
            </div>
            <div class="cart-item__right">
              <span class="cart-item__price">${money(unitPrice(p, l.opts) * l.opts.qty)}</span>
              <div class="mini-stepper">
                <button class="icon-btn" data-line="${i}" data-d="-1" aria-label="Decrease">${I.minus}</button>
                <b>${l.opts.qty}</b>
                <button class="icon-btn" data-line="${i}" data-d="1" aria-label="Increase" ${l.opts.qty >= 20 ? "disabled" : ""}>${I.plus}</button>
              </div>
            </div>
          </div>`;
        }).join("")}
      </div>

      <aside class="panel">
        <h2>${tbl ? "Dine-in details" : "Pickup details"}</h2>
        <button class="panel-store" data-open-mode style="width:100%;border:0;text-align:left;cursor:pointer">
          ${tbl ? I.table : I.pin}
          <span style="flex:1">${tbl
            ? `<strong>Table ${mode.table}</strong><small>We'll bring your order to your table</small>`
            : `<strong>Pick up at the counter</strong><small>${LOCATION.name}</small><small>${LOCATION.address} · ${LOCATION.hours}</small>`}</span>
          <span class="link-btn">Change</span>
        </button>

        ${tbl ? "" : `<div class="field"><label for="f-time">Pickup time</label>
          <select id="f-time" data-co="time">${slots.map((x) => `<option value="${x.v}" ${x.v === checkout.time ? "selected" : ""}>${x.t}</option>`).join("")}</select>${I.chev}</div>`}

        <div class="field" data-f="name"><label for="f-name">${tbl ? "Your name (optional)" : "Name for the order *"}</label>
          <input id="f-name" data-co="name" autocomplete="given-name" value="${escapeHtml(checkout.name)}" placeholder="e.g. Alex" />
          <div class="err">Please enter a name so we can call out your order.</div></div>
        <div class="field"><label for="f-phone">Phone (optional, for order updates)</label>
          <input id="f-phone" data-co="phone" type="tel" autocomplete="tel" value="${escapeHtml(checkout.phone)}" placeholder="(555) 123-4567" /></div>
        <div class="field"><label for="f-note">Note for the kitchen (optional)</label>
          <textarea id="f-note" data-co="note" placeholder="Anything we should know?">${escapeHtml(checkout.note)}</textarea></div>

        <div class="field"><label>Payment</label>
          <div class="pay-opts">
            <label class="pay-opt is-on">
              <input type="radio" name="pay" value="cashier" checked />
              <span class="pay-opt__icon">${I.cash}</span>
              <span><strong>Pay at Cashier</strong><small>${tbl ? `When you're ready, tell the cashier Table ${mode.table} or your order code and pay with cash or card.` : "Show your 4-digit pickup code and pay with cash or card at the counter."}</small></span>
            </label>
          </div></div>

        <div class="totals">
          <div><span>Subtotal</span><span>${money(t.sub)}</span></div>
          <div><span>Estimated tax</span><span>${money(t.tax)}</span></div>
          <div class="grand"><span>Total due at cashier</span><span>${money(t.total)}</span></div>
        </div>
        <div class="pay-note">${I.info}<span><b>No payment needed now.</b> ${tbl ? `We'll bring your order to Table ${mode.table}. Pay at the cashier when you're ready.` : "You'll receive a 4-digit pickup code and pay at the cashier when you collect your order."}</span></div>
        <p class="form-err" data-place-err role="alert" hidden></p>
        <p class="fine-print">By placing an order you agree to our <a href="#/terms">Terms of Use</a>. See how we handle your details in our <a href="#/privacy">Privacy Policy</a>.</p>
        <button class="btn btn--primary btn--lg btn--block" data-place>${tbl ? "Send order to kitchen" : "Place order"} · ${money(t.total)}</button>
      </aside>
    </div>`;
  }

  function escapeHtml(s) { return String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  const saveCheckout = () => store.set("checkout", checkout);

  function mountCart() {
    $$("[data-remove]").forEach((b) => b.addEventListener("click", () => {
      const l = cart[+b.dataset.remove];
      cart.splice(+b.dataset.remove, 1); saveCart(); render();
      toast(`${byId(l.id).name} removed`);
    }));
    $$("[data-line]").forEach((b) => b.addEventListener("click", () => {
      const l = cart[+b.dataset.line];
      l.opts.qty += +b.dataset.d;
      if (l.opts.qty <= 0) cart.splice(+b.dataset.line, 1);
      saveCart(); render();
    }));
    $$("[data-method]").forEach((b) => b.addEventListener("click", () => { checkout.method = b.dataset.method; saveCheckout(); render(); }));
    $$("[data-co]").forEach((el) => el.addEventListener("input", () => {
      checkout[el.dataset.co] = el.value; saveCheckout();
      if (el.dataset.co === "name") el.closest(".field").classList.remove("has-error");
    }));
    $$("input[name=pay]").forEach((r) => r.addEventListener("change", () => {
      checkout.pay = r.value; saveCheckout();
      $$(".pay-opt").forEach((x) => x.classList.toggle("is-on", x.contains(r) && r.checked));
    }));
    const place = $("[data-place]");
    if (place) place.addEventListener("click", placeOrder);
  }

  let placing = false;
  async function placeOrder() {
    if (placing) return;
    const tbl = atTable();
    if (!tbl && !checkout.name.trim()) {
      const f = $("[data-f=name]"); f.classList.add("has-error");
      $("#f-name").focus(); f.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const btn = $("[data-place]"), err = $("[data-place-err]"), label = btn.textContent;
    placing = true; btn.disabled = true; btn.textContent = "Sending your order…"; err.hidden = true;
    const items = cart.map((l) => ({ id: l.id, opts: cleanOpts(byId(l.id), l.opts) }));
    const t = totals();
    try {
      const r = await api("orders", {
        method: "POST",
        body: {
          items, method: tbl ? "table" : "pickup", table: tbl ? mode.table : null,
          name: checkout.name.trim(), phone: checkout.phone.trim(), note: checkout.note.trim(),
          time: tbl ? "asap" : checkout.time,
        },
      });
      const ready = tbl || checkout.time === "asap" ? new Date(r.created + 10 * 60000) : new Date(checkout.time);
      const order = {
        id: r.id, num: r.code, items, totals: t, placed: r.created, ready: ready.toISOString(),
        name: checkout.name.trim(), method: r.method, table: r.table, pay: "cashier", status: r.status, paid: r.paid,
      };
      const orders = store.get("orders", []); orders.unshift(order); store.set("orders", orders.slice(0, 10));
      cart = []; saveCart();
      location.hash = "#/order/" + r.code;
    } catch (e) {
      err.textContent = e.message; err.hidden = false;
      btn.disabled = false; btn.textContent = label;
      err.scrollIntoView({ behavior: "smooth", block: "center" });
    } finally { placing = false; }
  }

  const findOrder = (num) => store.get("orders", []).find((x) => x.num === num);
  function orderMsg(o) {
    const tbl = o.method === "table";
    switch (o.status) {
      case "preparing": return tbl ? `We're preparing your order now. We'll bring it to Table ${o.table}.` : "We're preparing your order now.";
      case "ready": return tbl ? "Your order has been served. Enjoy!" : `Your order is ready! Show code ${o.num} at the counter.`;
      case "done": return `All done—thank you for visiting ${BRAND.name}!`;
      case "cancelled": return "This order was cancelled. Please speak to the cashier if you have any questions.";
      default: return tbl ? `The kitchen has your order and will bring it to Table ${o.table}.` : `The kitchen has your order. See you soon at ${LOCATION.name}.`;
    }
  }
  function stepsHtml(o) {
    const tbl = o.method === "table";
    const at = { new: 1, preparing: 1, ready: 3, done: 3 }[o.status] ?? 1;
    const steps = [
      ["Order received", "We've got it"],
      ["Preparing", o.status === "new" ? "Up next" : "Fresh, just for you"],
      tbl ? ["Served", "Brought to your table"] : ["Ready", "Pay &amp; pick up at the cashier"],
    ];
    if (o.status === "cancelled") return `<p class="order-cancelled">${I.info} Cancelled</p>`;
    return steps.map(([t, sub], i) => {
      const cls = i < at ? "is-done" : i === at && o.status === "preparing" ? "is-now" : i === at && o.status === "new" ? "is-next" : "";
      return `<div class="step ${cls}"><div class="step__dot">${i < at ? I.check : i + 1}</div><strong>${t}</strong><small>${sub}</small></div>`;
    }).join("");
  }
  function payHtml(o) {
    const tbl = o.method === "table";
    if (o.paid) return `${I.check}<div><strong>Paid—thank you!</strong>Your payment of ${money(o.totals.total)} was received at the cashier.</div>`;
    return `${I.cash}<div><strong>Pay ${money(o.totals.total)} at the cashier</strong>${tbl ? `Whenever you're ready, tell the cashier <b>Table ${o.table}</b> or order code <b>${o.num}</b> and pay with cash or card.` : `Tell the cashier your pickup code <b>${o.num}</b> and pay with cash or card.`} Nothing has been charged.</div>`;
  }

  function pageOrder(num) {
    const o = findOrder(num);
    if (!o) return pageNotFound();
    const tbl = o.method === "table";
    o.status = o.status || "new";
    const ready = new Date(o.ready).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    return `
    <section class="confirm-hero page-enter" data-order-view="${o.id || ""}">
      <div class="check">${I.check}</div>
      <h1>Thanks${o.name ? ", " + escapeHtml(o.name) : ""}! We've got your order.</h1>
      <p data-order-msg>${orderMsg(o)}</p>
    </section>
    <div class="confirm-card">
      <div class="confirm-grid">
        ${tbl
          ? `<div><small>Your table</small><strong class="pickup-code">${o.table}</strong></div>
             <div><small>Order code</small><strong>${o.num}</strong></div>`
          : `<div><small>Pickup code</small><strong class="pickup-code">${o.num}</strong></div>
             <div><small>Ready around</small><strong>${ready}</strong></div>`}
        <div><small>Total at cashier</small><strong>${money(o.totals.total)}</strong></div>
      </div>
      <div class="steps" data-order-steps>${stepsHtml(o)}</div>
      <div class="confirm-pay ${o.paid ? "is-paid" : ""}" data-order-pay>${payHtml(o)}</div>
      <div class="confirm-list">
        ${o.items.map((l) => { const p = byId(l.id); return p ? `<div><span>${l.opts.qty} × ${p.name}</span><span>${money(unitPrice(p, l.opts) * l.opts.qty)}</span></div>` : ""; }).join("")}
        <div><span>Tax</span><span>${money(o.totals.tax)}</span></div>
        <div class="grand"><span>Total due at cashier</span><span>${money(o.totals.total)}</span></div>
      </div>
      <div class="confirm-actions">
        <a class="btn btn--primary btn--lg" href="#/menu">${tbl ? "Order something else" : "Start a new order"}</a>
        <a class="btn btn--outline btn--lg" href="#/">Back to home</a>
      </div>
    </div>
    <div style="height:120px"></div>`;
  }

  let orderPoll = null;
  function mountOrder(num) {
    clearInterval(orderPoll);
    const o = findOrder(num);
    if (!o || !o.id) return;
    const here = () => document.querySelector(`[data-order-view="${o.id}"]`);
    const poll = async () => {
      if (!here()) return clearInterval(orderPoll);
      try {
        const r = await api("orders/" + o.id);
        if (!here()) return;
        const changed = r.status !== o.status || r.paid !== o.paid;
        o.status = r.status; o.paid = r.paid;
        const all = store.get("orders", []); const i = all.findIndex((x) => x.id === o.id);
        if (i >= 0) { all[i] = o; store.set("orders", all); }
        if (changed) {
          $("[data-order-msg]").textContent = orderMsg(o);
          $("[data-order-steps]").innerHTML = stepsHtml(o);
          const pay = $("[data-order-pay]"); pay.innerHTML = payHtml(o); pay.classList.toggle("is-paid", !!o.paid);
        }
        if (o.status === "done" || o.status === "cancelled") clearInterval(orderPoll);
      } catch { /* keep trying quietly */ }
    };
    orderPoll = setInterval(poll, 6000); poll();
  }

  /* ---------- Our story ---------- */
  function pageCoffee() {
    const ways = [
      { k: "Espresso bar", n: "Made to order", d: "From our customers' favorite Traditional Macchiato to lattes and cappuccinos, every drink is pulled and steamed when you order it." },
      { k: "The Habesha way", n: "Spiced Habesha Coffee", d: "A warmly spiced, deeply aromatic brewed coffee inspired by the coffee ceremony—made to be shared." },
      { k: "Baked fresh daily", n: "Cakes & pastries", d: "Our specialty cakes, flaky puff cakes and morning croissants come out of our ovens every day." },
    ];
    return `
    <section class="page-hero page-enter">
      <p class="eyebrow">Our story</p>
      <h1>Baked with love. Brewed with pride.</h1>
      <p>${BRAND.full} is known for its specialty cakes—above all our signature Gebretensae cake—and for handcrafted espresso drinks. We bring traditional bakery favorites and café classics together under one roof.</p>
    </section>
    <section class="band">
      <div class="story-cards">${ways.map((r, i) => `
        <article class="story-card story-card--${i}"><small>${r.k}</small><h3>${r.n}</h3><p>${r.d}</p></article>`).join("")}</div>
    </section>
    <section class="feature feature--cream">
      <div class="feature__inner">
        <div class="feature__art">${group("cappuccino", "gebretensae-slice", "black-coffee")}</div>
        <div class="feature__copy">
          <h2>Come for the cake, stay for the coffee</h2>
          <p>Order ahead for pickup or order from your table, and pay at the cashier. It's that easy.</p>
          <a class="btn btn--primary btn--lg" href="#/menu">See the menu</a>
        </div>
      </div>
    </section>`;
  }

  /* ---------- Legal & help pages ---------- */
  const contactLine = () => [
    LOCATION.email && `email <a href="mailto:${escapeHtml(LOCATION.email)}">${escapeHtml(LOCATION.email)}</a>`,
    LOCATION.phone && `call <a href="tel:${LOCATION.phone.replace(/[^+\d]/g, "")}">${escapeHtml(LOCATION.phone)}</a>`,
    `speak to us at the bakery (${escapeHtml(LOCATION.address)})`,
  ].filter(Boolean).join(", or ");

  function legalPage(title, intro, sections) {
    return `
    <article class="legal-page page-enter">
      <header><p class="eyebrow">${BRAND.full}</p><h1>${title}</h1><p class="muted">Last updated ${escapeHtml(LEGAL.updated)}</p>${intro ? `<p class="legal-page__intro">${intro}</p>` : ""}</header>
      <nav class="legal-toc" aria-label="On this page"><ol>${sections.map((x, i) => `<li><button class="link-btn" data-jump="lg-${i}">${x[0]}</button></li>`).join("")}</ol></nav>
      ${sections.map((x, i) => `<section id="lg-${i}"><h2>${x[0]}</h2>${x[1]}</section>`).join("")}
    </article>`;
  }

  function pagePrivacy() {
    const days = LEGAL.personalDataDays;
    return legalPage("Privacy Policy",
      `This policy explains what information we collect when you use our website to order, why we collect it, and the choices you have. We keep it simple: we only collect what we need to make and serve your order.`, [
      ["Who we are", `<p>This website is run by ${escapeHtml(LEGAL.owner)} (“we”, “us”), a single bakery and café at ${escapeHtml(LOCATION.address)}. We are responsible for the information described in this policy.</p>`],
      ["What we collect", `<ul>
        <li><b>Your order:</b> the items and options you choose, any note you add, the time you placed it, and your pickup time or table number.</li>
        <li><b>Your name</b> (required for pickup orders so we can call it out; optional when you order from a table).</li>
        <li><b>Your phone number</b>, only if you choose to give it, so we can reach you about your order.</li>
        <li><b>Technical information:</b> your device's IP address is used briefly to protect the ordering system from abuse, and our web host may keep standard server logs for security.</li>
      </ul>
      <p>We do <b>not</b> take payments online, so we never collect card or bank details on this website. We have no customer accounts, and we do not collect your location.</p>`],
      ["How we use it", `<ul>
        <li>To prepare your order, call out your name or bring it to your table, and contact you if there's a problem with it.</li>
        <li>To keep records of sales for our accounts and tax obligations.</li>
        <li>To keep the website and ordering system secure and working properly.</li>
      </ul>
      <p>We never sell or rent your information, and we don't use it for advertising.</p>`],
      ["Who we share it with", `<p>Only our staff can see orders, using a PIN-protected screen. We use a small number of service providers to run the website:</p>
      <ul>
        <li><b>Our web hosting provider</b>, which stores the website and the order database on our behalf.</li>
        <li><b>Google Fonts</b>, which supplies the typefaces on this site. Your browser loads them directly from Google, which receives your IP address.</li>
      </ul>
      <p>We may also share information if the law requires it.</p>`],
      ["Cookies and storage on your device", `<p>We do not use advertising or analytics cookies, and we don't track you across other websites. To make ordering work, this site saves a few things in your browser's local storage on your own device:</p>
      <ul>
        <li>the items in your order, and your recent orders so you can follow their status;</li>
        <li>your order type and table number (cleared automatically after 4 hours);</li>
        <li>the name, phone number and note you typed at checkout, so you don't have to type them again.</li>
      </ul>
      <p>You can remove all of this at any time:</p>
      <p><button class="btn btn--outline" data-clear-device>Clear my saved information on this device</button></p>`],
      ["How long we keep it", `<p>Names, phone numbers and notes are automatically removed from our order records <b>${days} days</b> after the order. We keep the rest of the order record (items, prices, date and time) for as long as we need it for our business and tax records.</p>`],
      ["How we protect it", `<p>The website uses an encrypted connection (HTTPS). Orders can only be viewed by staff who know the staff PIN. No system is perfectly secure, but we work to keep your information safe.</p>`],
      ["Your choices and rights", `<p>You can order without giving a phone number, and order from a table without giving a name. You can ask us to show you, correct or delete the information we hold about you. Depending on where you live, you may have other rights under data protection law, including the right to complain to your data protection authority.</p>
      <p>To make a request, ${contactLine()}.</p>`],
      ["Children", `<p>Our website is not aimed at children under 13, and we don't knowingly collect their information. If you believe a child has given us their details, please contact us and we will delete them.</p>`],
      ["Changes to this policy", `<p>If we change this policy, we'll update the date at the top of this page.</p>`],
      ["Contact us", `<p>Questions about privacy? Please ${contactLine()}.</p>`],
    ]);
  }

  function pageTerms() {
    const law = LEGAL.country ? `the laws of ${escapeHtml(LEGAL.country)}` : "the laws of the country where our bakery is located";
    return legalPage("Terms of Use",
      `These terms apply when you use this website and order from ${escapeHtml(LEGAL.owner)}. By placing an order, you agree to them.`, [
      ["About this website", `<p>This website lets you view our menu and send orders to our kitchen for pickup at the counter or service at your table. Payment always happens in person at our cashier.</p>`],
      ["Your order", `<ul>
        <li>An order is a request to us. It's confirmed when you see a confirmation page with an order code.</li>
        <li>We may need to cancel an order, for example if an item is sold out. If that happens, we'll let you know at the bakery or by phone if you gave us a number.</li>
        <li>Pickup and ready times are estimates. Whole celebration cakes need at least 24 hours' notice, and we'll confirm the pickup time with you.</li>
        <li>For table orders, please check that the table number on your screen is correct.</li>
      </ul>`],
      ["Prices and payment", `<ul>
        <li>Prices are shown on the menu and may change. Tax is shown before you place your order.</li>
        <li>You pay at the cashier with cash or card when you collect your order or when you're ready (for table orders). Nothing is charged online.</li>
        <li>If a price on the website is wrong, we'll tell you the correct price before you pay, and you can choose not to go ahead.</li>
      </ul>`],
      ["Allergies and food information", `<p>Our kitchen handles wheat (gluten), milk, eggs, soy, nuts and other allergens. Although we take care, we can't guarantee any item is free from allergens. If you have a food allergy, please read our <a href="#/allergens">allergen information</a> and speak to our staff before ordering. Pictures on this site are illustrations, and items may look different.</p>`],
      ["Using the website fairly", `<p>Please don't place fake orders, interfere with the website or ordering system, try to access the staff area, or use the site for anything unlawful. We may block use of the website that breaks these rules.</p>`],
      ["Our name and content", `<p>The ${BRAND.full} name, logo, illustrations, text and design of this website belong to ${escapeHtml(LEGAL.owner)}. Please don't copy or reuse them without our permission. Any other product or company names mentioned belong to their owners, and we are not affiliated with or endorsed by them.</p>`],
      ["Our responsibility", `<p>We work to keep the website accurate and available, but it is provided “as is” and may sometimes be unavailable or contain mistakes. Nothing in these terms limits any rights you have as a consumer that can't be excluded by law, or our responsibility for the food we serve.</p>`],
      ["Changes and governing law", `<p>We may update these terms and will change the date at the top when we do. These terms are governed by ${law}.</p>`],
      ["Contact us", `<p>Questions about an order or these terms? Please ${contactLine()}.</p>`],
    ]);
  }

  function pageAccessibility() {
    return legalPage("Accessibility", `We want everyone to be able to browse our menu and order easily, whatever device or assistive technology you use.`, [
      ["What we do", `<ul>
        <li>We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1, level AA.</li>
        <li>Every page can be used with a keyboard, and focused items are clearly outlined.</li>
        <li>Text and buttons use strong color contrast, and pages adapt to large text and small screens.</li>
        <li>Menu pictures have text descriptions, and animations are turned off if you ask your device to reduce motion.</li>
      </ul>`],
      ["Known limitations", `<p>Some parts of the website may not yet work perfectly with every screen reader. We test and improve the site regularly.</p>`],
      ["Need help ordering?", `<p>If anything on this website is hard to use, our staff are always happy to take your order in person. To tell us about a problem, please ${contactLine()}. We'll do our best to fix it.</p>`],
    ]);
  }

  function pageAllergens() {
    return legalPage("Allergen information", `Our kitchen and coffee bar handle common allergens every day. Please tell our staff about any allergy before you order.`, [
      ["Allergens in our kitchen", `<p>We use <b>wheat (gluten), milk, eggs, soy, tree nuts (including almonds)</b> and other ingredients that can cause allergic reactions. Because everything is prepared in the same kitchen, we cannot guarantee that any item is completely free from allergens.</p>`],
      ["Coffee bar", `<ul>
        <li>Whole and 2% milk contain <b>milk</b>.</li>
        <li>Almond milk contains <b>tree nuts</b>.</li>
        <li>Oat milk may contain <b>gluten</b>.</li>
        <li>Some syrups, sauces and toppings contain milk or other allergens—please ask.</li>
      </ul>`],
      ["Cakes, pastries and breakfast", `<p>Our cakes, croissants and pastries are typically made with <b>wheat (gluten), eggs and milk</b>, and may contain or come into contact with <b>nuts</b> and <b>soy</b>. Ingredients can change, so please check with our staff each time.</p>`],
      ["Ask us", `<p>Our team can tell you the ingredients of anything on the menu. Please ${contactLine()}.</p>`],
    ]);
  }

  function mountLegal() {
    $$("[data-jump]").forEach((a) => a.addEventListener("click", () => {
      const t = document.getElementById(a.dataset.jump); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    }));
    const clr = $("[data-clear-device]");
    if (clr) clr.addEventListener("click", () => {
      try { Object.keys(localStorage).filter((k) => k.startsWith("eg_")).forEach((k) => localStorage.removeItem(k)); } catch {}
      cart = []; checkout = { method: "store", pay: "cashier", time: "asap", name: "", phone: "", note: "" }; mode = { type: "pickup" };
      updateBag(); toast("Your saved information was removed from this device");
    });
  }

  /* ---------- Table QR codes (staff page: #/tables) ---------- */
  const QR_LIB = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";
  const defaultBase = () => location.origin + location.pathname;
  function pageTables() {
    const base = store.get("qrBase", defaultBase());
    const count = store.get("qrCount", LOCATION.tables);
    return `
    <section class="qr-head no-print page-enter"><div class="qr-head__inner">
      <a class="link-btn" href="#/staff">← Back to orders</a>
      <h1>Table QR codes</h1>
      <p>Print these and put one on each table. Guests scan the code with their phone camera, the menu opens with their table number already set, and they pay at the cashier.</p>
      <div class="qr-controls">
        <div class="field"><label for="qr-base">Website address</label><input id="qr-base" value="${escapeHtml(base)}" spellcheck="false" /></div>
        <div class="field"><label for="qr-count">Number of tables</label><input id="qr-count" type="number" min="1" max="${MAX_TABLE}" value="${count}" /></div>
        <button class="btn btn--primary btn--lg" data-print>Print QR codes</button>
      </div>
      <div class="qr-warn" data-qr-warn hidden>${I.info}<span><b>Phones can't open this address yet.</b> It only works on this computer. Put the website online first, then type its real address above (for example https://www.tensaebakery.com/) before printing.</span></div>
    </div></section>
    <div class="qr-grid" data-qr-grid><p class="qr-msg">Loading QR codes…</p></div>`;
  }
  function loadQrLib() {
    if (window.qrcode) return Promise.resolve();
    return new Promise((res, rej) => {
      const sc = document.createElement("script");
      sc.src = QR_LIB; sc.onload = res; sc.onerror = rej;
      document.head.appendChild(sc);
    });
  }
  function qrSvg(text) {
    const qr = window.qrcode(0, "M"); qr.addData(text); qr.make();
    const n = qr.getModuleCount(), q = 2;
    let d = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c + q} ${r + q}h1v1h-1z`;
    return `<svg viewBox="0 0 ${n + q * 2} ${n + q * 2}" shape-rendering="crispEdges" role="img" aria-label="QR code"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#0f2a4a"/></svg>`;
  }
  function mountTables() {
    const baseIn = $("#qr-base"), countIn = $("#qr-count"), grid = $("[data-qr-grid]");
    const logo = $(".logo svg").outerHTML;
    const draw = () => {
      if (!$("[data-qr-grid]")) return;
      let base = baseIn.value.trim().split("#")[0] || defaultBase();
      if (!/^https?:\/\//i.test(base)) base = "https://" + base;
      const count = Math.min(MAX_TABLE, Math.max(1, parseInt(countIn.value, 10) || LOCATION.tables));
      store.set("qrBase", baseIn.value.trim()); store.set("qrCount", count);
      let host = ""; try { host = new URL(base).hostname; } catch {}
      $("[data-qr-warn]").hidden = !/^(localhost|127\.|\[::1\]|0\.0\.0\.0)|\.localhost$/.test(host);
      grid.innerHTML = Array.from({ length: count }, (_, i) => {
        const n = i + 1, url = `${base}#/table/${n}`;
        return `<div class="qr-card">
          <div class="qr-card__brand">${logo}<span>${BRAND.name}<small>Deli &amp; Bakery</small></span></div>
          <p class="qr-card__cta">Scan to see the menu &amp; order</p>
          <div class="qr-card__code">${qrSvg(url)}</div>
          <div class="qr-card__table"><small>Table</small><strong>${n}</strong></div>
          <p class="qr-card__pay">${I.cash} Pay at the cashier</p>
        </div>`;
      }).join("");
    };
    let t;
    [baseIn, countIn].forEach((el) => el.addEventListener("input", () => { clearTimeout(t); t = setTimeout(draw, 250); }));
    $("[data-print]").addEventListener("click", () => window.print());
    loadQrLib().then(draw).catch(() => {
      grid.innerHTML = `<p class="qr-msg">The QR code generator couldn't load. Check your internet connection and refresh the page.</p>`;
    });
  }

  /* ---------- Staff order screen (#/staff) ---------- */
  let staffPoll = null, staffOrders = [], staffSeen = null, staffQ = "", staffSig = "", staffPainted = 0, clockSkew = 0, audioCtx = null;
  const soundOn = () => store.get("staffSound", true);
  const staffToken = () => store.get("staffToken", null);
  const clock = (ms) => new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const ago = (ms) => {
    const m = Math.max(0, Math.round((Date.now() + clockSkew - ms) / 60000));
    return m < 1 ? "just now" : m < 60 ? `${m} min ago` : `${Math.floor(m / 60)} h ${m % 60} min ago`;
  };
  const whereLabel = (o) => (o.method === "table" ? `Table ${o.table}` : `Pickup${o.name ? " · " + o.name : ""}`);
  function orderTotal(items) {
    return items.reduce((n, l) => {
      const p = byId(l.id); if (!p) return n;
      const op = cleanOpts(p, l.opts);
      return n + unitPrice(p, op) * op.qty;
    }, 0) * (1 + BRAND.taxRate);
  }
  function unlockAudio() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
    } catch {}
  }
  function beep() {
    try {
      unlockAudio();
      const t0 = audioCtx.currentTime;
      [[0, 784], [0.2, 1047], [0.4, 1319]].forEach(([d, f]) => {
        const osc = audioCtx.createOscillator(), g = audioCtx.createGain();
        osc.type = "sine"; osc.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0 + d);
        g.gain.exponentialRampToValueAtTime(0.3, t0 + d + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + 0.18);
        osc.connect(g).connect(audioCtx.destination); osc.start(t0 + d); osc.stop(t0 + d + 0.2);
      });
    } catch {}
  }

  /* ---------- Back office shell, sign-in and tabs ---------- */
  const RANKS = { staff: 1, admin: 2, owner: 3 };
  const ROLE_NAME = { staff: "Staff", admin: "Admin", owner: "Owner" };
  const staffRole = () => (RANKS[store.get("staffRole", "")] ? store.get("staffRole", "") : "staff");
  const can = (min) => RANKS[staffRole()] >= RANKS[min];
  const TABS = [
    { id: "orders", t: "Orders", min: "staff" },
    { id: "menu", t: "Menu", min: "admin" },
    { id: "prices", t: "Prices & tax", min: "owner" },
    { id: "shop", t: "Shop info", min: "owner" },
    { id: "access", t: "Access codes", min: "owner" },
  ];
  let staffTab = "orders";
  const mgr = { draft: null, version: null, dirty: false, err: "", conflict: false };
  window.addEventListener("beforeunload", (e) => { if (mgr.dirty) { e.preventDefault(); e.returnValue = ""; } });

  function signOut(msg) {
    store.set("staffToken", null); store.set("staffRole", null);
    mgr.draft = null; mgr.dirty = false; mgr.err = "";
    staffLogin(msg);
  }
  const authFail = (ex) => { if (ex.status === 401) { signOut("Your session ended. Please sign in again."); return true; } return false; };

  function pageStaff(tab) {
    staffTab = TABS.some((t) => t.id === tab) ? tab : "orders";
    return `<div class="staff page-enter" data-staff></div>`;
  }
  function mountStaff() {
    clearInterval(staffPoll);
    staffToken() ? staffShell() : staffLogin();
  }

  function staffLogin(msg) {
    clearInterval(staffPoll);
    document.title = "Back office sign in · " + BRAND.full;
    $$("[data-role-badge]").forEach((el) => (el.textContent = "Back office"));
    const root = $("[data-staff]"); if (!root) return;
    root.onclick = root.oninput = root.onchange = null;
    root.innerHTML = `<div class="staff-login"><form class="staff-login__card" data-staff-login>
      ${$(".logo svg").outerHTML}
      <h1>Back office sign in</h1>
      <p>Enter your staff, admin or owner code.</p>
      <div class="field"><label for="f-pin">Your code</label><input id="f-pin" type="password" autocomplete="current-password" required /></div>
      <p class="form-err" data-login-err role="alert" ${msg ? "" : "hidden"}>${escapeHtml(msg || "")}</p>
      <button class="btn btn--primary btn--lg btn--block" type="submit">Sign in</button>
    </form></div>`;
    const f = $("[data-staff-login]");
    setTimeout(() => $("#f-pin") && $("#f-pin").focus(), 50);
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = f.querySelector("button"), err = $("[data-login-err]");
      unlockAudio();
      btn.disabled = true; btn.textContent = "Signing in…"; err.hidden = true;
      try {
        const r = await api("staff/login", { method: "POST", body: { pin: $("#f-pin").value } });
        store.set("staffToken", r.token); store.set("staffRole", r.role);
        toast(`Signed in as ${ROLE_NAME[r.role]}`);
        staffShell();
      } catch (ex) {
        err.textContent = ex.message; err.hidden = false;
        btn.disabled = false; btn.textContent = "Sign in";
        $("#f-pin").select();
      }
    });
  }

  function staffShell() {
    const root = $("[data-staff]"); if (!root) return;
    clearInterval(staffPoll);
    const tabs = TABS.filter((t) => can(t.min));
    if (!tabs.some((t) => t.id === staffTab)) staffTab = "orders";
    $$("[data-role-badge]").forEach((el) => (el.textContent = `Back office · ${ROLE_NAME[staffRole()]}`));
    document.title = `${TABS.find((t) => t.id === staffTab).t} · ${BRAND.full}`;
    root.innerHTML = `
      <div class="bo-bar">
        <nav class="bo-tabs" aria-label="Back office">${tabs.map((t) => `<a href="#/staff${t.id === "orders" ? "" : "/" + t.id}" class="${t.id === staffTab ? "is-active" : ""}" ${t.id === staffTab ? 'aria-current="page"' : ""}>${t.t}</a>`).join("")}</nav>
        <div class="bo-bar__right">
          <a class="btn" href="#/tables">Table QR codes</a>
          <button class="btn" data-staff-logout>Sign out</button>
        </div>
      </div>
      <div class="bo-panel" data-bo-panel></div>
      <div class="savebar" data-savebar hidden></div>`;
    root.onclick = staffClick;
    root.oninput = root.onchange = mgrInput;
    if (staffTab === "orders") ordersTab();
    else if (staffTab === "access") accessTab();
    else manageTab(staffTab);
  }

  /* ---------- Orders tab ---------- */
  function ordersTab() {
    const panel = $("[data-bo-panel]");
    staffSeen = null; staffSig = "";
    panel.innerHTML = `
      <div class="staff-bar">
        <div class="staff-bar__title"><h1>Orders</h1><small data-staff-sync>Connecting…</small></div>
        <label class="staff-search">${I.search}<input type="search" placeholder="Find order code, table or name" aria-label="Find order code, table or name" data-staff-q value="${escapeHtml(staffQ)}" /></label>
        <div class="staff-bar__actions"><button class="btn" data-sound aria-pressed="${soundOn()}">${I.bell}<span>${soundOn() ? "Sound on" : "Sound off"}</span></button></div>
      </div>
      <div class="staff-cols" data-staff-board></div>
      <details class="staff-done"><summary data-staff-done-sum>Completed today</summary><div class="staff-done__list" data-staff-done></div></details>`;
    $("[data-staff-q]").addEventListener("input", (e) => { staffQ = e.target.value; staffSig = ""; paintStaff(); });
    staffFetch();
    staffPoll = setInterval(staffFetch, 5000);
  }

  async function staffFetch() {
    if (!$("[data-staff-board]")) return clearInterval(staffPoll);
    try {
      const r = await api("staff/orders", { auth: staffToken() });
      if (!$("[data-staff-board]")) return;
      clockSkew = r.now - Date.now();
      const fresh = r.orders.filter((o) => o.status === "new" && staffSeen && !staffSeen.has(o.id));
      staffSeen = new Set(r.orders.map((o) => o.id));
      staffOrders = r.orders;
      if (fresh.length) {
        if (soundOn()) beep();
        toast(fresh.length === 1 ? `New order: ${whereLabel(fresh[0])} (#${fresh[0].code})` : `${fresh.length} new orders`);
      }
      paintStaff();
      const sync = $("[data-staff-sync]");
      sync.textContent = "Live · updated " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" });
      sync.classList.remove("is-off");
    } catch (e) {
      if (authFail(e)) return;
      const sync = $("[data-staff-sync]");
      if (sync) { sync.textContent = "Can't reach the order system. Retrying…"; sync.classList.add("is-off"); }
    }
  }

  function ticket(o) {
    const tbl = o.method === "table";
    const items = o.items.map((l) => {
      const p = byId(l.id);
      if (!p) return `<li><b>?</b><span>Item no longer on the menu <small>${escapeHtml(l.id)}</small></span></li>`;
      const op = cleanOpts(p, l.opts), labels = optLabels(p, op);
      return `<li><b>${op.qty}×</b><span>${p.name}${labels.length ? `<small>${labels.map(escapeHtml).join(" · ")}</small>` : ""}</span></li>`;
    }).join("");
    const t = Date.parse(o.time);
    const when = tbl ? "" : o.time && o.time !== "asap" && !isNaN(t) ? `Pick up at ${clock(t)}` : "Pick up ASAP";
    let actions = "";
    if (o.status === "new") actions = `<button class="link-btn is-danger" data-act="cancel">Cancel</button><button class="btn btn--primary" data-act="preparing">Start preparing</button>`;
    else if (o.status === "preparing") actions = `<button class="btn btn--primary" data-act="ready">${tbl ? "Mark served" : "Mark ready"}</button>`;
    else if (o.status === "ready") actions = `<button class="btn btn--primary" data-act="${o.paid ? "done" : "paid-done"}">${o.paid ? "Complete" : "Paid &amp; complete"}</button>`;
    return `<article class="ticket ticket--${o.status}" data-id="${o.id}">
      <header class="ticket__head">
        <span class="ticket__where ${tbl ? "is-table" : ""}">${tbl ? I.table + " Table " + o.table : I.bag + " Pickup"}</span>
        <span class="ticket__code">#${o.code}</span>
      </header>
      <div class="ticket__meta">${o.name ? `<b>${escapeHtml(o.name)}</b> · ` : ""}${clock(o.created)} · ${ago(o.created)}${when ? ` · <b>${when}</b>` : ""}${o.phone ? ` · ${escapeHtml(o.phone)}` : ""}</div>
      <ul class="ticket__items">${items}</ul>
      ${o.note ? `<p class="ticket__note"><b>Note:</b> ${escapeHtml(o.note)}</p>` : ""}
      <footer class="ticket__foot">
        <div class="ticket__total"><strong>${money(orderTotal(o.items))}</strong>
          <button class="paid-badge ${o.paid ? "is-paid" : ""}" data-act="${o.paid ? "unpaid" : "paid"}" title="${o.paid ? "Mark as not paid" : "Mark as paid"}">${o.paid ? I.check + "Paid" : "Not paid"}</button></div>
        <div class="ticket__actions">${actions}</div>
      </footer>
    </article>`;
  }

  function paintStaff() {
    const board = $("[data-staff-board]"); if (!board) return;
    const q = staffQ.trim().toLowerCase().replace(/^#/, "").replace(/^table\s*/, "");
    const list = staffOrders.filter((o) => !q || o.code.includes(q) || String(o.table || "") === q || (o.name || "").toLowerCase().includes(q));
    const sig = JSON.stringify([list, q]);
    if (sig === staffSig && Date.now() - staffPainted < 30000) return;
    staffSig = sig; staffPainted = Date.now();
    const cols = [
      { k: "new", t: "New", e: "No new orders right now." },
      { k: "preparing", t: "Preparing", e: "Nothing being prepared." },
      { k: "ready", t: "Ready / Served", e: "Nothing waiting for payment." },
    ];
    board.innerHTML = cols.map((c) => {
      const items = list.filter((o) => o.status === c.k);
      return `<section class="staff-col staff-col--${c.k}"><h2>${c.t} <span>${items.length}</span></h2>
        ${items.length ? items.map(ticket).join("") : `<p class="staff-empty">${c.e}</p>`}</section>`;
    }).join("");
    const done = list.filter((o) => o.status === "done" || o.status === "cancelled").reverse();
    const takings = done.filter((o) => o.paid && o.status === "done").reduce((n, o) => n + orderTotal(o.items), 0);
    $("[data-staff-done-sum]").innerHTML = `Completed today <span>${done.length}</span><em>Paid: ${money(takings)}</em>`;
    $("[data-staff-done]").innerHTML = done.length ? done.map((o) => `
      <div class="done-row" data-id="${o.id}">
        <b>#${o.code}</b><span>${escapeHtml(whereLabel(o))}</span><span>${clock(o.updated)}</span><span>${money(orderTotal(o.items))}</span>
        <span class="done-tag ${o.status === "cancelled" ? "is-cancelled" : o.paid ? "is-paid" : ""}">${o.status === "cancelled" ? "Cancelled" : o.paid ? "Paid" : "Not paid"}</span>
        <button class="link-btn" data-act="reopen">Reopen</button>
      </div>`).join("") : `<p class="staff-empty">No completed orders yet today.</p>`;
    const waiting = staffOrders.filter((o) => o.status === "new").length;
    document.title = (waiting ? `(${waiting}) New orders` : "Orders") + " · " + BRAND.full;
  }

  /* ---------- Editing the menu, prices and shop info ---------- */
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const bind = (path, kind = "text") => `data-bind="${escapeHtml(JSON.stringify(path))}" data-kind="${kind}"`;
  function setPath(obj, path, v) {
    const parent = path.slice(0, -1).reduce((o, k) => o[k], obj), last = path[path.length - 1];
    if (v === undefined) delete parent[last]; else parent[last] = v;
  }
  function applyCatalog(cat) {
    const targets = { BRAND, LOCATION, SOCIAL, LEGAL, CATEGORIES, PRODUCTS, SIZES, CUSTOM, OPTION_SETS };
    Object.entries(targets).forEach(([k, t]) => {
      const v = clone(cat[k]);
      if (Array.isArray(t)) t.splice(0, t.length, ...v);
      else { Object.keys(t).forEach((x) => delete t[x]); Object.assign(t, v); }
    });
    renderFooter();
  }

  async function manageTab(tab) {
    const panel = $("[data-bo-panel]");
    if (!mgr.draft) {
      panel.innerHTML = `<p class="bo-loading">Loading…</p>`;
      try {
        const r = await api("manage/catalog", { auth: staffToken() });
        mgr.draft = r.catalog; mgr.version = r.version; mgr.dirty = false; mgr.err = "";
      } catch (ex) {
        if (authFail(ex)) return;
        panel.innerHTML = `<p class="form-err">${escapeHtml(ex.message)}</p>`; return;
      }
      if (!$("[data-bo-panel]") || staffTab !== tab) return;
    }
    panel.innerHTML = tab === "menu" ? menuEditor() : tab === "prices" ? pricesEditor() : shopEditor();
    paintSavebar();
  }

  function mgrInput(e) {
    const el = e.target;
    if (el.matches && el.matches("[data-mgr-art]") && e.type === "change") {
      if (el.value === "") return;
      const i = +el.dataset.mgrArt, from = mgr.draft.PRODUCTS[+el.value];
      mgr.draft.PRODUCTS[i].art = clone(from.art);
      const card = el.closest("[data-item]"); card.querySelector(".mgr-item__art").innerHTML = drawProduct(mgr.draft.PRODUCTS[i]);
      mgr.dirty = true; paintSavebar(); return;
    }
    if (!el.dataset || !el.dataset.bind || !mgr.draft) return;
    const path = JSON.parse(el.dataset.bind), kind = el.dataset.kind;
    let v;
    if (kind === "bool") v = el.checked ? true : undefined;
    else if (kind === "num" || kind === "pct" || kind === "int") {
      const n = Number(el.value);
      const bad = el.value.trim() === "" || !Number.isFinite(n) || (el.min !== "" && n < +el.min) || (el.max !== "" && n > +el.max);
      el.classList.toggle("is-invalid", bad);
      if (bad) return;
      v = kind === "pct" ? Math.round(n * 100) / 10000 : kind === "int" ? Math.round(n) : Math.round(n * 100) / 100;
    } else v = el.value;
    setPath(mgr.draft, path, v);
    mgr.dirty = true; mgr.err = "";
    paintSavebar();
    const card = el.closest("[data-item]");
    if (card) {
      const p = mgr.draft.PRODUCTS[+card.dataset.item];
      card.classList.toggle("is-soldout", !!p.soldOut); card.classList.toggle("is-hidden", !!p.hidden);
    }
  }

  function paintSavebar() {
    const bar = $("[data-savebar]"); if (!bar) return;
    bar.hidden = !mgr.dirty && !mgr.err;
    bar.innerHTML = `<div class="savebar__inner">
      <span>${mgr.err ? `<b class="savebar__err">${escapeHtml(mgr.err)}</b>` : "You have unsaved changes."}</span>
      <div class="savebar__btns">
        ${mgr.conflict ? `<button class="btn" data-mgr="reload">Reload</button>` : `<button class="btn" data-mgr="discard">Discard</button>`}
        <button class="btn btn--primary" data-mgr="save" ${mgr.dirty && !mgr.conflict ? "" : "disabled"}>Save changes</button>
      </div></div>`;
  }

  async function mgrSave(btn) {
    btn.disabled = true; btn.textContent = "Saving…";
    try {
      const r = await api("manage/catalog", { method: "PUT", body: { catalog: mgr.draft, version: mgr.version }, auth: staffToken() });
      applyCatalog(r.catalog);
      mgr.draft = clone(r.catalog); mgr.version = r.version; mgr.dirty = false; mgr.err = ""; mgr.conflict = false;
      toast("Saved. The website is updated.");
      manageTab(staffTab);
    } catch (ex) {
      if (authFail(ex)) return;
      mgr.err = ex.message; mgr.conflict = ex.status === 409;
      paintSavebar();
    }
  }

  const priceBox = (path, val, label, opts = {}) => `<label class="price-in"><span class="price-in__label">${label}</span>
    <span class="price-in__box"><span>${escapeHtml(mgr.draft.BRAND.symbol)}</span><input type="number" step="0.01" ${opts.neg ? "" : 'min="0"'} max="100000" ${bind(path, "num")} value="${Number(val ?? 0).toFixed(2)}" /></span></label>`;
  const textField = (path, label, val, o = {}) => `<div class="field ${o.wide ? "mgr-grid__wide" : ""}"><label>${label}</label>
    <input ${o.type ? `type="${o.type}"` : ""} ${o.min != null ? `min="${o.min}"` : ""} ${o.max != null ? `max="${o.max}"` : ""} ${bind(path, o.kind || "text")} value="${escapeHtml(val ?? "")}" ${o.len ? `maxlength="${o.len}"` : ""} ${o.ph ? `placeholder="${escapeHtml(o.ph)}"` : ""} />
    ${o.hint ? `<small class="muted">${o.hint}</small>` : ""}</div>`;

  function menuEditor() {
    const d = mgr.draft, owner = can("owner");
    const cats = d.CATEGORIES.flatMap((g, gi) => g.items.map((c, ci) => ({ ...c, gi, ci })));
    return `<div class="mgr">
      <header class="mgr__head"><h1>Menu</h1>
        <p>Rename items and categories, edit descriptions, or mark items <b>sold out</b> (still shown, can't be ordered) or <b>hidden</b> (removed from the website). Changes go live when you save.</p>
        ${owner ? `<p class="mgr__note">${I.info}<span>New items start hidden, so you can finish them before customers see them.</span></p>`
                : `<p class="mgr__note">${I.info}<span>Only the owner can change prices or pictures, or add and remove items.</span></p>`}
      </header>
      ${cats.map((c) => {
        const items = d.PRODUCTS.map((p, i) => ({ p, i })).filter((x) => x.p.cat === c.id);
        return `<section class="mgr-cat">
          <header class="mgr-cat__head">
            <input class="mgr-cat__name" ${bind(["CATEGORIES", c.gi, "items", c.ci, "name"])} value="${escapeHtml(c.name)}" aria-label="Category name" maxlength="60" />
            <span class="muted">${items.length} item${items.length === 1 ? "" : "s"}</span>
            ${owner ? `<button class="btn" data-mgr="add" data-cat="${c.id}">${I.plus}<span>Add item</span></button>` : ""}
          </header>
          ${items.map(({ p, i }) => itemEditor(p, i, cats, owner)).join("") || `<p class="staff-empty">No items in this category yet.</p>`}
        </section>`;
      }).join("")}
    </div>`;
  }

  function itemEditor(p, i, cats, owner) {
    const d = mgr.draft;
    return `<article class="mgr-item ${p.soldOut ? "is-soldout" : ""} ${p.hidden ? "is-hidden" : ""}" data-item="${i}">
      <div class="mgr-item__row">
        <span class="art-frame mgr-item__art">${drawProduct(p)}</span>
        <div class="mgr-item__main">
          <input class="mgr-item__name" ${bind(["PRODUCTS", i, "name"])} value="${escapeHtml(p.name)}" maxlength="80" aria-label="Item name" />
          <span class="mgr-item__tags"><span class="tag tag--sold">Sold out</span><span class="tag tag--hidden">Hidden</span></span>
        </div>
        <div class="mgr-item__price">${owner
          ? `<span class="price-in__box"><span>${escapeHtml(d.BRAND.symbol)}</span><input type="number" min="0" max="100000" step="0.01" ${bind(["PRODUCTS", i, "price"], "num")} value="${Number(p.price).toFixed(2)}" aria-label="Price" /></span>`
          : `<b>${escapeHtml(d.BRAND.symbol)}${Number(p.price).toFixed(2)}</b>`}</div>
        <label class="switch"><input type="checkbox" ${bind(["PRODUCTS", i, "soldOut"], "bool")} ${p.soldOut ? "checked" : ""} /><span>Sold out</span></label>
        <label class="switch"><input type="checkbox" ${bind(["PRODUCTS", i, "hidden"], "bool")} ${p.hidden ? "checked" : ""} /><span>Hidden</span></label>
        <button class="link-btn" data-mgr="more" aria-expanded="false">Details</button>
      </div>
      <div class="mgr-item__more" hidden>
        <div class="mgr-grid">
          <div class="field mgr-grid__wide"><label>Description</label><textarea ${bind(["PRODUCTS", i, "desc"])} maxlength="400">${escapeHtml(p.desc || "")}</textarea></div>
          <div class="field"><label>Category</label><select ${bind(["PRODUCTS", i, "cat"])}>${cats.map((c) => `<option value="${c.id}" ${c.id === p.cat ? "selected" : ""}>${escapeHtml(c.name)}</option>`).join("")}</select>${I.chev}</div>
          ${textField(["PRODUCTS", i, "sub"], "Section within the category", p.sub, { len: 80, hint: "Items with the same section are grouped together." })}
          <label class="check"><input type="checkbox" ${bind(["PRODUCTS", i, "featured"], "bool")} ${p.featured ? "checked" : ""} /> Show in “Customer favorites” on the homepage</label>
          <label class="check"><input type="checkbox" ${bind(["PRODUCTS", i, "isNew"], "bool")} ${p.isNew ? "checked" : ""} /> Show a “New” badge</label>
          ${owner ? `
          <div class="field"><label>Picture</label><select data-mgr-art="${i}"><option value="">Keep this picture</option>${d.PRODUCTS.map((x, j) => (j === i ? "" : `<option value="${j}">Same picture as ${escapeHtml(x.name)}</option>`)).join("")}</select>${I.chev}</div>
          <div class="mgr-danger"><button class="link-btn is-danger" data-mgr="delete">Delete this item</button></div>` : ""}
        </div>
      </div>
    </article>`;
  }

  function pricesEditor() {
    const d = mgr.draft, cats = d.CATEGORIES.flatMap((g) => g.items);
    const items = d.PRODUCTS.map((p, i) => ({ p, i }));
    return `<div class="mgr">
      <header class="mgr__head"><h1>Prices &amp; tax</h1><p>Only the owner can see this page. New prices apply to orders placed after you save.</p></header>
      <section class="mgr-card"><h2>Tax and currency</h2><div class="mgr-grid">
        ${textField(["BRAND", "taxRate"], "Tax rate (%)", +(d.BRAND.taxRate * 100).toFixed(2), { type: "number", kind: "pct", min: 0, max: 50, hint: "Added to every order. Use 0 if prices already include tax." })}
        ${textField(["BRAND", "symbol"], "Currency symbol", d.BRAND.symbol, { len: 6, hint: "Shown before every price, for example $, ETB or Br." })}
      </div></section>
      <section class="mgr-card"><h2>Menu item prices</h2><p class="muted">Drink prices are for each drink's default cup size.</p>
        ${cats.map((c) => `<h3 class="mgr-sub">${escapeHtml(c.name)}</h3><div class="price-list">${items.filter((x) => x.p.cat === c.id).map(({ p, i }) => priceBox(["PRODUCTS", i, "price"], p.price, escapeHtml(p.name))).join("")}</div>`).join("")}
      </section>
      <section class="mgr-card"><h2>Cup sizes</h2><p class="muted">Price difference from a drink's default size (Medium for most drinks). Use a minus sign for a cheaper size.</p>
        <div class="price-list">${d.SIZES.map((s, i) => priceBox(["SIZES", i, "add"], s.add, `${escapeHtml(s.name)} <small class="muted">${escapeHtml(s.oz)}</small>`, { neg: true })).join("")}</div>
      </section>
      <section class="mgr-card"><h2>Milk and extras</h2>
        <h3 class="mgr-sub">Milk (extra charge)</h3><div class="price-list">${d.CUSTOM.milk.map((m) => priceBox(["CUSTOM", "milkUpcharge", m], d.CUSTOM.milkUpcharge[m] || 0, escapeHtml(m))).join("")}</div>
        <h3 class="mgr-sub">Espresso and syrups</h3><div class="price-list">${priceBox(["CUSTOM", "shotPrice"], d.CUSTOM.shotPrice ?? 0.9, "Each extra espresso shot")}${priceBox(["CUSTOM", "syrupPrice"], d.CUSTOM.syrupPrice ?? 0.6, "Each flavor syrup")}</div>
        <h3 class="mgr-sub">Toppings (extra charge)</h3><div class="price-list">${d.CUSTOM.toppings.map((t) => priceBox(["CUSTOM", "toppingUpcharge", t], d.CUSTOM.toppingUpcharge[t] || 0, escapeHtml(t))).join("")}</div>
      </section>
      ${Object.entries(d.OPTION_SETS).map(([k, fields]) => fields.map((f, fi) => f.type !== "select" ? "" : `
        <section class="mgr-card"><h2>${k === "cake" ? "Whole cake sizes" : escapeHtml(f.label)}</h2><p class="muted">Extra charge added to the cake's price.</p>
          <div class="price-list">${f.choices.map((ch, ci) => priceBox(["OPTION_SETS", k, fi, "choices", ci, "add"], ch.add, escapeHtml(ch.name))).join("")}</div></section>`).join("")).join("")}
    </div>`;
  }

  function shopEditor() {
    const d = mgr.draft;
    return `<div class="mgr">
      <header class="mgr__head"><h1>Shop info</h1><p>These details appear in the footer, on the “Visit us” card and in your Privacy Policy and Terms.</p></header>
      <section class="mgr-card"><h2>Shop and contact</h2><div class="mgr-grid">
        ${textField(["BRAND", "full"], "Business name", d.BRAND.full, { len: 80 })}
        ${textField(["LOCATION", "name"], "Shop name on contact cards", d.LOCATION.name, { len: 80 })}
        ${textField(["LOCATION", "address"], "Address", d.LOCATION.address, { len: 160, wide: true, ph: "e.g. Bole Road, near Edna Mall, Addis Ababa" })}
        ${textField(["LOCATION", "hours"], "Opening hours", d.LOCATION.hours, { len: 160, wide: true, ph: "e.g. Mon–Sun · 6:30 AM – 9:00 PM" })}
        ${textField(["LOCATION", "phone"], "Phone", d.LOCATION.phone, { len: 40, type: "tel" })}
        ${textField(["LOCATION", "email"], "Email", d.LOCATION.email, { len: 120, type: "email" })}
        ${textField(["LOCATION", "mapUrl"], "Map link (optional)", d.LOCATION.mapUrl, { len: 300, wide: true, ph: "https://maps.google.com/…", hint: "Must start with https://" })}
        ${textField(["LOCATION", "tables"], "Number of tables", d.LOCATION.tables, { type: "number", kind: "int", min: 1, max: 99, hint: "Used for the table picker and the QR code page." })}
      </div></section>
      <section class="mgr-card"><h2>Social media</h2><p class="muted">Only the links you fill in are shown in the footer. Each must start with https://</p><div class="mgr-grid">
        ${textField(["SOCIAL", "instagram"], "Instagram", d.SOCIAL.instagram, { len: 300, ph: "https://instagram.com/…" })}
        ${textField(["SOCIAL", "facebook"], "Facebook", d.SOCIAL.facebook, { len: 300, ph: "https://facebook.com/…" })}
        ${textField(["SOCIAL", "tiktok"], "TikTok", d.SOCIAL.tiktok, { len: 300, ph: "https://tiktok.com/@…" })}
      </div></section>
      <section class="mgr-card"><h2>Legal details</h2><div class="mgr-grid">
        ${textField(["LEGAL", "owner"], "Registered business name", d.LEGAL.owner, { len: 120 })}
        ${textField(["LEGAL", "country"], "Country (law for the Terms of Use)", d.LEGAL.country, { len: 80 })}
        ${textField(["LEGAL", "updated"], "Policies last updated", d.LEGAL.updated, { len: 40, hint: "Change this date whenever you edit the policies." })}
        ${textField(["LEGAL", "personalDataDays"], "Keep customer names and phone numbers for (days)", d.LEGAL.personalDataDays, { type: "number", kind: "int", min: 1, max: 3650, hint: "After this, they're erased from old orders automatically." })}
      </div></section>
    </div>`;
  }

  async function accessTab() {
    const panel = $("[data-bo-panel]");
    panel.innerHTML = `<p class="bo-loading">Loading…</p>`;
    let info = {};
    try { info = (await api("manage/access", { auth: staffToken() })).roles; }
    catch (ex) { if (authFail(ex)) return; panel.innerHTML = `<p class="form-err">${escapeHtml(ex.message)}</p>`; return; }
    if (!$("[data-bo-panel]") || staffTab !== "access") return;
    const roles = [
      { r: "staff", t: "Staff", d: "See and update orders.", hint: "6–12 digits", num: true },
      { r: "admin", t: "Admin", d: "Everything staff can do, plus edit menu names, descriptions and categories, and mark items sold out or hidden.", hint: "6–12 digits", num: true },
      { r: "owner", t: "Owner", d: "Full control: prices and tax, adding and removing items, shop info and everyone's codes.", hint: "8 or more characters", num: false },
    ];
    panel.innerHTML = `<div class="mgr">
      <header class="mgr__head"><h1>Access codes</h1><p>Everyone signs in with the code for their level. Changing a code signs out every device still using the old one.</p></header>
      <div class="access-grid">${roles.map((x) => `<form class="mgr-card access-card" data-access="${x.r}">
        <h2>${x.t}</h2><p>${x.d}</p>
        <p class="muted">Last changed: ${info[x.r] && info[x.r].changed ? new Date(info[x.r].changed).toLocaleDateString() : "—"}</p>
        <div class="field"><label for="ac-${x.r}">New ${x.t.toLowerCase()} code <span class="muted">(${x.hint})</span></label><input id="ac-${x.r}" type="password" ${x.num ? 'inputmode="numeric"' : ""} autocomplete="new-password" required /></div>
        <div class="field"><label for="ac2-${x.r}">Type it again</label><input id="ac2-${x.r}" type="password" ${x.num ? 'inputmode="numeric"' : ""} autocomplete="new-password" required /></div>
        <p class="form-err" data-access-err role="alert" hidden></p>
        <button class="btn btn--primary" type="submit">Change ${x.t.toLowerCase()} code</button>
      </form>`).join("")}</div>
      <p class="mgr__note">${I.info}<span>Forgot the owner code? Someone with access to the server can set a new one by running <code>python server.py set-code owner NEW-CODE</code>.</span></p>
    </div>`;
    $$("[data-access]").forEach((f) => f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const role = f.dataset.access, a = $(`#ac-${role}`).value, b = $(`#ac2-${role}`).value, err = f.querySelector("[data-access-err]"), btn = f.querySelector("button");
      err.hidden = true;
      if (a !== b) { err.textContent = "The two codes don't match."; err.hidden = false; return; }
      btn.disabled = true;
      try {
        await api("manage/access", { method: "POST", body: { role, code: a }, auth: staffToken() });
        if (role === staffRole()) return signOut("Your code was changed. Please sign in with the new code.");
        toast(`The ${role} code was changed`);
        accessTab();
      } catch (ex) {
        if (authFail(ex)) return;
        err.textContent = ex.message; err.hidden = false; btn.disabled = false;
      }
    }));
  }

  function mgrAdd(catId) {
    const d = mgr.draft, same = d.PRODUCTS.filter((p) => p.cat === catId), last = same[same.length - 1];
    let id; do { id = "item-" + Math.random().toString(36).slice(2, 8); } while (d.PRODUCTS.some((p) => p.id === id));
    const item = { id, cat: catId, sub: last ? last.sub : "New items", name: "New item", price: 0, desc: "",
      art: last ? clone(last.art) : { type: "cake", body: "#f3d9a4", frost: "#fffaf2", deco: "#f2c84b" }, hidden: true };
    if (last && last.milk) item.milk = last.milk === "No Milk" ? "No Milk" : "2% Milk";
    const at = last ? d.PRODUCTS.indexOf(last) + 1 : d.PRODUCTS.length;
    d.PRODUCTS.splice(at, 0, item);
    mgr.dirty = true; mgr.err = "";
    manageTab("menu").then(() => {
      const card = $(`[data-item="${at}"]`); if (!card) return;
      card.querySelector(".mgr-item__more").hidden = false;
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      const name = card.querySelector(".mgr-item__name"); name.focus(); name.select();
    });
  }

  async function staffClick(e) {
    if (e.target.closest("[data-staff-logout]")) {
      if (mgr.dirty && !confirm("You have unsaved changes. Sign out and lose them?")) return;
      return signOut();
    }
    const snd = e.target.closest("[data-sound]");
    if (snd) {
      store.set("staffSound", !soundOn());
      if (soundOn()) beep();
      snd.setAttribute("aria-pressed", soundOn()); snd.querySelector("span").textContent = soundOn() ? "Sound on" : "Sound off";
      return;
    }
    const m = e.target.closest("[data-mgr]");
    if (m) {
      const act = m.dataset.mgr, card = m.closest("[data-item]");
      if (act === "save") return mgrSave(m);
      if (act === "discard" || act === "reload") {
        if (act === "discard" && !confirm("Throw away your unsaved changes?")) return;
        mgr.draft = null; mgr.dirty = false; mgr.err = ""; mgr.conflict = false;
        return manageTab(staffTab);
      }
      if (act === "more") {
        const more = card.querySelector(".mgr-item__more"); more.hidden = !more.hidden;
        m.setAttribute("aria-expanded", String(!more.hidden)); m.textContent = more.hidden ? "Details" : "Close";
        return;
      }
      if (act === "add") return mgrAdd(m.dataset.cat);
      if (act === "delete") {
        const i = +card.dataset.item, p = mgr.draft.PRODUCTS[i];
        if (!confirm(`Delete “${p.name}” from the menu? You can still discard this before saving.`)) return;
        mgr.draft.PRODUCTS.splice(i, 1); mgr.dirty = true;
        return manageTab("menu");
      }
      return;
    }
    const b = e.target.closest("[data-act]"); if (!b) return;
    const o = staffOrders.find((x) => x.id === b.closest("[data-id]").dataset.id); if (!o) return;
    const act = b.dataset.act;
    const body = {
      preparing: { status: "preparing" }, ready: { status: "ready" }, done: { status: "done" },
      "paid-done": { status: "done", paid: true }, paid: { paid: true }, unpaid: { paid: false },
      cancel: { status: "cancelled" }, reopen: { status: o.status === "cancelled" ? "new" : "ready" },
    }[act];
    if (act === "cancel" && !confirm(`Cancel order #${o.code} (${whereLabel(o)})?`)) return;
    b.disabled = true;
    try {
      const r = await api("staff/orders/" + o.id, { method: "PATCH", body, auth: staffToken() });
      Object.assign(o, r); staffSig = ""; paintStaff();
    } catch (ex) {
      if (authFail(ex)) return;
      b.disabled = false; toast(ex.message);
    }
  }

  function pageNotFound() {
    return `<div class="empty page-enter">${I.bagEmpty}<h2>We couldn't find that page</h2><p>It may have moved, or the link might be incorrect.</p><a class="btn btn--primary btn--lg" href="#/menu">See the menu</a></div>`;
  }

  /* ============================================================
     ROUTER
     ============================================================ */
  function render() {
    const hash = location.hash.replace(/^#/, "") || "/";
    const [path, query] = hash.split("?");
    const parts = path.split("/").filter(Boolean);
    const params = new URLSearchParams(query || "");
    let html, mount, nav = "";

    switch (parts[0]) {
      case undefined: html = pageHome(); break;
      case "menu":
        html = parts[1] ? pageCategory(parts[1]) : pageMenu(); nav = parts[1] === "cakes" ? "cakes" : "menu"; break;
      case "product":
        html = pageProduct(parts[1], params.has("edit") ? +params.get("edit") : null);
        mount = byId(parts[1]) && mountProduct; nav = byId(parts[1]) && byId(parts[1]).cat === "cakes" ? "cakes" : "menu"; break;
      case "cart": html = pageCart(); mount = mountCart; nav = "menu"; break;
      case "order": html = pageOrder(parts[1]); mount = () => mountOrder(parts[1]); break;
      case "coffee": html = pageCoffee(); nav = "coffee"; break;
      case "privacy": html = pagePrivacy(); mount = mountLegal; break;
      case "terms": html = pageTerms(); mount = mountLegal; break;
      case "accessibility": html = pageAccessibility(); mount = mountLegal; break;
      case "allergens": html = pageAllergens(); mount = mountLegal; break;
      case "tables": html = pageTables(); mount = mountTables; break;
      case "staff": html = pageStaff(parts[1]); mount = mountStaff; break;
      case "table": {
        const n = Number(parts[1]);
        if (validTable(n)) {
          setMode("table", n);
          location.replace("#/menu");
          toast(`Welcome! You're ordering for Table ${n}.`);
          return;
        }
        html = pageNotFound(); break;
      }
      default: html = pageNotFound();
    }
    document.body.classList.toggle("is-staff", parts[0] === "staff" || parts[0] === "tables");
    if (parts[0] !== "staff") document.title = BRAND.full;
    main.innerHTML = html;
    if (mount) mount();
    $$(".nav__link").forEach((a) => a.classList.toggle("is-active", a.dataset.nav === nav));
    closeDrawer();
    updateBag();
  }

  let lastPath = "";
  window.addEventListener("hashchange", () => {
    const p = location.hash.split("?")[0];
    render();
    if (p !== lastPath) window.scrollTo({ top: 0, behavior: "instant" });
    lastPath = p;
  });
  lastPath = location.hash.split("?")[0];
  render();
})();
