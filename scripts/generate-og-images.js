// scripts/generate-og-images.js
//
// Génère une image Open Graph (1200×630) par article, reproduisant
// fidèlement le design de la "journal-card" du site (mêmes couleurs,
// mêmes polices, même structure : ARTICLE / titre / citation / date).
//
// Ne dépend d'aucun navigateur headless : Satori dessine le layout
// (flexbox-like) en SVG, resvg le rasterise en PNG. Les polices sont
// embarquées localement via les packages npm @fontsource/*, donc le
// script fonctionne offline / en CI sans accès à fonts.googleapis.com.
//
// Usage : node scripts/generate-og-images.js [slug]
//   - sans argument : régénère toutes les images
//   - avec un slug  : régénère uniquement cette image (pratique en dev)

const fs = require('fs');
const path = require('path');
const satori = require('satori').default;
const { Resvg } = require('@resvg/resvg-js');

const DATA_FILE = path.join(__dirname, 'og-data.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'images', 'og');

const WIDTH = 1200;
const HEIGHT = 630;

// ── Design tokens (copiés de styles/bases/variables.css) ─────────────
const COLORS = {
  bg: '#f0ede8',
  ivoryCard: '#f7f4f0',
  inkDeep: '#1a1a18',
  inkMid: '#5a534e',
  caramel: '#b07d52',
  border: 'rgba(44, 38, 34, 0.18)',
};

// ── Chargement des polices (fichiers .woff embarqués via npm) ────────
function loadFont(pkgFile) {
  return fs.readFileSync(path.join(__dirname, '..', 'node_modules', pkgFile));
}

const fonts = [
  {
    name: 'Cormorant Garamond',
    data: loadFont('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff'),
    weight: 500,
    style: 'normal',
  },
  {
    name: 'Cormorant Garamond',
    data: loadFont('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff'),
    weight: 400,
    style: 'italic',
  },
  {
    name: 'Jost',
    data: loadFont('@fontsource/jost/files/jost-latin-500-normal.woff'),
    weight: 500,
    style: 'normal',
  },
  {
    name: 'Pirata One',
    data: loadFont('@fontsource/pirata-one/files/pirata-one-latin-400-normal.woff'),
    weight: 400,
    style: 'normal',
  },
];

// ── Construction de l'arbre satori (équivalent JSX) ───────────────────
function buildCard({ title, quoteLines, dateLabel }) {
  return {
    type: 'div',
    props: {
      style: {
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: COLORS.bg,
        fontFamily: 'Jost',
      },
      children: {
        type: 'div',
        props: {
          style: {
            width: '1020px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            background: COLORS.ivoryCard,
            border: `2px solid ${COLORS.border}`,
            borderRadius: '6px',
            padding: '42px 92px',
          },
          children: [
            // ARTICLE
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  fontFamily: 'Jost',
                  fontWeight: 500,
                  fontSize: '20px',
                  letterSpacing: '6px',
                  textTransform: 'uppercase',
                  color: COLORS.caramel,
                  marginBottom: '22px',
                },
                children: 'Article',
              },
            },
            // Titre
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontFamily: 'Cormorant Garamond',
                  fontWeight: 500,
                  fontSize: '46px',
                  lineHeight: '58px',
                  color: COLORS.inkDeep,
                },
                children: title,
              },
            },
            // Filet + citation
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  marginTop: '26px',
                  paddingTop: '30px',
                  borderTop: `1px solid ${COLORS.border}`,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        fontFamily: 'Cormorant Garamond',
                        fontSize: '46px',
                        lineHeight: 1,
                        color: COLORS.caramel,
                        marginBottom: '10px',
                      },
                      children: '\u201C',
                    },
                  },
                  ...quoteLines.map((line) => ({
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        fontFamily: 'Cormorant Garamond',
                        fontStyle: 'italic',
                        fontWeight: 400,
                        fontSize: '25px',
                        lineHeight: 1.5,
                        color: COLORS.inkMid,
                      },
                      children: line,
                    },
                  })),
                ],
              },
            },
            // Filet + signature
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  marginTop: '26px',
                  paddingTop: '22px',
                  borderTop: `1px solid ${COLORS.border}`,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        fontFamily: 'Pirata One',
                        fontSize: '22px',
                        color: COLORS.inkMid,
                        marginRight: '10px',
                      },
                      children: 'The DSK Journal',
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        fontFamily: 'Jost',
                        fontWeight: 500,
                        fontSize: '15px',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        color: COLORS.inkMid,
                      },
                      children: `· ${dateLabel}`,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    },
  };
}

async function renderOne(article) {
  const svg = await satori(buildCard(article), {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
  });
  const png = resvg.render().asPng();

  const outPath = path.join(OUTPUT_DIR, `${article.slug}.png`);
  fs.writeFileSync(outPath, png);
  return outPath;
}

async function main() {
  const filterSlug = process.argv[2];
  const articles = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const targets = filterSlug ? articles.filter((a) => a.slug === filterSlug) : articles;

  if (filterSlug && targets.length === 0) {
    console.error(`✖ Aucun article avec le slug "${filterSlug}" dans ${DATA_FILE}`);
    process.exit(1);
  }

  for (const article of targets) {
    const outPath = await renderOne(article);
    console.log(`✔ ${path.relative(process.cwd(), outPath)}`);
  }

  console.log(`\n${targets.length} image(s) générée(s) dans ${path.relative(process.cwd(), OUTPUT_DIR)}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
