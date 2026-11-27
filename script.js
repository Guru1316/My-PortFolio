// CURSOR
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx+'px'; cursor.style.top = my+'px'; });
  (function animRing(){ rx += (mx-rx)*0.12; ry += (my-ry)*0.12; ring.style.left = rx+'px'; ring.style.top = ry+'px'; requestAnimationFrame(animRing); })();
  document.querySelectorAll('a,button,.project-card,.skill-tag').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width='16px'; cursor.style.height='16px'; ring.style.width='50px'; ring.style.height='50px'; ring.style.borderColor='rgba(56,189,248,0.8)'; });
    el.addEventListener('mouseleave', () => { cursor.style.width='10px'; cursor.style.height='10px'; ring.style.width='36px'; ring.style.height='36px'; ring.style.borderColor='rgba(56,189,248,0.5)'; });
  });
}

// GSAP HERO
const hasGsap = window.gsap && window.ScrollTrigger && window.ScrollToPlugin;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canAnimate = hasGsap && !prefersReducedMotion;
if (canAnimate) {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  gsap.from('.hero-tag', { opacity:0, x:-20, duration:0.8, delay:0.3, ease:'power3.out', onComplete:()=>{ document.querySelector('.hero-tag').style.opacity=1; } });
  gsap.to('.hero-tag', { opacity:1, x:0, duration:0.8, delay:0.3, ease:'power3.out' });
  gsap.to('.hero-name', { opacity:1, y:0, duration:0.9, delay:0.5, ease:'power3.out' });
  gsap.to('.hero-desc', { opacity:1, y:0, duration:0.8, delay:0.75, ease:'power3.out' });
  gsap.to('.hero-actions', { opacity:1, y:0, duration:0.8, delay:0.95, ease:'power3.out' });
  gsap.to('.hero-stats', { opacity:1, x:0, duration:0.9, delay:1.1, ease:'power3.out' });

  // SCROLL REVEAL
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.fromTo(el, { opacity:0, y:40 }, {
      opacity:1, y:0, duration:0.75, ease:'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    });
  });
}

// NAV scroll
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if(window.scrollY > 50) { nav.style.padding = '0.85rem 4rem'; } else { nav.style.padding = '1.2rem 4rem'; }
  // Mobile specific padding logic
  if(window.innerWidth <= 1024) {
    if(window.scrollY > 50) { nav.style.padding = '0.85rem 2rem'; } else { nav.style.padding = '1.2rem 2rem'; }
  }
  if(window.innerWidth <= 768) {
    if(window.scrollY > 50) { nav.style.padding = '0.85rem 1.5rem'; } else { nav.style.padding = '1rem 1.5rem'; }
  }
});

// Smooth scroll nav & Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navbar = document.getElementById('navbar');
const navScrim = document.getElementById('navScrim');

function setMobileMenuOpen(isOpen) {
  navLinks.classList.toggle('open', isOpen);
  navbar.classList.toggle('menu-open', isOpen);
  navScrim.hidden = !isOpen;
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  navLinks.inert = !isOpen && window.matchMedia('(max-width: 900px)').matches;
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

setMobileMenuOpen(false);
hamburger.addEventListener('click', () => setMobileMenuOpen(!navLinks.classList.contains('open')));
navScrim.addEventListener('click', () => {
  setMobileMenuOpen(false);
  hamburger.focus();
});
window.addEventListener('resize', () => {
  const keepOpen = navLinks.classList.contains('open') && window.matchMedia('(max-width: 900px)').matches;
  setMobileMenuOpen(keepOpen);
});
document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && navLinks.classList.contains('open')) {
    setMobileMenuOpen(false);
    hamburger.focus();
  }
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    const target = document.querySelector(href);
    if(href.length > 1 && target) {
      e.preventDefault();
      setMobileMenuOpen(false);
      if(canAnimate) {
        gsap.to(window, { duration: 0.8, scrollTo: href, ease: 'power2.inOut' });
      } else {
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    }
  });
});

// Counter animation for stats
function animateCounter(el, target, suffix='') {
  let start = 0;
  const duration = 1800;
  const step = timestamp => {
    if(!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const val = Math.floor(progress * target);
    el.textContent = val + suffix;
    if(progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      const stats = document.querySelectorAll('.stat-num');
      const data = [490, 1700, 870, 10];
      const suffix = ['+', '+', '', '+'];
      if(prefersReducedMotion) {
        stats.forEach((el, i) => { el.textContent = i===2 ? '8.70' : data[i] + suffix[i]; });
        heroObserver.disconnect();
        return;
      }
      stats.forEach((el,i) => {
        if(i===2) {
          let s=0, dur=1800, v=870;
          const t = ts => { if(!s)s=ts; const p=Math.min((ts-s)/dur,1); el.textContent=(p*v/100).toFixed(2); if(p<1)requestAnimationFrame(t); };
          requestAnimationFrame(t);
        } else { animateCounter(el, data[i], suffix[i]); }
      });
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.5 });
heroObserver.observe(document.querySelector('.hero-stats'));

// ACTIVE NAVBAR HIGHLIGHT

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

  let currentSection = "";

  sections.forEach(section => {

    const sectionTop = section.offsetTop - 200;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }

  });

  navItems.forEach(link => {

    link.classList.remove("active");

    if(link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }

  });

});