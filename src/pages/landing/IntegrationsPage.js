/**
 * Integrations Page
 */
import { createHero } from '../../components/landing/Hero.js';
import { createIntegrationCard } from '../../components/landing/IntegrationCard.js';
import { createFeatureSection } from '../../components/landing/FeatureSection.js';
import { createFAQSection, initFAQAccordion } from '../../components/landing/FAQAccordion.js';
import { SHARED_FAQ } from '../../data/faq.js';
import { createCTASection } from '../../components/landing/CTASection.js';
import { iconImg } from '../../lib/landingAssets.js';
import { setPageMeta, setFAQSchema } from '../../lib/seoHelper.js';

const PAGE_FAQ = [
  { question: 'Wie binde ich BookFast in Webflow ein?', answer: 'Zwei Wege: Embed-Script (ein Script-Tag in den Body) oder Template-Copy (Booking-Flow direkt in den Webflow Designer einfügen). Beide Varianten sind in unter 5 Minuten eingerichtet.' },
  { question: 'Brauche ich einen Stripe-Account?', answer: 'Ja, für Online-Zahlungen. Das Stripe-Connect-Onboarding dauert nur wenige Minuten. Ohne Stripe kannst du BookFast auch rein für Buchungsverwaltung nutzen – ohne Zahlungsfunktion.' },
  { question: 'Funktioniert BookFast auch ohne Webflow?', answer: 'Ja. Das Embed-Script funktioniert auf jeder Website. Template-Copy und native Datenattribute sind Webflow-exklusiv.' },
  { question: 'Welche Automatisierungen sind über Webhooks möglich?', answer: 'BookFast feuert Events bei Buchungs- und Zahlungsaktionen (erstellt, bestätigt, abgelehnt, abgeschlossen, erstattet). Du kannst diese Events an beliebige Endpunkte weiterleiten – z. B. Slack, E-Mail-Dienste oder eigene APIs.' },
  { question: 'Ist Google Calendar bereits verfügbar?', answer: 'Google Calendar Sync ist aktuell in Entwicklung und kommt bald. Ebenso Zapier- und Make-Integrationen.' },
];

export const renderIntegrationsPage = () => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  setPageMeta('Integrationen', 'BookFast integriert sich nahtlos mit Webflow, Stripe, Google Calendar und mehr.');
  setFAQSchema([...SHARED_FAQ, ...PAGE_FAQ]);

  content.innerHTML = `
    ${createHero({
      headline: 'Integrationen: Tools verbinden statt wechseln.',
      subheadline: 'Webflow, Stripe, Webhooks – BookFast verbindet sich mit den Tools, die du bereits nutzt. Kein iFrame, volle Kontrolle.',
      illustrationAlt: 'Integrations-Illustration mit Webflow, Stripe und Webhooks in BookFast',
      secondaryCTA: '',
    })}

    <section class="landing-section">
      <div class="landing-container">
        <div class="landing-grid landing-grid-2" style="max-width: 800px; margin: 0 auto;">
          ${createIntegrationCard({ icon: iconImg('Globe.svg'), name: 'Webflow', description: 'Native Integration via Embed-Script oder Template-Copy.', status: 'active' })}
          ${createIntegrationCard({ icon: iconImg('Bank-card.svg'), name: 'Stripe Connect', description: 'Zahlungen, Anzahlungen, Refunds und automatische Auszahlungen.', status: 'active' })}
          ${createIntegrationCard({ icon: iconImg('calender-days-date.svg'), name: 'Google Calendar', description: 'Zwei-Wege-Sync für deine Buchungen.', status: 'coming-soon' })}
          ${createIntegrationCard({ icon: iconImg('blocks-integration.svg'), name: 'Webhooks', description: 'Events für Automatisierungen und eigene Integrationen.', status: 'active' })}
        </div>
      </div>
    </section>

    <section class="landing-section landing-section-alt">
      <div class="landing-container">
        ${createFeatureSection({
          title: 'Webflow – Copy, Paste, Fertig.',
          description: 'BookFast wurde für Webflow entwickelt. Zwei Wege zur Integration:',
          bullets: [
            'Embed-Script: Ein Script-Tag in den Body, fertig.',
            'Template-Copy: Booking-Flow direkt in den Webflow Designer einfügen – volle Kontrolle über das Design.',
            'Datenattribute statt iFrame: Dein Booking-Widget lebt nativ in deiner Webflow-Seite.',
          ],
        })}
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-container">
        ${createFeatureSection({
          title: 'Stripe Connect – Professionelle Zahlungen.',
          description: 'In unter 5 Minuten eingerichtet. Deine Kunden zahlen direkt.',
          bullets: [
            'Onboarding in 3 Schritten: Konto erstellen, verifizieren, fertig.',
            'Anzahlungen konfigurierbar (z.B. 30% bei Buchung).',
            'Automatische Rückerstattung bei Ablehnung.',
            'Auszahlung 24h nach Bestätigung auf dein Bankkonto.',
          ],
          reverse: true,
        })}
      </div>
    </section>

    <section class="landing-section landing-section-alt">
      <div class="landing-container">
        ${createFeatureSection({
          title: 'Webhooks – Automatisiere alles.',
          description: 'BookFast feuert Events bei jeder relevanten Aktion. Perfekt für eigene Integrationen.',
          bullets: [
            'Events: Buchung erstellt, bestätigt, abgelehnt, abgeschlossen.',
            'Zahlung erfolgreich, fehlgeschlagen, erstattet.',
            'JSON-Payload mit allen relevanten Daten.',
          ],
        })}
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-container text-center">
        <p class="landing-label">Coming Soon</p>
        <h2 class="landing-h2">Weitere Integrationen in Planung.</h2>
        <div class="landing-grid landing-grid-3" style="max-width: 700px; margin: 2rem auto 0;">
          <div style="padding: 1.5rem; background: var(--color-stone-50); border-radius: 12px; text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${iconImg('calender-days-date.svg')}</div>
            <h4 class="landing-h4">Google Calendar</h4>
            <p class="landing-text-sm">Zwei-Wege-Sync</p>
          </div>
          <div style="padding: 1.5rem; background: var(--color-stone-50); border-radius: 12px; text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${iconImg('Bulp.svg')}</div>
            <h4 class="landing-h4">Zapier</h4>
            <p class="landing-text-sm">1000+ App-Verbindungen</p>
          </div>
          <div style="padding: 1.5rem; background: var(--color-stone-50); border-radius: 12px; text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${iconImg('gear.svg')}</div>
            <h4 class="landing-h4">Make</h4>
            <p class="landing-text-sm">Visuelle Automationen</p>
          </div>
        </div>
      </div>
    </section>

    ${createCTASection({
      headline: 'Integrationen in unter 5 Minuten einrichten.',
      subheadline: '3 Tage kostenlos testen. Keine Kreditkarte nötig. Webflow + Stripe in wenigen Klicks verbunden.',
    })}

    ${createFAQSection({ sharedFaq: SHARED_FAQ, pageFaq: PAGE_FAQ, pageTitle: 'Integrationen' })}
  `;

  initFAQAccordion(content);
};
