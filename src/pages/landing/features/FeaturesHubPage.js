/**
 * Features Hub Page – Overview of all features
 */
import { createHero } from '../../../components/landing/Hero.js';
import { createFeatureGrid } from '../../../components/landing/FeatureCard.js';
import { createCTASection } from '../../../components/landing/CTASection.js';
import { setPageMeta } from '../../../lib/seoHelper.js';
import { featurePages } from '../../../data/features/index.js';

const FEATURE_ICONS = {
  buchungen: '<img src="/src/svg/ICON/list.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', objekte: '<img src="/src/svg/ICON/home.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', services: '<img src="/src/svg/ICON/gear.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />️', zahlungen: '<img src="/src/svg/ICON/Bank-card.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />',
  rechnungen: '<img src="/src/svg/ICON/receipt-euro.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', analytics: '<img src="/src/svg/ICON/chart.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', integration: '<img src="/src/svg/ICON/Globe.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', kundenportal: '<img src="/src/svg/ICON/blocks-integration.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />',
  mitarbeiter: '<img src="/src/svg/ICON/users-2.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', addons: '<img src="/src/svg/ICON/ticket-percent.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', gutscheine: '<img src="/src/svg/ICON/ticket-percent.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />️', kunden: '<img src="/src/svg/ICON/user.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />',
  verfuegbarkeit: '<img src="/src/svg/ICON/lock.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', buffer: '<img src="/src/svg/ICON/clean.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', zeitfenster: '⏰', approval: '<img src="/src/svg/ICON/check.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />',
  overnight: '<img src="/src/svg/ICON/date-cog.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', workspaces: '<img src="/src/svg/ICON/Building-comapny.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', kaution: '<img src="/src/svg/ICON/lock.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />',
};

const CATEGORIES = [
  {
    label: 'Kernfunktionen',
    slugs: ['buchungen', 'objekte', 'services', 'zahlungen', 'rechnungen', 'analytics', 'integration', 'kundenportal'],
  },
  {
    label: 'Verwaltung',
    slugs: ['mitarbeiter', 'addons', 'gutscheine', 'kunden'],
  },
  {
    label: 'Spezielle Features',
    slugs: ['verfuegbarkeit', 'buffer', 'zeitfenster', 'approval', 'overnight', 'workspaces', 'kaution'],
  },
];

export const renderFeaturesHubPage = () => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  setPageMeta('Features', 'Alle BookFast Features im Überblick – Buchungen, Zahlungen, Rechnungen, Analytics und mehr.');

  const categorySections = CATEGORIES.map(cat => {
    const features = cat.slugs.map(slug => {
      const page = featurePages[slug];
      const sub = page?.hero?.subheadline || '';
      const desc = sub.length > 120 ? sub.slice(0, 117).trim() + '…' : sub || 'Bald verfügbar.';
      return {
        icon: FEATURE_ICONS[slug] || '<img src="/src/svg/ICON/package.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />',
        title: page?.meta?.title || slug.charAt(0).toUpperCase() + slug.slice(1),
        description: desc,
        link: `/features/${slug}`,
      };
    });

    return `
      <div style="margin-bottom: 3rem;">
        <h3 class="landing-h3" style="margin-bottom: 1.5rem;">${cat.label}</h3>
        ${createFeatureGrid(features)}
      </div>`;
  }).join('');

  content.innerHTML = `
    ${createHero({
      headline: 'Buchungen, Zahlungen, Rechnungen – alles in einem Tool.',
      subheadline: 'Entdecke alle Features: Von der Buchungsverwaltung bis zu Analytics. Jedes Feature mit klarem Benefit für dein Business.',
      secondaryCTA: '',
    })}

    <section class="landing-section">
      <div class="landing-container">
        ${categorySections}
      </div>
    </section>

    ${createCTASection({
      headline: 'Alle Features kostenlos testen.',
      subheadline: '3 Tage kostenlos. Keine Kreditkarte nötig. In unter 5 Minuten startklar.',
    })}
  `;
};
