# État de la traduction des articles — The DSK Journal

## ✅ Statut : traduction complète (FR / EN / ES)

Les 30 articles sont désormais traduits dans les 3 langues du site. Le
sélecteur de langue (FR / EN / ES) traduit maintenant intégralement chaque
article : titre, citation stylée et chaque paragraphe du corps — aussi bien
sur la page de l'article que sur ses cartes (accueil + page Blog).

## Comment ça fonctionne

Chaque article (titre, catégorie, citation stylée, chaque paragraphe) porte
un attribut `data-i18n` / `data-i18n-html` qui pointe vers `JSON/i18n.json`,
sous le namespace `articles.<slug>.*` :

```json
"articles": {
  "day-200": {
    "title": "Jour 200 : ce que la patience m'a appris",
    "quote": "Si je ne fais rien, rien ne change.<br>Alors je choisis de continuer.",
    "body": { "p0": "...", "p1": "...", "...": "..." }
  }
}
```

- `<slug>` = le nom de fichier sans `article-` ni `.html`
- Les cartes (accueil + page Blog) et la page article pointent vers les
  mêmes clés — traduire une fois traduit les deux affichages.
- La catégorie de chaque article réutilise les clés déjà traduites de
  `blog_page.filters.*`.
- Le "Par"/"By"/"Por" devant chaque signature utilise
  `blog_page.byline_prefix`.
- **Les dates ne sont pas traduites** (le nom du mois reste en français
  quelle que soit la langue affichée) — non couvert par ce chantier,
  à traiter séparément si besoin.

## Pour modifier une traduction existante

1. Ouvrir `JSON/i18n.json`
2. Localiser `en.articles.<slug>` ou `es.articles.<slug>`
3. Modifier `title`, `quote` ou n'importe quel `body.pN`
4. Aucune modification du HTML n'est nécessaire — le changement s'applique
   automatiquement au chargement de la page, dans la langue concernée

## Les 8 articles nés en anglais

Pour ces 8 articles (day-200, choosing-both, twenty-laps-a-night,
my-morning-ritual, the-mistakes-that-taught-me-french,
the-question-that-became-my-engine, why-i-never-stop-asking-questions,
learning-to-speak-up), la version anglaise dans `i18n.json` reprend le
**texte original** que tu avais écrit — pas une traduction FR→EN, pour
rester au plus près de tes mots exacts.
