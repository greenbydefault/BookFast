/**
 * Features Hub Page – Overview of all features
 */
import { createHero } from '../../../components/landing/Hero.js';
import { createFeatureGrid } from '../../../components/landing/FeatureCard.js';
import { createCTASection } from '../../../components/landing/CTASection.js';
import { setPageMeta } from '../../../lib/seoHelper.js';
import { featurePages } from '../../../data/features/index.js';
import { iconImg } from '../../../lib/landingAssets.js';

const FEATURE_ICONS = {
  buchungen: iconImg('list.svg'), objekte: iconImg('home.svg'), services: `${iconImg('gear.svg')}️`, zahlungen: iconImg('Bank-card.svg'),
  rechnungen: iconImg('receipt-euro.svg'), analytics: iconImg('chart.svg'), integration: iconImg('Globe.svg'), kundenportal: iconImg('blocks-integration.svg'),
  mitarbeiter: iconImg('users-2.svg'), addons: iconImg('ticket-percent.svg'), gutscheine: `${iconImg('ticket-percent.svg')}️`, kunden: iconImg('user.svg'),
  verfuegbarkeit: iconImg('lock.svg'), buffer: iconImg('clean.svg'), zeitfenster: '⏰', approval: iconImg('check.svg'),
  overnight: iconImg('date-cog.svg'), workspaces: iconImg('Building-comapny.svg'), kaution: iconImg('lock.svg'),
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
        icon: FEATURE_ICONS[slug] || iconImg('package.svg'),
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
