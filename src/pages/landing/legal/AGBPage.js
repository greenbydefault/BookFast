/**
 * AGB (Terms of Service) Page
 */
import { setPageMeta, setBreadcrumbSchema, setHreflangAlternates } from '../../../lib/seoHelper.js';
import { legalConfig } from '../../../data/legalConfig.js';
import { setLandingContent } from '../../../lib/landingContent.js';
import { getUiChrome } from '../../../locales/uiChrome.js';

export const renderAGBPage = (locale = 'de') => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  const isEn = locale === 'en';
  const pricingPath = isEn ? '/en/pricing' : '/preise';
  const chrome = getUiChrome(locale);

  setPageMeta(
    isEn ? 'Terms of Service' : 'AGB',
    isEn ? 'Terms of service of BookFast.' : 'Allgemeine Geschäftsbedingungen von BookFast.',
    { locale },
  );
  setBreadcrumbSchema(
    isEn
      ? [
          { name: 'Home', url: '/en' },
          { name: 'Terms of Service', url: '/en/terms' },
        ]
      : [
          { name: 'Home', url: '/' },
          { name: 'AGB', url: '/agb' },
        ],
  );
  setHreflangAlternates([
    { hreflang: 'de', path: '/agb' },
    { hreflang: 'en', path: '/en/terms' },
  ]);

  const c = legalConfig;
  const bodyDe = `
          <h2 class="landing-h3">§ 1 Geltungsbereich</h2>
          <p>Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der BookFast-Plattform. Mit der Registrierung akzeptierst du diese Bedingungen. Die Plattform richtet sich in erster Linie an Unternehmer; soweit Verbraucher Vertragspartner werden, bleibt das gesetzliche Widerrufsrecht unberührt.</p>

          <h2 class="landing-h3">§ 2 Leistungsbeschreibung</h2>
          <p>BookFast stellt eine SaaS-Plattform zur Verfügung, die es Nutzern ermöglicht, ein Buchungssystem in ihre Website zu integrieren. Die Plattform umfasst ein Booking-Widget, ein Operator-Dashboard und Integrationen mit Drittanbietern.</p>

          <h2 class="landing-h3">§ 3 Registrierung und Konto</h2>
          <p>Für die Nutzung von BookFast ist eine Registrierung erforderlich. Du bist für die Sicherheit deines Kontos verantwortlich und darfst deine Zugangsdaten nicht an Dritte weitergeben.</p>

          <h2 class="landing-h3">§ 4 Preise und Zahlung</h2>
          <p>Die aktuellen Preise findest du auf unserer <a href="${pricingPath}" data-landing-link title="Preisseite öffnen">Preisseite</a>. Bezahlte Pläne werden monatlich oder jährlich abgerechnet. Alle Preise verstehen sich zzgl. MwSt.</p>

          <h2 class="landing-h3">§ 5 Kündigung</h2>
          <p>Monatliche Pläne können jederzeit zum Ende des Abrechnungszeitraums gekündigt werden. Jährliche Pläne können zum Ende der Laufzeit gekündigt werden.</p>

          <h2 class="landing-h3">§ 6 Haftung</h2>
          <p>BookFast haftet nicht für Schäden, die durch die Nutzung oder Nichtnutzung der bereitgestellten Informationen und Dienste entstehen, sofern kein vorsätzliches oder grob fahrlässiges Verschulden vorliegt.</p>

          <h2 class="landing-h3">§ 7 Schlussbestimmungen</h2>
          <p>Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist ${c.courtJurisdiction}. Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>
  `;

  const bodyEn = `
          <p class="landing-legal-note"><strong>${chrome.legal.bindingNotice}</strong></p>

          <h2 class="landing-h3">§ 1 Scope</h2>
          <p>These terms of service apply to use of the BookFast platform. By registering you accept these terms. The platform is primarily aimed at businesses; where consumers become contracting parties, the statutory right of withdrawal remains unaffected.</p>

          <h2 class="landing-h3">§ 2 Service description</h2>
          <p>BookFast provides a SaaS platform that lets users integrate a booking system into their website. The platform includes a booking widget, an operator dashboard, and third-party integrations.</p>

          <h2 class="landing-h3">§ 3 Registration and account</h2>
          <p>Using BookFast requires registration. You are responsible for the security of your account and must not share your credentials with third parties.</p>

          <h2 class="landing-h3">§ 4 Prices and payment</h2>
          <p>Current prices are on our <a href="${pricingPath}" data-landing-link title="Open pricing page">pricing page</a>. Paid plans are billed monthly or yearly. All prices are exclusive of VAT.</p>

          <h2 class="landing-h3">§ 5 Cancellation</h2>
          <p>Monthly plans may be cancelled at any time effective at the end of the billing period. Yearly plans may be cancelled at the end of the term.</p>

          <h2 class="landing-h3">§ 6 Liability</h2>
          <p>BookFast is not liable for damage arising from use or non-use of the information and services provided, except in cases of intent or gross negligence.</p>

          <h2 class="landing-h3">§ 7 Final provisions</h2>
          <p>The law of the Federal Republic of Germany applies. Place of jurisdiction is ${c.courtJurisdiction}. If individual provisions are invalid, the remaining provisions remain in effect.</p>
  `;

  setLandingContent(content, `
    <section class="landing-section">
      <div class="landing-container-narrow">
        <h1 class="landing-h1">${isEn ? 'Terms of Service' : 'Allgemeine Geschäftsbedingungen'}</h1>
        <div class="landing-text landing-legal-content">
          ${isEn ? bodyEn : bodyDe}
        </div>
      </div>
    </section>
  `);
};
