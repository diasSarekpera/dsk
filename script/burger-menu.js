/* ============================================================
   burger-menu.js
   Gère l'ouverture / fermeture du menu mobile (burger).
   - Clic sur le burger
   - Clic sur un lien du menu mobile
   - Touche Échap
============================================================ */

const burger     = document.querySelector('.header__burger');
const mobileMenu = document.getElementById('mobile-menu');

/* Libellés accessibles : lus depuis window.i18n si le module est
   chargé (respecte la langue active), sinon repli sur le français. */
const burgerLabels = {
  open:  { fr: 'Ouvrir le menu', en: 'Open menu',  es: 'Abrir menú'  },
  close: { fr: 'Fermer le menu', en: 'Close menu', es: 'Cerrar menú' }
};

function getBurgerLabel(state) {
  const lang = (typeof i18n !== 'undefined' && i18n.getLang && i18n.getLang()) || 'fr';
  return burgerLabels[state][lang] || burgerLabels[state].fr;
}

function openMenu() {
  burger.classList.add('is-open');
  mobileMenu.classList.add('is-open');
  burger.setAttribute('aria-expanded', 'true');
  burger.setAttribute('aria-label', getBurgerLabel('close'));
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  burger.classList.remove('is-open');
  mobileMenu.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', getBurgerLabel('open'));
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

burger.addEventListener('click', () => {
  burger.classList.contains('is-open') ? closeMenu() : openMenu();
});

mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
    closeMenu();
  }
});
