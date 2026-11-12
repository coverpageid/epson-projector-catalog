/* Epson Projector Catalog — vanilla JS, no build step */
(() => {
  "use strict";
  const P = window.PRODUCTS || [];
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const ICON = {
    all: '<path d="M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z"/>',
    xga: '<path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2v2h-2v-2H9v2H7v-2H5a2 2 0 0 1-2-2V7zm12 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>',
    wxga: '<path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm2 0v10h16V6H4zm4 14h8v2H8z"/>',
    fhd: '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm2 5v6h2v-2h2v2h2V9h-2v2H8V9H6zm8 0v6h3a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-3zm2 1.8h1v2.4h-1v-2.4z"/>',
    short: '<path d="M4 4h2v16H4V4zm14 3l-8 5 8 5V7z"/>',
    laser: '<path d="M12 2l2.2 6.2L20 10l-5.8 1.8L12 18l-2.2-6.2L4 10l5.8-1.8L12 2zm6 13l1 2.8L22 19l-3 1.2L18 23l-1-2.8L14 19l3-1.2L18 15z"/>',
    venue: '<path d="M3 5h18v11H3V5zm2 2v7h14V7H5zm-3 11h20v2H2v-2z"/>',
    plus: '<path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/>',
    check: '<path d="M9.5 16.2 5.3 12l-1.4 1.4 5.6 5.6L20.1 8.4 18.7 7z"/>',
    ext: '<path d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14zM5 5h6v2H6v11h11v-5h2v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/>',
    share: '<path d="M12 2l4 4-1.4 1.4L13 5.8V15h-2V5.8L9.4 7.4 8 6zM5 10h3v2H6v8h12v-8h-2v-2h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1z"/>',
  };
  const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k] || ICON.xga}</svg>`;

  const CATS = [
    { id: "all", label: "Semua Proyektor", desc: "Seluruh lini proyektor 3LCD Epson Corporate & Education — warna cerah, tajam dan andal." },
    { id: "xga", label: "XGA · Kelas & Rapat", desc: "Proyektor rasio 4:3 (1024×768) ekonomis dan terang untuk ruang kelas maupun ruang rapat." },
    { id: "wxga", label: "WXGA · Layar Lebar", desc: "Resolusi layar lebar 16:10 (1280×800) ideal untuk presentasi laptop modern." },
    { id: "fhd", label: "Full HD & WUXGA", desc: "Ketajaman tinggi 1080p dan WUXGA (1920×1200) untuk presentasi detail & multimedia." },
    { id: "short", label: "Short Throw", desc: "Proyeksi layar besar dari jarak dekat — meminimalkan bayangan dan silau presenter." },
    { id: "laser", label: "Proyektor Laser", desc: "Sumber cahaya laser dengan kontras > 5.000.000:1 dan umur pakai hingga 20.000 jam." },
    { id: "venue", label: "Ruang Besar · 5000+ lm", desc: "Kecerahan tinggi 5.000 – 5.500 lumens untuk aula, auditorium dan ruang konferensi besar." },
  ];
  const FEATURES = [
    { id: "laser", label: "Sumber Laser", test: (p) => p.lightSource === "Laser" },
    { id: "wifibuiltin", label: "Wi-Fi Built-in", test: (p) => p.wifiBuiltin },
    { id: "wifi", label: "Mendukung Wi-Fi", test: (p) => p.wifi },
    { id: "lan", label: "RJ45 LAN", test: (p) => p.lan },
    { id: "hdmi2", label: "Dual HDMI (2×)", test: (p) => p.hdmi >= 2 },
    { id: "short", label: "Short Throw", test: (p) => p.shortThrow },
    { id: "mirror", label: "Screen Mirroring", test: (p) => p.mirroring },
    { id: "spk16", label: "Speaker 16W", test: (p) => p.speaker === "16W" },
    { id: "lm4000", label: "≥ 4.000 Lumens", test: (p) => p.lumens >= 4000 },
    { id: "tkdn", label: "TKDN", test: (p) => p.tkdn },
    { id: "new", label: "Baru 2026", test: (p) => p.isNew },
  ];
  const RES_INFO = {
    "XGA":     { pixels: "1024 × 768 · Rasio 4:3", desc: "Standar ruang kelas & presentasi dokumen dasar", color: "#0a84ff" },
    "WXGA":    { pixels: "1280 × 800 · Rasio 16:10", desc: "Layar lebar standar laptop bisnis & kantor", color: "#30d158" },
    "Full HD": { pixels: "1920 × 1080 · Rasio 16:9", desc: "Ketajaman 1080p untuk video, desain & ruang rapat modern", color: "#af52de" },
    "WUXGA":   { pixels: "1920 × 1200 · Rasio 16:10", desc: "Resolusi tertinggi untuk spreadsheet & aula konferensi", color: "#ff9f0a" },
  };
  const catLabel = (id) => CATS.find((c) => c.id === id)?.label || id;

  const state = {
    cat: "all", features: new Set(), res: null, q: "", sort: "default",
    view: localStorage.getItem("view") || "grid",
    compare: JSON.parse(localStorage.getItem("compare_proj") || "[]").filter((m) => P.some((p) => p.model === m)),
  };

  /* ---------- Theme & clock (auto-follows device OS theme) ---------- */
  const root = document.documentElement;
  const params = new URLSearchParams(location.search);
  const mq = matchMedia("(prefers-color-scheme: dark)");
  let manualTheme = params.get("theme") || sessionStorage.getItem("theme_override");
  const applyTheme = (t) => { root.dataset.theme = t; };
  applyTheme(manualTheme || (mq.matches ? "dark" : "light"));
  mq.addEventListener("change", (e) => {
    sessionStorage.removeItem("theme_override");
    manualTheme = null;
    applyTheme(e.matches ? "dark" : "light");
  });
  $("#themeBtn").onclick = () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    sessionStorage.setItem("theme_override", next);
    applyTheme(next);
  };
  const tick = () => {
    const d = new Date();
    $("#clock").textContent = d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" }) + "  " +
      d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };
  tick(); setInterval(tick, 15000);

  /* ---------- Sidebar ---------- */
  const CAT_SHORT = { all: "Semua", xga: "XGA", wxga: "WXGA", fhd: "Full HD+", short: "Short Throw", laser: "Laser", venue: "5000+ lm" };
  function renderSidebar() {
    $("#categoryList").innerHTML = CATS.map((c) => {
      const n = c.id === "all" ? P.length : P.filter((p) => p.category === c.id).length;
      return `<li><button class="side-item ${state.cat === c.id ? "active" : ""}" data-cat="${c.id}">
        <span class="ico">${svg(c.id)}</span>${c.label}<span class="count">${n}</span></button></li>`;
    }).join("");
    $("#featureList").innerHTML = FEATURES.map((f) => `<li><button class="side-item ${state.features.has(f.id) ? "active" : ""}" data-feat="${f.id}">
        <span class="check"></span>${f.label}<span class="count">${P.filter(f.test).length}</span></button></li>`).join("");
    $("#resList").innerHTML = Object.keys(RES_INFO).map((k) =>
      `<button class="ink-tag ${state.res === k ? "active" : ""}" data-res="${k}">${k}</button>`).join("");
    if ($("#chapterNav")) {
      $("#chapterNav").innerHTML = CATS.map((c) =>
        `<button class="chapter-item ${state.cat === c.id ? "active" : ""}" data-cat="${c.id}">
          <span class="chapter-ico">${svg(c.id)}</span>
          <span class="chapter-lbl">${CAT_SHORT[c.id] || c.label}</span>
        </button>`).join("");
    }
    if ($("#mobileFeatureBar")) {
      $("#mobileFeatureBar").innerHTML = `<span class="sf-label">Fitur</span>` +
        FEATURES.map((f) => `<button class="sf-pill ${state.features.has(f.id) ? "active" : ""}" data-feat="${f.id}">${f.label}</button>`).join("");
    }
    if ($("#mobileResBar")) {
      $("#mobileResBar").innerHTML = `<span class="sf-label">Resolusi</span>` +
        Object.keys(RES_INFO).map((k) => `<button class="sf-pill ${state.res === k ? "active" : ""}" data-res="${k}">
          <span class="sf-dots"><i style="background:${RES_INFO[k].color}"></i></span>${k}</button>`).join("");
    }
    const tags = [
      ...[...state.features].map((id) => `<button class="af-chip" data-feat="${id}">${FEATURES.find((f) => f.id === id).label} ×</button>`),
      ...(state.res ? [`<button class="af-chip" data-res="${state.res}">${state.res} ×</button>`] : []),
    ];
    const af = $("#activeFilters");
    if (af) { af.innerHTML = tags.join(""); af.hidden = !tags.length; }
    const activeCount = state.features.size + (state.res ? 1 : 0);
    const fb = $("#filterBadge"), fp = $("#filterBtn");
    if (fb) { fb.textContent = activeCount; fb.hidden = activeCount === 0; }
    if (fp) fp.classList.toggle("active", activeCount > 0);
    if ($("#sheetApply")) $("#sheetApply").textContent = `Tampilkan ${filtered().length} proyektor`;
  }
  const toggleDrawer = (open) => {
    const sb = $("#sidebar"), bd = $("#drawerBackdrop");
    const show = open ?? !sb.classList.contains("open");
    sb.classList.toggle("open", show);
    if (bd) bd.hidden = !show;
  };
  if ($("#filterBtn")) $("#filterBtn").onclick = () => toggleDrawer();
  if ($("#drawerClose")) $("#drawerClose").onclick = () => toggleDrawer(false);
  if ($("#sheetApply")) $("#sheetApply").onclick = () => toggleDrawer(false);
  if ($("#sheetReset")) $("#sheetReset").onclick = () => { state.cat = "all"; state.res = null; state.features.clear(); update(); };
  if ($("#drawerBackdrop")) $("#drawerBackdrop").onclick = () => toggleDrawer(false);
  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-cat]"); if (c) { state.cat = c.dataset.cat; update(); return; }
    const f = e.target.closest("[data-feat]");
    if (f) { state.features.has(f.dataset.feat) ? state.features.delete(f.dataset.feat) : state.features.add(f.dataset.feat); update(); return; }
    const r = e.target.closest("[data-res]");
    if (r) { state.res = state.res === r.dataset.res ? null : r.dataset.res; closeModal(); update(); }
  });

  /* ---------- Filtering ---------- */
  const haystack = (p) => [p.model, p.name, p.tagline, p.sku, p.resolution, p.aspect, p.lightSource, `${p.lumens}`, p.lumensText,
    catLabel(p.category), p.wifi && "wifi wi-fi wireless", p.lan && "lan rj45 ethernet", p.shortThrow && "short throw",
    p.mirroring && "mirroring miracast", p.tkdn && `tkdn ${p.tkdnScore} ${p.tkdnCert}`, p.isNew && "baru new 2026"].join(" ").toLowerCase();
  function filtered() {
    const q = state.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let list = P.filter((p) =>
      (state.cat === "all" || p.category === state.cat) &&
      [...state.features].every((id) => FEATURES.find((f) => f.id === id).test(p)) &&
      (!state.res || p.resolution === state.res) &&
      q.every((t) => haystack(p).includes(t)));
    const kg = (p) => parseFloat((p.weight || "").replace(",", ".")) || 999;
    if (state.sort === "lumens") list = [...list].sort((a, b) => b.lumens - a.lumens);
    if (state.sort === "name") list = [...list].sort((a, b) => a.model.localeCompare(b.model, "en", { numeric: true }));
    if (state.sort === "new") list = [...list].sort((a, b) => b.isNew - a.isNew);
    if (state.sort === "weight") list = [...list].sort((a, b) => kg(a) - kg(b));
    return list;
  }

  /* ---------- Cards ---------- */
  function pills(p) {
    const out = [];
    out.push(`<span class="pill blue">${p.lumens.toLocaleString("id-ID")} lm</span>`);
    out.push(`<span class="pill">${p.resolution}</span>`);
    if (p.lightSource === "Laser") out.push('<span class="pill purple">Laser</span>');
    if (p.shortThrow) out.push('<span class="pill orange">Short Throw</span>');
    if (p.wifiBuiltin) out.push('<span class="pill green">Wi-Fi Built-in</span>');
    else if (p.wifi) out.push('<span class="pill">Wi-Fi Opsional</span>');
    if (p.tkdn) out.push(`<span class="pill red">TKDN ${esc(p.tkdnScore || "")}</span>`);
    return out.join("");
  }
  const imgTag = (p, cls = "") => p.image
    ? `<img src="${p.image}" alt="${esc(p.name)}" loading="lazy" class="${cls}" />`
    : `<div class="${cls}" style="display:grid;place-items:center;color:#aaa">${svg("xga")}</div>`;

  function renderGrid() {
    const list = filtered();
    const cat = CATS.find((c) => c.id === state.cat);
    $("#paneTitle").textContent = cat.label;
    $("#paneCount").textContent = `${list.length} proyektor`;
    const isHome = state.cat === "all" && !state.features.size && !state.res && !state.q;
    $("#hero").innerHTML = `<h2>${isHome ? "Epson 3LCD Projectors" : esc(cat.label)}</h2><p>${esc(cat.desc)}</p>` + (isHome ? `
      <div class="stats">
        <div class="stat"><b>${P.length}</b><span>Model proyektor</span></div>
        <div class="stat"><b>${P.filter((p) => p.isNew).length}</b><span>Model baru 2026</span></div>
        <div class="stat"><b>${P.filter((p) => p.lightSource === "Laser").length}</b><span>Proyektor Laser</span></div>
        <div class="stat"><b>s.d. 5.500</b><span>Lumens kecerahan</span></div>
        <div class="stat"><b>3LCD</b><span>100% Colour Brightness</span></div>
      </div>` : "");
    const g = $("#grid");
    g.className = "grid" + (state.view === "list" ? " list" : "");
    g.innerHTML = list.map((p, i) => `
      <article class="card" style="animation-delay:${Math.min(i, 16) * 25}ms">
        ${p.isNew ? '<span class="badge-new">Baru</span>' : p.tkdn ? `<span class="badge-new tkdn">TKDN ${esc(p.tkdnScore || "")}</span>` : p.lightSource === "Laser" ? '<span class="badge-new tkdn">Laser</span>' : ""}
        <button class="cmp-toggle ${state.compare.includes(p.model) ? "on" : ""}" data-cmp="${p.model}" title="Tambah ke perbandingan" aria-label="Bandingkan ${p.model}">
          ${svg(state.compare.includes(p.model) ? "check" : "plus")}</button>
        <button class="card-img" data-open="${p.model}" aria-label="Detail ${esc(p.name)}">${imgTag(p)}</button>
        <div class="card-body">
          <div class="card-head"><div><div class="series">${esc(catLabel(p.category))}</div><h3>${esc(p.model)}</h3></div></div>
          <p>${esc(p.tagline)}</p>
          <div class="pills">${pills(p)}</div>
          <div class="card-actions"><button class="btn small" data-open="${p.model}">Lihat detail</button></div>
        </div>
      </article>`).join("");
    $("#empty").hidden = list.length > 0;
  }

  $$(".segmented button").forEach((b) => b.onclick = () => { state.view = b.dataset.view; localStorage.setItem("view", state.view); update(); });
  $("#sortSelect").onchange = (e) => { state.sort = e.target.value; update(); };
  $("#searchInput").oninput = (e) => { state.q = e.target.value; renderGrid(); };
  $("#resetBtn").onclick = () => { Object.assign(state, { cat: "all", res: null, q: "" }); state.features.clear(); $("#searchInput").value = ""; update(); };

  function update() {
    renderSidebar(); renderGrid(); renderDock();
    $$(".segmented button").forEach((b) => b.classList.toggle("active", b.dataset.view === state.view));
  }

  /* ---------- Compare dock ---------- */
  function renderDock() {
    localStorage.setItem("compare_proj", JSON.stringify(state.compare));
    $("#dock").hidden = !state.compare.length;
    $("#dockItems").innerHTML = state.compare.map((m) => {
      const p = P.find((x) => x.model === m);
      return `<button class="dock-item" data-cmp="${m}" title="Hapus ${m}">${imgTag(p)}<span>${m} · klik untuk hapus</span></button>`;
    }).join("");
    $("#compareBtn").textContent = `Bandingkan (${state.compare.length})`;
  }
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-cmp]"); if (!t) return;
    e.stopPropagation();
    const m = t.dataset.cmp, i = state.compare.indexOf(m);
    if (i >= 0) state.compare.splice(i, 1);
    else if (state.compare.length >= 4) return toast("Maksimal 4 proyektor untuk dibandingkan");
    else { state.compare.push(m); toast(`${m} ditambahkan ke perbandingan`); }
    renderGrid(); renderDock();
    if (!$("#overlay").hidden) {
      const kind = $("#modal").dataset.kind;
      if (kind === "compare") state.compare.length ? openCompare() : closeModal();
      if (kind === "detail") { const st = $("#modalBody").scrollTop; openDetail($("#modal").dataset.model); $("#modalBody").scrollTop = st; }
    }
  }, true);
  $("#compareBtn").onclick = () => state.compare.length < 2 ? toast("Pilih minimal 2 proyektor") : (location.hash = "#/compare/" + state.compare.join(","));
  $("#clearCompare").onclick = () => { state.compare = []; renderGrid(); renderDock(); };

  /* ---------- Modal ---------- */
  function openModal(title, html, kind) {
    $("#modalTitle").textContent = title;
    $("#modalBody").innerHTML = html;
    $("#modalBody").scrollTop = 0;
    $("#modal").dataset.kind = kind;
    $("#overlay").hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    if ($("#overlay").hidden) return;
    $("#overlay").hidden = true; document.body.style.overflow = "";
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  }
  $("#overlay").addEventListener("click", (e) => { if (e.target.id === "overlay" || e.target.closest("[data-close]")) closeModal(); });

  const specLabel = (c) => ({
    "Projection Technology": "Teknologi Proyeksi", "Specifications of Main Parts": "Komponen Utama & Lensa",
    "Brightness*1": "Kecerahan (Lumens)", "Brightness1": "Kecerahan (Lumens)", "Contrast Ratio": "Rasio Kontras",
    "Screen Size (Projected Distance)": "Ukuran Layar & Jarak Proyeksi", "Geometric Correction": "Koreksi Geometris (Keystone)",
    "Connectivity": "Konektivitas & Port", "Wireless Specifications (Optional Wireless LAN)": "Spesifikasi Wireless",
    "Wireless Specifications (Wireless LAN: Built-in)": "Spesifikasi Wireless Built-in",
    "Optional Wireless & Built In Lan Specifications": "Spesifikasi Jaringan & Wireless",
    "Internal Speaker(s)": "Speaker Internal", "Air Filter": "Filter Udara", "Operating Temperature": "Suhu Operasional",
    "Operating Altitude": "Ketinggian Operasional", "Power": "Catu Daya", "Power Supply": "Catu Daya",
    "Power Consumption (220-240V)": "Konsumsi Daya", "Dimension Excluding Feet (W x H x D)": "Dimensi",
    "Dimension Excluding Feet": "Dimensi", "Weight": "Berat", "Fan Noise": "Tingkat Kebisingan Kipas",
    "Start-Up Period": "Waktu Nyala", "Cool Down Period": "Waktu Pendinginan", "Direct Power On / Off": "Direct Power On/Off",
  }[c] || c);

  function openDetail(model) {
    const p = P.find((x) => x.model === model); if (!p) return;
    const ri = RES_INFO[p.resolution] || {};
    const wifiText = p.wifiBuiltin ? "Wi-Fi Built-in" : p.wifi ? "Wi-Fi Opsional (ELPAP11)" : "—";
    const ks = [
      ["Kecerahan", p.lumensText],
      ["Resolusi", `${p.resolution} (${p.aspect})`],
      ["Sumber Cahaya", p.lightSource],
      ["Rasio Kontras", p.contrast],
      ["Port HDMI", `${p.hdmi}× HDMI`],
      ["Wireless / LAN", [wifiText !== "—" && wifiText, p.lan && "RJ45 LAN"].filter(Boolean).join(" · ") || "—"],
      ["Speaker", p.speaker || "—"],
      ["TKDN + BMP", p.tkdn ? p.tkdnScore : "—"],
      ...(p.tkdnCert ? [["No. Sertifikat TKDN", p.tkdnCert]] : []),
      ["Berat", p.weight || "—"],
    ];
    const groups = Object.entries(p.specs);
    const groupHtml = groups.map(([c, kv], i) => `<details class="spec-group" ${i < 2 ? "open" : ""}><summary>${esc(specLabel(c))}</summary>
      <table class="spec-table">${Object.entries(kv).map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join("")}</table></details>`).join("");
    const html = `<div class="detail">
      <div class="detail-media">${imgTag(p)}</div>
      <div class="detail-info">
        <div class="series">${esc(catLabel(p.category))}${p.isNew ? " · Baru 2026" : ""}${p.tkdn ? ` · TKDN ${esc(p.tkdnScore)}` : ""}</div>
        <h2>${esc(p.name)}</h2>
        <p class="tagline">${esc(p.tagline)}</p>
        <div class="pills">${pills(p)}</div>
        <div class="keyspecs">${ks.map(([k, v]) => `<div class="keyspec"><small>${k}</small><b>${esc(v)}</b></div>`).join("")}</div>
        <div class="keyspec" style="display:flex;align-items:center;gap:12px">
          <div class="ink-dots"><i style="background:${ri.color || "#0a84ff"}"></i></div>
          <div><small>Resolusi Native</small><b>${esc(p.resolution)} — ${esc(ri.pixels || "")}</b></div>
          <button class="btn small" style="flex:none;margin-left:auto" data-res="${esc(p.resolution)}">Model lain</button>
        </div>
        <div class="tabs"><button class="active">Spesifikasi lengkap</button></div>
        ${groupHtml || '<p class="muted">Spesifikasi tidak tersedia di situs resmi.</p>'}
        <div class="detail-actions">
          <a class="btn primary" href="${p.url}" target="_blank" rel="noopener">${svg("ext")} Lihat di epson.co.id</a>
          <button class="btn" data-cmp="${p.model}">${svg(state.compare.includes(p.model) ? "check" : "plus")} ${state.compare.includes(p.model) ? "Di perbandingan" : "Bandingkan"}</button>
          <button class="btn" id="shareBtn">${svg("share")} Bagikan</button>
        </div>
        <p class="muted" style="font-size:12px;margin-top:14px">SKU ${esc(p.sku)}</p>
      </div></div>`;
    openModal(p.name, html, "detail");
    $("#shareBtn").onclick = async () => {
      const url = location.href;
      try { if (navigator.share) await navigator.share({ title: p.name, url }); else { await navigator.clipboard.writeText(url); toast("Tautan disalin"); } } catch {}
    };
    $("#modal").dataset.model = model;
  }

  function openCompare(models = state.compare) {
    const list = models.map((m) => P.find((p) => p.model === m)).filter(Boolean);
    if (!list.length) return;
    const yn = (v) => v ? '<span class="yes">✓ Ya</span>' : '<span class="no">—</span>';
    const rows = [
      ["Kategori", (p) => catLabel(p.category)],
      ["Kecerahan", (p) => p.lumensText],
      ["Resolusi", (p) => `${p.resolution} (${p.aspect})`],
      ["Sumber Cahaya", (p) => p.lightSource],
      ["Rasio Kontras", (p) => p.contrast],
      ["Port HDMI", (p) => `${p.hdmi}× HDMI`],
      ["Wi-Fi Built-in", (p) => yn(p.wifiBuiltin), true],
      ["Wi-Fi Opsional", (p) => yn(p.wifi && !p.wifiBuiltin), true],
      ["RJ45 LAN", (p) => yn(p.lan), true],
      ["Short Throw", (p) => yn(p.shortThrow), true],
      ["Screen Mirroring", (p) => yn(p.mirroring), true],
      ["TKDN + BMP", (p) => p.tkdn ? `<span class="yes">✓ ${esc(p.tkdnScore || "Ya")}</span>` : '<span class="no">—</span>', true],
      ["No. Sertifikat TKDN", (p) => p.tkdnCert || "—"],
      ["Speaker", (p) => p.speaker || "—"],
      ["Dimensi", (p) => p.dimensions || "—"],
      ["Berat", (p) => p.weight || "—"],
    ];
    const html = `<div class="compare-wrap"><table class="compare">
      <thead><tr><th></th>${list.map((p) => `<th>${imgTag(p)}<h4>${esc(p.model)}</h4>
        <button class="btn ghost" style="font-size:12px;padding:2px 6px" data-cmp="${p.model}">Hapus</button></th>`).join("")}</tr></thead>
      <tbody>${rows.map(([label, fn, raw]) => {
        const vals = list.map(fn);
        const diff = new Set(vals).size > 1;
        return `<tr><th>${label}</th>${vals.map((v) => `<td class="${diff ? "diff" : ""}">${raw ? v : esc(v)}</td>`).join("")}</tr>`;
      }).join("")}
      <tr><th></th>${list.map((p) => `<td><button class="btn small" data-open="${p.model}">Detail</button></td>`).join("")}</tr>
      </tbody></table></div>
      <p class="muted" style="padding:0 16px 16px;font-size:12px">Sel berwarna menandakan perbedaan antar model.</p>`;
    openModal(`Perbandingan · ${list.map((p) => p.model).join(" vs ")}`, html, "compare");
  }

  function openRes() {
    const html = `<div class="ink-grid">${Object.entries(RES_INFO).map(([k, v]) => {
      const models = P.filter((p) => p.resolution === k);
      return `<div class="ink-card"><h4>${esc(k)} <span class="ink-dots"><i style="background:${v.color}"></i></span></h4>
        <p><b>${esc(v.pixels)}</b> · ${models.length} model<br>${esc(v.desc)}</p>
        <div class="pills">${models.map((p) => `<span class="pill" data-open="${p.model}">${p.model}</span>`).join("")}</div></div>`;
    }).join("")}</div>`;
    openModal("Panduan Resolusi Proyektor", html, "res");
  }

  function openAbout() {
    openModal("Tentang Katalog", `<div class="about">
      <h2>Katalog Digital Proyektor Epson 3LCD</h2>
      <p>Katalog independen berisi ${P.length} proyektor Corporate & Education yang tercantum di
      <a href="https://www.epson.co.id/For-Work/Projectors/Corporate-and-Education/c/w310id" target="_blank" rel="noopener">epson.co.id</a>.</p>
      <h4>Panduan singkat seri EB-</h4>
      <ul>
        <li><b>EB-E / EB-X</b> = XGA (1024×768, 4:3) · <b>EB-W</b> = WXGA (1280×800, 16:10) · <b>EB-FH</b> = Full HD 1080p · <b>EB-U</b> = WUXGA (1920×1200).</li>
        <li><b>EB-L...</b> = Sumber cahaya <b>Laser</b> (kontras > 5.000.000:1, bebas perawatan lampu).</li>
        <li><b>EB-2xxx</b> = Kecerahan tinggi <b>5.000 – 5.500 lumens</b> untuk aula & ruang besar.</li>
        <li>Akhiran <b>S / SW / SF</b> = lensa <b>Short Throw</b> untuk proyeksi besar dari jarak dekat.</li>
      </ul>
      <h4>Pintasan keyboard</h4>
      <ul><li><b>⌘K / Ctrl+K</b> atau <b>/</b> — Spotlight</li><li><b>Esc</b> — tutup jendela</li></ul>
      <p class="note">Harga tidak tersedia di situs resmi. Spesifikasi dapat berubah sewaktu-waktu; selalu verifikasi di situs resmi Epson.
      Epson, 3LCD dan gambar produk adalah merek/hak milik Seiko Epson Corporation.</p>
    </div>`, "about");
  }

  document.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]"); if (o) location.hash = "#/p/" + o.dataset.open;
    const m = e.target.closest("[data-menu]"); if (!m) return;
    toggleDrawer(false);
    const k = m.dataset.menu;
    if (k === "all") { $("#resetBtn").click(); closeModal(); }
    if (k === "compare") state.compare.length >= 2 ? (location.hash = "#/compare/" + state.compare.join(",")) : toast("Tambahkan minimal 2 proyektor dengan tombol + pada kartu");
    if (k === "res") openRes();
    if (k === "about") openAbout();
  });

  /* ---------- Router ---------- */
  function route() {
    const h = decodeURIComponent(location.hash);
    let m;
    if ((m = h.match(/^#\/p\/(.+)$/))) openDetail(m[1]);
    else if ((m = h.match(/^#\/compare\/(.+)$/))) {
      const models = m[1].split(",").filter((x) => P.some((p) => p.model === x));
      if (models.join() !== state.compare.join()) { state.compare = models; renderGrid(); renderDock(); }
      openCompare(models);
    } else if (!$("#overlay").hidden) { $("#overlay").hidden = true; document.body.style.overflow = ""; }
  }
  addEventListener("hashchange", route);

  /* ---------- Spotlight ---------- */
  let sel = 0, results = [];
  const spot = $("#spotlight"), spotIn = $("#spotInput");
  function openSpot() { spot.hidden = false; spotIn.value = ""; renderSpot(); setTimeout(() => spotIn.focus(), 10); }
  function closeSpot() { spot.hidden = true; }
  function renderSpot() {
    const q = spotIn.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    results = q.length ? P.filter((p) => q.every((t) => haystack(p).includes(t))).slice(0, 8) : [];
    sel = Math.min(sel, Math.max(0, results.length - 1));
    $("#spotResults").innerHTML = results.map((p, i) => `<li class="${i === sel ? "sel" : ""}" data-i="${i}">
      ${p.image ? `<img src="${p.image}" alt="" />` : ""}<div><b>${esc(p.name)}</b><small>${esc(p.lumensText)} · ${esc(p.resolution)} · ${esc(p.tagline)}</small></div></li>`).join("");
  }
  spotIn.oninput = () => { sel = 0; renderSpot(); };
  spotIn.onkeydown = (e) => {
    if (e.key === "ArrowDown") { sel = Math.min(sel + 1, results.length - 1); renderSpot(); e.preventDefault(); }
    if (e.key === "ArrowUp") { sel = Math.max(sel - 1, 0); renderSpot(); e.preventDefault(); }
    if (e.key === "Enter" && results[sel]) { closeSpot(); location.hash = "#/p/" + results[sel].model; }
  };
  $("#spotResults").onclick = (e) => { const li = e.target.closest("li"); if (li) { closeSpot(); location.hash = "#/p/" + results[+li.dataset.i].model; } };
  spot.onclick = (e) => { if (e.target === spot) closeSpot(); };
  $("#spotlightBtn").onclick = openSpot;
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); spot.hidden ? openSpot() : closeSpot(); }
    else if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); openSpot(); }
    else if (e.key === "Escape") { if (!spot.hidden) closeSpot(); else closeModal(); }
  });

  /* ---------- Toast ---------- */
  let tt;
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 1800); }

  update();
  route();
})();
