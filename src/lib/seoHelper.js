/**
 * SEO Helper - Meta tags, JSON-LD, canonical
 */

const BASE_URL = 'https://book-fast.de';
const DEFAULT_TITLE = 'BookFast – Buchungen in Webflow';
const DEFAULT_IMAGE = `${BASE_URL}/Logo/logo.png`;

const upsertMeta = (attrName, attrValue) => {
  let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attrName, attrValue);
    document.head.appendChild(meta);
  }
  return meta;
};

/**
 * Set page title and meta description
 */
export const setPageMeta = (title, description) => {
  const fullTitle = title ? `${title} | BookFast` : DEFAULT_TITLE;
  const desc = description || '';
  const url = `${BASE_URL}${window.location.pathname === '/index.html' ? '/' : window.location.pathname}`;

  document.title = fullTitle;

  upsertMeta('name', 'description').content = desc;

  // Open Graph
  upsertMeta('property', 'og:title').content = fullTitle;
  upsertMeta('property', 'og:description').content = desc;
  upsertMeta('property', 'og:type').content = 'website';
  upsertMeta('property', 'og:url').content = url;
  upsertMeta('property', 'og:image').content = DEFAULT_IMAGE;
  upsertMeta('property', 'og:locale').content = 'de_DE';

  // Twitter
  upsertMeta('name', 'twitter:card').content = 'summary_large_image';
  upsertMeta('name', 'twitter:title').content = fullTitle;
  upsertMeta('name', 'twitter:description').content = desc;
  upsertMeta('name', 'twitter:image').content = DEFAULT_IMAGE;
};

/**
 * Set canonical URL
 */
export const setCanonical = (path) => {
  const url = `${BASE_URL}${path}`;
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = url;
};

/**
 * Inject FAQ Schema JSON-LD
 */
export const setFAQSchema = (items) => {
  // Remove previous
  document.getElementById('faq-schema')?.remove();

  if (!items || items.length === 0) return;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'faq-schema';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};

/**
 * Clear all SEO tags (for cleanup)
 */
export const clearSEO = () => {
  document.getElementById('faq-schema')?.remove();
};
