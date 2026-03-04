/**
 * About Page
 */
import { createHero } from '../../components/landing/Hero.js';
import { createCTASection } from '../../components/landing/CTASection.js';
import { iconImg } from '../../lib/landingAssets.js';
import { setPageMeta } from '../../lib/seoHelper.js';

export const renderAboutPage = () => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  setPageMeta('Über uns', 'Die Geschichte hinter BookFast – warum wir das Buchungssystem für Webflow gebaut haben.');

  content.innerHTML = `
    ${createHero({
      headline: 'Warum wir BookFast gebaut haben.',
      subheadline: 'Wir waren frustriert von den Booking-Lösungen für Webflow. Also haben wir das Tool gebaut, das wir selbst vermisst haben – ohne iFrames, ohne Provision, mit echter Kontrolle.',
      secondaryCTA: '',
      primaryCTA: 'Kostenlos starten',
    })}

    <section class="landing-section">
      <div class="landing-container-narrow">
        <h2 class="landing-h2">Unsere Mission</h2>
        <p class="landing-text" style="margin-top: 1rem;">
          Webflow-Designer und ihre Kunden verdienen ein Buchungssystem, das sich nahtlos integriert. 
          Keine iFrames, keine Redirects, keine Provisionen. Ein System, das dem Designer volle Kontrolle gibt 
          und dem Endkunden ein erstklassiges Booking-Erlebnis bietet.
        </p>
        <p class="landing-text" style="margin-top: 1rem;">
          BookFast ist diese Lösung: Ein Booking-Widget + Operator-Dashboard, das in Webflow lebt.
          Mit echten Daten, echten Zahlungen und automatischen Rechnungen. Probier es aus – 3 Tage kostenlos, keine Kreditkarte nötig.
        </p>
      </div>
    </section>

    <section class="landing-section landing-section-alt">
      <div class="landing-container">
        <div class="text-center" style="margin-bottom: 2.5rem;">
          <h2 class="landing-h2">Unsere Werte</h2>
        </div>
        <div class="landing-grid landing-grid-3" style="max-width: 960px; margin: 0 auto;">
          <div style="padding: 2rem; background: white; border-radius: 12px; border: 1px solid var(--color-stone-200); text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">${iconImg('target.svg')}</div>
            <h3 class="landing-h4">Klarheit</h3>
            <p class="landing-text-sm">Einfache Preise, klare Kommunikation, keine versteckten Kosten.</p>
          </div>
          <div style="padding: 2rem; background: white; border-radius: 12px; border: 1px solid var(--color-stone-200); text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">${iconImg('Bulp.svg')}</div>
            <h3 class="landing-h4">Geschwindigkeit</h3>
            <p class="landing-text-sm">In unter 5 Minuten startklar. Keine Lernkurve, keine Einarbeitungszeit.</p>
          </div>
          <div style="padding: 2rem; background: white; border-radius: 12px; border: 1px solid var(--color-stone-200); text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">${iconImg('gear.svg')}</div>
            <h3 class="landing-h4">Kontrolle</h3>
            <p class="landing-text-sm">Du bestimmst den Booking-Flow, das Design und die Regeln.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-container-narrow text-center">
        <h2 class="landing-h2">Team</h2>
        <p class="landing-text" style="margin-top: 1rem;">
          BookFast wird von einem kleinen, fokussierten Team aus Deutschland entwickelt. 
          Wir sind Webflow-Enthusiasten, die das Tool bauen, das sie selbst vermisst haben.
        </p>
      </div>
    </section>

    ${createCTASection({
      headline: 'BookFast kostenlos testen.',
      subheadline: '3 Tage kostenlos. Keine Kreditkarte nötig. In unter 5 Minuten startklar.',
    })}
  `;
};
