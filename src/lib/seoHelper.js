/**
 * SEO Helper - Meta tags, JSON-LD, canonical
 */

const BASE_URL = 'https://book-fast.de';
const DEFAULT_TITLE = 'Webflow Buchungstool – BookFast';
const DEFAULT_IMAGE = `${BASE_URL}/Logo/logo.png`;
const PRODUCT_IMAGE = `${BASE_URL}/Logo/logo-bookfast.svg`;
const ORGANIZATION_ID = `${BASE_URL}/#organization`;

const SCHEMA_SCRIPT_IDS = Object.freeze({
  faq: 'faq-schema',
  product: 'product-schema',
  breadcrumb: 'breadcrumb-schema',
  contact: 'contact-page-schema',
});

const upsertMeta = (attrName, attrValue) => {
  let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attrName, attrValue);
    document.head.appendChild(meta);
  }
  return meta;
};

const normalizePath = (path) => {
  if (!path || path === '/index.html') return '/';
  return path.startsWith('/') ? path : `/${path}`;
};

const toAbsoluteUrl = (path) => `${BASE_URL}${normalizePath(path)}`;

const upsertJsonLdScript = (id, schema) => {
  document.getElementById(id)?.remove();
  if (!schema) return;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = id;
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};

const parseEuroPrice = (value) => {
  const numeric = Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(numeric) ? numeric.toFixed(2) : null;
};

const oneYearFromNowIsoDate = () => {
  const future = new Date();
  future.setFullYear(future.getFullYear() + 1);
  return future.toISOString().slice(0, 10);
};

/**
 * Set page title and meta description
 */
export const setPageMeta = (title, description, options = {}) => {
  const { noindex = false } = options;
  const fullTitle = title ? `${title} | BookFast` : DEFAULT_TITLE;
  const desc = description || '';
  const url = `${BASE_URL}${window.location.pathname === '/index.html' ? '/' : window.location.pathname}`;

  document.title = fullTitle;

  upsertMeta('name', 'description').content = desc;
  upsertMeta('name', 'robots').content = noindex ? 'noindex,follow' : 'index,follow';

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
  const url = toAbsoluteUrl(path);
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
  upsertJsonLdScript(SCHEMA_SCRIPT_IDS.faq, null);
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

  upsertJsonLdScript(SCHEMA_SCRIPT_IDS.faq, schema);
};

/**
 * Inject Product + Offer JSON-LD for pricing page.
 */
export const setProductSchema = (plans) => {
  upsertJsonLdScript(SCHEMA_SCRIPT_IDS.product, null);
  if (!Array.isArray(plans) || plans.length === 0) return;

  const priceValidUntil = oneYearFromNowIsoDate();
  const shippingDetails = {
    '@type': 'OfferShippingDetails',
    shippingRate: { '@type': 'MonetaryAmount', value: 0, currency: 'EUR' },
    shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'DE' },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
      transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
    },
  };
  const hasMerchantReturnPolicy = {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: 'DE',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 14,
    returnFees: 'https://schema.org/FreeReturn',
  };

  const products = plans.map((plan) => {
    const monthlyPrice = parseEuroPrice(plan.price);
    const yearlyPrice = parseEuroPrice(plan.priceAnnual);
    const offers = [];

    if (monthlyPrice) {
      offers.push({
        '@type': 'Offer',
        name: `${plan.name} monatlich`,
        price: monthlyPrice,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        priceValidUntil,
        category: 'monthly',
        url: toAbsoluteUrl('/preise'),
        shippingDetails,
        hasMerchantReturnPolicy,
      });
    }

    if (yearlyPrice) {
      offers.push({
        '@type': 'Offer',
        name: `${plan.name} jährlich`,
        price: yearlyPrice,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        priceValidUntil,
        category: 'yearly',
        url: toAbsoluteUrl('/preise'),
        shippingDetails,
        hasMerchantReturnPolicy,
      });
    }

    return {
      '@type': 'Product',
      name: `BookFast ${plan.name}`,
      description: plan.description,
      image: PRODUCT_IMAGE,
      brand: {
        '@type': 'Brand',
        name: 'BookFast',
      },
      offers,
    };
  }).filter((product) => product.offers.length > 0);

  if (products.length === 0) return;

  upsertJsonLdScript(SCHEMA_SCRIPT_IDS.product, {
    '@context': 'https://schema.org',
    '@graph': products,
  });
};

/**
 * Inject BreadcrumbList JSON-LD.
 */
export const setBreadcrumbSchema = (items) => {
  upsertJsonLdScript(SCHEMA_SCRIPT_IDS.breadcrumb, null);
  if (!Array.isArray(items) || items.length < 2) return;

  const itemListElement = items
    .map((item, index) => {
      const name = item?.name?.trim();
      if (!name) return null;

      const entry = {
        '@type': 'ListItem',
        position: index + 1,
        name,
      };

      if (item.url) {
        entry.item = toAbsoluteUrl(item.url);
      }

      return entry;
    })
    .filter(Boolean);

  if (itemListElement.length < 2) return;

  upsertJsonLdScript(SCHEMA_SCRIPT_IDS.breadcrumb, {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  });
};

/**
 * Inject ContactPage schema for contact route.
 */
export const setContactPageSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Kontakt | BookFast',
    url: toAbsoluteUrl('/kontakt'),
    mainEntity: {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: 'BookFast',
      url: BASE_URL,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          url: toAbsoluteUrl('/kontakt'),
          email: 'hello@book-fast.de',
          availableLanguage: ['de'],
        },
      ],
    },
  };

  upsertJsonLdScript(SCHEMA_SCRIPT_IDS.contact, schema);
};

/**
 * Clear all SEO tags (for cleanup)
 */
export const clearSEO = () => {
  Object.values(SCHEMA_SCRIPT_IDS).forEach((id) => {
    document.getElementById(id)?.remove();
  });
};
