import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const CONTENT_DIR = path.join(ROOT_DIR, 'content', 'blog');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');
const SITE_URL = (process.env.SITE_URL || 'https://revelti.com').replace(/\/+$/, '');
const INCLUDE_DRAFTS = process.env.INCLUDE_DRAFTS === 'true';
const DEFAULT_OG_IMAGE = '/images/banner1200x400.jpg';

marked.setOptions({
  gfm: true,
  breaks: false
});

const UI_COPY = {
  en: {
    locale: 'en-US',
    ogLocale: 'en_US',
    ogAlternateLocale: 'es_ES',
    blogIndexPath: '/blog/',
    termsPath: '/terms.html',
    privacyPath: '/privacy.html',
    navOrganizer: 'Organizer',
    navCreative: 'Creative',
    navAttendee: 'Attendee',
    navBlog: 'Blog',
    navJoinWaitlist: 'Join Waitlist',
    toggleMenuAria: 'Toggle mobile menu',
    blogKicker: 'Revelti Journal',
    blogHeading: 'Stories, guides & insights for live events',
    blogSubtitle:
      'Ideas and playbooks for event organizers, photographers, videographers, and communities who believe the night should live on.',
    indexPageTitle: 'Blog - Revelti',
    indexMetaDescription:
      'Guides, product updates, and stories from Revelti for event organizers, creatives, and dance & live event communities.',
    filterSectionAria: 'Search and filter articles',
    searchPlaceholder: 'Search articles, topics, or #tags...',
    searchAria: 'Search articles',
    clearSearchAria: 'Clear search',
    filterByCategoryAria: 'Filter articles by category',
    allCategoriesOption: 'All categories',
    filterByTagAria: 'Filter articles by tag',
    allTagsOption: 'All tags',
    sortByAria: 'Sort articles',
    sortNewest: 'Newest first',
    sortOldest: 'Oldest first',
    sortTitle: 'Title (A–Z)',
    resultSingular: '{count} article',
    resultPlural: '{count} articles',
    clearAllFilters: 'Clear all',
    articlesListAria: 'Blog articles',
    emptyFilterState: 'No articles match this filter yet.',
    readMore: 'Read article →',
    backToBlog: 'Back to Blog',
    publishedLabel: 'Published',
    updatedLabel: 'Updated',
    minReadSuffix: 'min read',
    shareLabel: 'Share',
    copyLinkLabel: 'Copy link',
    copiedLabel: 'Copied!',
    instagramCopiedLabel: 'Link copied! Paste in Instagram DM',
    relatedHeading: 'More from the Revelti Blog',
    ctaHeading: "The event doesn't end when the music stops.",
    ctaBody:
      'Ticketing, crowd comms, creative workspaces, and official event galleries in one platform. Join the waitlist for early access.',
    ctaButton: 'Join the Waitlist →',
    footerRights: '© 2026 <strong class="brand-highlight">Revelti</strong>. All rights reserved.',
    footerTerms: 'Terms & Conditions',
    footerPrivacy: 'Privacy Policy'
  },
  es: {
    locale: 'es-ES',
    ogLocale: 'es_ES',
    ogAlternateLocale: 'en_US',
    blogIndexPath: '/es/blog/',
    termsPath: '/terms-es.html',
    privacyPath: '/privacy-es.html',
    navOrganizer: 'Organizador',
    navCreative: 'Creativo',
    navAttendee: 'Asistente',
    navBlog: 'Blog',
    navJoinWaitlist: 'Unirse a la lista',
    toggleMenuAria: 'Alternar menú móvil',
    blogKicker: 'Blog de Revelti',
    blogHeading: 'Guías, historias e ideas para eventos en vivo',
    blogSubtitle:
      'Recursos y estrategias para organizadores, fotógrafos, videógrafos y comunidades que creen que la noche no termina cuando la música se para.',
    indexPageTitle: 'Blog - Revelti',
    indexMetaDescription:
      'Guías, novedades e historias de Revelti para organizadores de eventos, creativos y comunidades de baile y eventos en vivo.',
    filterSectionAria: 'Buscar y filtrar artículos',
    searchPlaceholder: 'Buscar artículos, temas o #etiquetas...',
    searchAria: 'Buscar artículos',
    clearSearchAria: 'Limpiar búsqueda',
    filterByCategoryAria: 'Filtrar artículos por categoría',
    allCategoriesOption: 'Todas las categorías',
    filterByTagAria: 'Filtrar artículos por etiqueta',
    allTagsOption: 'Todas las etiquetas',
    sortByAria: 'Ordenar artículos',
    sortNewest: 'Más recientes',
    sortOldest: 'Más antiguos',
    sortTitle: 'Título (A–Z)',
    resultSingular: '{count} artículo',
    resultPlural: '{count} artículos',
    clearAllFilters: 'Limpiar todo',
    articlesListAria: 'Artículos del blog',
    emptyFilterState: 'Todavía no hay artículos para este filtro.',
    readMore: 'Leer artículo →',
    backToBlog: 'Volver al Blog',
    publishedLabel: 'Publicado',
    updatedLabel: 'Actualizado',
    minReadSuffix: 'min de lectura',
    shareLabel: 'Compartir',
    copyLinkLabel: 'Copiar enlace',
    copiedLabel: '¡Copiado!',
    instagramCopiedLabel: '¡Enlace copiado! Pégalo en Instagram DM',
    relatedHeading: 'Más en el Blog de Revelti',
    ctaHeading: 'El evento no termina cuando la música se para.',
    ctaBody:
      'Entradas, comunicación con tu comunidad, espacio para creativos y galerías oficiales en una sola plataforma. Únete a la lista de espera.',
    ctaButton: 'Unirse a la lista →',
    footerRights: '© 2026 <strong class="brand-highlight">Revelti</strong>. Todos los derechos reservados.',
    footerTerms: 'Términos y Condiciones',
    footerPrivacy: 'Política de Privacidad'
  }
};

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeSearchText(text) {
  return String(text || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/[#*_>\-\[\]()!|]/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeList(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean);
  }
  return String(value)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

function normalizeDate(value, fieldName, filePath) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid "${fieldName}" date in ${filePath}: ${value}`);
  }
  return date.toISOString().slice(0, 10);
}

function formatDate(isoDate, locale) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(utcDate);
}

function toAbsoluteUrl(urlOrPath) {
  if (!urlOrPath) return `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
  const normalized = urlOrPath.startsWith('/') ? urlOrPath : `/${urlOrPath}`;
  return `${SITE_URL}${normalized}`;
}

function estimateReadingMinutes(markdownText) {
  const plainText = markdownText
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/[#*_>\-\[\]()!]/g, ' ')
    .trim();
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function renderTemplate(template, vars) {
  return template.replace(/\{\{([a-zA-Z0-9_.]+)\}\}/g, (match, key) => {
    const parts = key.split('.');
    let current = vars;
    for (const part of parts) {
      if (current && Object.prototype.hasOwnProperty.call(current, part)) {
        current = current[part];
      } else {
        return '';
      }
    }
    return current ?? '';
  });
}

function parseFilenameMeta(filename) {
  const withoutExt = filename.replace(/\.md$/i, '');
  const match = withoutExt.match(/^(.*)\.(en|es)$/i);
  if (match) {
    return {
      stem: match[1],
      langFromFilename: match[2].toLowerCase()
    };
  }
  return {
    stem: withoutExt,
    langFromFilename: null
  };
}

async function loadPosts() {
  let entries;
  try {
    entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }

  const mdFiles = entries
    .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.md'))
    .map(entry => entry.name)
    .sort();

  const posts = [];
  const seenSlugs = { en: new Set(), es: new Set() };

  for (const filename of mdFiles) {
    const fullPath = path.join(CONTENT_DIR, filename);
    const raw = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(raw);

    if (data.draft === true && !INCLUDE_DRAFTS) {
      continue;
    }

    const { stem, langFromFilename } = parseFilenameMeta(filename);
    const lang = String(data.lang || langFromFilename || 'en').toLowerCase();
    if (lang !== 'en' && lang !== 'es') {
      throw new Error(`Unsupported language "${lang}" in ${filename}. Expected "en" or "es".`);
    }

    if (!data.title || !data.description || !data.pubDate) {
      throw new Error(
        `Missing required frontmatter (title, description, pubDate) in content/blog/${filename}`
      );
    }

    const pubDate = normalizeDate(data.pubDate, 'pubDate', filename);
    const updatedDate = normalizeDate(data.updatedDate, 'updatedDate', filename);
    const slug = slugify(data.slug || stem);
    if (!slug) {
      throw new Error(`Could not derive a valid slug for content/blog/${filename}`);
    }
    if (seenSlugs[lang].has(slug)) {
      throw new Error(`Duplicate ${lang.toUpperCase()} slug "${slug}" detected in ${filename}`);
    }
    seenSlugs[lang].add(slug);

    const translationKey = String(data.translationKey || stem).trim();
    const urlPath = lang === 'en' ? `/blog/${slug}/` : `/es/blog/${slug}/`;
    const categories = normalizeList(data.categories);
    const tags = normalizeList(data.tags);
    const featuredImage = data.featuredImage ? String(data.featuredImage).trim() : '';
    const featuredImageAlt = data.featuredImageAlt
      ? String(data.featuredImageAlt).trim()
      : String(data.title).trim();

    const plainBodyExcerpt = normalizeSearchText(content).slice(0, 1200);
    const searchText = normalizeSearchText(
      [data.title, data.description, ...categories, ...tags, plainBodyExcerpt].join(' ')
    ).slice(0, 1500);

    posts.push({
      filename,
      lang,
      translationKey,
      title: String(data.title).trim(),
      description: String(data.description).trim(),
      pubDate,
      updatedDate,
      slug,
      urlPath,
      canonicalUrl: `${SITE_URL}${urlPath}`,
      categories,
      tags,
      featuredImage,
      featuredImageAlt,
      ogImage: toAbsoluteUrl(featuredImage || DEFAULT_OG_IMAGE),
      readingMinutes: estimateReadingMinutes(content),
      searchText,
      contentHtml: marked.parse(content)
    });
  }

  posts.sort((a, b) => b.pubDate.localeCompare(a.pubDate) || a.title.localeCompare(b.title));
  return posts;
}

function buildPostCardHtml(post, ui) {
  const imageSrc = post.featuredImage || DEFAULT_OG_IMAGE;
  const catData = post.categories.map(c => slugify(c)).join('|');
  const tagData = post.tags.map(t => slugify(t)).join('|');
  const categoriesHtml = post.categories
    .map(cat => `<span class="category-badge">${escapeHtml(cat)}</span>`)
    .join('');

  return `
    <article class="post-card" data-categories="${escapeHtml(catData)}" data-tags="${escapeHtml(tagData)}" data-date="${escapeHtml(post.pubDate)}" data-title="${escapeHtml(normalizeSearchText(post.title))}" data-search="${escapeHtml(post.searchText)}">
      <a href="${escapeHtml(post.urlPath)}" class="post-card-image-link">
        <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(post.featuredImageAlt)}" class="post-card-image" loading="lazy">
      </a>
      <div class="post-card-body">
        <div class="post-categories">${categoriesHtml}</div>
        <h2 class="post-card-title">
          <a href="${escapeHtml(post.urlPath)}">${escapeHtml(post.title)}</a>
        </h2>
        <p class="post-card-desc">${escapeHtml(post.description)}</p>
        <div class="post-card-meta">
          <span>${escapeHtml(formatDate(post.pubDate, ui.locale))} • ${post.readingMinutes} ${escapeHtml(ui.minReadSuffix)}</span>
          <a href="${escapeHtml(post.urlPath)}" class="post-card-read">${escapeHtml(ui.readMore)}</a>
        </div>
      </div>
    </article>`;
}

function buildHreflangTags({ enUrl, esUrl }) {
  const tags = [];
  if (enUrl) tags.push(`<link rel="alternate" hreflang="en" href="${escapeHtml(enUrl)}">`);
  if (esUrl) tags.push(`<link rel="alternate" hreflang="es" href="${escapeHtml(esUrl)}">`);
  const defaultUrl = enUrl || esUrl;
  if (defaultUrl) {
    tags.push(`<link rel="alternate" hreflang="x-default" href="${escapeHtml(defaultUrl)}">`);
  }
  return tags.join('\n  ');
}

function pickRelatedPosts(currentPost, sameLangPosts) {
  const currentCats = new Set(currentPost.categories.map(slugify));
  const currentTags = new Set(currentPost.tags.map(slugify));

  return sameLangPosts
    .filter(p => p.slug !== currentPost.slug)
    .map(candidate => {
      let score = 0;
      candidate.categories.forEach(c => {
        if (currentCats.has(slugify(c))) score += 2;
      });
      candidate.tags.forEach(t => {
        if (currentTags.has(slugify(t))) score += 1;
      });
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score || b.candidate.pubDate.localeCompare(a.candidate.pubDate))
    .slice(0, 3)
    .map(item => item.candidate);
}

async function generateSitemap(postsByLang, pairsByKey) {
  const latestEnDate = postsByLang.en[0]?.updatedDate || postsByLang.en[0]?.pubDate || new Date().toISOString().slice(0, 10);
  const latestEsDate = postsByLang.es[0]?.updatedDate || postsByLang.es[0]?.pubDate || new Date().toISOString().slice(0, 10);

  const staticEntries = [
    {
      loc: `${SITE_URL}/`,
      lastmod: latestEnDate,
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      loc: `${SITE_URL}/blog/`,
      lastmod: latestEnDate,
      changefreq: 'weekly',
      priority: '0.9',
      alternates: [
        { lang: 'en', href: `${SITE_URL}/blog/` },
        { lang: 'es', href: `${SITE_URL}/es/blog/` },
        { lang: 'x-default', href: `${SITE_URL}/blog/` }
      ]
    },
    {
      loc: `${SITE_URL}/es/blog/`,
      lastmod: latestEsDate,
      changefreq: 'weekly',
      priority: '0.9',
      alternates: [
        { lang: 'en', href: `${SITE_URL}/blog/` },
        { lang: 'es', href: `${SITE_URL}/es/blog/` },
        { lang: 'x-default', href: `${SITE_URL}/blog/` }
      ]
    },
    {
      loc: `${SITE_URL}/privacy.html`,
      changefreq: 'yearly',
      priority: '0.3',
      alternates: [
        { lang: 'en', href: `${SITE_URL}/privacy.html` },
        { lang: 'es', href: `${SITE_URL}/privacy-es.html` }
      ]
    },
    {
      loc: `${SITE_URL}/privacy-es.html`,
      changefreq: 'yearly',
      priority: '0.3',
      alternates: [
        { lang: 'en', href: `${SITE_URL}/privacy.html` },
        { lang: 'es', href: `${SITE_URL}/privacy-es.html` }
      ]
    },
    {
      loc: `${SITE_URL}/terms.html`,
      changefreq: 'yearly',
      priority: '0.3',
      alternates: [
        { lang: 'en', href: `${SITE_URL}/terms.html` },
        { lang: 'es', href: `${SITE_URL}/terms-es.html` }
      ]
    },
    {
      loc: `${SITE_URL}/terms-es.html`,
      changefreq: 'yearly',
      priority: '0.3',
      alternates: [
        { lang: 'en', href: `${SITE_URL}/terms.html` },
        { lang: 'es', href: `${SITE_URL}/terms-es.html` }
      ]
    }
  ];

  const postEntries = [...postsByLang.en, ...postsByLang.es].map(post => {
    const pair = pairsByKey.get(post.translationKey) || {};
    const alternates = [];
    if (pair.en) alternates.push({ lang: 'en', href: pair.en.canonicalUrl });
    if (pair.es) alternates.push({ lang: 'es', href: pair.es.canonicalUrl });
    if (pair.en || pair.es) {
      alternates.push({ lang: 'x-default', href: (pair.en || pair.es).canonicalUrl });
    }
    return {
      loc: post.canonicalUrl,
      lastmod: post.updatedDate || post.pubDate,
      changefreq: 'monthly',
      priority: '0.8',
      alternates
    };
  });

  const allEntries = [...staticEntries, ...postEntries];
  const xmlItems = allEntries
    .map(entry => {
      const lines = [
        '  <url>',
        `    <loc>${escapeHtml(entry.loc)}</loc>`
      ];
      if (entry.lastmod) lines.push(`    <lastmod>${escapeHtml(entry.lastmod)}</lastmod>`);
      if (entry.changefreq) lines.push(`    <changefreq>${escapeHtml(entry.changefreq)}</changefreq>`);
      if (entry.priority) lines.push(`    <priority>${escapeHtml(entry.priority)}</priority>`);
      if (entry.alternates && entry.alternates.length > 0) {
        entry.alternates.forEach(alt => {
          lines.push(
            `    <xhtml:link rel="alternate" hreflang="${escapeHtml(alt.lang)}" href="${escapeHtml(alt.href)}" />`
          );
        });
      }
      lines.push('  </url>');
      return lines.join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${xmlItems}
</urlset>
`;

  await fs.writeFile(path.join(ROOT_DIR, 'sitemap.xml'), xml, 'utf8');
}

async function build() {
  const [indexTemplate, postTemplate, posts] = await Promise.all([
    fs.readFile(path.join(TEMPLATES_DIR, 'blog-index.html'), 'utf8'),
    fs.readFile(path.join(TEMPLATES_DIR, 'blog-post.html'), 'utf8'),
    loadPosts()
  ]);

  const postsByLang = {
    en: posts.filter(p => p.lang === 'en'),
    es: posts.filter(p => p.lang === 'es')
  };

  const pairsByKey = new Map();
  for (const post of posts) {
    if (!pairsByKey.has(post.translationKey)) {
      pairsByKey.set(post.translationKey, {});
    }
    pairsByKey.get(post.translationKey)[post.lang] = post;
  }

  // Clean previous generated blog directories
  await fs.rm(path.join(ROOT_DIR, 'blog'), { recursive: true, force: true });
  await fs.rm(path.join(ROOT_DIR, 'es', 'blog'), { recursive: true, force: true });

  for (const lang of ['en', 'es']) {
    const ui = UI_COPY[lang];
    const langPosts = postsByLang[lang];
    const indexDir = lang === 'en' ? path.join(ROOT_DIR, 'blog') : path.join(ROOT_DIR, 'es', 'blog');
    await fs.mkdir(indexDir, { recursive: true });

    // Build category and tag dropdown options with counts
    const categoryMap = new Map();
    const tagMap = new Map();
    langPosts.forEach(post => {
      post.categories.forEach(cat => {
        const key = slugify(cat);
        if (!key) return;
        const entry = categoryMap.get(key) || { label: cat, count: 0 };
        entry.count += 1;
        categoryMap.set(key, entry);
      });
      post.tags.forEach(tag => {
        const key = slugify(tag);
        if (!key) return;
        const entry = tagMap.get(key) || { label: tag, count: 0 };
        entry.count += 1;
        tagMap.set(key, entry);
      });
    });

    const categoryOptions = Array.from(categoryMap.entries())
      .sort((a, b) => a[1].label.localeCompare(b[1].label, ui.locale))
      .map(
        ([key, { label, count }]) =>
          `<option value="${escapeHtml(key)}" data-label="${escapeHtml(label)}">${escapeHtml(label)} (${count})</option>`
      )
      .join('\n          ');

    const tagOptions = Array.from(tagMap.entries())
      .sort((a, b) => a[1].label.localeCompare(b[1].label, ui.locale))
      .map(
        ([key, { label, count }]) =>
          `<option value="${escapeHtml(key)}" data-label="#${escapeHtml(label)}">#${escapeHtml(label)} (${count})</option>`
      )
      .join('\n          ');

    const initialResultsText = (langPosts.length === 1 ? ui.resultSingular : ui.resultPlural).replace(
      '{count}',
      String(langPosts.length)
    );

    const postCards = langPosts.map(post => buildPostCardHtml(post, ui)).join('\n');
    const canonicalIndexUrl = `${SITE_URL}${ui.blogIndexPath}`;

    const indexJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: ui.indexPageTitle,
      description: ui.indexMetaDescription,
      url: canonicalIndexUrl,
      inLanguage: lang,
      publisher: {
        '@type': 'Organization',
        name: 'Revelti',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/images/reveltiLogo.png`
        }
      }
    };

    const indexHtml = renderTemplate(indexTemplate, {
      lang,
      ui,
      pageTitle: escapeHtml(ui.indexPageTitle),
      ogTitle: escapeHtml(ui.indexPageTitle),
      metaDescription: escapeHtml(ui.indexMetaDescription),
      canonicalUrl: escapeHtml(canonicalIndexUrl),
      hreflangLinks: buildHreflangTags({
        enUrl: `${SITE_URL}/blog/`,
        esUrl: `${SITE_URL}/es/blog/`
      }),
      ogLocale: ui.ogLocale,
      ogAlternateLocale: `<meta property="og:locale:alternate" content="${ui.ogAlternateLocale}">`,
      ogImage: escapeHtml(toAbsoluteUrl(DEFAULT_OG_IMAGE)),
      jsonLd: `<script type="application/ld+json">${JSON.stringify(indexJsonLd)}</script>`,
      blogIndexPath: ui.blogIndexPath,
      termsPath: ui.termsPath,
      privacyPath: ui.privacyPath,
      enSwitchUrl: '/blog/',
      esSwitchUrl: '/es/blog/',
      enActiveClass: lang === 'en' ? 'active' : '',
      esActiveClass: lang === 'es' ? 'active' : '',
      categoryOptions,
      tagOptions,
      initialResultsText,
      postCards
    });

    await fs.writeFile(path.join(indexDir, 'index.html'), indexHtml, 'utf8');

    // Build individual article pages
    for (const post of langPosts) {
      const pair = pairsByKey.get(post.translationKey) || {};
      const enSwitchUrl = pair.en ? pair.en.urlPath : '/blog/';
      const esSwitchUrl = pair.es ? pair.es.urlPath : '/es/blog/';

      const categoryBadges = post.categories
        .map(
          cat =>
            `<a href="${escapeHtml(ui.blogIndexPath)}?category=${encodeURIComponent(slugify(cat))}" class="category-badge">${escapeHtml(cat)}</a>`
        )
        .join('');

      const tagChips = post.tags
        .map(
          tag =>
            `<a href="${escapeHtml(ui.blogIndexPath)}?tag=${encodeURIComponent(slugify(tag))}" class="tag-chip">#${escapeHtml(tag)}</a>`
        )
        .join('');

      const updatedDateHtml =
        post.updatedDate && post.updatedDate !== post.pubDate
          ? `<span class="article-meta-dot">•</span><span>${escapeHtml(ui.updatedLabel)} <time datetime="${escapeHtml(post.updatedDate)}">${escapeHtml(formatDate(post.updatedDate, ui.locale))}</time></span>`
          : '';

      const featuredImageHtml = post.featuredImage
        ? `<figure class="article-featured-figure"><img src="${escapeHtml(post.featuredImage)}" alt="${escapeHtml(post.featuredImageAlt)}" class="article-featured-image"></figure>`
        : '';

      const relatedPosts = pickRelatedPosts(post, langPosts);
      const relatedPostsSection =
        relatedPosts.length > 0
          ? `<section class="related-section">
      <h2 class="related-heading">${escapeHtml(ui.relatedHeading)}</h2>
      <div class="related-grid">
        ${relatedPosts.map(rel => buildPostCardHtml(rel, ui)).join('\n')}
      </div>
    </section>`
          : '';

      const postJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        image: [post.ogImage],
        datePublished: post.pubDate,
        dateModified: post.updatedDate || post.pubDate,
        inLanguage: lang,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': post.canonicalUrl
        },
        author: {
          '@type': 'Organization',
          name: 'Revelti',
          url: SITE_URL
        },
        publisher: {
          '@type': 'Organization',
          name: 'Revelti',
          url: SITE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/images/reveltiLogo.png`
          }
        },
        keywords: [...post.categories, ...post.tags].join(', ')
      };

      const encodedUrl = encodeURIComponent(post.canonicalUrl);
      const encodedTitle = encodeURIComponent(post.title);

      const postHtml = renderTemplate(postTemplate, {
        lang,
        ui,
        pageTitle: escapeHtml(`${post.title} | Revelti Blog`),
        ogTitle: escapeHtml(post.title),
        metaDescription: escapeHtml(post.description),
        canonicalUrl: escapeHtml(post.canonicalUrl),
        hreflangLinks: buildHreflangTags({
          enUrl: pair.en?.canonicalUrl,
          esUrl: pair.es?.canonicalUrl
        }),
        ogLocale: ui.ogLocale,
        ogAlternateLocale:
          pair.en && pair.es
            ? `<meta property="og:locale:alternate" content="${ui.ogAlternateLocale}">`
            : '',
        ogImage: escapeHtml(post.ogImage),
        pubDateIso: escapeHtml(post.pubDate),
        pubDateFormatted: escapeHtml(formatDate(post.pubDate, ui.locale)),
        modifiedMetaTag: post.updatedDate
          ? `<meta property="article:modified_time" content="${escapeHtml(post.updatedDate)}">`
          : '',
        articleSectionMeta: post.categories[0]
          ? `<meta property="article:section" content="${escapeHtml(post.categories[0])}">`
          : '',
        articleTagMetas: post.tags
          .map(tag => `<meta property="article:tag" content="${escapeHtml(tag)}">`)
          .join('\n  '),
        jsonLd: `<script type="application/ld+json">${JSON.stringify(postJsonLd)}</script>`,
        blogIndexPath: ui.blogIndexPath,
        termsPath: ui.termsPath,
        privacyPath: ui.privacyPath,
        enSwitchUrl: escapeHtml(enSwitchUrl),
        esSwitchUrl: escapeHtml(esSwitchUrl),
        enActiveClass: lang === 'en' ? 'active' : '',
        esActiveClass: lang === 'es' ? 'active' : '',
        title: escapeHtml(post.title),
        description: escapeHtml(post.description),
        categoryBadges,
        updatedDateHtml,
        readingTimeText: `${post.readingMinutes} ${escapeHtml(ui.minReadSuffix)}`,
        featuredImageHtml,
        contentHtml: post.contentHtml,
        tagChips,
        shareXUrl: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        shareLinkedInUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        shareWhatsAppUrl: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        shareEmailUrl: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`${post.description}\n\n${post.canonicalUrl}`)}`,
        relatedPostsSection
      });

      const postDir = path.join(indexDir, post.slug);
      await fs.mkdir(postDir, { recursive: true });
      await fs.writeFile(path.join(postDir, 'index.html'), postHtml, 'utf8');
    }
  }

  await generateSitemap(postsByLang, pairsByKey);
  console.log(
    `[build-blog] Generated ${postsByLang.en.length} EN and ${postsByLang.es.length} ES blog posts + sitemap.xml`
  );
}

build().catch(err => {
  console.error('[build-blog] Build failed:', err.message);
  process.exit(1);
});
