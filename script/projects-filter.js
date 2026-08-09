/* ============================================================
   projects-filter.js
   Filtre les cartes .project affichées sur /projets.html selon
   la pill de catégorie active. Purement additif : sans JS (ou
   si le script échoue), toutes les cartes restent visibles.
============================================================ */

(function () {

  const pills = document.querySelectorAll('.projects-filters__pill');
  const cards = document.querySelectorAll('.projects-grid .project');
  const emptyState = document.querySelector('.projects-empty');

  if (!pills.length || !cards.length) return;

  function applyFilter(filter) {
    let visibleCount = 0;

    cards.forEach(card => {
      const matches = filter === 'all' || card.dataset.category === filter;
      card.toggleAttribute('data-hidden', !matches);
      if (matches) visibleCount += 1;
    });

    if (emptyState) emptyState.hidden = visibleCount > 0;
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => {
        p.classList.remove('is-active');
        p.setAttribute('aria-pressed', 'false');
      });
      pill.classList.add('is-active');
      pill.setAttribute('aria-pressed', 'true');
      applyFilter(pill.dataset.filter);
    });
  });

})();
