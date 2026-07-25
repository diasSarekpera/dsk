/* ============================================================
   nav-indicator.js
   Fait glisser un point caramel sous le lien de navigation
   actif (desktop uniquement) au fil du scroll.

   PRINCIPE :
   - Un élément <span class="nav-indicator"> (petit point rond)
     est injecté dans la <ul class="header__nav-list">.
   - À chaque changement de section active, il se recentre
     sous le bon lien via transform: translateX(),
     avec une transition CSS fluide.
   - Il écoute le même événement que active-nav.js en
     s'appuyant sur un MutationObserver sur les classes
     is-active, pour rester découplé.
============================================================ */

(function () {

  const navList = document.querySelector('.header__nav-list');
  if (!navList) return;

  /* ── 1. Créer et injecter l'indicateur ─────────────────── */

  const indicator = document.createElement('span');
  indicator.className = 'nav-indicator';
  navList.appendChild(indicator);

  /* ── 2. CSS de l'indicateur (injecté en JS pour autonomie) ─ */

  const style = document.createElement('style');
  style.textContent = `
    .header__nav-list {
      position: relative;
    }

    .nav-indicator {
      position:         absolute;
      bottom:           -8px;
      left:             0;
      width:            6px;
      height:           6px;
      background-color: var(--caramel-light, #c8956a);
      border-radius:    50%;
      pointer-events:   none;
      opacity:          0;
      transition:
        transform  350ms cubic-bezier(0.16, 1, 0.3, 1),
        opacity    250ms ease;
    }

    /* Supprimer le point statique du CSS existant
       pour éviter la double marque */
    .header__nav-item.is-active::after {
      display: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .nav-indicator {
        transition: none;
      }
    }
  `;
  document.head.appendChild(style);

  /* ── 3. Positionner l'indicateur sous un élément nav ───── */

  const DOT_SIZE = 6; // px — doit correspondre à width/height dans le CSS ci-dessus

  function moveIndicatorTo(activeItem) {
    if (!activeItem) {
      indicator.style.opacity = '0';
      return;
    }

    const link       = activeItem.querySelector('a');
    const listRect    = navList.getBoundingClientRect();
    const linkRect    = link.getBoundingClientRect();

    /* Centre le point horizontalement sous le lien actif */
    const centerX = (linkRect.left - listRect.left) + (linkRect.width / 2) - (DOT_SIZE / 2);

    indicator.style.transform = `translateX(${centerX}px)`;
    indicator.style.opacity   = '1';
  }

  /* ── 4. Observer les changements de classe is-active ───── */

  const observer = new MutationObserver((mutations) => {
    const relevant = mutations.some(m => m.target.classList.contains('header__nav-item'));
    if (!relevant) return;
    const activeItem = navList.querySelector('.header__nav-item.is-active');
    moveIndicatorTo(activeItem);
  });

  observer.observe(navList, {
    subtree:        true,
    attributeFilter: ['class'],
    attributes:     true
  });

  /* ── 5. Position initiale au chargement ─────────────────── */

  const initialActive = navList.querySelector('.header__nav-item.is-active');
  if (initialActive) {
    /* Léger délai pour que le layout soit prêt */
    requestAnimationFrame(() => moveIndicatorTo(initialActive));
  }

  /* ── 6. Recalculer si la fenêtre est redimensionnée ─────── */

  window.addEventListener('resize', () => {
    const activeItem = navList.querySelector('.header__nav-item.is-active');
    moveIndicatorTo(activeItem);
  }, { passive: true });

})();
