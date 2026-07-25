/* ============================================================
   active-nav.js
   Surligne le lien de navigation actif selon la section visible.
   - Met à jour nav desktop + nav mobile
   - Désactive tout quand le footer est visible
============================================================ */

const sections    = document.querySelectorAll('section[id]');
const navItems    = document.querySelectorAll('.header__nav-item');
const mobileItems = document.querySelectorAll('.mobile-menu__item');

function setActiveNav(id) {
  navItems.forEach(item => {
    const link = item.querySelector('a');
    const href = link.getAttribute('href');
    item.classList.toggle('is-active', href === `#${id}` || (id === 'home' && href === '#'));
  });
  mobileItems.forEach(item => {
    const link = item.querySelector('a');
    const href = link.getAttribute('href');
    item.classList.toggle('is-active', href === `#${id}` || (id === 'home' && href === '#'));
  });
}

function clearActiveNav() {
  navItems.forEach(item => item.classList.remove('is-active'));
  mobileItems.forEach(item => item.classList.remove('is-active'));
}

const footerEl = document.getElementById('footer');

const footerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) clearActiveNav();
  });
}, { threshold: 0.1 });

if (footerEl) footerObserver.observe(footerEl);

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActiveNav(entry.target.id);
  });
}, { threshold: 0.35 });

sections.forEach(section => sectionObserver.observe(section));
