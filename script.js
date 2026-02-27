/* ==========================================
   PRATYUSH CHAND — PORTFOLIO
   Interactive JS: Nav, Scroll Reveal, Cursor, Particles
   ========================================== */

'use strict';

// ──────────────────────────────────────────
// 1. Scroll: Nav glass effect + active link
// ──────────────────────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');
const sections = document.querySelectorAll('section[id], header[id]');

function onScroll() {
  // Scrolled class for nav backdrop
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  // Active nav link highlight
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

// ──────────────────────────────────────────
// 2. Hamburger mobile nav
// ──────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  hamburger.classList.toggle('open');
});

// Close mobile nav on link click
navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// ──────────────────────────────────────────
// 3. Scroll reveal — IntersectionObserver
// ──────────────────────────────────────────
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Staggered delay based on sibling index
        const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'));
        const index = siblings.indexOf(entry.target);
        const delay = Math.min(index * 80, 400);

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

// ──────────────────────────────────────────
// 4. Custom cursor (desktop only)
// ──────────────────────────────────────────
function initCursor() {
  if (window.innerWidth < 768) return;

  const cursor = document.createElement('div');
  cursor.id = 'cursor';
  cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
  document.body.appendChild(cursor);

  // Inject cursor CSS
  const style = document.createElement('style');
  style.textContent = `
    #cursor { position: fixed; top: 0; left: 0; z-index: 9999; pointer-events: none; mix-blend-mode: difference; }
    .cursor-dot { width: 6px; height: 6px; background: #fff; border-radius: 50%; position: absolute; transform: translate(-50%, -50%); transition: transform 0.1s ease; }
    .cursor-ring { width: 36px; height: 36px; border: 1.5px solid rgba(255,255,255,0.5); border-radius: 50%; position: absolute; transform: translate(-50%, -50%); transition: width 0.25s, height 0.25s, border-color 0.25s, transform 0.08s ease; }
    body.cursor-hover .cursor-ring { width: 54px; height: 54px; border-color: rgba(10,132,255,0.7); transform: translate(-50%, -50%) scale(1) ; }
    body.cursor-hover .cursor-dot { transform: translate(-50%, -50%) scale(2.5); background: rgba(10,132,255,0.9); }
  `;
  document.head.appendChild(style);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.querySelector('.cursor-dot').style.transform = `translate(calc(-50% + ${mouseX}px), calc(-50% + ${mouseY}px))`;
  });

  // Smooth ring follow
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursor.querySelector('.cursor-ring').style.transform = `translate(calc(-50% + ${ringX}px), calc(-50% + ${ringY}px))`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover state
  document.querySelectorAll('a, button, .glass-card, .skill-pill, .interest-chip').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ──────────────────────────────────────────
// 5. Glassmorphism tilt effect on cards
// ──────────────────────────────────────────
function initTilt() {
  if (window.innerWidth < 768) return;

  const cards = document.querySelectorAll('.glass-card');
  const MAX_TILT = 6;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -MAX_TILT;
      const rotY = ((x - cx) / cx) * MAX_TILT;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ──────────────────────────────────────────
// 6. Floating particles canvas
// ──────────────────────────────────────────
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles';
  const style = document.createElement('style');
  style.textContent = `#particles { position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.5; }`;
  document.head.appendChild(style);
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.floor((w * h) / 22000);
    return Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.15,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 200, 255, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  particles = createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); particles = createParticles(); });
}

// ──────────────────────────────────────────
// 7. Typing animation for hero title
// ──────────────────────────────────────────
function initTypewriter() {
  const titleEl = document.querySelector('.hero-title');
  if (!titleEl) return;

  const words = ['iOS Developer', 'SwiftUI Engineer', 'UI/UX Enthusiast', 'SwiftUI Craftsman', 'Motorhead'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let pause = false;

  function type() {
    if (pause) { setTimeout(type, 1800); pause = false; return; }

    const word = words[wordIndex];
    if (!isDeleting) {
      titleEl.textContent = word.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === word.length) { isDeleting = true; pause = true; }
    } else {
      titleEl.textContent = word.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(type, isDeleting ? 55 : 90);
  }

  // Start after hero reveals
  setTimeout(type, 1200);
}

// ──────────────────────────────────────────
// 8. YOE stat gentle pulse on entry
// ──────────────────────────────────────────
function initCounters() {
  const yoeEl = document.querySelector('.stat-card:nth-child(1) .stat-num');
  if (!yoeEl) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      let start = 0;
      const target = 2.5;
      const duration = 1200;
      const startTime = performance.now();
      function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        yoeEl.textContent = (start + (target - start) * eased).toFixed(1) + '+';
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }, { threshold: 0.5 });

  const statsContainer = document.querySelector('.hero-stats');
  if (statsContainer) observer.observe(statsContainer);
}

// ──────────────────────────────────────────
// 9. Smooth active nav link style
// ──────────────────────────────────────────
(function injectActiveStyle() {
  const s = document.createElement('style');
  s.textContent = `.nav-link.active { color: var(--text-primary) !important; background: var(--glass); }`;
  document.head.appendChild(s);
})();

// ──────────────────────────────────────────
// INIT
// ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initCursor();
  initTilt();
  initParticles();
  initTypewriter();
  initCounters();
});
