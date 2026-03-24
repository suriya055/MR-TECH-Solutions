/* =========================================
   MR TECH Solutions — script.js
   Interactions: Header scroll, B/A Sliders,
   Bottom Nav highlight, Scroll animations
   ========================================= */

// ─── Header scroll shadow ────────────────
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ─── Scroll-spy: Bottom Nav ──────────────
const sections = {
  home:        document.getElementById('home'),
  services:    document.getElementById('services'),
  portfolio:   document.getElementById('portfolio'),
  pricing:     document.getElementById('pricing'),
};
const bnavItems = {
  home:        document.getElementById('bnav-home'),
  services:    document.getElementById('bnav-services'),
  portfolio:   document.getElementById('bnav-portfolio'),
  pricing:     document.getElementById('bnav-pricing'),
};

function highlightNav() {
  const scrollY = window.scrollY + window.innerHeight / 3;
  let current = 'home';
  for (const [key, el] of Object.entries(sections)) {
    if (el && el.offsetTop <= scrollY) current = key;
  }
  for (const [key, el] of Object.entries(bnavItems)) {
    if (!el) continue;
    el.classList.toggle('active', key === current);
  }
}
window.addEventListener('scroll', highlightNav, { passive: true });
highlightNav();

// ─── Scroll Animations (lightweight AOS) ──
function initScrollAnim() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.aosDelay
          ? parseInt(entry.target.dataset.aosDelay)
          : 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
}
initScrollAnim();

// ─── Before/After Image Slider ────────────
function initBASlider(sliderId, afterId, handleId) {
  const slider = document.getElementById(sliderId);
  const after  = document.getElementById(afterId);
  const handle = document.getElementById(handleId);
  if (!slider || !after || !handle) return;

  let dragging = false;
  let pct = 50; // start at 50%

  function updateSlider(x) {
    const rect = slider.getBoundingClientRect();
    let pos = ((x - rect.left) / rect.width) * 100;
    pos = Math.max(2, Math.min(98, pos));
    pct = pos;
    after.style.clipPath  = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left     = `${pct}%`;
  }

  // Mouse events
  handle.addEventListener('mousedown', (e) => {
    dragging = true;
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    updateSlider(e.clientX);
  });
  window.addEventListener('mouseup', () => { dragging = false; });

  // Touch events
  handle.addEventListener('touchstart', (e) => {
    dragging = true;
    e.preventDefault();
  }, { passive: false });
  window.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    updateSlider(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('touchend', () => { dragging = false; });

  // Click anywhere on slider to jump
  slider.addEventListener('click', (e) => {
    updateSlider(e.clientX);
  });

  // Auto-animate on load: sweep from right to left then settle at 50%
  let animPct = 100;
  const startAnim = () => {
    const interval = setInterval(() => {
      animPct -= 2;
      if (animPct < 30) {
        clearInterval(interval);
        // Then sweep back to 50
        let backPct = 30;
        const back = setInterval(() => {
          backPct += 1.5;
          after.style.clipPath = `inset(0 ${100 - backPct}% 0 0)`;
          handle.style.left    = `${backPct}%`;
          if (backPct >= 50) {
            clearInterval(back);
            pct = 50;
          }
        }, 18);
        return;
      }
      after.style.clipPath = `inset(0 ${100 - animPct}% 0 0)`;
      handle.style.left    = `${animPct}%`;
    }, 18);
  };

  // Start animation when slider is in view
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      obs.disconnect();
      setTimeout(startAnim, 400);
    }
  }, { threshold: 0.3 });
  obs.observe(slider);
}

initBASlider('slider1', 'after1', 'handle1');
initBASlider('slider2', 'after2', 'handle2');
initBASlider('slider3', 'after3', 'handle3');

// ─── Smooth Scroll for all anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const headerH = header ? header.offsetHeight : 64;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 10;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── WhatsApp float tooltip on mobile ────
// Show tooltip for 3s on first page load
const waFloat = document.getElementById('wa-float');
if (waFloat) {
  setTimeout(() => {
    waFloat.querySelector('.wa-float-tooltip').style.opacity = '1';
    setTimeout(() => {
      waFloat.querySelector('.wa-float-tooltip').style.opacity = '';
    }, 3000);
  }, 2000);
}
