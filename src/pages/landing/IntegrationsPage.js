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
import { setPageMeta, setFAQSchema, setBreadcrumbSchema, setHreflangAlternates } from '../../lib/seoHelper.js';

const SHARED_FAQ_EN = [
  { question: 'What is BookFast?', answer: 'BookFast is a Webflow booking system with payments. You offer bookings on your own site — no redirects, no iFrames, no commission per booking.' },
  { question: 'How does setup work?', answer: 'You create objects and services in the dashboard, connect Stripe Connect, and embed the widget via script tag and Webflow template. You can go live in under 5 minutes.' },
  { question: 'How much does BookFast cost?', answer: 'From €9.49/month (Basic, 1 workspace). All plans include the same features — only the number of workspaces differs. 0% commission per booking.' },
  { question: 'Does BookFast only work with Webflow?', answer: 'Yes. BookFast is currently Webflow-only — optimized for Webflow and not supported on other sites yet.' },
  { question: 'Do I need technical skills?', answer: 'No. Add the script tag and Webflow template — done. No programming required.' },
  { question: 'Which payment methods are supported?', answer: 'Currently card (Visa, Mastercard, Amex) via Stripe Connect. Klarna and PayPal are planned.' },
];

const PAGE_FAQ_DE = [
  { question: 'Wie binde ich BookFast in Webflow ein?', answer: 'Zwei Wege: Embed-Script (ein Script-Tag in den Body) oder Template-Copy (Booking-Flow direkt in den Webflow Designer einfügen). Beide Varianten sind in unter 5 Minuten eingerichtet.' },
  { question: 'Brauche ich einen Stripe-Account?', answer: 'Ja, für Online-Zahlungen. Das Stripe-Connect-Onboarding dauert nur wenige Minuten. Ohne Stripe kannst du BookFast auch rein für Buchungsverwaltung nutzen – ohne Zahlungsfunktion.' },
  { question: 'Funktioniert BookFast auch ohne Webflow?', answer: 'Ja. Das Embed-Script funktioniert auf jeder Website. Template-Copy und native Datenattribute sind Webflow-exklusiv.' },
  { question: 'Welche Automatisierungen sind über Webhooks möglich?', answer: 'BookFast feuert Events bei Buchungs- und Zahlungsaktionen (erstellt, bestätigt, abgelehnt, abgeschlossen, erstattet). Du kannst diese Events an beliebige Endpunkte weiterleiten – z. B. Slack, E-Mail-Dienste oder eigene APIs.' },
  { question: 'Ist Google Calendar bereits verfügbar?', answer: 'Noch nicht live. Google Calendar Sync ist aktuell in Entwicklung, ebenso Zapier- und Make-Integrationen.' },
];

const PAGE_FAQ_EN = [
  { question: 'How do I embed BookFast in Webflow?', answer: 'Two ways: embed script (one script tag in the body) or template copy (paste the booking flow into the Webflow Designer). Both are set up in under 5 minutes.' },
  { question: 'Do I need a Stripe account?', answer: 'Yes, for online payments. Stripe Connect onboarding only takes a few minutes. Without Stripe you can still use BookFast for booking management only — without payments.' },
  { question: 'Does BookFast work without Webflow?', answer: 'Yes. The embed script works on any website. Template copy and native data attributes are Webflow-only.' },
  { question: 'What automations are possible with webhooks?', answer: 'BookFast fires events for booking and payment actions (created, confirmed, declined, completed, refunded). You can forward these to any endpoint — e.g. Slack, email services, or your own APIs.' },
  { question: 'Is Google Calendar available yet?', answer: 'Not live yet. Google Calendar sync is in development, as are Zapier and Make integrations.' },
];

export const renderIntegrationsPage = (locale = 'de') => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  const isEn = locale === 'en';
  const sharedFaq = isEn ? SHARED_FAQ_EN : SHARED_FAQ;
  const pageFaq = isEn ? PAGE_FAQ_EN : PAGE_FAQ_DE;

  setPageMeta(
    isEn
      ? 'Integrate Webflow bookings'
      : 'Webflow Termine integrieren',
    isEn
      ? 'Integrate Webflow bookings: embed script or template copy. Stripe, webhooks, Google Calendar — connected in under 5 minutes.'
      : 'Webflow Termine integrieren: Embed-Script oder Template-Copy. Stripe, Webhooks, Google Calendar – in 5 Min. verbunden.',
    { locale },
  );
  setFAQSchema([...sharedFaq, ...pageFaq]);
  setBreadcrumbSchema(
    isEn
      ? [
          { name: 'Home', url: '/en' },
          { name: 'Integrations', url: '/en/integrations' },
        ]
      : [
          { name: 'Home', url: '/' },
          { name: 'Integrationen', url: '/integrationen' },
        ],
  );
  setHreflangAlternates([
    { hreflang: 'de', path: '/integrationen' },
    { hreflang: 'en', path: '/en/integrations' },
  ]);

  content.innerHTML = `
    ${createHero({
      headline: isEn
        ? 'Integrate Webflow bookings — connect tools instead of switching'
        : 'Webflow Termine integrieren – Tools verbinden statt wechseln',
      subheadline: isEn
        ? 'Webflow, Stripe, webhooks — BookFast connects to the tools you already use. No iFrame, full control.'
        : 'Webflow, Stripe, Webhooks – BookFast verbindet sich mit den Tools, die du bereits nutzt. Kein iFrame, volle Kontrolle.',
      illustrationAlt: isEn
        ? 'Integration illustration with Webflow, Stripe, and webhooks in BookFast'
        : 'Integrations-Illustration mit Webflow, Stripe und Webhooks in BookFast',
      secondaryCTA: '',
    })}

    <section class="landing-section">
      <div class="landing-container">
        <div class="landing-grid landing-grid-2" style="max-width: 800px; margin: 0 auto;">
          ${createIntegrationCard({
            icon: iconImg('Globe.svg'),
            name: 'Webflow',
            description: isEn
              ? 'Native integration via embed script or template copy.'
              : 'Native Integration via Embed-Script oder Template-Copy.',
            status: 'active',
          })}
          ${createIntegrationCard({
            icon: iconImg('Bank-card.svg'),
            name: 'Stripe Connect',
            description: isEn
              ? 'Payments, deposits, refunds, and automatic payouts.'
              : 'Zahlungen, Anzahlungen, Refunds und automatische Auszahlungen.',
            status: 'active',
          })}
          ${createIntegrationCard({
            icon: iconImg('calender-days-date.svg'),
            name: 'Google Calendar',
            description: isEn
              ? 'Two-way sync for your bookings.'
              : 'Zwei-Wege-Sync für deine Buchungen.',
            status: 'coming-soon',
          })}
          ${createIntegrationCard({
            icon: iconImg('blocks-integration.svg'),
            name: 'Webhooks',
            description: isEn
              ? 'Events for automations and custom integrations.'
              : 'Events für Automatisierungen und eigene Integrationen.',
            status: 'active',
          })}
        </div>
      </div>
    </section>

    <section class="landing-section landing-section-alt">
      <div class="landing-container">
        ${createFeatureSection({
          title: isEn
            ? 'Webflow — copy, paste, done.'
            : 'Webflow – Copy, Paste, Fertig.',
          description: isEn
            ? 'BookFast was built for Webflow. Two ways to integrate:'
            : 'BookFast wurde für Webflow entwickelt. Zwei Wege zur Integration:',
          bullets: isEn
            ? [
                'Embed script: one script tag in the body — done.',
                'Template copy: paste the booking flow into the Webflow Designer — full design control.',
                'Data attributes instead of iFrame: your booking widget lives natively in your Webflow page.',
              ]
            : [
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
          title: isEn
            ? 'Stripe Connect — professional payments.'
            : 'Stripe Connect – Professionelle Zahlungen.',
          description: isEn
            ? 'Set up in under 5 minutes. Your customers pay directly.'
            : 'In unter 5 Minuten eingerichtet. Deine Kunden zahlen direkt.',
          bullets: isEn
            ? [
                'Onboarding in 3 steps: create account, verify, done.',
                'Configurable deposits (e.g. 30% at booking).',
                'Automatic refund on decline.',
                'Payout to your bank account 24h after confirmation.',
              ]
            : [
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
          title: isEn
            ? 'Webhooks — automate everything.'
            : 'Webhooks – Automatisiere alles.',
          description: isEn
            ? 'BookFast fires events on every relevant action. Perfect for custom integrations.'
            : 'BookFast feuert Events bei jeder relevanten Aktion. Perfekt für eigene Integrationen.',
          bullets: isEn
            ? [
                'Events: booking created, confirmed, declined, completed.',
                'Payment succeeded, failed, refunded.',
                'JSON payload with all relevant data.',
              ]
            : [
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
        <h2 class="landing-h2">${isEn ? 'More integrations in the pipeline.' : 'Weitere Integrationen in Planung.'}</h2>
        <div class="landing-grid landing-grid-3" style="max-width: 700px; margin: 2rem auto 0;">
          <div style="padding: 1.5rem; background: var(--color-stone-50); border-radius: 12px; text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${iconImg('calender-days-date.svg')}</div>
            <h4 class="landing-h4">Google Calendar</h4>
            <p class="landing-text-sm">${isEn ? 'Two-way sync' : 'Zwei-Wege-Sync'}</p>
          </div>
          <div style="padding: 1.5rem; background: var(--color-stone-50); border-radius: 12px; text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${iconImg('Bulp.svg')}</div>
            <h4 class="landing-h4">Zapier</h4>
            <p class="landing-text-sm">${isEn ? '1000+ app connections' : '1000+ App-Verbindungen'}</p>
          </div>
          <div style="padding: 1.5rem; background: var(--color-stone-50); border-radius: 12px; text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${iconImg('gear.svg')}</div>
            <h4 class="landing-h4">Make</h4>
            <p class="landing-text-sm">${isEn ? 'Visual automations' : 'Visuelle Automationen'}</p>
          </div>
        </div>
      </div>
    </section>

    ${createCTASection({
      locale,
      headline: isEn
        ? 'Set up integrations in under 5 minutes.'
        : 'Integrationen in unter 5 Minuten einrichten.',
      subheadline: isEn
        ? '3-day free trial. No credit card required. Connect Webflow + Stripe in a few clicks.'
        : '3 Tage kostenlos testen. Keine Kreditkarte nötig. Webflow + Stripe in wenigen Klicks verbunden.',
      ...(isEn
        ? {
            primaryCTA: 'Start live demo',
          }
        : {}),
    })}

    ${createFAQSection({
      sharedFaq,
      pageFaq,
      pageTitle: isEn ? 'Integrations' : 'Integrationen',
    })}
  `;

  initFAQAccordion(content);
};
