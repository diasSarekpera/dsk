/* ============================================================
   sticky-header.js
   Gère le comportement sticky du header au scroll.
============================================================ */

const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('is-sticky', window.scrollY > 10);
}, { passive: true });
