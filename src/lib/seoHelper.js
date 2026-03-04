/**
 * SEO Helper - Meta tags, JSON-LD, canonical
 */

/**
 * Set page title and meta description
 */
export const setPageMeta = (title, description) => {
  document.title = title ? `${title} | BookFast` : 'BookFast – Buchungen in Webflow';

  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.content = description || '';
};

/**
 * Set canonical URL
 */
export const setCanonical = (path) => {
  const url = `https://bookfast.app${path}`;
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
