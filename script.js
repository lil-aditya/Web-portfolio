document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════════════════
  // Live Clock
  // ═══════════════════════════════════════════════════════

  const clockEl = document.getElementById('clock');
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s}`;
  }
  updateClock();
  setInterval(updateClock, 1000);


  // ═══════════════════════════════════════════════════════
  // Typewriter Effect
  // ═══════════════════════════════════════════════════════

  const twEl = document.getElementById('typewriter');
  const phrases = [
    'Backend & ML Engineer',
    'Distributed Systems',
    'Deep Learning Research',
    'Computer Vision',
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function typeStep() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      twEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        setTimeout(() => { deleting = true; typeStep(); }, 2000);
        return;
      }
      setTimeout(typeStep, 60 + Math.random() * 40);
    } else {
      twEl.textContent = current.substring(0, charIdx);
      charIdx--;
      if (charIdx < 0) {
        deleting = false;
        charIdx = 0;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(typeStep, 400);
        return;
      }
      setTimeout(typeStep, 30);
    }
  }
  setTimeout(typeStep, 800);


  // ═══════════════════════════════════════════════════════
  // Hero Canvas — Particle Network
  // ═══════════════════════════════════════════════════════

  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.5 + 0.15,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const opacity = (1 - dist / 140) * 0.12;
          ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
      ctx.fill();

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;
    }

    animId = requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });


  // ═══════════════════════════════════════════════════════
  // Project Network Graph (Hero Panel)
  // ═══════════════════════════════════════════════════════

  const netCanvas = document.getElementById('networkCanvas');
  if (netCanvas) {
    const nctx = netCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const projectNodes = [
      { label: 'Lumos',     color: '0, 240, 255',   angle: 0,       orbitR: 0.32, speed: 0.15 },
      { label: 'EEG',       color: '255, 45, 117',  angle: 1.256,   orbitR: 0.35, speed: 0.12 },
      { label: 'Volt',      color: '0, 255, 136',   angle: 2.513,   orbitR: 0.30, speed: 0.18 },
      { label: 'CERP',      color: '0, 255, 136',   angle: 3.769,   orbitR: 0.28, speed: 0.14 },
      { label: 'ADIPE',     color: '255, 45, 117',  angle: 5.026,   orbitR: 0.33, speed: 0.1 },
    ];

    const netEdges = [[0,1],[0,2],[1,2],[2,3],[3,4],[0,4],[1,3],[0,3]];

    function resizeNetCanvas() {
      const rect = netCanvas.parentElement.getBoundingClientRect();
      netCanvas.width = rect.width * dpr;
      netCanvas.height = 300 * dpr;
      netCanvas.style.width = rect.width + 'px';
      netCanvas.style.height = '300px';
      nctx.scale(dpr, dpr);
    }

    function drawNetGraph() {
      const w = netCanvas.width / dpr;
      const h = netCanvas.height / dpr;
      nctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.5;
      const t = Date.now() * 0.001;

      // Compute positions
      const positions = projectNodes.map(n => {
        const a = n.angle + t * n.speed;
        const rx = w * n.orbitR;
        const ry = h * n.orbitR;
        return {
          x: cx + Math.cos(a) * rx,
          y: cy + Math.sin(a) * ry,
          label: n.label,
          color: n.color,
        };
      });

      // Draw edges with animated pulse
      for (const [a, b] of netEdges) {
        const pa = positions[a];
        const pb = positions[b];
        const pulseAlpha = 0.06 + Math.sin(t * 1.5 + a + b) * 0.04;

        nctx.strokeStyle = `rgba(0, 240, 255, ${pulseAlpha})`;
        nctx.lineWidth = 0.8;
        nctx.beginPath();
        nctx.moveTo(pa.x, pa.y);
        nctx.lineTo(pb.x, pb.y);
        nctx.stroke();

        // Traveling dot along edge
        const progress = (Math.sin(t * 0.8 + a * 2) * 0.5 + 0.5);
        const dotX = pa.x + (pb.x - pa.x) * progress;
        const dotY = pa.y + (pb.y - pa.y) * progress;
        nctx.beginPath();
        nctx.arc(dotX, dotY, 1.2, 0, Math.PI * 2);
        nctx.fillStyle = `rgba(0, 240, 255, 0.3)`;
        nctx.fill();
      }

      // Draw nodes
      for (const p of positions) {
        // Outer glow
        const grad = nctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 18);
        grad.addColorStop(0, `rgba(${p.color}, 0.15)`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);
        nctx.beginPath();
        nctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
        nctx.fillStyle = grad;
        nctx.fill();

        // Core dot
        nctx.beginPath();
        nctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        nctx.fillStyle = `rgba(${p.color}, 0.85)`;
        nctx.fill();

        // Label
        nctx.font = '500 9px "JetBrains Mono", monospace';
        nctx.fillStyle = `rgba(${p.color}, 0.7)`;
        nctx.textAlign = 'center';
        nctx.fillText(p.label, p.x, p.y - 12);
      }

      // Center crosshair
      nctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
      nctx.lineWidth = 0.5;
      nctx.beginPath();
      nctx.moveTo(cx - 12, cy); nctx.lineTo(cx + 12, cy);
      nctx.moveTo(cx, cy - 12); nctx.lineTo(cx, cy + 12);
      nctx.stroke();

      requestAnimationFrame(drawNetGraph);
    }

    resizeNetCanvas();
    drawNetGraph();

    window.addEventListener('resize', resizeNetCanvas);
  }


  // ═══════════════════════════════════════════════════════
  // Mini Canvas Visualizations
  // ═══════════════════════════════════════════════════════

  const vizCanvases = document.querySelectorAll('.pc-viz');

  function drawEmbedding(cvs) {
    const c = cvs.getContext('2d');
    const w = cvs.width;
    const h = cvs.height;
    c.clearRect(0, 0, w, h);

    // Cluster dots
    const clusters = [
      { cx: w * 0.2, cy: h * 0.4, color: '0, 240, 255' },
      { cx: w * 0.5, cy: h * 0.6, color: '255, 45, 117' },
      { cx: w * 0.8, cy: h * 0.35, color: '0, 255, 136' },
    ];

    for (const cl of clusters) {
      for (let i = 0; i < 12; i++) {
        const x = cl.cx + (Math.random() - 0.5) * 50;
        const y = cl.cy + (Math.random() - 0.5) * 30;
        const r = Math.random() * 2 + 1;
        c.beginPath();
        c.arc(x, y, r, 0, Math.PI * 2);
        c.fillStyle = `rgba(${cl.color}, ${Math.random() * 0.5 + 0.3})`;
        c.fill();
      }
    }

    // Faint connection lines between clusters
    c.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    c.lineWidth = 0.5;
    c.beginPath();
    c.moveTo(clusters[0].cx, clusters[0].cy);
    c.lineTo(clusters[1].cx, clusters[1].cy);
    c.lineTo(clusters[2].cx, clusters[2].cy);
    c.stroke();
  }

  function drawWaveform(cvs) {
    const c = cvs.getContext('2d');
    const w = cvs.width;
    const h = cvs.height;
    c.clearRect(0, 0, w, h);

    const offset = Date.now() * 0.001;
    c.strokeStyle = 'rgba(0, 240, 255, 0.5)';
    c.lineWidth = 1.5;
    c.beginPath();
    for (let x = 0; x < w; x++) {
      const t = (x / w) * Math.PI * 6 + offset;
      const y = h / 2 + Math.sin(t) * (h * 0.3) + Math.sin(t * 2.3) * (h * 0.1);
      if (x === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
    c.stroke();

    // Second wave (alpha channel)
    c.strokeStyle = 'rgba(255, 45, 117, 0.25)';
    c.lineWidth = 1;
    c.beginPath();
    for (let x = 0; x < w; x++) {
      const t = (x / w) * Math.PI * 4 + offset * 0.7;
      const y = h / 2 + Math.sin(t) * (h * 0.2) + Math.cos(t * 1.5) * (h * 0.12);
      if (x === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
    c.stroke();
  }

  function drawBars(cvs) {
    const c = cvs.getContext('2d');
    const w = cvs.width;
    const h = cvs.height;
    c.clearRect(0, 0, w, h);

    const barCount = 16;
    const barW = w / barCount * 0.6;
    const gap = w / barCount;
    const offset = Date.now() * 0.0005;

    for (let i = 0; i < barCount; i++) {
      const barH = (Math.sin(i * 0.5 + offset) * 0.5 + 0.5) * h * 0.75 + h * 0.1;
      const x = i * gap + (gap - barW) / 2;
      const alpha = 0.3 + (barH / h) * 0.4;
      c.fillStyle = `rgba(0, 240, 255, ${alpha})`;
      c.fillRect(x, h - barH, barW, barH);
    }
  }

  function drawNodes(cvs) {
    const c = cvs.getContext('2d');
    const w = cvs.width;
    const h = cvs.height;
    c.clearRect(0, 0, w, h);

    const nodes = [
      { x: w * 0.15, y: h * 0.3 },
      { x: w * 0.35, y: h * 0.7 },
      { x: w * 0.5, y: h * 0.25 },
      { x: w * 0.65, y: h * 0.65 },
      { x: w * 0.85, y: h * 0.4 },
    ];

    // Edges
    const edges = [[0,1],[1,2],[2,3],[2,4],[0,2],[3,4]];
    c.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    c.lineWidth = 0.8;
    for (const [a, b] of edges) {
      c.beginPath();
      c.moveTo(nodes[a].x, nodes[a].y);
      c.lineTo(nodes[b].x, nodes[b].y);
      c.stroke();
    }

    // Nodes
    for (const n of nodes) {
      c.beginPath();
      c.arc(n.x, n.y, 3, 0, Math.PI * 2);
      c.fillStyle = 'rgba(0, 240, 255, 0.6)';
      c.fill();
      // Glow
      c.beginPath();
      c.arc(n.x, n.y, 6, 0, Math.PI * 2);
      c.fillStyle = 'rgba(0, 240, 255, 0.1)';
      c.fill();
    }
  }

  function drawNetwork(cvs) {
    const c = cvs.getContext('2d');
    const w = cvs.width;
    const h = cvs.height;
    c.clearRect(0, 0, w, h);

    // 6 nodes in a ring-ish layout
    const nodes = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const rx = w * 0.35;
      const ry = h * 0.35;
      nodes.push({
        x: w / 2 + Math.cos(angle) * rx,
        y: h / 2 + Math.sin(angle) * ry,
      });
    }

    // All-to-some edges
    const edges = [[0,1],[0,3],[1,2],[2,3],[2,5],[3,4],[4,5],[0,5],[1,4]];
    c.strokeStyle = 'rgba(255, 45, 117, 0.2)';
    c.lineWidth = 0.6;
    for (const [a, b] of edges) {
      c.beginPath();
      c.moveTo(nodes[a].x, nodes[a].y);
      c.lineTo(nodes[b].x, nodes[b].y);
      c.stroke();
    }

    // Nodes with different colors (trust levels)
    const colors = ['0, 240, 255', '0, 240, 255', '0, 255, 136', '0, 240, 255', '255, 45, 117', '0, 255, 136'];
    for (let i = 0; i < nodes.length; i++) {
      c.beginPath();
      c.arc(nodes[i].x, nodes[i].y, 3.5, 0, Math.PI * 2);
      c.fillStyle = `rgba(${colors[i]}, 0.7)`;
      c.fill();
      c.beginPath();
      c.arc(nodes[i].x, nodes[i].y, 7, 0, Math.PI * 2);
      c.fillStyle = `rgba(${colors[i]}, 0.1)`;
      c.fill();
    }
  }

  const vizMap = {
    embedding: drawEmbedding,
    waveform: drawWaveform,
    bars: drawBars,
    nodes: drawNodes,
    network: drawNetwork,
  };

  function resizeMiniCanvases() {
    vizCanvases.forEach(cvs => {
      cvs.width = cvs.parentElement.clientWidth - 48; // account for padding
      cvs.height = 50;
    });
  }

  function renderAllViz() {
    vizCanvases.forEach(cvs => {
      const type = cvs.dataset.viz;
      if (vizMap[type]) vizMap[type](cvs);
    });
  }

  resizeMiniCanvases();
  renderAllViz();

  // Animate waveform and bars (they look better animated)
  function animateViz() {
    vizCanvases.forEach(cvs => {
      const type = cvs.dataset.viz;
      if (type === 'waveform' || type === 'bars') {
        vizMap[type](cvs);
      }
    });
    requestAnimationFrame(animateViz);
  }
  animateViz();

  // Re-render static viz every 3s with slight variation
  setInterval(() => {
    vizCanvases.forEach(cvs => {
      const type = cvs.dataset.viz;
      if (type !== 'waveform' && type !== 'bars') {
        vizMap[type](cvs);
      }
    });
  }, 3000);

  window.addEventListener('resize', () => {
    resizeMiniCanvases();
    renderAllViz();
  });


  // ═══════════════════════════════════════════════════════
  // Card Expand / Collapse
  // ═══════════════════════════════════════════════════════

  document.querySelectorAll('.pc-expand').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      const isOpen = target.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      btn.textContent = isOpen ? 'collapse ▲' : 'expand ▼';
    });
  });


  // ═══════════════════════════════════════════════════════
  // Scroll Reveal
  // ═══════════════════════════════════════════════════════

  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 5) * 0.08}s`;
    observer.observe(el);
  });


  // ═══════════════════════════════════════════════════════
  // Mobile Nav Toggle
  // ═══════════════════════════════════════════════════════

  const sbToggle = document.getElementById('sbToggle');
  const sbNav = document.getElementById('sbNav');

  if (sbToggle) {
    sbToggle.addEventListener('click', () => {
      sbNav.classList.toggle('open');
      sbToggle.classList.toggle('open');
    });

    sbNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        sbNav.classList.remove('open');
        sbToggle.classList.remove('open');
      });
    });
  }


  // ═══════════════════════════════════════════════════════
  // Active Nav Tracking
  // ═══════════════════════════════════════════════════════

  const sections = document.querySelectorAll('section[id], footer[id]');
  const navAnchors = document.querySelectorAll('.sb-nav a[href^="#"]');

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
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

});
