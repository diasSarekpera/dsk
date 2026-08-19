// scripts/extract-og-data.js
//
// Lit pages/blog/index.html (la source de vérité déjà utilisée pour
// afficher les cartes) et en extrait, pour chaque article :
//   - slug        (déduit du nom du fichier article-*.html)
//   - title       (texte brut, sans balises)
//   - quoteLines  (la citation, découpée sur les <br>)
//   - date        (attribut datetime + libellé affiché)
//
// Le résultat est écrit dans scripts/og-data.json et sert de source
// unique pour generate-og-images.js.

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const BLOG_INDEX = path.join(__dirname, '..', 'pages', 'blog', 'index.html');
const OUTPUT = path.join(__dirname, 'og-data.json');

function slugFromHref(href) {
  // "article-mon-titre.html" -> "mon-titre"
  return href.replace(/^article-/, '').replace(/\.html$/, '');
}

function main() {
  const html = fs.readFileSync(BLOG_INDEX, 'utf8');
  const $ = cheerio.load(html);

  const articles = [];

  $('.journal-card__link').each((_, el) => {
    const $link = $(el);
    const href = $link.attr('href');
    if (!href) return;

    const slug = slugFromHref(href);
    const title = $link.find('.journal-card__title').text().trim();

    const $quote = $link.find('.journal-card__quote p');
    // On respecte les retours à la ligne volontaires (<br>) de la citation
    const quoteHtml = $quote.html() || '';
    const quoteLines = quoteHtml
      .split(/<br\s*\/?>/i)
      .map((s) => s.replace(/<[^>]+>/g, '').trim())
      .filter(Boolean);

    const $time = $link.find('.journal-card__byline');
    const datetime = $time.attr('datetime') || '';
    const dateLabel = $time.find('.journal-card__byline-date').text().replace('·', '').trim();

    articles.push({ slug, title, quoteLines, datetime, dateLabel });
  });

  fs.writeFileSync(OUTPUT, JSON.stringify(articles, null, 2), 'utf8');
  console.log(`✔ ${articles.length} articles extraits → ${path.relative(process.cwd(), OUTPUT)}`);
}

main();
