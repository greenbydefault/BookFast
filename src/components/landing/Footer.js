import { featurePages } from '../../data/features/index.js';
import { getLocaleFromPath, normalizeLandingPath } from '../../lib/landingLocale.js';
import { getLocaleSwitchTarget } from '../../lib/landingLocaleRoutes.js';
import { deFeatureSlugToEn } from '../../lib/featureSlugLocale.js';
import { FOOTER_CHROME } from '../../locales/footerChrome.js';

const FOOTER_ILLUSTRATION_URL = new URL('../../svg/illustrations/landingpage/footer/footer_illustration.svg', import.meta.url).href;

const FOOTER_COLUMNS = [
  { headingKey: 'bookingMgmt', slugs: ['buchungen', 'objekte', 'services', 'mitarbeiter', 'workspaces'] },
  { headingKey: 'paymentPlatform', slugs: ['zahlungen', 'rechnungen', 'analytics', 'integration', 'kundenportal'] },
];

const LEGAL_KEYS = [
  { hrefDe: '/kontakt', labelKey: 'kontakt' },
  { hrefDe: '/impressum', labelKey: 'impressum' },
  { hrefDe: '/datenschutz', labelKey: 'datenschutz' },
  { hrefDe: '/agb', labelKey: 'agb' },
];

const BOTTOM_BADGES = ['DSGVO-konform', 'EU-Server', 'SOC2 Compliant', 'AICPA SOC Trusted', 'Made with passion and love from Berlin'];

const featurePathForLocale = (slug, locale) => {
  const en = deFeatureSlugToEn(slug);
  if (locale === 'en' && en) return `/en/features/${en}`;
  return `/features/${slug}`;
};

function buildFooterColumns(locale) {
  const chrome = locale === 'en' ? FOOTER_CHROME.en : FOOTER_CHROME.de;

  return FOOTER_COLUMNS.map((column) => {
    const heading = chrome.columnHeadings[column.headingKey];
    const links = column.slugs
      .map((slug) => {
        const page = featurePages[slug];
        if (!page?.meta?.title) return null;
        return {
          label: page.meta.title,
          href: featurePathForLocale(slug, locale),
        };
      })
      .filter(Boolean);

    return {
      heading,
      links,
    };
  });
}

export const renderFooter = (container) => {
  const path = normalizeLandingPath(window.location.pathname);
  const locale = getLocaleFromPath(path);
  const chrome = locale === 'en' ? FOOTER_CHROME.en : FOOTER_CHROME.de;

  const footer = document.createElement('footer');
  footer.className = 'landing-footer';

  const columns = buildFooterColumns(locale);
  const primaryColumnsHTML = columns
    .map(
      (column) => `
        <section class="landing-footer-col" aria-label="${column.heading}">
          <h3 class="landing-footer-heading">${column.heading}</h3>
          <ul class="landing-footer-links">
            ${column.links.map((link) => `<li><a href="${link.href}" data-landing-link title="${link.label}">${link.label}</a></li>`).join('')}
          </ul>
        </section>
      `
    )
    .join('');

  const legalLinksHTML = LEGAL_KEYS.map((item) => {
    const href = getLocaleSwitchTarget(item.hrefDe, locale);
    const label = chrome.legal[item.labelKey];
    return `<a href="${href}" data-landing-link title="${label}">${label}</a>`;
  }).join('');

  const bottomBadgesHTML = BOTTOM_BADGES.map((item) => `<span class="landing-footer-badge">${item}</span>`).join('');

  footer.innerHTML = `
    <div class="landing-container">
      <div class="landing-footer-header">
        <h2 class="landing-footer-title">${chrome.title}</h2>
      </div>

      <div class="landing-footer-links-zone">
        <div class="landing-footer-main">
          <section class="landing-footer-brand-col" aria-label="BookFast">
            <div class="landing-footer-brand-wrap">
              <span class="landing-footer-brand-mark" aria-hidden="true">+</span>
              <span class="landing-footer-brand">BookFast</span>
            </div>
            <p class="landing-footer-desc">${chrome.brandDesc}</p>
          </section>
          ${primaryColumnsHTML}
        </div>
      </div>
    </div>

    <div class="landing-footer-stage">
      <img src="${FOOTER_ILLUSTRATION_URL}" alt="${chrome.illustrationAlt}" class="landing-footer-illustration" width="1725" height="535">
    </div>

    <div class="landing-container">
      <div class="landing-footer-bottom">
        <div class="landing-footer-legal">${legalLinksHTML}</div>
        <div class="landing-footer-badges">${bottomBadgesHTML}</div>
      </div>
    </div>
  `;

  container.appendChild(footer);
};
