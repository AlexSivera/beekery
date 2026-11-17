/* Beekery v2 — comportamiento.
   El contenido vive en el HTML; los horarios y la agenda en lib/manifest.js. */
(function () {
  "use strict";

  var data = window.__BRAND__ || {};
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[" + name + "]", e); } }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  /* ---------- Hora local de Dénia ---------- */
  function madridNow() {
    var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    try {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
      }).formatToParts(new Date());
      var get = function (t) { return (parts.filter(function (p) { return p.type === t; })[0] || {}).value; };
      return { day: map[get("weekday")], hour: (parseInt(get("hour"), 10) % 24) + parseInt(get("minute"), 10) / 60 };
    } catch (_) {
      var d = new Date();
      return { day: d.getDay(), hour: d.getHours() + d.getMinutes() / 60 };
    }
  }
  function fmt(h) { var hh = Math.floor(h), mm = Math.round((h - hh) * 60); return hh + ":" + (mm < 10 ? "0" : "") + mm; }
  function nextOpen(from) {
    for (var i = 1; i <= 7; i++) { var d = (from + i) % 7; if (data.hours && data.hours[d]) return { day: d, offset: i }; }
    return null;
  }

  var NOW = madridNow();
  var OPEN_TODAY = !!(data.hours && data.hours[NOW.day]);
  var CLOSED_FOR_TODAY = !OPEN_TODAY || NOW.hour >= data.hours[NOW.day][1];
  // Día de horno que mostramos por defecto: hoy si aún abre hoy, si no el siguiente
  var FOCUS = (function () {
    if (!CLOSED_FOR_TODAY) return { day: NOW.day, offset: 0 };
    return nextOpen(NOW.day) || { day: NOW.day, offset: 0 };
  })();

  function whenLabel(day) {
    if (day === NOW.day) return "Hoy";
    if (day === (NOW.day + 1) % 7) return "Mañana";
    return "El " + data.dayNames[day];
  }

  /* ---------- Estado abierto / cerrado ---------- */
  function initStatus() {
    var el = $("[data-status]"), txt = $("[data-status-text]");
    if (!el || !txt || !data.hours) return;
    var today = data.hours[NOW.day], msg;
    if (today && NOW.hour >= today[0] && NOW.hour < today[1]) {
      el.classList.add("is-open");
      msg = "Abierto · hasta las " + fmt(today[1]);
    } else {
      el.classList.add("is-closed");
      if (today && NOW.hour < today[0]) msg = "Abrimos hoy a las " + fmt(today[0]);
      else {
        var n = nextOpen(NOW.day);
        if (n) msg = "Cerrado · abrimos " + (n.offset === 1 ? "mañana" : "el " + data.dayNames[n.day]) + " a las " + fmt(data.hours[n.day][0]);
      }
    }
    if (msg) txt.textContent = msg;
  }

  /* ---------- Hoy en el horno ---------- */
  function initHoy() {
    if (!data.agenda) return;
    var stage = $(".hoy-stage"), when = $("[data-hoy-when]"), dayEl = $("[data-hoy-day]"), list = $("[data-hoy-list]");
    var wa = $("[data-hoy-wa]"), tabs = $$("[data-hoy-week] [role=tab]");
    if (!stage || !dayEl || !list || !tabs.length) return;

    function render(day, animate) {
      var breads = data.agenda[day];
      var apply = function () {
        when.textContent = breads ? (whenLabel(day) + " sale del horno") : whenLabel(day);
        dayEl.textContent = cap(data.dayNames[day]);
        list.innerHTML = "";
        list.classList.toggle("is-rest", !breads);
        (breads || ["Los lunes el horno descansa. Nos vemos el martes a las 8:00."]).forEach(function (b) {
          var li = document.createElement("li"); li.textContent = b; list.appendChild(li);
        });
        if (wa) {
          var txt = breads
            ? "Hola Beekery, ¿me podéis guardar un pan para el " + data.dayNames[day] + "? (" + breads.join(", ") + ")"
            : "Hola Beekery, ¿me podéis guardar un pan para el martes?";
          wa.href = "https://wa.me/" + data.whatsapp + "?text=" + encodeURIComponent(txt);
        }
        stage.classList.remove("is-swapping");
      };
      if (animate && !reduce) { stage.classList.add("is-swapping"); setTimeout(apply, 200); } else apply();
    }

    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
      });
      if (focus) tab.focus();
      render(parseInt(tab.getAttribute("data-d"), 10), true);
    }

    tabs.forEach(function (t, i) {
      var d = parseInt(t.getAttribute("data-d"), 10);
      t.setAttribute("aria-label", cap(data.dayNames[d]));
      if (d === NOW.day) t.classList.add("is-today");
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") n = tabs[0];
        if (e.key === "End") n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });

    var first = tabs.filter(function (t) { return parseInt(t.getAttribute("data-d"), 10) === FOCUS.day; })[0] || tabs[0];
    tabs.forEach(function (t) { var on = t === first; t.setAttribute("aria-selected", on ? "true" : "false"); t.tabIndex = on ? 0 : -1; });
    render(FOCUS.day, false);

    // Franja del hero
    var hl = $("[data-hero-today-label]"), hlist = $("[data-hero-today-list]");
    if (hl && hlist && data.agenda[FOCUS.day]) {
      hl.textContent = whenLabel(FOCUS.day) + " en el horno · " + data.dayNames[FOCUS.day];
      hlist.textContent = data.agenda[FOCUS.day].join(" · ");
    }

    var row = $('[data-hours] [data-row="' + NOW.day + '"]');
    if (row) row.classList.add("is-today");
  }

  /* ---------- Navegación ---------- */
  function initNav() {
    var nav = $("[data-nav]"), burger = $("[data-burger]"), sheet = $("[data-sheet]");
    if (!nav) return;
    var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 24); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      if (sheet) sheet.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      document.body.style.overflow = open ? "hidden" : "";
    }
    if (burger && sheet) {
      burger.addEventListener("click", function () { setOpen(!nav.classList.contains("is-open")); });
      $$("a", sheet).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); burger.focus(); } });
    }

    if (!("IntersectionObserver" in window)) return;
    var links = $$(".nav-links a");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle("is-current", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { io.observe(s); });
  }

  /* ---------- Vitrina: el escenario cambia de color y producto ---------- */
  function initVitrina() {
    var stage = $("[data-stage]"), cats = $$("[data-cat]"), caption = $("[data-stage-caption]");
    if (!stage || !cats.length || !("IntersectionObserver" in window)) return;
    var shots = $$("[data-shot]", stage), current = null;

    function activate(cat) {
      var key = cat.getAttribute("data-cat");
      if (key === current) return;
      current = key;
      stage.style.setProperty("--stage-c", cat.style.getPropertyValue("--c"));
      stage.style.setProperty("--stage-on", cat.style.getPropertyValue("--on"));
      shots.forEach(function (s) { s.classList.toggle("is-active", s.getAttribute("data-shot") === key); });
      if (caption) caption.textContent = String(cats.indexOf(cat) + 1).padStart(2, "0");
    }
    activate(cats[0]);

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) activate(e.target); });
    }, { rootMargin: "-50% 0px -50% 0px" });
    cats.forEach(function (c) { io.observe(c); });
  }

  /* ---------- Encargo por WhatsApp ---------- */
  function initOrder() {
    var form = $("[data-order]");
    if (!form || !data.whatsapp) return;
    var t = new Date();
    form.elements.fecha.min = t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      ["fecha", "nombre"].forEach(function (name) {
        var el = form.elements[name], field = el.closest(".field"), bad = !el.value.trim();
        field.classList.toggle("is-invalid", bad);
        el.setAttribute("aria-invalid", bad ? "true" : "false");
        if (bad && ok) { el.focus(); ok = false; }
      });
      if (!ok) return;

      var f = form.elements;
      var fecha = new Date(f.fecha.value + "T12:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
      var lines = [
        "Hola Beekery, soy " + f.nombre.value.trim() + ". Me gustaría encargar:",
        "• " + f.producto.value,
        "• Para el " + fecha,
        "• " + (f.raciones.value || "?") + " raciones"
      ];
      if (f.notas.value.trim()) lines.push("• Notas: " + f.notas.value.trim());
      lines.push("¡Gracias!");
      window.open("https://wa.me/" + data.whatsapp + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
    });
    $$("input", form).forEach(function (el) {
      el.addEventListener("input", function () { el.closest(".field").classList.remove("is-invalid"); el.removeAttribute("aria-invalid"); });
    });
  }

  /* ---------- Apariciones ---------- */
  function initReveals() {
    var sel = [
      ".hoy-head > *", ".hoy-week", ".hoy-foot", ".origen-lede", ".chain li", ".partners",
      ".vitrina-head > *", ".cat header", ".cat-intro", ".obrador-title", ".obrador-photo",
      ".obrador-text", ".facts li", ".review", ".encargos-body > *", ".visita-title", ".visita-grid > *"
    ].join(",");
    var items = $$(sel);
    if (reduce || !("IntersectionObserver" in window)) return;
    items.forEach(function (el) { el.classList.add("rv"); });
    $$(".chain li, .facts li").forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 90 + "ms"; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
    setTimeout(function () { items.forEach(function (el) { el.classList.add("is-in"); }); }, 7000);
  }

  /* ---------- Movimiento ligado al scroll ---------- */
  function initScroll() {
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    var heroImg = $("[data-hero-media] img");
    if (heroImg) {
      gsap.to(heroImg, { scale: 1.08, yPercent: 4, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    }
    var montgo = $("[data-parallax]");
    if (montgo) {
      gsap.fromTo(montgo, { yPercent: -7 }, { yPercent: 7, ease: "none",
        scrollTrigger: { trigger: ".origen-hero", start: "top bottom", end: "bottom top", scrub: true } });
    }
    var oTitle = $(".origen-title");
    if (oTitle) {
      gsap.fromTo(oTitle, { yPercent: 18 }, { yPercent: 0, ease: "none",
        scrollTrigger: { trigger: ".origen-hero", start: "top bottom", end: "center center", scrub: true } });
    }
  }

  function boot() {
    safe(initStatus, "status");
    safe(initHoy, "hoy");
    safe(initNav, "nav");
    safe(initVitrina, "vitrina");
    safe(initOrder, "order");
    safe(initReveals, "reveals");
    safe(initScroll, "scroll");
    safe(function () { $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); }); }, "year");
    requestAnimationFrame(function () { root.classList.add("is-ready"); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
