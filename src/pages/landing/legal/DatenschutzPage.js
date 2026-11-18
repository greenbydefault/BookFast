/**
 * Datenschutz (Privacy Policy) Page
 */
import { setPageMeta, setBreadcrumbSchema, setHreflangAlternates } from '../../../lib/seoHelper.js';
import { legalConfig } from '../../../data/legalConfig.js';
import { setLandingContent } from '../../../lib/landingContent.js';
import { getUiChrome } from '../../../locales/uiChrome.js';

export const renderDatenschutzPage = (locale = 'de') => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  const isEn = locale === 'en';
  const impressumPath = isEn ? '/en/imprint' : '/impressum';
  const chrome = getUiChrome(locale);

  setPageMeta(
    isEn ? 'Privacy Policy' : 'Datenschutz',
    isEn ? 'Privacy policy of BookFast.' : 'Datenschutzerklärung von BookFast.',
    { locale },
  );
  setBreadcrumbSchema(
    isEn
      ? [
          { name: 'Home', url: '/en' },
          { name: 'Privacy Policy', url: '/en/privacy' },
        ]
      : [
          { name: 'Home', url: '/' },
          { name: 'Datenschutz', url: '/datenschutz' },
        ],
  );
  setHreflangAlternates([
    { hreflang: 'de', path: '/datenschutz' },
    { hreflang: 'en', path: '/en/privacy' },
  ]);

  const c = legalConfig;
  const bodyDe = `
          <p><strong>Stand:</strong> 09.03.2026</p>

          <h2 class="landing-h3">1. Verantwortlicher</h2>
          <p>Verantwortlich für die Datenverarbeitung ist ${c.responsibleName}, ${c.responsibleAddress}. Weitere Kontaktdaten findest du im <a href="${impressumPath}" data-landing-link title="Impressum anzeigen">Impressum</a>.</p>

          <h2 class="landing-h3">2. Verarbeitete Daten</h2>
          <p>Wir verarbeiten Daten, die du uns mitteilst (z.B. Name, E-Mail, Telefonnummer, Buchungsdaten, Kontaktformular-Inhalte) sowie technische Daten (z.B. Browser, Gerätetyp, Betriebssystem, Zeitstempel).</p>

          <h2 class="landing-h3">3. Zwecke und Rechtsgrundlagen</h2>
          <p>Die Verarbeitung erfolgt zur Vertragsdurchführung (Art. 6 Abs. 1 lit. b DSGVO), zur Erfüllung rechtlicher Pflichten (Art. 6 Abs. 1 lit. c DSGVO) sowie auf Basis berechtigter Interessen an einem sicheren und stabilen Betrieb (Art. 6 Abs. 1 lit. f DSGVO).</p>

          <h2 class="landing-h3">4. Empfänger und eingesetzte Dienstleister</h2>
          <p>Wir setzen folgende Dienstleister ein (Auftragsverarbeiter bzw. Empfänger, soweit erforderlich mit Auftragsverarbeitungsvertrag):</p>
          <ul class="landing-legal-list">
            <li><strong>Supabase</strong> – Datenbank, Authentifizierung, Speicher, Edge Functions (EU-Standort).</li>
            <li><strong>Stripe</strong> – Zahlungsabwicklung, Checkout, Connect.</li>
            <li><strong>Vercel</strong> – Hosting der Website; zudem <strong>Vercel Speed Insights</strong> zur technischen Leistungsanalyse (anonymisierte Metriken, Art. 6 Abs. 1 lit. f DSGVO).</li>
            <li><strong>Resend</strong> – Versand transaktionaler E-Mails (Buchungen, Kontaktformular, Waitlist).</li>
          </ul>

          <h2 class="landing-h3">5. Cookies und lokale Speicherung</h2>
          <p>Wir setzen nur technisch notwendige bzw. für den Betrieb unerlässliche Speicher ein; es wird kein Marketing-Tracking verwendet:</p>
          <ul class="landing-legal-list">
            <li><strong>Supabase-Session (Cookie)</strong> – Anmeldung und Session im Dashboard; Rechtsgrundlage Art. 6 Abs. 1 lit. b DSGVO.</li>
            <li><strong>localStorage</strong> – z.B. gewählte Workspace-ID im Dashboard sowie im eingebetteten Buchungs-Widget eine zufällige Session-ID (<code>bf_session_…</code>) für die Funnel-Analyse; Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO (betriebliches Interesse an Stabilität und Auswertung).</li>
          </ul>
          <p class="landing-legal-note">Eine Einwilligung (Cookie-Banner) ist für diese technisch notwendigen bzw. berechtigten Verarbeitungen nicht erforderlich. Sollten wir künftig nicht technisch notwendige Cookies oder Tracking einsetzen, holen wir deine Einwilligung ein.</p>

          <h2 class="landing-h3">6. Buchungs- und Event-Tracking</h2>
          <p>Zur technischen Analyse des Buchungsprozesses erfassen wir Ereignisse mit einer zufälligen Session-ID (keine Zuordnung zu personenbezogenen Daten). Das dient der Fehleranalyse und Produktverbesserung und enthält keine sensiblen Zahlungsdaten. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</p>

          <h2 class="landing-h3">7. Speicherdauer</h2>
          <p>Personenbezogene Daten speichern wir nur so lange, wie es für die genannten Zwecke nötig ist oder gesetzliche Aufbewahrungsfristen bestehen:</p>
          <ul class="landing-legal-list">
            <li>Kontodaten und Buchungsdaten: bis zur Vertragsbeendigung bzw. Erfüllung, danach ggf. steuerrechtliche Aufbewahrung (z.B. 10 Jahre).</li>
            <li>Kontaktformular: Nachrichten werden per E-Mail übermittelt und nicht in einer Datenbank gespeichert; E-Mail-Postfach nach üblicher Geschäftsabwicklung.</li>
            <li>Waitlist: E-Mail und Status bis zum Widerruf bzw. Löschung auf Anfrage.</li>
            <li>Session-Cookie / localStorage: Session-Ende bzw. Logout; Widget-Session-ID zeitlich begrenzt für Analysen.</li>
          </ul>

          <h2 class="landing-h3">8. Deine Rechte</h2>
          <p>Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Zur Ausübung wende dich an ${c.responsibleName}, ${c.responsibleAddress}, E-Mail: <a href="mailto:${c.email}">${c.email}</a>.</p>
          <p class="landing-legal-note"><strong>Beschwerderecht:</strong> Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig ist in der Regel die Landesdatenschutzbehörde deines Wohnsitzes oder die des Landes Berlin (Sitz: ${c.cityZip}).</p>
  `;

  const bodyEn = `
          <p class="landing-legal-note"><strong>${chrome.legal.bindingNotice}</strong></p>
          <p><strong>Last updated:</strong> 09.03.2026</p>

          <h2 class="landing-h3">1. Controller</h2>
          <p>The controller for data processing is ${c.responsibleName}, ${c.responsibleAddress}. Further contact details are in the <a href="${impressumPath}" data-landing-link title="View imprint">imprint</a>.</p>

          <h2 class="landing-h3">2. Data processed</h2>
          <p>We process data you provide (e.g. name, email, phone number, booking data, contact-form contents) as well as technical data (e.g. browser, device type, operating system, timestamps).</p>

          <h2 class="landing-h3">3. Purposes and legal bases</h2>
          <p>Processing is carried out to perform a contract (Art. 6 (1) (b) GDPR), to comply with legal obligations (Art. 6 (1) (c) GDPR), and on the basis of legitimate interests in secure, stable operation (Art. 6 (1) (f) GDPR).</p>

          <h2 class="landing-h3">4. Recipients and processors</h2>
          <p>We use the following processors / recipients (with a data-processing agreement where required):</p>
          <ul class="landing-legal-list">
            <li><strong>Supabase</strong> – database, authentication, storage, Edge Functions (EU region).</li>
            <li><strong>Stripe</strong> – payments, checkout, Connect.</li>
            <li><strong>Vercel</strong> – website hosting; plus <strong>Vercel Speed Insights</strong> for technical performance analysis (anonymized metrics, Art. 6 (1) (f) GDPR).</li>
            <li><strong>Resend</strong> – transactional email (bookings, contact form, waitlist).</li>
          </ul>

          <h2 class="landing-h3">5. Cookies and local storage</h2>
          <p>We only use storage that is technically necessary for operation; there is no marketing tracking:</p>
          <ul class="landing-legal-list">
            <li><strong>Supabase session (cookie)</strong> – login and session in the dashboard; legal basis Art. 6 (1) (b) GDPR.</li>
            <li><strong>localStorage</strong> – e.g. selected workspace ID in the dashboard and, in the embedded booking widget, a random session ID (<code>bf_session_…</code>) for funnel analysis; legal basis Art. 6 (1) (f) GDPR (operational interest in stability and evaluation).</li>
          </ul>
          <p class="landing-legal-note">Consent (cookie banner) is not required for these technically necessary or legitimate-interest processing activities. If we later use non-essential cookies or tracking, we will obtain your consent.</p>

          <h2 class="landing-h3">6. Booking and event tracking</h2>
          <p>To analyze the booking process technically we record events with a random session ID (no link to personal data). This supports error analysis and product improvement and contains no sensitive payment data. Legal basis: Art. 6 (1) (f) GDPR.</p>

          <h2 class="landing-h3">7. Retention</h2>
          <p>We store personal data only as long as needed for the stated purposes or as required by law:</p>
          <ul class="landing-legal-list">
            <li>Account and booking data: until the contract ends or is fulfilled, then possibly tax retention (e.g. 10 years).</li>
            <li>Contact form: messages are sent by email and not stored in a database; mailbox according to ordinary business practice.</li>
            <li>Waitlist: email and status until withdrawal or deletion on request.</li>
            <li>Session cookie / localStorage: end of session or logout; widget session ID time-limited for analytics.</li>
          </ul>

          <h2 class="landing-h3">8. Your rights</h2>
          <p>You have the right of access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction (Art. 18), data portability (Art. 20) and objection (Art. 21). To exercise these rights contact ${c.responsibleName}, ${c.responsibleAddress}, email: <a href="mailto:${c.email}">${c.email}</a>.</p>
          <p class="landing-legal-note"><strong>Right to lodge a complaint:</strong> You may complain to a data-protection supervisory authority. Typically this is the state authority of your residence or of the State of Berlin (seat: ${c.cityZip}).</p>
  `;

  setLandingContent(content, `
    <section class="landing-section">
      <div class="landing-container-narrow">
        <h1 class="landing-h1">${isEn ? 'Privacy Policy' : 'Datenschutzerklärung'}</h1>
        <div class="landing-text landing-legal-content">
          ${isEn ? bodyEn : bodyDe}
        </div>
      </div>
    </section>
  `);
};
