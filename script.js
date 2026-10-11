(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var desktopRail = window.matchMedia('(min-width: 1024px)');

  /* ---------- Small helpers ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Whole months between "YYYY-MM" and now, counted inclusively like LinkedIn does
  function monthsSince(ym) {
    var p = ym.split('-');
    var now = new Date();
    return (now.getFullYear() - Number(p[0])) * 12 + (now.getMonth() + 1 - Number(p[1])) + 1;
  }
  function formatDuration(months) {
    var y = Math.floor(months / 12);
    var m = months % 12;
    var parts = [];
    if (y) parts.push(y + (y === 1 ? ' yr' : ' yrs'));
    if (m) parts.push(m + (m === 1 ? ' mo' : ' mos'));
    return parts.join(' ');
  }

  // Keep date-driven text correct as time passes
  var duration = document.querySelector('[data-duration]');
  if (duration) duration.textContent = formatDuration(monthsSince(duration.getAttribute('data-duration')));
  var yearsEl = document.querySelector('[data-since]');
  if (yearsEl) yearsEl.setAttribute('data-count', String(Math.floor(monthsSince(yearsEl.getAttribute('data-since')) / 12)));

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Count-up stats ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function runCounter(el) {
    var target = Number(el.getAttribute('data-count'));
    el.textContent = String(target);
    if (reduceMotion || !target) return;
    var start = null;
    var duration = 1400;
    el.textContent = '0';
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* ---------- Active nav link ---------- */
  var sections = [];
  document.querySelectorAll('.rail nav a').forEach(function (link) {
    var target = document.querySelector(link.getAttribute('href'));
    if (target) sections.push({ link: link, target: target });
  });
  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sections.forEach(function (s) {
          var active = s.target === entry.target;
          s.link.classList.toggle('active', active);
          if (active) {
            s.link.setAttribute('aria-current', 'true');
            if (!desktopRail.matches) s.link.scrollIntoView({ inline: 'center', block: 'nearest' });
          } else {
            s.link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navObserver.observe(s.target); });
  }

  /* ---------- Hero visibility (shared by the field and the rotor) ---------- */
  var hero = document.querySelector('.hero');
  var heroVisible = true;
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      if (heroVisible) startField();
    }, { threshold: 0 }).observe(hero);
  }

  /* ---------- Dot-wave field (canvas background) ---------- */
  var canvas = document.querySelector('.field');
  var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  var running = false;
  var pointer = { x: -9999, y: -9999 };
  var dots = [];
  var gap = 30;
  var dpr = 1;
  var cw = 0;
  var ch = 0;

  function sizeField() {
    if (!ctx) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cw = canvas.clientWidth;
    ch = canvas.clientHeight;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    gap = cw < 520 ? 34 : 30;
    dots = [];
    for (var y = gap / 2; y < ch; y += gap) {
      for (var x = gap / 2; x < cw; x += gap) dots.push({ x: x, y: y });
    }
    drawField(performance.now());
  }

  function drawField(t) {
    if (!ctx) return;
    ctx.clearRect(0, 0, cw, ch);
    var reach = 150;
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      var wave = reduceMotion ? 0 : Math.sin(d.x * 0.011 + t * 0.0007) * 6 + Math.cos(d.y * 0.014 + t * 0.0006) * 6;
      var px = d.x;
      var py = d.y + wave;
      var dx = px - pointer.x;
      var dy = py - pointer.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var force = dist < reach ? Math.pow(1 - dist / reach, 2) : 0;
      if (force > 0) {
        px += (dx / (dist || 1)) * force * 22;
        py += (dy / (dist || 1)) * force * 22;
      }
      var alpha = 0.2 + 0.22 * ((wave + 12) / 24) + force * 0.7;
      ctx.fillStyle = 'rgba(242,114,75,' + alpha.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(px, py, 1.25 + force * 1.9, 0, 6.2832);
      ctx.fill();
    }
  }

  function loop(t) {
    if (!heroVisible || document.hidden) { running = false; return; }
    drawField(t);
    requestAnimationFrame(loop);
  }
  function startField() {
    if (!ctx || reduceMotion || running) return;
    running = true;
    requestAnimationFrame(loop);
  }

  if (ctx) {
    sizeField();
    if (window.ResizeObserver) new ResizeObserver(sizeField).observe(canvas);
    else window.addEventListener('resize', sizeField);
    if (!reduceMotion) {
      window.addEventListener('pointermove', function (e) {
        var r = canvas.getBoundingClientRect();
        pointer.x = e.clientX - r.left;
        pointer.y = e.clientY - r.top;
      }, { passive: true });
      document.addEventListener('visibilitychange', function () { if (!document.hidden) startField(); });
      startField();
    }
  }

  /* ---------- Scrambling tech word ---------- */
  var rotor = document.querySelector('.rotor');
  if (rotor && !reduceMotion) {
    var words = ['Laravel', 'Symfony', 'React', 'Next.js', 'Vue.js', 'React Native', 'TypeScript'];
    var glyphs = '!<>-_/[]{}=+*^?#';
    var index = 0;
    var scrambling = false;

    var scramble = function (to) {
      scrambling = true;
      var from = rotor.textContent;
      var length = Math.max(from.length, to.length);
      var queue = [];
      for (var i = 0; i < length; i++) {
        var start = Math.floor(Math.random() * 14);
        queue.push({ from: from[i] || '', to: to[i] || '', start: start, end: start + 8 + Math.floor(Math.random() * 14), ch: '' });
      }
      var frame = 0;
      (function update() {
        var out = '';
        var done = 0;
        for (var j = 0; j < queue.length; j++) {
          var q = queue[j];
          if (frame >= q.end) { done++; out += q.to; }
          else if (frame >= q.start) {
            if (!q.ch || Math.random() < 0.3) q.ch = glyphs[Math.floor(Math.random() * glyphs.length)];
            out += q.ch;
          } else { out += q.from; }
        }
        rotor.textContent = out;
        if (done === queue.length) { scrambling = false; return; }
        frame++;
        requestAnimationFrame(update);
      })();
    };

    setInterval(function () {
      if (scrambling || document.hidden || !heroVisible) return;
      index = (index + 1) % words.length;
      scramble(words[index]);
    }, 2800);
  }

  /* ---------- Pointer effects (fine pointers only) ---------- */
  if (finePointer && !reduceMotion) {
    // Magnetic buttons
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) * 0.18;
        var y = (e.clientY - (r.top + r.height / 2)) * 0.28;
        btn.style.setProperty('--tx', Math.max(-6, Math.min(6, x)) + 'px');
        btn.style.setProperty('--ty', Math.max(-5, Math.min(5, y)) + 'px');
      });
      btn.addEventListener('pointerleave', function () {
        btn.style.setProperty('--tx', '0px');
        btn.style.setProperty('--ty', '0px');
      });
    });

    // Spotlight that follows the cursor
    document.querySelectorAll('.spot').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });

    // Gentle 3D tilt on the file trees
    document.querySelectorAll('.tilt').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateX(' + (-py * 5).toFixed(2) + 'deg) rotateY(' + (px * 6).toFixed(2) + 'deg)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- Command palette ---------- */
  var dialog = document.getElementById('palette');
  var input = document.getElementById('palette-input');
  var list = document.getElementById('palette-list');
  var empty = document.querySelector('.palette-empty');
  var openBtn = document.querySelector('.palette-open');
  if (!dialog || typeof dialog.showModal !== 'function') {
    if (openBtn) openBtn.hidden = true;
    return;
  }

  var items = [
    { label: 'About', hint: 'Section', href: '#about' },
    { label: 'Experience', hint: 'Section', href: '#experience' },
    { label: 'Code samples', hint: 'Section', href: '#code' },
    { label: 'Skills', hint: 'Section', href: '#skills' },
    { label: 'Education', hint: 'Section', href: '#education' },
    { label: 'Contact', hint: 'Section', href: '#contact' },
    { label: 'GitHub profile', hint: 'Opens in new tab', href: 'https://github.com/mzohaib79', external: true },
    { label: 'LinkedIn profile', hint: 'Opens in new tab', href: 'https://www.linkedin.com/in/m-zohaib-tech', external: true }
  ];
  var visible = [];
  var selected = 0;

  function render() {
    var q = input.value.trim().toLowerCase();
    visible = items.filter(function (it) { return it.label.toLowerCase().indexOf(q) !== -1; });
    selected = Math.min(selected, Math.max(visible.length - 1, 0));
    list.innerHTML = '';
    visible.forEach(function (it, i) {
      var li = document.createElement('li');
      li.id = 'palette-opt-' + i;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', i === selected ? 'true' : 'false');
      var name = document.createElement('span');
      name.textContent = it.label;
      var hint = document.createElement('small');
      hint.textContent = it.hint;
      li.appendChild(name);
      li.appendChild(hint);
      li.addEventListener('click', function () { choose(it); });
      list.appendChild(li);
    });
    empty.hidden = visible.length > 0;
    if (visible.length) input.setAttribute('aria-activedescendant', 'palette-opt-' + selected);
    else input.removeAttribute('aria-activedescendant');
  }

  function move(delta) {
    if (!visible.length) return;
    selected = (selected + delta + visible.length) % visible.length;
    render();
    var el = document.getElementById('palette-opt-' + selected);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }

  function choose(it) {
    dialog.close();
    if (it.external) {
      window.open(it.href, '_blank', 'noopener');
    } else {
      var target = document.querySelector(it.href);
      if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', it.href);
    }
  }

  function openPalette() {
    input.value = '';
    selected = 0;
    render();
    dialog.showModal();
    input.focus();
  }

  if (openBtn) openBtn.addEventListener('click', openPalette);
  input.addEventListener('input', function () { selected = 0; render(); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter' && visible[selected]) { e.preventDefault(); choose(visible[selected]); }
  });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });

  document.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    var typing = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable);
    var isShortcut = (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) ||
                     ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k');
    if (isShortcut && !dialog.open) { e.preventDefault(); openPalette(); }
  });
})();
