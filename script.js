document.addEventListener('DOMContentLoaded', () => {

  // ── Nav scroll state ──
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ── Mobile nav toggle ──
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (toggle) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // ── Scroll reveal ──
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.06,
    rootMargin: '0px 0px -30px 0px'
  });

  reveals.forEach(el => observer.observe(el));

  // ── Stagger work rows ──
  const rows = document.querySelectorAll('.work-row.reveal');
  rows.forEach((row, i) => {
    row.style.transitionDelay = `${i * 0.06}s`;
  });

  // ── Active nav tracking ──
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 200;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navAnchors.forEach(link => {
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = 'var(--accent)';
      } else {
        link.style.color = '';
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

});
