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
import { setLandingContent } from '../../../lib/landingContent.js';

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
    isEn ? 'Features. Webflow booking system' : 'Features. Webflow Buchungssystem',
    isEn
      ? 'Booking inbox, widget, Stripe, invoices, objects, services, analytics. One page per feature.'
      : 'Buchungs-Inbox, Widget, Stripe, Rechnungen, Objekte, Services, Analytics. Eine Seite pro Feature.',
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
        <h2 class="landing-h2" style="margin-bottom: 1.5rem;">${cat.label}</h2>
        ${createFeatureGrid(features)}
      </div>`;
  }).join('');

  setLandingContent(content, `
    ${createHero({
      headline: isEn
        ? 'Every BookFast feature, one page each.'
        : 'Jedes BookFast-Feature, eine Seite.',
      subheadline: isEn
        ? 'Inbox, widget, Stripe, invoices, objects, staff, analytics. Open the one you need.'
        : 'Inbox, Widget, Stripe, Rechnungen, Objekte, Mitarbeiter, Analytics. Mach die auf, die du brauchst.',
      primaryCTA: isEn ? 'Start live demo' : 'Kostenlos testen',
      primaryHref: isEn ? '/en' : '/',
      secondaryCTA: '',
    })}

    <section class="landing-section">
      <div class="landing-container">
        ${categorySections}
      </div>
    </section>

    ${createCTASection({
      locale,
      headline: isEn ? 'Click through the ones you will actually use.' : 'Klick die durch, die du wirklich brauchst.',
      subheadline: isEn
        ? '3-day trial. No card. Under 5 minutes if the site is ready.'
        : '3 Tage testen. Keine Karte. Unter 5 Minuten, wenn die Seite steht.',
      ...(isEn ? { primaryCTA: 'Start live demo' } : {}),
    })}
  `);
};
