/**
 * Homepage - New Hero Design
 */
import { createHeroNew, initHeroNew } from '../../components/landing/HeroNew.js';
import { createFAQAccordion, initFAQAccordion } from '../../components/landing/FAQAccordion.js';
import { createCTASection } from '../../components/landing/CTASection.js';
import { setPageMeta, setFAQSchema } from '../../lib/seoHelper.js';

const FAQ = [
  { question: 'Was ist BookFast?', answer: 'BookFast ist ein Buchungs- und Zahlungssystem für Webflow-Websites. Du bietest Buchungen direkt auf deiner eigenen Website an – ohne Redirects, ohne iFrames, ohne Provision pro Buchung.' },
  { question: 'Wie funktioniert die Einrichtung?', answer: 'Du legst Objekte und Services im Dashboard an, verbindest Stripe Connect und bettest das Widget per Script-Tag oder Webflow-Template ein. In unter 5 Minuten bist du startklar.' },
  { question: 'Was kostet BookFast?', answer: 'Ab 9,49 €/Monat (Solo, 1 Workspace). Alle Pläne enthalten dieselben Features – nur die Anzahl der Workspaces unterscheidet sich. 0 % Provision pro Buchung.' },
  { question: 'Funktioniert BookFast nur mit Webflow?', answer: 'BookFast ist für Webflow optimiert, funktioniert aber auf jeder Website per Embed-Script. Webflow bietet zusätzlich Template-Copy und native Datenattribute.' },
  { question: 'Brauche ich technisches Wissen?', answer: 'Nein. Script-Tag in deine Website kopieren oder Webflow-Template nutzen – fertig. Keine Programmierkenntnisse nötig.' },
  { question: 'Welche Zahlungsmethoden werden unterstützt?', answer: 'Aktuell Kreditkarte (Visa, Mastercard, Amex) über Stripe Connect. Klarna und PayPal sind in Planung.' },
];

export const renderHomePage = () => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  setPageMeta(null, 'BookFast – Buchungen auf deiner Website. 0% Provision, Zahlung vor Termin. Webflow-native, in 5 Minuten eingerichtet.');
  setFAQSchema(FAQ);

  content.innerHTML = `
    ${createHeroNew({
      tagline: 'Buchungen & Zahlungen für Webflow',
      subheadline: 'Workspace-Name eingeben und Live-Demo starten.',
      formLabel: 'Workspace-Name',
      formPlaceholder: 'z.B. Alpine Chalets, Studio Nordlicht…',
      formButtonText: 'Live-Demo starten',
      formHint: 'Ohne Account Live Demo testen.',
      trustClaims: ['0% Provision', 'Webflow-native', 'Zahlung vor Termin'],
    })}

    ${createCTASection({
      headline: 'Buchungen auf deiner Website – in 5 Minuten eingerichtet.',
      subheadline: '3 Tage kostenlos testen. Keine Kreditkarte nötig.\nIn unter 5 Minuten startklar.',
    })}

    <section class="landing-section landing-section-alt">
      <div class="landing-container">
        <div class="text-center" style="margin-bottom: 2.5rem;">
          <p class="hero-new__tagline">FAQ</p>
          <h2 class="landing-h2">Häufige Fragen zu BookFast.</h2>
        </div>
        ${createFAQAccordion(FAQ)}
      </div>
    </section>
  `;

  initHeroNew();
  initFAQAccordion(content);
};
