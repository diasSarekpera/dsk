/* ============================================================
   blog-filter.js
   Filtre les articles .post affichés sur /blog.html selon la
   pill de catégorie active. Purement additif : sans JS (ou si
   le script échoue), tous les articles restent visibles.
============================================================ */

(function () {

  const pills = document.querySelectorAll('.blog-filters__pill');
  const posts = document.querySelectorAll('.blog-posts-grid .post');
  const emptyState = document.querySelector('.blog-empty');

  if (!pills.length || !posts.length) return;

  function applyFilter(filter) {
    let visibleCount = 0;

    posts.forEach(post => {
      const matches = filter === 'all' || post.dataset.category === filter;
      post.toggleAttribute('data-hidden', !matches);
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
