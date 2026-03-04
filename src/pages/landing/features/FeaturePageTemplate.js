/**
 * Feature Page Template
 * Renders ANY feature page based on config data from featurePages.js
 * All feature pages use FeatureHero + interactiveHowItWorks (when steps exist).
 */
import { createFeatureHero } from '../../../components/landing/FeatureHero.js';
import { getDemoModule } from '../../../components/landing/featureDemos/index.js';
import { createFeatureSection } from '../../../components/landing/FeatureSection.js';
import { createHowItWorksInteractive, initHowItWorksInteractive } from '../../../components/landing/HowItWorksInteractive.js';
import { createFeatureGrid } from '../../../components/landing/FeatureCard.js';
import { createFAQAccordion, initFAQAccordion } from '../../../components/landing/FAQAccordion.js';
import { createCTASection } from '../../../components/landing/CTASection.js';
import { setPageMeta, setFAQSchema } from '../../../lib/seoHelper.js';
import { escapeHtml } from '../../../lib/sanitize.js';
import { iconImg, svgAssetUrl } from '../../../lib/landingAssets.js';
import { featurePages } from '../../../data/features/index.js';

/**
 * Render a feature page by slug
 * @param {string} slug - Feature slug (e.g. 'buchungen')
 */
export const renderFeaturePage = (slug) => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  const page = featurePages[slug];
  if (!page) {
    content.innerHTML = `
      <section class="landing-hero">
        <div class="landing-container landing-hero-centered">
          <h1 class="landing-h1">Feature nicht gefunden</h1>
          <p class="landing-text-lg">Das Feature "${escapeHtml(slug)}" existiert noch nicht.</p>
          <div class="landing-hero-ctas" style="justify-content: center;">
            <a href="/features" class="landing-btn landing-btn-secondary" data-landing-link>Alle Features</a>
          </div>
        </div>
      </section>`;
    return;
  }

  setPageMeta(page.meta.title, page.meta.description);
  if (page.faq) setFAQSchema(page.faq);

  // Build related features
  const relatedHTML = page.relatedFeatures?.length ? (() => {
    const related = page.relatedFeatures
      .map(slug => featurePages[slug])
      .filter(Boolean)
      .map(f => ({
        icon: getFeatureIcon(f.slug),
        title: f.meta.title,
        description: (f.hero?.subheadline || '').slice(0, 80) + '...',
        link: `/features/${f.slug}`,
      }));
    return related.length ? `
      <section class="landing-section landing-section-alt">
        <div class="landing-container text-center">
          <p class="landing-label">Verwandte Features</p>
          <h2 class="landing-h2">So erreichst du mehr mit ${page.meta.title}.</h2>
          <div style="margin-top: 2rem;">
            ${createFeatureGrid(related)}
          </div>
        </div>
      </section>` : '';
  })() : '';

  // Build journey sections (alternating left/right like Integrations page)
  const journeyHTML = page.journey?.length ? page.journey.map((step, i) => `
    <section class="landing-section ${i % 2 === 0 ? 'landing-section-alt' : ''}">
      <div class="landing-container">
        ${createFeatureSection({
          title: step.title,
          description: step.description,
          bullets: step.bullets || [],
          reverse: !!step.reverse,
        })}
      </div>
    </section>
  `).join('') : '';

  // Fallback: Problem + Screenshot + Steps when no journey
  const hasInteractiveHowItWorks = Boolean(page.interactiveHowItWorks && page.steps?.length);
  const interactiveHowItWorksHTML = hasInteractiveHowItWorks
    ? createHowItWorksInteractive({
        label: page.interactiveHowItWorksLabel || "So funktioniert's",
        headline: page.interactiveHowItWorksHeadline || `${page.meta.title} in ${page.steps.length} Schritten.`,
        steps: page.steps,
        previewHTML: '',
      })
    : '';

  const fallbackHTML = !page.journey?.length ? `
    <!-- 2. Problem → Lösung -->
    <section class="landing-section landing-section-alt">
      <div class="landing-container">
        ${createFeatureSection({
          title: 'Das Problem.',
          description: page.problem.text,
          bullets: page.problem.bullets,
        })}
      </div>
    </section>

    <!-- 3. Screenshot -->
    <section class="landing-section">
      <div class="landing-container text-center">
        <p class="landing-label">So sieht's aus</p>
        <h2 class="landing-h2">${page.meta.title} im Dashboard.</h2>
        <div style="margin-top: 2rem; background: var(--color-stone-100); border-radius: 16px; height: 400px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--color-stone-200);">
          <span style="font-size: 3rem; opacity: 0.3;">${iconImg('target.svg')} Screenshot</span>
        </div>
      </div>
    </section>

    <!-- 4. So funktioniert's (alternierendes links-rechts Layout) -->
    ${page.steps?.length && !hasInteractiveHowItWorks ? `
    <section class="landing-section">
      <div class="landing-container text-center">
        <p class="landing-label">So funktioniert's</p>
        <h2 class="landing-h2">${page.meta.title} in ${page.steps.length} Schritten.</h2>
      </div>
    </section>
    ${page.steps.map((step, i) => `
    <section class="landing-section ${i % 2 === 1 ? 'landing-section-alt' : ''}">
      <div class="landing-container">
        ${createFeatureSection({
          title: step.title?.startsWith(String(i + 1) + '.') ? step.title : `${i + 1}. ${step.title}`,
          description: step.description,
          bullets: step.bullets || [],
          imageHTML: `<div class="landing-feature-image" style="height: 200px; display:flex; align-items:center; justify-content:center; background: var(--color-stone-100); border-radius: 12px;"><span style="width: 64px; height: 64px; border-radius: 50%; background: var(--color-vulcan-900); color: white; font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; justify-content: center;">${i + 1}</span></div>`,
          reverse: step.reverse !== undefined ? step.reverse : (i % 2 === 1),
        })}
      </div>
    </section>`).join('')}` : ''}
  ` : '';

  // Build hero: FeatureHero for all feature pages (demo module or illustration)
  const demoMod = page.hero.demoModule ? getDemoModule(page.hero.demoModule) : null;
  const defaultIllustration = svgAssetUrl('illustrations/landingpage/features/ft_objektverwaltung.svg');
  const heroHTML = createFeatureHero({
    headline: page.hero.headline,
    subheadline: page.hero.subheadline,
    illustrationSrc: page.hero.illustration || defaultIllustration,
    breadcrumb: ['Home', 'Features', page.meta.title],
    demoModuleHTML: demoMod ? demoMod.create() : '',
    demoHint: demoMod ? "Tippe, klicke & probier's aus — ganz ohne Account." : '',
  });

  content.innerHTML = `
    <!-- 1. Hero -->
    ${heroHTML}

    ${hasInteractiveHowItWorks ? `
    <!-- 2. So funktioniert's (interactive) -->
    ${interactiveHowItWorksHTML}
    ` : ''}

    ${page.journey?.length ? `
    <!-- 2. Journey (alternating sections) -->
    ${journeyHTML}
    ` : fallbackHTML}

    <!-- 5. Use-Cases -->
    ${page.useCases?.length ? `
    <section class="landing-section">
      <div class="landing-container text-center">
        <p class="landing-label">Perfekt für</p>
        <h2 class="landing-h2">Use-Cases für ${page.meta.title}.</h2>
        <div style="margin-top: 2rem;">
          ${createFeatureGrid(page.useCases)}
        </div>
      </div>
    </section>` : ''}

    <!-- 6. Verwandte Features -->
    ${relatedHTML}

    <!-- 7. FAQ -->
    ${page.faq?.length ? `
    <section class="landing-section ${relatedHTML ? '' : 'landing-section-alt'}">
      <div class="landing-container">
        <div class="text-center" style="margin-bottom: 2.5rem;">
          <p class="hero-new__tagline">FAQ</p>
          <h2 class="landing-h2">Häufige Fragen zu ${page.meta.title}.</h2>
        </div>
        ${createFAQAccordion(page.faq)}
      </div>
    </section>` : ''}

    <!-- 8. CTA -->
    ${createCTASection({
      headline: page.cta?.headline ?? `${page.meta.title} kostenlos testen.`,
      subheadline: page.cta && 'subheadline' in page.cta ? page.cta.subheadline : '3 Tage kostenlos testen. Keine Kreditkarte nötig. In unter 5 Minuten startklar.',
    })}
  `;

  // Init interactive demo module (if present)
  if (demoMod) demoMod.init(content);

  // Init interactive "How it works" section (currently enabled for objekte)
  if (hasInteractiveHowItWorks) {
    initHowItWorksInteractive(content, {
      renderPreview: () => {
        const heroPreview = content.querySelector('#feature-hero-demo .feature-hero__card-frame');
        if (!heroPreview) return '';
        const clone = heroPreview.cloneNode(true);
        clone.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
        return clone.outerHTML;
      },
    });
  }

  // Init FAQ
  const faqContainer = content.querySelector('.landing-faq-list');
  if (faqContainer) initFAQAccordion(content);
};

/**
 * Get emoji icon for a feature slug
 */
const getFeatureIcon = (slug) => {
  const icons = {
    buchungen: iconImg('list.svg'), objekte: iconImg('home.svg'), services: `${iconImg('gear.svg')}️`, zahlungen: iconImg('Bank-card.svg'),
    rechnungen: iconImg('receipt-euro.svg'), analytics: iconImg('chart.svg'), integration: iconImg('Globe.svg'), kundenportal: iconImg('blocks-integration.svg'),
    mitarbeiter: iconImg('users-2.svg'), addons: iconImg('ticket-percent.svg'), gutscheine: `${iconImg('ticket-percent.svg')}️`, kunden: iconImg('user.svg'),
    verfuegbarkeit: iconImg('lock.svg'), buffer: iconImg('clean.svg'), zeitfenster: '⏰', approval: iconImg('check.svg'),
    overnight: iconImg('date-cog.svg'), workspaces: iconImg('Building-comapny.svg'), kaution: iconImg('lock.svg'),
    urlaub: iconImg('calender-days-date.svg'), 'email-templates': `${iconImg('Mail.svg')}️`,
  };
  return icons[slug] || iconImg('package.svg');
};
