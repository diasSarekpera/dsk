/* ============================================================
   skills-animation.js
   Anime les barres de compétences via IntersectionObserver.
   Déclenche le remplissage quand l'élément entre dans le viewport.
============================================================ */

const skillFills = document.querySelectorAll('.skill__bar-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el  = entry.target;
      const pct = el.dataset.fill;
      el.style.width = pct + '%';
      el.classList.add('is-filled');
      skillObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));
