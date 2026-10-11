(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Theme toggle (preference is saved when storage is available)
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Active nav link
  var links = document.querySelectorAll('.nav nav a');
  var sections = [];
  links.forEach(function (link) {
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

  if (reduceMotion) return;

  // Scroll progress bar + cursor glow (batched into one animation frame)
  var progress = document.querySelector('.progress');
  var glow = document.querySelector('.glow');
  var pointer = { x: window.innerWidth / 2, y: window.innerHeight * 0.25 };
  var ticking = false;

  function frame() {
    ticking = false;
    var max = root.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    if (glow) {
      glow.style.setProperty('--gx', pointer.x + 'px');
      glow.style.setProperty('--gy', pointer.y + 'px');
    }
  }
  function schedule() {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('pointermove', function (e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    schedule();
  }, { passive: true });
  schedule();

  // Spotlight on project cards
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  });
})();
