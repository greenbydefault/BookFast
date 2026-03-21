/**
 * Features Hub Page – Overview of all features
 */
import { createHero } from '../../../components/landing/Hero.js';
import { createFeatureGrid } from '../../../components/landing/FeatureCard.js';
import { createCTASection } from '../../../components/landing/CTASection.js';
import { setPageMeta, setBreadcrumbSchema } from '../../../lib/seoHelper.js';
import { featurePages } from '../../../data/features/index.js';

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

  setPageMeta('Features – Webflow Buchungssystem', 'Alle Features des Webflow Buchungssystems: Buchungsverwaltung, Terminbuchung, Online-Zahlungen, Rechnungen, Analytics.');
  setBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Features', url: '/features' },
  ]);

  const categorySections = CATEGORIES.map(cat => {
    const features = cat.slugs.map(slug => {
      const page = featurePages[slug];
      const sub = page?.hero?.subheadline || '';
      const desc = sub.length > 120 ? sub.slice(0, 117).trim() + '…' : sub || 'Bald verfügbar.';
      return {
        variant: 'slider',
        title: page?.meta?.title || slug.charAt(0).toUpperCase() + slug.slice(1),
        description: desc,
        link: `/features/${slug}`,
        illustration: page?.hero?.illustration || '',
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
      headline: 'Webflow Buchungssystem – alle Features im Überblick',
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
