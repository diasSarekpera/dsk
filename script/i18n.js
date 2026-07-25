/* ============================================================
i18n — Système de traduction multilingue
   Langues : FR (défaut) | EN | ES

   STRATÉGIE DE CHARGEMENT :
   1. Tentative de fetch du fichier /JSON/i18n.json
   2. En cas d'échec (CORS, fichier absent, etc.),
      utilisation des traductions embarquées en fallback.

   ATTRIBUTS HTML PRIS EN CHARGE :
     data-i18n               → contenu textuel du nœud
     data-i18n-placeholder   → attribut placeholder
     data-i18n-aria-label    → attribut aria-label
     data-i18n-alt           → attribut alt
     (balise <title>)        → document.title
============================================================ */

const i18n = (() => {

  let currentLang  = 'fr';
  let translations = {};

  /* ── Résolution d'une clé pointée "a.b.c" ─────────────── */
  function resolvePath(obj, path) {
    return path.split('.').reduce((acc, key) => {
      return (acc && acc[key] !== undefined) ? acc[key] : null;
    }, obj);
  }

  /* ── Retourner la traduction d'une clé ─────────────────── */
  function t(key) {
    const value = resolvePath(translations[currentLang], key);
    if (value === null || typeof value === 'object') {
      // Si la valeur est un objet (clé mal configurée), on avertit
      console.warn(`[i18n] Clé introuvable ou non-scalaire : "${key}" (lang: ${currentLang})`);
      return key;
    }
    return value;
  }

  /* ── Appliquer toutes les traductions au DOM ────────────── */
  function applyTranslations() {

    /* 1. data-i18n → contenu textuel */
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key   = el.getAttribute('data-i18n');
      const value = t(key);
      if (!value || value === key) return;

      /* Préserver les enfants non-texte (SVG, etc.) */
      const nonTextChildren = Array.from(el.childNodes).filter(
        n => n.nodeType === Node.ELEMENT_NODE && n.tagName.toLowerCase() !== 'br'
      );

      if (nonTextChildren.length > 0) {
        /* Supprimer les nœuds texte et <br> existants */
        Array.from(el.childNodes).forEach(n => {
          if (
            n.nodeType === Node.TEXT_NODE ||
            (n.nodeType === Node.ELEMENT_NODE && n.tagName.toLowerCase() === 'br')
          ) {
            el.removeChild(n);
          }
        });
        /* Insérer le nouveau texte avant le premier enfant non-texte */
        const frag = document.createDocumentFragment();
        const parts = value.split('\n');
        parts.forEach((part, i) => {
          frag.appendChild(document.createTextNode(part));
          if (i < parts.length - 1) frag.appendChild(document.createElement('br'));
        });
        el.insertBefore(frag, nonTextChildren[0]);
      } else if (value.includes('\n')) {
        el.innerHTML = value.split('\n').join('<br>');
      } else {
        el.textContent = value;
      }
    });

    /* 2. data-i18n-placeholder */
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key   = el.getAttribute('data-i18n-placeholder');
      const value = t(key);
      if (value && value !== key) el.setAttribute('placeholder', value);
    });

    /* 3. data-i18n-aria-label */
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      const key   = el.getAttribute('data-i18n-aria-label');
      const value = t(key);
      if (value && value !== key) el.setAttribute('aria-label', value);
    });

    /* 4. data-i18n-alt */
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key   = el.getAttribute('data-i18n-alt');
      const value = t(key);
      if (value && value !== key) el.setAttribute('alt', value);
    });

    /* 5. <title> */
    const titleEl = document.querySelector('title[data-i18n]');
    if (titleEl) {
      const key   = titleEl.getAttribute('data-i18n');
      const value = t(key);
      if (value && value !== key) document.title = value;
    }

    /* 6. Attribut lang sur <html> */
    document.documentElement.setAttribute('lang', currentLang);
  }

  /* ── Mettre à jour les boutons du sélecteur de langue ───── */
  function updateLangButtons(lang) {
    document.querySelectorAll('.lang-switcher__btn').forEach(btn => {
      const isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  /* ── Changer la langue active ───────────────────────────── */
  function setLang(lang) {
    if (!translations[lang]) {
      console.error(`[i18n] Langue non disponible : "${lang}"`);
      return;
    }
    currentLang = lang;
    applyTranslations();
    updateLangButtons(lang);
  }

  /* ── Retourner la langue active ─────────────────────────── */
  function getLang() { return currentLang; }

  /* ── Attacher les événements sur les boutons ────────────── */
  function bindButtons() {
    document.querySelectorAll('.lang-switcher__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        if (lang && lang !== currentLang) setLang(lang);
      });
    });
  }

  /* ── Traductions embarquées (fallback si fetch échoue) ──── */
  function getInlineTranslations() {
    return {
      fr: {
        meta: { title: "Dias Sare Kpera - Développeur Web & Créateur de savoirs" },
        header: { burger: { open: "Ouvrir le menu", close: "Fermer le menu" } },
        nav: { home: "Accueil", about: "À propos", skills: "Compétences", work: "Projets", blog: "Blog", contact: "Contact" },
        hero: {
          role: "Développeur Web - Créateur & Passionné de savoir",
          status: "Disponible pour des projets",
          scroll: "Défiler",
          tagline: "Créer, apprendre, transmettre -\nconstruire le web avec intention."
        },
        about: {
          eyebrow: "À propos de moi",
          title: "La curiosité\nà l'œuvre.",
          photo: { alt: "Portrait de Dias Sare Kpera" },
          availability: "Disponible pour des projets",
          role: "Développeur Web & Créateur de contenus",
          tagline: "Je suis développeur web en progression, passionné par la création d'interfaces modernes et par la transmission du savoir. Je construis des expériences numériques avec soin, en apprenant chaque jour.",
          info: {
            birthday: { label: "Date de naissance", value: "1er mai 1995" },
            age:      { label: "Âge",               value: "30 ans" },
            website:  { label: "Site web",           value: "www.example.com" },
            degree:   { label: "Diplôme",            value: "Master" },
            phone:    { label: "Téléphone",          value: "+123 456 7890" },
            email:    { label: "E-mail",             value: "email@example.com" },
            city:     { label: "Ville",              value: "Cotonou, Bénin" },
            freelance:{ label: "Freelance",          value: "Disponible" }
          },
          bio: "Je suis basé à Cotonou et je conçois des sites vitrines, des maquettes et des interfaces avec une attention particulière à la cohérence visuelle et à l'expérience utilisateur. Au-delà du code, je suis animé par une curiosité profonde pour l'éducation, la connaissance et le développement humain. À travers des projets comme Cultivora Land et The DSK Journal, je cherche à rendre les idées accessibles et à encourager une réflexion constructive sur le monde. Je crois que chaque difficulté est une occasion de grandir - et que créer, apprendre et transmettre sont les valeurs qui donnent du sens à mon parcours.",
          cta: { contact: "En savoir plus", cv: "Voir mes projets" }
        },
        skills: {
          eyebrow: "Ce que je fais",
          title: "Compétences &\noutils.",
          intro: "Les langages et outils que je maîtrise et continue d'approfondir chaque jour, avec l'objectif de devenir un développeur full-stack complet.",
          html:  { name: "HTML",       aria: "HTML - 100%" },
          css:   { name: "CSS",        aria: "CSS - 90%" },
          js:    { name: "Javascript", aria: "JavaScript - 75%" },
          react: { name: "React JS",   aria: "React JS - 80%" },
          node:  { name: "Node JS",    aria: "Node JS - 70%" },
          figma: { name: "Figma",      aria: "Figma - 65%" }
        },
        work: {
          eyebrow: "Projets réalisés",
          title: "Créations &\nprojets.",
          cta: "Voir tous les projets",
          cta_aria: "Voir tous les projets",
          project1: { aria: "Voir Cultivora Land",  img: { alt: "Cultivora Land - Le Jardin du Savoir" },    category: "Éducation & Savoir",   name: "Cultivora Land",  desc: "Le Jardin du Savoir - une plateforme pour\nrendre l'apprentissage inspirant et accessible." },
          project2: { aria: "Voir The DSK Journal", img: { alt: "The DSK Journal - carnet de réflexions" },  category: "Blog & Réflexions",    name: "The DSK Journal", desc: "Un espace d'écriture pour partager des idées,\nobserver et réfléchir sur le monde." },
          project3: { aria: "Voir Portfolio DSK",   img: { alt: "Portfolio DSK - interface web moderne" },   category: "Site vitrine",          name: "Portfolio DSK",   desc: "Conception et développement de ce portfolio -\nHTML, CSS, JavaScript, fait avec soin." }
        },
        blog: {
          eyebrow: "Écrits & réflexions",
          title: "Le\njournal.",
          cta: "Tous les articles",
          cta_aria: "Voir tous les articles",
          readmore: "Lire la suite",
          post1: { aria: "Lire : Pourquoi j'apprends à coder seul", tag: "Développement",        img: { alt: "Écran d'ordinateur affichant du code" },        category: "Développement",         date: "8 mars 2025",      title: "Pourquoi j'apprends à coder seul - et ce que ça m'a appris sur moi",      excerpt: "Apprendre le développement web sans école ni mentor, c'est une aventure autant technique qu'humaine. Voici ce que le chemin m'a enseigné." },
          post2: { aria: "Lire : L'éducation comme outil de transformation sociale", tag: "Éducation", img: { alt: "Livres et cahiers ouverts sur un bureau" }, category: "Éducation",             date: "21 fév. 2025",     title: "L'éducation comme outil de transformation sociale",                        excerpt: "Je crois que apprendre peut changer une société. Voici pourquoi je consacre une partie de mon énergie à rendre le savoir plus accessible et plus vivant." },
          post3: { aria: "Lire : L'échec comme enseignant",          tag: "Développement personnel", img: { alt: "Bureau avec carnet et stylo ouvert" },       category: "Développement personnel", date: "14 jan. 2025",    title: "L'échec comme enseignant - réflexions sur la progression",                excerpt: "Chaque erreur contient une leçon. Voici comment j'ai appris à regarder mes difficultés non pas comme des obstacles, mais comme des étapes." }
        },
        contact: {
          eyebrow: "Prendre contact",
          title: "Construisons\nensemble.",
          copyright: "© 2025 Dias Sare Kpera - Tous droits réservés.",
          info: {
            title: "Une idée, un projet,\nune question ?",
            subtitle: "N'hésite pas à m'écrire - je lis chaque\nmessage et réponds sous 24 heures.",
            email:    { label: "E-mail",       value: "email@example.com" },
            phone:    { label: "Téléphone",    value: "+123 456 7890" },
            location: { label: "Localisation", value: "Cotonou, Bénin" }
          },
          form: {
            title: "Envoyer un message",
            desc: "Parle-moi de ton projet, d'une idée de collaboration -\nou dis simplement bonjour.",
            name:    { label: "Nom complet",    placeholder: "Jean Dupont" },
            email:   { label: "Adresse e-mail", placeholder: "jean@exemple.com" },
            subject: { label: "Objet",          placeholder: "Projet, collaboration, question…" },
            message: { label: "Message",        placeholder: "Décris-moi ton projet ou simplement ce qui t'a amené ici…" },
            note: "Je réponds sous 24 heures.",
            submit: "Envoyer le message"
          }
        },
        footer: {
          tagline: "Développeur web, curieux insatiable, passionné de savoir.\nJe crée, j'apprends, je transmets - chaque jour un peu plus.",
          status: "Disponible pour des projets",
          copy: "© 2025 Dias Sare Kpera - Tous droits réservés."
        }
      },

      en: {
        meta: { title: "Dias Sare Kpera - Web Developer & Knowledge Creator" },
        header: { burger: { open: "Open menu", close: "Close menu" } },
        nav: { home: "Home", about: "About", skills: "Skills", work: "Projects", blog: "Blog", contact: "Contact" },
        hero: {
          role: "Web Developer - Creator & Knowledge Enthusiast",
          status: "Available for projects",
          scroll: "Scroll",
          tagline: "Create, learn, share -\nbuilding the web with intention."
        },
        about: {
          eyebrow: "About me",
          title: "Curiosity\nat work.",
          photo: { alt: "Portrait of Dias Sare Kpera" },
          availability: "Available for projects",
          role: "Web Developer & Content Creator",
          tagline: "I am a growing web developer, passionate about crafting modern interfaces and sharing knowledge. I build digital experiences with care, learning something new every day.",
          info: {
            birthday: { label: "Date of birth", value: "May 1, 1995" },
            age:      { label: "Age",           value: "30 years old" },
            website:  { label: "Website",       value: "www.example.com" },
            degree:   { label: "Degree",        value: "Master's" },
            phone:    { label: "Phone",         value: "+123 456 7890" },
            email:    { label: "E-mail",        value: "email@example.com" },
            city:     { label: "City",          value: "Cotonou, Benin" },
            freelance:{ label: "Freelance",     value: "Available" }
          },
          bio: "Based in Cotonou, I design showcase websites, mockups and interfaces with a particular focus on visual consistency and user experience. Beyond the code, I am driven by a deep curiosity for education, knowledge and human development. Through projects like Cultivora Land and The DSK Journal, I seek to make ideas accessible and encourage constructive thinking about the world. I believe every difficulty is an opportunity to grow - and that creating, learning and sharing are the values that give meaning to my journey.",
          cta: { contact: "Learn more", cv: "View my work" }
        },
        skills: {
          eyebrow: "What I do",
          title: "Skills &\ntools.",
          intro: "The languages and tools I master and continue to deepen every day, with the goal of becoming a complete full-stack developer.",
          html: { name: "HTML",            aria: "HTML - 100%" },
          css:  { name: "CSS",             aria: "CSS - 90%" },
          js:   { name: "Javascript",      aria: "JavaScript - 75%" },
          react: { name: "React JS",   aria: "React JS - 80%" },
          node:  { name: "Node JS",    aria: "Node JS - 70%" },
          figma: { name: "Figma",      aria: "Figma - 65%" }
        },
        work: {
          eyebrow: "Selected projects",
          title: "Work &\nprojects.",
          cta: "View all projects",
          cta_aria: "View all projects",
          project1: { aria: "View Cultivora Land",  img: { alt: "Cultivora Land - The Garden of Knowledge" },         category: "Education & Knowledge",  name: "Cultivora Land",  desc: "The Garden of Knowledge - a platform to\nmake learning inspiring and accessible." },
          project2: { aria: "View The DSK Journal", img: { alt: "The DSK Journal - a notebook of reflections" },      category: "Blog & Reflections",     name: "The DSK Journal", desc: "A writing space to share ideas,\nobserve and reflect on the world." },
          project3: { aria: "View Portfolio DSK",   img: { alt: "Portfolio DSK - modern web interface" },             category: "Showcase website",       name: "Portfolio DSK",   desc: "Design and development of this portfolio -\nHTML, CSS, JavaScript, crafted with care." }
        },
        blog: {
          eyebrow: "Writings & reflections",
          title: "The\njournal.",
          cta: "All articles",
          cta_aria: "View all articles",
          readmore: "Read more",
          post1: { aria: "Read: Why I learn to code alone",              tag: "Development",         img: { alt: "Computer screen displaying code" },               category: "Development",         date: "March 8, 2025",  title: "Why I learn to code alone - and what it taught me about myself",  excerpt: "Learning web development without school or mentor is an adventure as much technical as human. Here is what the journey taught me." },
          post2: { aria: "Read: Education as a tool for social transformation", tag: "Education",   img: { alt: "Books and notebooks open on a desk" },            category: "Education",           date: "Feb. 21, 2025",  title: "Education as a tool for social transformation",                   excerpt: "I believe that learning can change a society. Here is why I dedicate part of my energy to making knowledge more accessible and alive." },
          post3: { aria: "Read: Failure as a teacher",                   tag: "Personal development", img: { alt: "Desk with open notebook and pen" },             category: "Personal development", date: "Jan. 14, 2025",  title: "Failure as a teacher - reflections on progress",                  excerpt: "Every mistake contains a lesson. Here is how I learned to see my difficulties not as obstacles, but as steps forward." }
        },
        contact: {
          eyebrow: "Get in touch",
          title: "Let's build\ntogether.",
          copyright: "© 2025 Dias Sare Kpera - All rights reserved.",
          info: {
            title: "An idea, a project,\na question?",
            subtitle: "Don't hesitate to write to me - I read every\nmessage and reply within 24 hours.",
            email:    { label: "E-mail",   value: "email@example.com" },
            phone:    { label: "Phone",    value: "+123 456 7890" },
            location: { label: "Location", value: "Cotonou, Benin" }
          },
          form: {
            title: "Send a message",
            desc: "Tell me about your project, a collaboration idea -\nor simply say hello.",
            name:    { label: "Full name",      placeholder: "John Doe" },
            email:   { label: "E-mail address", placeholder: "john@example.com" },
            subject: { label: "Subject",        placeholder: "Project, collaboration, question…" },
            message: { label: "Message",        placeholder: "Tell me about your project or simply what brought you here…" },
            note: "I reply within 24 hours.",
            submit: "Send message"
          }
        },
        footer: {
          tagline: "Web developer, insatiable learner, passionate about knowledge.\nI create, I learn, I share - a little more every day.",
          status: "Available for projects",
          copy: "© 2025 Dias Sare Kpera - All rights reserved."
        }
      },

      es: {
        meta: { title: "Dias Sare Kpera - Desarrollador Web & Creador de conocimiento" },
        header: { burger: { open: "Abrir menú", close: "Cerrar menú" } },
        nav: { home: "Inicio", about: "Sobre mí", skills: "Habilidades", work: "Proyectos", blog: "Blog", contact: "Contacto" },
        hero: {
          role: "Desarrollador Web - Creador & Apasionado del conocimiento",
          status: "Disponible para proyectos",
          scroll: "Desplazar",
          tagline: "Crear, aprender, compartir -\nconstruir la web con intención."
        },
        about: {
          eyebrow: "Sobre mí",
          title: "La curiosidad\nen acción.",
          photo: { alt: "Retrato de Dias Sare Kpera" },
          availability: "Disponible para proyectos",
          role: "Desarrollador Web & Creador de contenido",
          tagline: "Soy un desarrollador web en crecimiento, apasionado por crear interfaces modernas y transmitir conocimiento. Construyo experiencias digitales con cuidado, aprendiendo cada día.",
          info: {
            birthday: { label: "Fecha de nacimiento", value: "1 de mayo de 1995" },
            age:      { label: "Edad",                value: "30 años" },
            website:  { label: "Sitio web",           value: "www.example.com" },
            degree:   { label: "Título",              value: "Máster" },
            phone:    { label: "Teléfono",            value: "+123 456 7890" },
            email:    { label: "Correo",              value: "email@example.com" },
            city:     { label: "Ciudad",              value: "Cotonou, Benín" },
            freelance:{ label: "Freelance",           value: "Disponible" }
          },
          bio: "Basado en Cotonou, diseño sitios web, maquetas e interfaces con especial atención a la coherencia visual y la experiencia de usuario. Más allá del código, me impulsa una profunda curiosidad por la educación, el conocimiento y el desarrollo humano. A través de proyectos como Cultivora Land y The DSK Journal, busco hacer las ideas accesibles y fomentar una reflexión constructiva sobre el mundo. Creo que cada dificultad es una oportunidad de crecer - y que crear, aprender y transmitir son los valores que dan sentido a mi camino.",
          cta: { contact: "Saber más", cv: "Ver mis proyectos" }
        },
        skills: {
          eyebrow: "Lo que hago",
          title: "Habilidades &\nherramientas.",
          intro: "Los lenguajes y herramientas que domino y sigo profundizando cada día, con el objetivo de convertirme en un desarrollador full-stack completo.",
          html: { name: "HTML",            aria: "HTML - 100%" },
          css:  { name: "CSS",             aria: "CSS - 90%" },
          js:   { name: "Javascript",      aria: "JavaScript - 75%" },
          react: { name: "React JS",   aria: "React JS - 80%" },
          node:  { name: "Node JS",    aria: "Node JS - 70%" },
          figma: { name: "Figma",      aria: "Figma - 65%" }
        },
        work: {
          eyebrow: "Proyectos realizados",
          title: "Creaciones &\nproyectos.",
          cta: "Ver todos los proyectos",
          cta_aria: "Ver todos los proyectos",
          project1: { aria: "Ver Cultivora Land",  img: { alt: "Cultivora Land - El Jardín del Saber" },       category: "Educación & Conocimiento",      name: "Cultivora Land",  desc: "El Jardín del Saber - una plataforma para\nhacer el aprendizaje inspirador y accesible." },
          project2: { aria: "Ver The DSK Journal", img: { alt: "The DSK Journal - cuaderno de reflexiones" },  category: "Blog & Reflexiones",            name: "The DSK Journal", desc: "Un espacio de escritura para compartir ideas,\nobservar y reflexionar sobre el mundo." },
          project3: { aria: "Ver Portfolio DSK",   img: { alt: "Portfolio DSK - interfaz web moderna" },       category: "Sitio web de presentación",     name: "Portfolio DSK",   desc: "Diseño y desarrollo de este portfolio -\nHTML, CSS, JavaScript, hecho con cuidado." }
        },
        blog: {
          eyebrow: "Escritos & reflexiones",
          title: "El\ndiario.",
          cta: "Todos los artículos",
          cta_aria: "Ver todos los artículos",
          readmore: "Leer más",
          post1: { aria: "Leer: Por qué aprendo a programar solo",                   tag: "Desarrollo",          img: { alt: "Pantalla de ordenador mostrando código" },           category: "Desarrollo",          date: "8 de marzo de 2025", title: "Por qué aprendo a programar solo - y lo que eso me enseñó sobre mí",    excerpt: "Aprender desarrollo web sin escuela ni mentor es una aventura tan técnica como humana. Esto es lo que el camino me ha enseñado." },
          post2: { aria: "Leer: La educación como herramienta de transformación social", tag: "Educación",      img: { alt: "Libros y cuadernos abiertos sobre un escritorio" },  category: "Educación",           date: "21 feb. 2025",       title: "La educación como herramienta de transformación social",              excerpt: "Creo que aprender puede cambiar una sociedad. Aquí explico por qué dedico parte de mi energía a hacer el conocimiento más accesible y vivo." },
          post3: { aria: "Leer: El fracaso como maestro",                              tag: "Desarrollo personal", img: { alt: "Escritorio con cuaderno y bolígrafo abierto" },   category: "Desarrollo personal", date: "14 ene. 2025",       title: "El fracaso como maestro - reflexiones sobre el progreso",             excerpt: "Cada error contiene una lección. Así aprendí a ver mis dificultades no como obstáculos, sino como etapas." }
        },
        contact: {
          eyebrow: "Ponerse en contacto",
          title: "Construyamos\njuntos.",
          copyright: "© 2025 Dias Sare Kpera - Todos los derechos reservados.",
          info: {
            title: "¿Una idea, un proyecto,\nuna pregunta?",
            subtitle: "No dudes en escribirme - leo cada\nmensaje y respondo en 24 horas.",
            email:    { label: "Correo",       value: "email@example.com" },
            phone:    { label: "Teléfono",     value: "+123 456 7890" },
            location: { label: "Localización", value: "Cotonou, Benín" }
          },
          form: {
            title: "Enviar un mensaje",
            desc: "Cuéntame tu proyecto, una idea de colaboración -\no simplemente saluda.",
            name:    { label: "Nombre completo",     placeholder: "Juan García" },
            email:   { label: "Dirección de correo", placeholder: "juan@ejemplo.com" },
            subject: { label: "Asunto",              placeholder: "Proyecto, colaboración, pregunta…" },
            message: { label: "Mensaje",             placeholder: "Cuéntame tu proyecto o simplemente qué te trajo aquí…" },
            note: "Respondo en 24 horas.",
            submit: "Enviar mensaje"
          }
        },
        footer: {
          tagline: "Desarrollador web, curioso insaciable, apasionado del conocimiento.\nCreo, aprendo, comparto - un poco más cada día.",
          status: "Disponible para proyectos",
          copy: "© 2025 Dias Sare Kpera - Todos los derechos reservados."
        }
      }
    };
  }

  /* ── Initialisation ─────────────────────────────────────── */
  async function init() {
    /* Tenter de charger i18n.json ; fallback sur les traductions embarquées */
    try {
      const response = await fetch('./JSON/i18n.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      translations = await response.json();
      console.log('[i18n] Traductions chargées depuis i18n.json');
    } catch (err) {
      console.warn('[i18n] Chargement de i18n.json échoué, utilisation des traductions embarquées.', err.message);
      translations = getInlineTranslations();
    }

    currentLang = 'fr';
    applyTranslations();
    updateLangButtons(currentLang);
    bindButtons();
  }

  /* Lancer après le chargement du DOM */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { t, setLang, getLang };

})();