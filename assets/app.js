/* ============ CODE ONE STUDIO — interactions ============ */
(function () {
  'use strict';

  /* ---------- booking modal ---------- */
  var bkOverlay = document.getElementById('bkOverlay');
  var bkBarber = document.getElementById('bkBarber');
  var bkService = document.getElementById('bkService');
  var bkDate = document.getElementById('bkDate');
  var bkTime = document.getElementById('bkTime');
  var bkWhen = document.getElementById('bkWhen');
  var bkDur = document.getElementById('bkDur');
  var bkAmt = document.getElementById('bkAmt');
  var bkSend = document.getElementById('bkSend');
  var WA_NUMBER = '40770868798';

  // program de lucru: [openHour, closeHour]; null = închis
  var HOURS = { 0: null, 1: [9, 19], 2: [9, 19], 3: [9, 20], 4: [9, 19], 5: [9, 20], 6: [9, 16] };
  var DAYS_RO = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function todayStr() { var t = new Date(); return t.getFullYear() + '-' + pad(t.getMonth() + 1) + '-' + pad(t.getDate()); }

  // set min date = azi
  bkDate.min = todayStr();

  function buildTimes() {
    bkTime.innerHTML = '';
    var ds = bkDate.value;
    if (!ds) {
      bkTime.disabled = true;
      bkTime.innerHTML = '<option value="" disabled selected>Alege întâi data…</option>';
      return;
    }
    var d = new Date(ds + 'T00:00:00');
    var rng = HOURS[d.getDay()];
    if (!rng) {
      bkTime.disabled = true;
      bkTime.innerHTML = '<option value="" disabled selected>Închis ' + DAYS_RO[d.getDay()].toLowerCase() + ' — alege altă zi</option>';
      return;
    }
    bkTime.disabled = false;
    var html = '<option value="" disabled selected>Alege ora…</option>';
    var now = new Date();
    var isToday = ds === todayStr();
    var nowMin = now.getHours() * 60 + now.getMinutes();
    var slots = 0;
    for (var m = rng[0] * 60; m <= rng[1] * 60 - 30; m += 30) {
      if (isToday && m <= nowMin + 15) continue; // lasă buffer 15 min
      var lbl = pad(Math.floor(m / 60)) + ':' + pad(m % 60);
      html += '<option value="' + lbl + '">' + lbl + '</option>';
      slots++;
    }
    if (!slots) html = '<option value="" disabled selected>Nu mai sunt ore azi — alege altă zi</option>';
    bkTime.innerHTML = html;
  }

  function fmtDate(ds) {
    var d = new Date(ds + 'T00:00:00');
    return DAYS_RO[d.getDay()] + ', ' + pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear();
  }

  function updateBooking() {
    var sOpt = bkService.options[bkService.selectedIndex];
    var price = sOpt && sOpt.value ? sOpt.getAttribute('data-price') : null;
    var dur = sOpt && sOpt.value ? sOpt.getAttribute('data-dur') : null;
    bkDur.textContent = dur || '—';
    bkAmt.textContent = price || '—';

    var barber = bkBarber.value, service = bkService.value, date = bkDate.value, time = bkTime.value;
    bkWhen.textContent = (date && time) ? (fmtDate(date) + ' · ' + time) : '—';

    if (barber && service && date && time) {
      bkSend.classList.remove('disabled');
      var msg = 'Salut! Vreau o programare la Code One Studio.\n'
        + 'Frizer: ' + barber + '\n'
        + 'Serviciu: ' + service + '\n'
        + 'Data: ' + fmtDate(date) + '\n'
        + 'Ora: ' + time + '\n'
        + 'Pret: ' + price;
      bkSend.setAttribute('href', 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg));
    } else {
      bkSend.classList.add('disabled');
      bkSend.setAttribute('href', 'https://wa.me/' + WA_NUMBER);
    }
  }
  bkBarber.addEventListener('change', updateBooking);
  bkService.addEventListener('change', updateBooking);
  bkDate.addEventListener('change', function () { buildTimes(); updateBooking(); });
  bkTime.addEventListener('change', updateBooking);
  buildTimes();
  updateBooking();

  function openBooking() {
    bkOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (typeof closeMenu === 'function') closeMenu();
  }
  function closeBooking() {
    bkOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('bkClose').addEventListener('click', closeBooking);
  bkOverlay.addEventListener('click', function (e) { if (e.target === bkOverlay) closeBooking(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && bkOverlay.classList.contains('open')) closeBooking();
  });
  document.querySelectorAll('[data-booking]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); openBooking(); });
  });

  /* ---------- robust video loading (preview server lacks range support) ---------- */
  var vCache = {};
  function loadVideo(videoEl, path) {
    if (vCache[path]) { videoEl.src = vCache[path]; return; }
    fetch(path).then(function (r) { return r.blob(); }).then(function (b) {
      var url = URL.createObjectURL(b);
      vCache[path] = url;
      videoEl.src = url;
      if (videoEl.autoplay) videoEl.play().catch(function () {});
    }).catch(function () {});
  }
  // hero + any data-vsrc videos
  document.querySelectorAll('video[data-vsrc]').forEach(function (v) {
    loadVideo(v, v.getAttribute('data-vsrc'));
  });

  /* ---------- year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- header scrolled ---------- */
  var header = document.getElementById('header');
  var onScroll = function () {
    if (window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  var scrim = document.getElementById('scrim');
  function closeMenu() {
    burger.classList.remove('open');
    menu.classList.remove('open');
    scrim.classList.remove('open');
    document.body.style.overflow = '';
  }
  function toggleMenu() {
    var open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    scrim.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', toggleMenu);
  scrim.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });

  /* ---------- highlight today's hours ---------- */
  var today = new Date().getDay(); // 0 = Sun .. 6 = Sat
  var row = document.querySelector('.hrow[data-day="' + today + '"]');
  if (row) row.classList.add('today');

  /* ---------- gallery data ---------- */
  var ITEMS = [
    { type: 'img', src: 'assets/img/work_01.jpg', label: 'Skin Fade · blond' },
    { type: 'img', src: 'assets/img/work_06.jpg', label: 'Taper Fade' },
    { type: 'video', src: 'assets/video/clip_01.mp4', poster: 'assets/img/work_09.jpg', label: 'În lucru' },
    { type: 'img', src: 'assets/img/work_02.jpg', label: 'Clasic' },
    { type: 'img', src: 'assets/img/work_10.jpg', label: 'Textured Fade' },
    { type: 'img', src: 'assets/img/work_03.jpg', label: 'Texturat' },
    { type: 'video', src: 'assets/video/clip_02.mp4', poster: 'assets/img/work_05.jpg', label: 'Backstage' },
    { type: 'img', src: 'assets/img/work_07.jpg', label: 'Crop' },
    { type: 'img', src: 'assets/img/work_11.jpg', label: 'Blond Mohawk' },
    { type: 'img', src: 'assets/img/work_04.jpg', label: 'Skin Fade · spate' },
    { type: 'video', src: 'assets/video/clip_03.mp4', poster: 'assets/img/work_08.jpg', label: 'Finisaj' },
    { type: 'img', src: 'assets/img/work_05.jpg', label: 'Design Line' },
    { type: 'img', src: 'assets/img/work_08.jpg', label: 'Modern Quiff' },
    { type: 'img', src: 'assets/img/work_09.jpg', label: 'Comb Over' },
    { type: 'video', src: 'assets/video/clip_04.mp4', poster: 'assets/img/work_02.jpg', label: 'Code One' }
  ];

  var grid = document.getElementById('galGrid');
  var playSvg = '<div class="play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>';
  // prima pagină: grid-ul are data-preview="4" + data-more-href="lucrari.html" (afișează doar 4 + link);
  // pagina dedicată lucrari.html: fără atribute => afișează toate lucrările.
  var galPreview = grid ? parseInt(grid.getAttribute('data-preview') || '0', 10) : 0;
  var galMoreHref = grid ? grid.getAttribute('data-more-href') : null;
  var SHOWN = (galPreview > 0) ? ITEMS.slice(0, galPreview) : ITEMS;

  if (grid) SHOWN.forEach(function (it, i) {
    var el = document.createElement('div');
    el.className = 'gal-item reveal';
    el.setAttribute('data-index', i);
    var media;
    if (it.type === 'video') {
      media = '<video poster="' + it.poster + '" muted loop playsinline preload="none"></video>' + playSvg;
    } else {
      media = '<img src="' + it.src + '" alt="' + it.label + '" loading="lazy">';
    }
    el.innerHTML = media +
      '<div class="ov"><div class="t">' + it.label + ' <span class="ac">↗</span></div></div>';
    grid.appendChild(el);

    // hover preview for video tiles (lazy-load blob on first hover)
    if (it.type === 'video') {
      var v = el.querySelector('video');
      var loaded = false;
      el.addEventListener('mouseenter', function () {
        if (!loaded) { loadVideo(v, it.src); loaded = true; }
        v.play().catch(function () {});
      });
      el.addEventListener('mouseleave', function () { v.pause(); });
    }
    el.addEventListener('click', function () { openLightbox(i); });
  });

  /* ---------- link „vezi toate lucrările" -> pagina dedicată ---------- */
  if (grid && galMoreHref && ITEMS.length > SHOWN.length) {
    var moreWrap = document.createElement('div');
    moreWrap.className = 'gal-more';
    var moreLink = document.createElement('a');
    moreLink.className = 'btn btn-ghost btn-lg';
    moreLink.href = galMoreHref;
    moreLink.innerHTML = 'Vezi toate lucrările (' + ITEMS.length + ') <span aria-hidden="true">→</span>';
    moreWrap.appendChild(moreLink);
    grid.parentNode.insertBefore(moreWrap, grid.nextSibling);
  }

  /* ---------- lightbox ---------- */
  var lb = document.getElementById('lightbox');
  var stage = document.getElementById('lbStage');
  var cur = 0;

  function render() {
    var it = SHOWN[cur];
    if (it.type === 'video') {
      stage.innerHTML = '<video controls autoplay loop playsinline></video>';
      loadVideo(stage.querySelector('video'), it.src);
    } else {
      stage.innerHTML = '<img src="' + it.src + '" alt="' + it.label + '">';
    }
  }
  function openLightbox(i) {
    cur = i;
    render();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lb.classList.remove('open');
    stage.innerHTML = '';
    document.body.style.overflow = '';
  }
  function step(d) {
    cur = (cur + d + SHOWN.length) % SHOWN.length;
    render();
  }
  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  document.getElementById('lbPrev').addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
  document.getElementById('lbNext').addEventListener('click', function (e) { e.stopPropagation(); step(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });

  /* ---------- scroll reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

})();
