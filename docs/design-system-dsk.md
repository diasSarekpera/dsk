# Design System — Portfolio DSK

Document généré à partir du code existant (`variables.css`, `base.css`, et l'ensemble des
fichiers de sections). Il décrit ce qui est *déjà en place* dans le site, pour que toute
nouvelle page ou tout nouveau composant reste cohérent avec l'existant — y compris pour
quelqu'un d'autre que toi qui reprendrait le projet.

---

## 1. Philosophie du design

Trois partis pris traversent tout le site :

- **Chaleur plutôt que froideur.** Pas de blanc pur ni de noir pur nulle part. Le fond est
  ivoire (`#f0ede8`), le texte est une encre presque noire mais teintée (`#1a1a18`). Ce
  choix évite le rendu "template SaaS" et donne un rendu plus proche d'un studio créatif
  ou d'une maison haut de gamme.
- **Une seule couleur d'accent : le caramel.** Pas de palette multicolore, pas de dégradés.
  Le caramel (`#b07d52`) est utilisé avec parcimonie — un survol, un point, un trait, une
  bordure au focus — jamais en grande surface. C'est ce qui rend chaque touche de couleur
  significative plutôt que décorative.
- **Le contraste vient de la typographie, pas de la couleur.** Les titres sont en serif
  italique fin (Cormorant Garamond), le reste du texte en sans-serif droit (Jost). C'est
  cette opposition italique/droit, serif/sans-serif, qui structure visuellement la page —
  pas des blocs de couleur.

---

## 2. Fondations (design tokens)

Tous les tokens vivent dans **`styles/bases/variables.css`**, source unique de vérité.
Aucune couleur, taille ou espacement ne devrait être écrit en dur ailleurs dans le CSS.

### 2.1 Polices

| Rôle | Variable | Police | Usage |
|---|---|---|---|
| Titres | `--font-display` | *Cormorant Garamond* | Tous les titres de section, le nom en hero, les taglines italiques, le logo du footer |
| Corps | `--font-body` | *Jost* | Paragraphes, labels, navigation, boutons, formulaires |

Chargées via `<link>` dans le `<head>` (pas de `@import` dans le CSS, pour éviter un
aller-retour réseau bloquant supplémentaire).

**Convention d'usage du serif :** `font-style: italic` + `font-weight: 300` pour les
grands titres et taglines (effet léger, élégant). Le poids monte à 400–500 seulement pour
les sous-titres plus courts (`.about__role`, `.contact__form-title`).

### 2.2 Couleurs

| Variable | Valeur | Rôle |
|---|---|---|
| `--color-bg` | `#f0ede8` | Fond de page général |
| `--ivory-card` | `#f7f4f0` | Fond des cartes, champs au focus, menu mobile |
| `--ink-deep` | `#1a1a18` | Titres, boutons pleins, texte le plus contrasté |
| `--ink-base` | `#2c2622` | Texte courant, labels |
| `--ink-mid` | `#5a534e` | Texte secondaire, légendes, icônes discrètes |
| `--caramel` | `#b07d52` | **Seul** accent — hover, focus, liens actifs |
| `--caramel-light` | `#c8956a` | Variante plus claire de l'accent (petits détails, points) |
| `--caramel-pale` | `#e8d5c4` | Fond très clair (sélection de texte, halo de survol) |
| `--status-online` | `#5a9c5a` | Statut "disponible" uniquement |
| `--status-error` | `#c0574a` | Validation de formulaire uniquement |

**Variantes RGB** (`--ink-base-rgb`, `--ink-deep-rgb`, `--ivory-rgb`) existent pour
composer des `rgba()` avec transparence — voir échelle d'opacités ci-dessous.

**Règle stricte : pas de nouvelle couleur.** Un besoin de nuance supplémentaire se résout
avec `rgba(var(--x-rgb), alpha)`, jamais avec un nouveau code hexadécimal.

### 2.3 Échelle d'opacités

Plutôt que choisir une transparence au hasard à chaque composant, le projet pioche dans
une échelle fixe et documentée :

| Token | Valeur | Usage typique |
|---|---|---|
| `--alpha-06` | 0.06 | Trace décorative la plus discrète |
| `--alpha-08` | 0.08 | Ombres légères |
| `--alpha-10` | 0.10 | Bordures/séparateurs discrets sur fond sombre |
| `--alpha-18` | 0.18 | Bordures un peu plus marquées sur fond clair |
| `--alpha-20` | 0.20 | Bordures d'éléments interactifs sur fond sombre |
| `--alpha-35` | 0.35 | Texte peu appuyé sur fond sombre |
| `--alpha-50` | 0.50 | Texte moyen (nav du footer) |
| `--alpha-60` | 0.60 | Texte plus visible sur fond sombre |
| `--alpha-92` | 0.92 | Quasi-opaque sur fond sombre |

Tokens composés prêts à l'emploi : `--border-on-ink`, `--border-on-ink-soft`,
`--text-on-ink-mid`, `--text-on-ink-strong`, `--bg-on-ink-heavy`, `--border-on-light`,
`--shadow-soft`.

### 2.4 Espacements

Échelle en base 4px. Le nombre dans le nom = nombre d'unités de 4px
(`--space-4` = 4 × 4px = 16px). Toujours préférer une valeur de l'échelle à une valeur
libre écrite en dur.

`--space-1` (4px) · `--space-1-5` (6px) · `--space-2` (8px) · `--space-2-5` (10px) ·
`--space-3` (12px) · `--space-4` (16px) · `--space-5` (20px) · `--space-5-5` (22px) ·
`--space-6` (24px) · `--space-7` (28px) · `--space-8` (32px) · `--space-10` (40px) ·
`--space-12` (48px) · `--space-14` (56px) · `--space-16` (64px) · `--space-18` (72px) ·
`--space-20` (80px) · `--space-24` (96px) · `--space-28` (112px)

### 2.5 Typographie UI (texte courant)

Concerne labels, boutons, nav, paragraphes — pas les titres, qui restent en `clamp()`
calibrés section par section (voir 2.6).

| Token | Valeur | Usage |
|---|---|---|
| `--text-xs` | 11px | Badges, labels, sur-titres |
| `--text-sm` | 12px | Boutons, petites étiquettes |
| `--text-base` | 13px | Texte d'interface standard |
| `--text-md` | 14px | Corps de texte secondaire |
| `--text-lg` | 15px | Corps de texte principal (`body` par défaut) |
| `--text-xl` | 17px | Accroche, texte mis en valeur |

### 2.6 Titres en `clamp()`

Les titres de section et le hero utilisent des `clamp()` propres à chaque contexte
(longueur du texte, densité de mise en page) plutôt qu'une échelle commune — choix
assumé pour garder un calibrage fluide fin. Exemples déjà en place :

- Hero (nom) : `clamp(4.5rem, 11vw, 9.5rem)` et `clamp(3.5rem, 9.5vw, 8rem)`
- Titre de section générique (`.section-title`) : `clamp(3rem, 6vw, 5.5rem)`
- Titre de carte projet : `clamp(1.375rem, 1.8vw, 1.75rem)`
- Titre d'article de blog : `clamp(1.1875rem, 1.5vw, 1.5rem)`

### 2.7 Rayons

| Token | Valeur | Usage |
|---|---|---|
| `--radius-sm` | 2px | Boutons, champs, cartes sociales — **le rayon par défaut du site** |
| `--radius-md` | 3px | Cartes plus grandes (projet, article, contact) |
| `--radius-full` | 50% | Cercles (avatars, icônes rondes) |
| `--radius-pill` | 9999px | Pastilles, points de statut |

**Le site n'est volontairement pas "arrondi".** Les rayons restent très faibles (2–3px) :
c'est un signal esthétique fort (sobre, architectural) à préserver sur toute nouvelle page.

### 2.8 Largeur de contenu & z-index

- `--container-max` : 1440px — largeur max de toutes les sections.
- Échelle de z-index nommée, à utiliser systématiquement plutôt qu'un nombre choisi au
  hasard : `--z-base` (0) · `--z-raised` (1) · `--z-sticky` (2) · `--z-overlay` (200) ·
  `--z-modal` (300) · `--z-header` (400, toujours au-dessus du menu mobile plein écran
  pour que le burger reste cliquable comme bouton de fermeture).

### 2.9 Breakpoints (fixes, pas des variables)

Le CSS natif ne permet pas `var()` dans une media query sans préprocesseur. Les paliers
sont donc documentés ici et à utiliser tels quels :

| Breakpoint | Usage |
|---|---|
| 480px | Mobile |
| 768px | Tablette portrait / bascule vers menu burger |
| 900px | Tablette / grilles complexes (cartes qui empilent) |
| 1024px | Petit desktop / tablette paysage |
| 1440px | Largeur max du contenu |

Exception documentée dans le code : `contact.css` (et donc `form/style.css` qui en hérite
l'esprit) utilise aussi 1100px, un ajustement fin propre à la mise en page à deux colonnes.

---

## 3. Structure de page & rythme vertical

Chaque section (`about`, `skills`, `work`, `blog`, `contact`) partage la même carcasse :

```
max-width: var(--container-max);
margin: 0 auto;
padding: var(--space-28) var(--space-24) var(--space-24);
```

avec une **ligne verticale décorative** à gauche (`::before`, 1px, `--ink-mid` à 30%
d'opacité), qui commence au niveau du contenu et s'arrête en bas de section — supprimée
sur mobile (≤768px) faute de place.

### Éléments de section récurrents

- **`.section-index`** : numéro de section (ex. "02 / 07") en petit texte vertical
  (`writing-mode: vertical-rl`), aligné sur la ligne décorative.
- **`.section-eyebrow`** : sur-titre en majuscules, `letter-spacing: 0.14em`, couleur
  `--ink-mid` — utilisé avant chaque titre de section.
- **`.section-title`** : le grand titre italique serif (`clamp(3rem, 6vw, 5.5rem)`).
- **`.section-title-rule`** : petit trait caramel (40px) + point caramel-light (5px) sous
  le titre — signature visuelle du site, à reprendre sur toute nouvelle page/section.
- **`.section-divider`** : ligne + label (ex. "06 / 07") en bas de section, avec une
  micro-animation d'apparition au scroll.

### Système de reveal au scroll

Un seul système générique (`[data-reveal]`) pilote toutes les apparitions au scroll via
un `IntersectionObserver` (`script/scroll-reveal.js`) plutôt qu'une animation + délai fixe
par élément :

```css
[data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 600ms cubic-bezier(0,0,0.3,1),
              transform 600ms cubic-bezier(0,0,0.3,1);
  transition-delay: var(--reveal-delay, 0ms);
}
[data-reveal].is-inview { opacity: 1; transform: none; }
```

`[data-reveal="right"]` pour une entrée latérale plutôt que verticale.

**Accessibilité :** `@media (prefers-reduced-motion: reduce)` neutralise globalement
toutes les animations/transitions (ramenées à 0.01ms) — géré une seule fois dans
`base.css`, pas répété section par section.

---

## 4. Composants

### 4.1 Boutons

Bouton de base, contour uniquement (`.btn`) :

```css
.btn {
  border: 1px solid var(--ink-deep);
  color: var(--ink-deep);
  background: transparent;
  border-radius: var(--radius-sm);
  padding: 0.875rem var(--space-7);
  font-size: var(--text-sm);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.btn:hover { background: var(--ink-deep); color: var(--color-bg); }
```

Variante accentuée `.btn--caramel` : mêmes proportions, bordure et texte caramel, fond
caramel + texte ivoire au survol.

Bouton plein (formulaires, CTA principal) : fond `--ink-deep` direct, hover → `--caramel`
(voir `.contact__submit`, `.submit` dans le formulaire). C'est le seul bouton qui est
"plein" par défaut plutôt qu'au survol — réservé aux actions principales (envoyer,
soumettre).

Toutes les flèches de bouton (`.btn__arrow`, `.submit svg`) glissent de quelques pixels
vers la droite au survol (`translateX`), jamais de simple changement de couleur seul.

### 4.2 Champs de formulaire

Pattern constant sur tout le site (contact, formulaire de collecte) :

- Label au-dessus, majuscules, `font-weight: 600`, `letter-spacing: 0.08em`, `--text-sm`.
- Icône SVG (style *Feather*, `stroke-width: 1.5`, `fill: none`) positionnée en absolu à
  gauche à l'intérieur du champ.
- Champ : hauteur fixe 52px, fond `--color-bg`, bordure `--border-on-light`,
  `border-radius: var(--radius-sm)`.
- **Hover** : bordure qui fonce légèrement (`rgba(ink-base, 0.35)`).
- **Focus** : bordure `--caramel` + fond qui passe à `--ivory-card`. L'icône associée
  passe aussi en caramel (`:focus-within .field-icon`).
- Validation native HTML5 : n'apparaît qu'après que l'utilisateur a commencé à saisir
  (`:not(:placeholder-shown)`), jamais sur un champ vide — pour ne pas montrer un champ
  obligatoire "en erreur" avant même que la personne ait pu le remplir.

### 4.3 Cartes

Trois variantes de cartes, même base (`--ivory-card`, bordure `--border`, radius-md) :

- **Carte projet** (`.project__link`) : pas de bordure/fond propre, juste l'image avec un
  radius, un overlay caramel en dégradé qui apparaît au survol, l'image qui zoome
  légèrement (`scale(1.05)`) et se désature moins.
- **Carte article** (`.post`) : bordure + fond + radius visibles, structure image/texte
  empilée.
- **Carte contact** (`.contact__card`) : deux colonnes (info sombre + formulaire clair)
  dans un même conteneur radius-md.

### 4.4 Badges & statut

Point de statut "disponible" (`--status-online`, 7px, `border-radius: pill`) avec
animation `dot-pulse` en boucle — réutilisé à l'identique dans le hero, l'about et le
footer. Toujours accompagné d'un label en majuscules à côté, jamais seul.

### 4.5 Navigation

- Logo : texte encadré (`border: 1px solid --ink-deep`, padding serré) qui s'inverse
  complètement au survol (fond ink-deep, texte ivoire) — **c'est le traitement visuel de
  base du logo "DSK"**, à reprendre sur toute déclinaison du logo.
- Liens de nav : majuscules, `letter-spacing: 0.14em`, `--ink-base` → `--caramel` au
  survol ; lien actif marqué par un point caramel-light sous le lien (pas de soulignement
  classique).
- Menu mobile : plein écran, fond `--ivory-card`, liens en grand serif italique quand
  actifs.
- Sélecteur de langue : pastilles collées avec bordures internes en desktop, pastilles
  séparées de 44px (zone tactile) en mobile — les deux ne sont pas le même composant
  redimensionné, mais deux traitements pensés pour leur contexte.

### 4.6 Footer

Structure en deux temps : zone claire (logo géant italique + tagline + statut + réseaux,
avec un **watermark "DSK" géant en filigrane** en arrière-plan, juste un contour à 4.5%
d'opacité) puis bande sombre (`--ink-deep`) pour la nav secondaire et le copyright.

---

## 5. Accessibilité

- `:focus-visible` global : `outline: 2px solid var(--caramel)`, `offset: 3px`.
- Zones tactiles d'au moins 44×44px pour tout élément interactif mobile (burger, réseaux
  sociaux, sélecteur de langue mobile).
- `prefers-reduced-motion: reduce` neutralise toutes les animations d'un coup, pas de
  gestion au cas par cas.
- Contraste : le texte le plus clair (`--ink-mid` sur `--color-bg`) reste lisible ; les
  informations importantes ne reposent jamais sur la couleur seule (le point de statut a
  toujours un label texte à côté).

---

## 6. Conventions de code (comment on écrit du CSS ici)

- **Un fichier CSS par section/composant**, importé depuis un point d'entrée (pas de gros
  fichier monolithique).
- **Zéro couleur, taille ou espacement écrit en dur** hors de `variables.css` — toujours
  passer par un token, quitte à en composer un nouveau avec l'échelle d'alpha existante.
- **Commenter le "pourquoi", pas le "quoi"** quand une décision n'est pas évidente à la
  lecture (ex. pourquoi `100svh` plutôt que `100dvh`, pourquoi le breakpoint 1100px
  n'existe que dans `contact.css`). Un commentaire qui répète juste la propriété CSS
  n'apporte rien.
- **Chaque exception aux règles ci-dessus doit être documentée en commentaire** à
  l'endroit où elle apparaît, pas supposée "comprise".

---

## 7. Ce qui est délibérément hors système

- Le fond sombre (`--ink-deep`) n'apparaît que sur des zones ponctuelles à fort contraste
  (colonne info du contact, bande basse du footer, boutons pleins) — jamais comme fond de
  section entière.
- Aucune ombre portée classique (`box-shadow` flou) n'est utilisée pour donner du volume ;
  le seul usage de `shadow-soft` est très discret (barre de nav sticky).
- Pas de dégradé visible sauf un seul, très subtil, sur l'overlay des cartes projet au
  survol (caramel à 18% d'opacité) — jamais en fond de section.

---

*Document à mettre à jour à chaque nouveau composant ou section ajoutée au site, pour
qu'il reste le reflet fidèle du code plutôt qu'une intention de départ oubliée.*
