(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Scroll reveal (IntersectionObserver only)
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

  // Active nav link follows the section in view
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
          if (active) s.link.setAttribute('aria-current', 'true');
          else s.link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navObserver.observe(s.target); });
  }

  // Command palette
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
    { label: 'Work', hint: 'Section', href: '#work' },
    { label: 'Patterns in my code', hint: 'Section', href: '#patterns' },
    { label: 'About', hint: 'Section', href: '#about' },
    { label: 'Skills', hint: 'Section', href: '#skills' },
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
