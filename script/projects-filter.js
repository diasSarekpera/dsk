/* ============================================================
   projects-filter.js
   Filtre les cartes .project-card affichées sur /pages/projets/
   selon le bouton de catégorie actif. Purement additif : sans
   JS (ou si le script échoue), toutes les cartes restent visibles.
============================================================ */

(function () {

  const buttons    = document.querySelectorAll('.filters__button');
  const items       = document.querySelectorAll('.project-grid__item');
  const emptyState  = document.querySelector('.projects-empty');

  if (!buttons.length || !items.length) return;

  function applyFilter(filter) {
    let visibleCount = 0;

    items.forEach(item => {
      const matches = filter === 'all' || item.dataset.category === filter;
      item.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    if (emptyState) emptyState.hidden = visibleCount > 0;
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(b => b.setAttribute('aria-pressed', 'false'));
      button.setAttribute('aria-pressed', 'true');
      applyFilter(button.dataset.filter);
    });
  });

})();
