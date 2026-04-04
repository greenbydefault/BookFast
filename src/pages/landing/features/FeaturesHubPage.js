/**
 * Features Hub Page – Overview of all features
 */
import { createHero } from '../../../components/landing/Hero.js';
import { createFeatureGrid } from '../../../components/landing/FeatureCard.js';
import { createCTASection } from '../../../components/landing/CTASection.js';
import { FEATURE_GROUPS } from '../../../components/landing/navConfig.js';
import { setPageMeta, setBreadcrumbSchema, setHreflangAlternates } from '../../../lib/seoHelper.js';
import { getAllFeaturePages } from '../../../lib/getLocaleContent.js';
import { deFeatureSlugToEn } from '../../../lib/featureSlugLocale.js';

export const renderFeaturesHubPage = (locale = 'de') => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  const isEn = locale === 'en';
  const pages = getAllFeaturePages(locale);
  const categories = FEATURE_GROUPS.map((group) => ({
    ...group,
    label: isEn ? (group.labelEn || group.label) : group.label,
  }));
  const homePath = isEn ? '/en' : '/';
  const featuresPath = isEn ? '/en/features' : '/features';

  setPageMeta(
    isEn ? 'Features — Webflow Booking System' : 'Features – Webflow Buchungssystem',
    isEn
      ? 'All features of the Webflow booking system: booking management, appointments, online payments, invoices, analytics.'
      : 'Alle Features des Webflow Buchungssystems: Buchungsverwaltung, Terminbuchung, Online-Zahlungen, Rechnungen, Analytics.',
    { locale },
  );
  setBreadcrumbSchema([
    { name: 'Home', url: homePath },
    { name: 'Features', url: featuresPath },
  ]);
  setHreflangAlternates([
    { hreflang: 'de', path: '/features' },
    { hreflang: 'en', path: '/en/features' },
  ]);

  const categorySections = categories.map(cat => {
    const features = cat.slugs.map(slug => {
      const page = pages[slug];
      const sub = page?.hero?.subheadline || '';
      const fallback = isEn ? 'Coming soon.' : 'Bald verfügbar.';
      const desc = sub.length > 120 ? sub.slice(0, 117).trim() + '…' : sub || fallback;
      const enSlug = deFeatureSlugToEn(slug);
      const link = isEn && enSlug ? `/en/features/${enSlug}` : `/features/${slug}`;
      return {
        variant: 'slider',
        title: page?.meta?.title || slug.charAt(0).toUpperCase() + slug.slice(1),
        description: desc,
        link,
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
      headline: isEn
        ? 'Webflow booking system — all features at a glance'
        : 'Webflow Buchungssystem – alle Features im Überblick',
      subheadline: isEn
        ? 'Discover all features: From booking management to analytics. Every feature with a clear benefit for your business.'
        : 'Entdecke alle Features: Von der Buchungsverwaltung bis zu Analytics. Jedes Feature mit klarem Benefit für dein Business.',
      secondaryCTA: '',
    })}

    <section class="landing-section">
      <div class="landing-container">
        ${categorySections}
      </div>
    </section>

    ${createCTASection({
      headline: isEn ? 'Try all features for free.' : 'Alle Features kostenlos testen.',
      subheadline: isEn
        ? '3-day free trial. No credit card required. Ready in under 5 minutes.'
        : '3 Tage kostenlos. Keine Kreditkarte nötig. In unter 5 Minuten startklar.',
      ...(isEn ? { primaryCTA: 'Start live demo', secondaryCTA: 'Try for free' } : {}),
    })}
  `;
};
