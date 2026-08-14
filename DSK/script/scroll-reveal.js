/* ============================================================
   scroll-reveal.js
   Révèle les éléments marqués [data-reveal] quand ils entrent
   dans le viewport, au lieu de les animer au chargement de la
   page avec un délai fixe (l'ancien système : le temps que
   l'utilisateur scrolle jusqu'à "Compétences" ou "Projets",
   l'animation était déjà terminée depuis longtemps).

   USAGE HTML :
     <div data-reveal>...</div>                → fade-up (défaut)
     <div data-reveal="right">...</div>        → fade depuis la gauche
     <div data-reveal style="--reveal-delay: 120ms">...</div>
                                                → décale le départ
                                                  (utile pour faire
                                                  apparaître des cartes
                                                  d'une même rangée
                                                  légèrement l'une
                                                  après l'autre)

   Le style visuel (opacity, transform, transition) vit dans
   base.css — ce fichier ne fait que basculer la classe
   .is-inview au bon moment. Un seul système pour toute la page,
   au lieu d'une animation @keyframes différente par section.

   ACCESSIBILITÉ :
   Respecte prefers-reduced-motion — voir base.css : la
   transition globale est ramenée à ~0ms pour ces utilisateurs,
   donc le contenu apparaît directement, sans mouvement, dès
   qu'il entre dans le viewport (pas besoin de dupliquer la
   logique ici).

   DÉGRADATION :
   Si IntersectionObserver n'existe pas (navigateur très ancien),
   tout le contenu est révélé immédiatement plutôt que de rester
   invisible.
============================================================ */

(function () {
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-inview'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-inview');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -8% 0px'
  });

  revealEls.forEach(el => observer.observe(el));
})();
