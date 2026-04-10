/**
 * About Page
 */
import { createHero } from '../../components/landing/Hero.js';
import { createCTASection } from '../../components/landing/CTASection.js';
import { iconImg } from '../../lib/landingAssets.js';
import { setPageMeta, setBreadcrumbSchema, setHreflangAlternates } from '../../lib/seoHelper.js';

export const renderAboutPage = (locale = 'de') => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  const isEn = locale === 'en';

  setPageMeta(
    isEn ? 'About us' : 'Über uns',
    isEn
      ? 'The story behind BookFast — why we built the booking system for Webflow.'
      : 'Die Geschichte hinter BookFast – warum wir das Buchungssystem für Webflow gebaut haben.',
    { locale },
  );
  setBreadcrumbSchema([
    { name: 'Home', url: isEn ? '/en' : '/' },
    { name: isEn ? 'About' : 'Über uns', url: isEn ? '/en/about' : '/ueber-uns' },
  ]);
  setHreflangAlternates([
    { hreflang: 'de', path: '/ueber-uns' },
    { hreflang: 'en', path: '/en/about' },
  ]);

  content.innerHTML = `
    ${createHero({
      headline: isEn ? 'Why we built BookFast.' : 'Warum wir BookFast gebaut haben.',
      subheadline: isEn
        ? 'We were frustrated with booking options for Webflow. So we built the tool we wished existed — no iframes, no commission, real control.'
        : 'Wir waren frustriert von den Booking-Lösungen für Webflow. Also haben wir das Tool gebaut, das wir selbst vermisst haben – ohne iFrames, ohne Provision, mit echter Kontrolle.',
      illustrationAlt: isEn
        ? 'Illustration of BookFast’s origin and digital booking'
        : 'Illustration zur Entstehung von BookFast und digitaler Buchungsabwicklung',
      secondaryCTA: '',
      primaryCTA: isEn ? 'Start for free' : 'Kostenlos starten',
    })}

    <section class="landing-section">
      <div class="landing-container-narrow">
        <h2 class="landing-h2">${isEn ? 'Our mission' : 'Unsere Mission'}</h2>
        <p class="landing-text" style="margin-top: 1rem;">
          ${isEn
            ? `Webflow designers and their clients deserve a booking system that fits seamlessly.
          No iframes, no redirects, no commissions. A system that gives designers full control
          and end customers a first-class booking experience.`
            : `Webflow-Designer und ihre Kunden verdienen ein Buchungssystem, das sich nahtlos integriert. 
          Keine iFrames, keine Redirects, keine Provisionen. Ein System, das dem Designer volle Kontrolle gibt 
          und dem Endkunden ein erstklassiges Booking-Erlebnis bietet.`}
        </p>
        <p class="landing-text" style="margin-top: 1rem;">
          ${isEn
            ? 'BookFast is that solution: a booking widget + operator dashboard that lives in Webflow. With real data, real payments, and automatic invoices. Try it — 3 days free, no credit card.'
            : `BookFast ist diese Lösung: Ein Booking-Widget + Operator-Dashboard, das in Webflow lebt.
          Mit echten Daten, echten Zahlungen und automatischen Rechnungen. Probier es aus – 3 Tage kostenlos, keine Kreditkarte nötig.`}
        </p>
      </div>
    </section>

    <section class="landing-section landing-section-alt">
      <div class="landing-container">
        <div class="text-center" style="margin-bottom: 2.5rem;">
          <h2 class="landing-h2">${isEn ? 'Our values' : 'Unsere Werte'}</h2>
        </div>
        <div class="landing-grid landing-grid-3" style="max-width: 960px; margin: 0 auto;">
          <div style="padding: 2rem; background: white; border-radius: 12px; border: 1px solid var(--color-stone-200); text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">${iconImg('target.svg')}</div>
            <h3 class="landing-h4">${isEn ? 'Clarity' : 'Klarheit'}</h3>
            <p class="landing-text-sm">${isEn ? 'Simple pricing, clear communication, no hidden fees.' : 'Einfache Preise, klare Kommunikation, keine versteckten Kosten.'}</p>
          </div>
          <div style="padding: 2rem; background: white; border-radius: 12px; border: 1px solid var(--color-stone-200); text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">${iconImg('Bulp.svg')}</div>
            <h3 class="landing-h4">${isEn ? 'Speed' : 'Geschwindigkeit'}</h3>
            <p class="landing-text-sm">${isEn ? 'Live in under 5 minutes. No learning curve, no ramp-up.' : 'In unter 5 Minuten startklar. Keine Lernkurve, keine Einarbeitungszeit.'}</p>
          </div>
          <div style="padding: 2rem; background: white; border-radius: 12px; border: 1px solid var(--color-stone-200); text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">${iconImg('gear.svg')}</div>
            <h3 class="landing-h4">${isEn ? 'Control' : 'Kontrolle'}</h3>
            <p class="landing-text-sm">${isEn ? 'You define the booking flow, design, and rules.' : 'Du bestimmst den Booking-Flow, das Design und die Regeln.'}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-container-narrow text-center">
        <h2 class="landing-h2">${isEn ? 'Team' : 'Team'}</h2>
        <p class="landing-text" style="margin-top: 1rem;">
          ${isEn
            ? 'BookFast is built by a small, focused team in Germany. We are Webflow enthusiasts building the tool we missed ourselves.'
            : `BookFast wird von einem kleinen, fokussierten Team aus Deutschland entwickelt. 
          Wir sind Webflow-Enthusiasten, die das Tool bauen, das sie selbst vermisst haben.`}
        </p>
      </div>
    </section>

    ${createCTASection({
      locale,
      headline: isEn ? 'Try BookFast for free.' : 'BookFast kostenlos testen.',
      subheadline: isEn ? '3 days free. No credit card. Live in under 5 minutes.' : '3 Tage kostenlos. Keine Kreditkarte nötig. In unter 5 Minuten startklar.',
      ...(isEn ? { primaryCTA: 'Start live demo' } : {}),
    })}
  `;
};
