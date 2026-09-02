/* ============================================================
   Moriá Usinagem
   global.js — Comportamentos compartilhados entre páginas
   ============================================================ */

// ─── NAVBAR SCROLL ──────────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  let ticking = false;
  
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  
  // Executa imediatamente na carga para definir o estado inicial
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}
// ─── MOBILE MENU ────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => navMobile.classList.toggle('open'));
  navMobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navMobile.classList.remove('open'));
  });
}

// ─── ACTIVE NAV LINK (highlight current page) ────────────────
(function markActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === 'index.html' && href === '/') || href === './' + current) {
      a.classList.add('active');
    }
  });
})();

// ─── SCROLL REVEAL ──────────────────────────────────────────
if ('IntersectionObserver' in window) {
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => entry.target.classList.add('visible'), idx * 80);
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
} else {
  // Fallback: exibe tudo imediatamente se a API não for suportada
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

/* ── SLIDER DA GALERIA - SERVIÇOS ────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('introGalleryContainer');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  if(container && prevBtn && nextBtn) {
    nextBtn.addEventListener('click', () => {
      const scrollAmount = container.querySelector('.gallery-img').clientWidth + 16;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
    prevBtn.addEventListener('click', () => {
      const scrollAmount = container.querySelector('.gallery-img').clientWidth + 16;
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }
});