/* Beekery — comportamiento de la web.
   El contenido está en el HTML; este archivo solo lo enriquece. */
(function () {
  "use strict";

  var data = window.__BRAND__ || {};
  var root = document.documentElement;

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "] falló:", e); }
  }

  /* ---------- Hora local de Dénia (Europe/Madrid) ---------- */
  function madridNow() {
    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    try {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
      }).formatToParts(new Date());
      var get = function (t) { return (parts.filter(function (p) { return p.type === t; })[0] || {}).value; };
      return { day: days[get("weekday")], hour: (parseInt(get("hour"), 10) % 24) + parseInt(get("minute"), 10) / 60 };
    } catch (_) {
      var d = new Date();
      return { day: d.getDay(), hour: d.getHours() + d.getMinutes() / 60 };
    }
  }

  function fmtHour(h) {
    var hh = Math.floor(h), mm = Math.round((h - hh) * 60);
    return hh + ":" + (mm < 10 ? "0" : "") + mm;
  }

  // Siguiente día (desde mañana) en que abre el obrador
  function nextOpenDay(fromDay) {
    for (var i = 1; i <= 7; i++) {
      var d = (fromDay + i) % 7;
      if (data.hours && data.hours[d]) return { day: d, offset: i };
    }
    return null;
  }

  /* ---------- Estado: abierto / cerrado ---------- */
  function initStatus() {
    var el = $("[data-status]"), txt = $("[data-status-text]");
    if (!el || !txt || !data.hours) return;
    var now = madridNow(), today = data.hours[now.day], msg;

    if (today && now.hour >= today[0] && now.hour < today[1]) {
      el.classList.add("is-open");
      msg = "Abierto ahora · hasta las " + fmtHour(today[1]);
    } else {
      el.classList.add("is-closed");
      if (today && now.hour < today[0]) {
        msg = "Cerrado · abrimos hoy a las " + fmtHour(today[0]);
      } else {
        var next = nextOpenDay(now.day);
        if (next) {
          var when = next.offset === 1 ? "mañana" : "el " + data.dayNames[next.day];
          msg = "Cerrado · abrimos " + when + " a las " + fmtHour(data.hours[next.day][0]);
        }
      }
    }
    if (msg) txt.textContent = msg;
  }

  /* ---------- Agenda: hoy (o el próximo día de horno) ---------- */
  function initToday() {
    if (!data.agenda) return;
    var now = madridNow();
    var isToday = !!data.hours[now.day];
    var target = isToday ? now.day : (nextOpenDay(now.day) || {}).day;
    if (target == null) return;

    var card = $('[data-week] [data-day="' + target + '"]');
    if (card) {
      card.classList.add("is-today");
      if (!isToday) $(".day-tag", card).textContent = "Mañana";
      // En móvil la semana es un carrusel: lo colocamos en el día de hoy sin mover la página
      var week = $("[data-week]");
      if (week && week.scrollWidth > week.clientWidth) {
        week.scrollLeft = card.offsetLeft - week.offsetLeft - parseInt(getComputedStyle(week).paddingLeft, 10);
      }
    }

    var row = $('[data-hours] [data-row="' + now.day + '"]');
    if (row) row.classList.add("is-today");

    var label = $("[data-today-label]"), list = $("[data-today-list]");
    if (label && list && data.agenda[target]) {
      label.textContent = (isToday ? "Hoy" : "Mañana") + " en el horno · " + data.dayNames[target];
      list.textContent = data.agenda[target].join(" · ");
    }

    var wa = $("[data-wa-reserve]");
    if (wa && data.whatsapp) {
      var text = "Hola Beekery, ¿me podéis guardar un pan para " + (isToday ? "hoy" : "mañana") + "? ";
      wa.href = "https://wa.me/" + data.whatsapp + "?text=" + encodeURIComponent(text);
    }
  }

  /* ---------- Navegación ---------- */
  function initNav() {
    var nav = $("[data-nav]"), burger = $("[data-burger]");
    if (!nav) return;

    var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 24); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (burger) {
      burger.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      });
      $$(".nav-sheet a").forEach(function (a) {
        a.addEventListener("click", function () {
          nav.classList.remove("is-open");
          burger.setAttribute("aria-expanded", "false");
        });
      });
    }

    // Enlace activo según la sección visible
    if (!("IntersectionObserver" in window)) return;
    var links = $$(".nav-links a");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle("is-current", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    $$("main section[id]").forEach(function (s) { io.observe(s); });
  }

  /* ---------- Pestañas de la carta ---------- */
  function initTabs() {
    var tabs = $$("[data-tabs] [role=tab]"), ink = $("[data-tabs-ink]");
    if (!tabs.length) return;

    function moveInk(tab) {
      if (!ink) return;
      ink.style.width = tab.offsetWidth + "px";
      ink.style.transform = "translateX(" + tab.offsetLeft + "px)";
    }

    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.classList.toggle("is-active", on);
      });
      moveInk(tab);
      if (focus) tab.focus();
      if (tab.parentNode.scrollWidth > tab.parentNode.clientWidth) tab.parentNode.scrollTo({ left: tab.offsetLeft - 24, behavior: "smooth" });
    }

    tabs.forEach(function (t, i) {
      t.tabIndex = i === 0 ? 0 : -1;
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, n = null;
        if (k === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        if (k === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (k === "Home") n = tabs[0];
        if (k === "End") n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });

    var current = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0];
    moveInk(current);
    window.addEventListener("resize", function () {
      moveInk(tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0]);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveInk(current); });
  }

  /* ---------- Encargo por WhatsApp ---------- */
  function initOrder() {
    var form = $("[data-order]");
    if (!form || !data.whatsapp) return;

    var date = form.elements.fecha;
    var t = new Date();
    var iso = t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");
    if (date) date.min = iso;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      ["fecha", "nombre"].forEach(function (name) {
        var el = form.elements[name], field = el.closest(".field");
        var bad = !el.value.trim();
        field.classList.toggle("is-invalid", bad);
        if (bad && ok) { el.focus(); ok = false; }
      });
      if (!ok) return;

      var f = form.elements;
      var fecha = new Date(f.fecha.value + "T12:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
      var lines = [
        "Hola Beekery, soy " + f.nombre.value.trim() + ". Me gustaría hacer un encargo:",
        "• " + f.producto.value,
        "• Para el " + fecha,
        "• " + (f.raciones.value || "?") + " raciones"
      ];
      if (f.notas.value.trim()) lines.push("• Notas: " + f.notas.value.trim());
      lines.push("¡Gracias!");

      window.open("https://wa.me/" + data.whatsapp + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
    });

    $$("input", form).forEach(function (el) {
      el.addEventListener("input", function () { el.closest(".field").classList.remove("is-invalid"); });
    });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  function initReveals() {
    var items = $$(".reveal");
    $$(".steps .step, .week .day").forEach(function (el, i) {
      el.style.transitionDelay = (i % 6) * 80 + "ms";
    });
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (el) { io.observe(el); });

    // Red de seguridad: nada se queda oculto
    setTimeout(function () { items.forEach(function (el) { el.classList.add("is-in"); }); }, 6000);
  }

  /* ---------- Contadores ---------- */
  function initCounters() {
    var els = $$("[data-count]");
    if (!els.length || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target, end = parseInt(el.getAttribute("data-count"), 10), start = null;
        var step = function (ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / 1400, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.01 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Movimiento ligado al scroll (GSAP) ---------- */
  function initScrollMotion() {
    gsap.registerPlugin(ScrollTrigger);

    var loaf = $("[data-loaf] img");
    if (loaf) {
      gsap.to(loaf, {
        rotate: 70, scale: 1.14, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 }
      });
    }

    var montgo = $("[data-parallax]");
    if (montgo) {
      gsap.fromTo(montgo, { yPercent: -6 }, {
        yPercent: 6, ease: "none",
        scrollTrigger: { trigger: ".blat-hero", start: "top bottom", end: "bottom top", scrub: true }
      });
    }

    var line = $("[data-steps-line]");
    if (line) {
      gsap.to(line, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: "[data-steps]", start: "top 85%", end: "bottom 60%", scrub: 0.5 }
      });
    }
  }

  function boot() {
    safe(initStatus, "status");
    safe(initToday, "today");
    safe(initNav, "nav");
    safe(initTabs, "tabs");
    safe(initOrder, "order");
    safe(initReveals, "reveals");
    safe(initCounters, "counters");
    safe(function () { $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); }); }, "year");

    if (window.gsap && window.ScrollTrigger) {
      safe(initScrollMotion, "scrollMotion");
    } else {
      root.classList.add("no-gsap");
    }
    root.classList.add("is-ready");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
