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
  { question: 'What is BookFast?', answer: 'A booking system for Webflow with Stripe. Guests book on your page. No redirect, no iframe, no BookFast cut per booking.' },
  { question: 'How does setup work?', answer: 'Create objects and services, connect Stripe Connect, add the script tag and the Webflow template. Often under 5 minutes if the site is ready.' },
  { question: 'How much does BookFast cost?', answer: 'From €9.49/month (Basic, 1 workspace). Same features on every plan. You pay for workspace count. 0% commission per booking.' },
  { question: 'Does BookFast only work with Webflow?', answer: 'Built for Webflow. The script needs the markup from the Webflow template. On other platforms you would have to rebuild it yourself.' },
  { question: 'Do I need technical skills?', answer: 'No. Paste the template into the Webflow Designer and copy one script tag. No custom code.' },
  { question: 'Which payment methods are supported?', answer: 'Card (Visa, Mastercard, Amex) via Stripe Connect. Klarna and PayPal are planned.' },
];

const PAGE_FAQ_DE = [
  { question: 'Wie binde ich BookFast in Webflow ein?', answer: 'Zwei Schritte: Booking Flow Template in den Webflow Designer einfügen, dann das Embed-Script vor </body> setzen. Beides ist in unter 5 Minuten drin, wenn die Seite steht.' },
  { question: 'Brauche ich einen Stripe-Account?', answer: 'Ja, wenn online kassiert werden soll. Stripe Connect dauert ein paar Minuten. Ohne Stripe geht BookFast nur als Buchungsliste, ohne Zahlung.' },
  { question: 'Funktioniert BookFast auch ohne Webflow?', answer: 'Das Script braucht das Markup mit den data-bf-Attributen aus dem Template. Auf anderen Systemen müsstest du es selbst nachbauen.' },
  { question: 'Gibt es Webhooks?', answer: 'Noch nicht. Webhooks stehen mit Google Calendar, Zapier und Make auf der Liste.' },
  { question: 'Ist Google Calendar bereits verfügbar?', answer: 'Nein. Kalender-Sync, Zapier und Make sind in Arbeit, nicht live.' },
];

const PAGE_FAQ_EN = [
  { question: 'How do I embed BookFast in Webflow?', answer: 'Two steps: paste the booking flow template into the Webflow Designer, then add the embed script before </body>. Both take under 5 minutes if the site is ready.' },
  { question: 'Do I need a Stripe account?', answer: 'Yes, if you take money online. Stripe Connect takes a few minutes. Without Stripe you still get the booking list, no payments.' },
  { question: 'Does BookFast work without Webflow?', answer: 'The script needs the markup with data-bf attributes from the template. On other platforms you would have to rebuild it yourself.' },
  { question: 'Are there webhooks?', answer: 'Not yet. Webhooks are on the list with Google Calendar, Zapier, and Make.' },
  { question: 'Is Google Calendar available yet?', answer: 'No. Calendar sync, Zapier, and Make are in progress, not live.' },
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
      ? 'Webflow bookings: template copy plus embed script. Stripe Connect for payments. Webhooks and calendar sync are not live yet.'
      : 'Webflow-Buchungen: Template-Copy plus Embed-Script. Stripe Connect für Zahlungen. Webhooks und Kalender-Sync sind noch nicht live.',
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
        ? 'Webflow and Stripe. Webhooks and calendar later.'
        : 'Webflow und Stripe. Webhooks und Kalender später.',
      subheadline: isEn
        ? 'Template copy plus embed script for the widget. Stripe Connect for money. That covers booking and payment today.'
        : 'Template-Copy plus Embed-Script fürs Widget. Stripe Connect fürs Geld. Das deckt Buchung und Zahlung heute ab.',
      illustrationAlt: isEn
        ? 'Integration illustration with Webflow and Stripe in BookFast'
        : 'Integrations-Illustration mit Webflow und Stripe in BookFast',
      secondaryCTA: '',
    })}

    <section class="landing-section">
      <div class="landing-container">
        <div class="landing-grid landing-grid-2" style="max-width: 800px; margin: 0 auto;">
          ${createIntegrationCard({
            icon: iconImg('Globe.svg'),
            name: 'Webflow',
            description: isEn
              ? 'Template copy plus embed script. The widget sits in the page.'
              : 'Template-Copy plus Embed-Script. Das Widget sitzt in der Seite.',
            status: 'active',
          })}
          ${createIntegrationCard({
            icon: iconImg('Bank-card.svg'),
            name: 'Stripe Connect',
            description: isEn
              ? 'Card payments, refunds, and payouts on your Stripe schedule.'
              : 'Kartenzahlung, Erstattungen und Auszahlung nach deinem Stripe-Plan.',
            status: 'active',
          })}
          ${createIntegrationCard({
            icon: iconImg('calender-days-date.svg'),
            name: 'Google Calendar',
            description: isEn
              ? 'Two-way sync. Not live.'
              : 'Zwei-Wege-Sync. Nicht live.',
            status: 'coming-soon',
          })}
          ${createIntegrationCard({
            icon: iconImg('blocks-integration.svg'),
            name: 'Webhooks',
            description: isEn
              ? 'Booking and payment events to your URL. Not live.'
              : 'Buchungs- und Zahlungs-Events an deine URL. Nicht live.',
            status: 'coming-soon',
          })}
        </div>
      </div>
    </section>

    <section class="landing-section landing-section-alt">
      <div class="landing-container">
        ${createFeatureSection({
          title: isEn
            ? 'Webflow. Copy, paste, live.'
            : 'Webflow. Copy, Paste, live.',
          description: isEn
            ? 'Two steps. The template brings the elements, the script brings the data.'
            : 'Zwei Schritte. Das Template bringt die Elemente, das Script die Daten.',
          bullets: isEn
            ? [
                'Template copy: paste the booking flow into the Designer.',
                'Embed script: one script tag with data-site-id before </body>.',
                'No iframe. You style the widget like any other element.',
              ]
            : [
                'Template-Copy: den Booking Flow in den Designer einfügen.',
                'Embed-Script: ein Script-Tag mit data-site-id vor </body>.',
                'Kein iFrame. Du gestaltest das Widget wie jedes andere Element.',
              ],
        })}
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-container">
        ${createFeatureSection({
          title: isEn
            ? 'Stripe Connect. Money before the slot.'
            : 'Stripe Connect. Geld vor dem Termin.',
          description: isEn
            ? 'Onboarding from BookFast settings. Guests pay in the widget.'
            : 'Onboarding aus den BookFast-Einstellungen. Gäste zahlen im Widget.',
          bullets: isEn
            ? [
                'Create or connect a Stripe account, verify, done.',
                'Guests pay by card when booking, in full or as a deposit per service.',
                'Decline triggers the refund.',
                'Payouts follow your Stripe schedule.',
              ]
            : [
                'Stripe-Konto anlegen oder verbinden, verifizieren, fertig.',
                'Gäste zahlen bei der Buchung per Karte, voll oder als Anzahlung pro Service.',
                'Ablehnen löst die Rückerstattung aus.',
                'Auszahlung folgt deinem Stripe-Rhythmus.',
              ],
          reverse: true,
        })}
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-container text-center">
        <p class="landing-label">${isEn ? 'Not live' : 'Noch nicht live'}</p>
        <h2 class="landing-h2">${isEn ? 'On the list, not in production.' : 'Auf der Liste, nicht in Produktion.'}</h2>
        <div class="landing-grid landing-grid-2" style="max-width: 700px; margin: 2rem auto 0;">
          <div style="padding: 1.5rem; background: var(--color-stone-50); border-radius: 12px; text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${iconImg('blocks-integration.svg')}</div>
            <h4 class="landing-h4">Webhooks</h4>
            <p class="landing-text-sm">${isEn ? 'Events to your URL' : 'Events an deine URL'}</p>
          </div>
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
        ? 'Connect Webflow and Stripe, then take a test booking.'
        : 'Webflow und Stripe verbinden, dann eine Testbuchung.',
      subheadline: isEn
        ? '3-day trial. No card. Webhooks and calendar sync are not part of this setup yet.'
        : '3 Tage testen. Keine Karte. Webhooks und Kalender-Sync gehören noch nicht dazu.',
      ...(isEn
        ? {
            primaryCTA: 'Start live demo',
          }
        : {}),
    })}

    ${createFAQSection({
      locale,
      sharedFaq,
      pageFaq,
      pageTitle: isEn ? 'Integrations' : 'Integrationen',
    })}
  `;

  initFAQAccordion(content);
};
