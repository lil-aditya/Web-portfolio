document.addEventListener('DOMContentLoaded', () => {

  // ─── Custom Cursor ───
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX - 4 + 'px';
    dot.style.top = mouseY - 4 + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX - 18 + 'px';
    ring.style.top = ringY - 18 + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Cursor hover effects
  const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-tag, .achievement-item');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });

  // ─── Nav Scroll Effect ───
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ─── Mobile Nav Toggle ───
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
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

  // ─── Scroll Reveal ───
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));

  // ─── Active Nav Link ───
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 200;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navItems.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = '#5a9e6f';
      }
    });
  });

  // ─── Stagger children animation ───
  const staggerContainers = document.querySelectorAll('.stagger-children');
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.children;
        Array.from(children).forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.08}s`;
          child.classList.add('visible');
        });
      }
    });
  }, { threshold: 0.1 });

  staggerContainers.forEach(el => staggerObserver.observe(el));

});
