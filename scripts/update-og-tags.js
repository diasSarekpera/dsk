// scripts/update-og-tags.js
//
// Met à jour, dans chaque pages/blog/article-*.html, la balise
//   <meta property="og:image" content="..." />
// pour qu'elle pointe vers l'image dédiée générée par
// generate-og-images.js (assets/images/og/<slug>.png) au lieu de
// l'image générique og-image.png.
//
// Idempotent : peut être relancé sans dupliquer ou casser quoi que
// ce soit (il remplace juste le content="..." existant).

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'pages', 'blog');
const SITE_URL = 'https://dsk.ink';

function main() {
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.startsWith('article-') && f.endsWith('.html'));

  let updated = 0;
  let skipped = 0;

  for (const file of files) {
    const slug = file.replace(/^article-/, '').replace(/\.html$/, '');
    const ogImageUrl = `${SITE_URL}/assets/images/og/${slug}.png`;
    const filePath = path.join(BLOG_DIR, file);
    const html = fs.readFileSync(filePath, 'utf8');

    const ogImageTagRegex = /(<meta property="og:image" content=")([^"]*)("\s*\/?>)/;

    if (!ogImageTagRegex.test(html)) {
      console.warn(`⚠ ${file} : balise og:image introuvable, ignoré`);
      skipped++;
      continue;
    }

    const newHtml = html.replace(ogImageTagRegex, `$1${ogImageUrl}$3`);

    if (newHtml === html) {
      // Déjà à jour
      continue;
    }

    fs.writeFileSync(filePath, newHtml, 'utf8');
    console.log(`✔ ${file} → ${ogImageUrl}`);
    updated++;
  }

  console.log(`\n${updated} page(s) mise(s) à jour, ${skipped} ignorée(s).`);
}

main();
