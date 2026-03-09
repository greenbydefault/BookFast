import { featurePages } from '../../data/features/index.js';

const FOOTER_ILLUSTRATION_URL = new URL('../../svg/illustrations/landingpage/footer/footer_illustration.svg', import.meta.url).href;

const FOOTER_COLUMNS = [
  { heading: 'SETUP & STRUKTUR', slugs: ['objekte', 'services', 'zeitfenster', 'integration', 'workspaces'] },
  { heading: 'BUCHUNGEN & VERFUEGBARKEIT', slugs: ['buchungen', 'verfuegbarkeit', 'buffer', 'urlaub', 'overnight'] },
  { heading: 'ZAHLUNG & UMSATZ', slugs: ['zahlungen', 'kaution', 'addons', 'gutscheine', 'rechnungen'] },
  { heading: 'KUNDEN, TEAM & INSIGHTS', slugs: ['kunden', 'kundenportal', 'mitarbeiter', 'email-templates', 'analytics'] },
];

const LEGAL_LINKS = [
  { label: 'Kontakt', href: '/kontakt' },
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
  { label: 'AGB', href: '/agb' },
];

const BOTTOM_BADGES = ['DSGVO-konform', 'EU-Server', 'SOC2 Compliant', 'AICPA SOC Trusted', 'Made with passion and love from Berlin'];

function buildFooterColumns() {
  return FOOTER_COLUMNS.map((column) => {
    const links = column.slugs
      .map((slug) => {
        const page = featurePages[slug];
        if (!page?.meta?.title) return null;
        return { label: page.meta.title, href: `/features/${slug}` };
      })
      .filter(Boolean);

    return {
      heading: column.heading,
      links,
    };
  });
}

export const renderFooter = (container) => {
  const footer = document.createElement('footer');
  footer.className = 'landing-footer';

  const columns = buildFooterColumns();
  const primaryColumnsHTML = columns
    .map(
      (column) => `
        <section class="landing-footer-col" aria-label="${column.heading}">
          <h3 class="landing-footer-heading">${column.heading}</h3>
          <ul class="landing-footer-links">
            ${column.links.map((link) => `<li><a href="${link.href}" data-landing-link>${link.label}</a></li>`).join('')}
          </ul>
        </section>
      `
    )
    .join('');

  const legalLinksHTML = LEGAL_LINKS.map((item) => `<a href="${item.href}" data-landing-link>${item.label}</a>`).join('');
  const bottomBadgesHTML = BOTTOM_BADGES.map((item) => `<span class="landing-footer-badge">${item}</span>`).join('');

  footer.innerHTML = `
    <div class="landing-container">
      <header class="landing-footer-header">
        <h2 class="landing-footer-title">Probiere BookFast noch heute und entdecke alle Moeglichkeiten.</h2>
      </header>

      <div class="landing-footer-links-zone">
        <div class="landing-footer-main">
          <section class="landing-footer-brand-col" aria-label="BookFast">
            <div class="landing-footer-brand-wrap">
              <span class="landing-footer-brand-mark" aria-hidden="true">+</span>
              <span class="landing-footer-brand">BookFast</span>
            </div>
            <p class="landing-footer-desc">Das Buchungssystem fuer Webflow. Ohne Provision, mit Zahlung vor Termin.</p>
          </section>
          ${primaryColumnsHTML}
        </div>
      </div>
    </div>

    <div class="landing-footer-stage" aria-hidden="true">
      <img src="${FOOTER_ILLUSTRATION_URL}" alt="" class="landing-footer-illustration">
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
