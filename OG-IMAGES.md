# Images Open Graph des articles

Chaque article du blog a maintenant sa propre image de partage (celle qui
s'affiche quand le lien est partagé sur WhatsApp, Twitter/X, LinkedIn,
iMessage, Discord, etc.), générée automatiquement à partir du même design
que les cartes de `pages/blog/index.html` — pas de capture d'écran manuelle,
pas de générateur d'IA.

## Comment ça marche

1. **`scripts/extract-og-data.js`**
   Lit `pages/blog/index.html` (la source déjà utilisée pour afficher les
   cartes) et en extrait, pour chaque article : titre, citation, date, slug.
   Résultat → `scripts/og-data.json`.

2. **`scripts/generate-og-images.js`**
   Dessine chaque carte en 1200×630 avec [Satori](https://github.com/vercel/satori)
   (layout façon flexbox → SVG) puis [resvg](https://github.com/RazrFalcon/resvg)
   (SVG → PNG). Les polices du site (Cormorant Garamond, Jost, Pirata One)
   sont embarquées localement via les packages npm `@fontsource/*` : le
   script fonctionne donc hors-ligne / en CI, sans dépendre de Google Fonts.
   Résultat → `assets/images/og/<slug>.png`.

3. **`scripts/update-og-tags.js`**
   Met à jour, dans chaque `pages/blog/article-*.html`, la balise
   `<meta property="og:image">` pour qu'elle pointe vers l'image dédiée de
   l'article au lieu de l'image générique `og-image.png`.

## Utilisation

```bash
npm install        # une seule fois

npm run og:build    # extrait + génère + met à jour les balises, en une commande
```

Ou étape par étape :

```bash
npm run og:extract   # régénère scripts/og-data.json
npm run og:generate   # régénère toutes les images (ou : node scripts/generate-og-images.js <slug> pour un seul article)
npm run og:tags       # met à jour les balises og:image
```

## Automatisation (GitHub Actions)

Le workflow `.github/workflows/og-images.yml` relance automatiquement les
3 étapes ci-dessus à chaque `push` qui touche un article ou
`pages/blog/index.html`, et commite les images/balises mises à jour.
Aucune action manuelle nécessaire pour un nouvel article : il suffit de
publier l'article comme d'habitude, les images suivent.

## Ajuster le design de la carte OG

Tout le style visuel (couleurs, tailles, espacements) vit dans
`scripts/generate-og-images.js`, dans la fonction `buildCard()`. Les
couleurs sont reprises telles quelles de `styles/bases/variables.css`.
