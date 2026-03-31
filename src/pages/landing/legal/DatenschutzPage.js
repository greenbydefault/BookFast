/**
 * Datenschutz (Privacy Policy) Page
 */
import { setPageMeta, setBreadcrumbSchema, setHreflangAlternates } from '../../../lib/seoHelper.js';
import { legalConfig } from '../../../data/legalConfig.js';

export const renderDatenschutzPage = (locale = 'de') => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  const isEn = locale === 'en';
  const impressumPath = isEn ? '/en/imprint' : '/impressum';

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
  content.innerHTML = `
    <section class="landing-section">
      <div class="landing-container-narrow">
        <h1 class="landing-h1">${isEn ? 'Privacy Policy' : 'Datenschutzerklärung'}</h1>
        <div class="landing-text landing-legal-content">

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
        </div>
      </div>
    </section>
  `;
};
