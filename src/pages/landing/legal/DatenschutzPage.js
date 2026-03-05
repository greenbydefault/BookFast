/**
 * Datenschutz (Privacy Policy) Page
 */
import { setPageMeta } from '../../../lib/seoHelper.js';

export const renderDatenschutzPage = () => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  setPageMeta('Datenschutz', 'Datenschutzerklaerung von BookFast.');

  content.innerHTML = `
    <section class="landing-section">
      <div class="landing-container-narrow">
        <h1 class="landing-h1" style="font-size: 2.5rem;">Datenschutzerklärung</h1>
        <div class="landing-text" style="margin-top: 2rem;">

          <p><strong>Stand:</strong> 05.03.2026</p>

          <h2 class="landing-h3">1. Verantwortlicher</h2>
          <p>Verantwortlich fuer die Datenverarbeitung ist der Betreiber von BookFast. Die Kontaktdaten findest du im Impressum.</p>

          <h2 class="landing-h3" style="margin-top: 2rem;">2. Verarbeitete Daten</h2>
          <p>Wir verarbeiten Daten, die du uns mitteilst (z.B. Name, E-Mail, Telefonnummer, Buchungsdaten) sowie technische Daten (z.B. Browser, Geraetetyp, Betriebssystem, Zeitstempel).</p>

          <h2 class="landing-h3" style="margin-top: 2rem;">3. Zwecke und Rechtsgrundlagen</h2>
          <p>Die Verarbeitung erfolgt zur Vertragsdurchfuehrung (Art. 6 Abs. 1 lit. b DSGVO), zur Erfuellung rechtlicher Pflichten (Art. 6 Abs. 1 lit. c DSGVO) sowie auf Basis berechtigter Interessen an einem sicheren und stabilen Betrieb (Art. 6 Abs. 1 lit. f DSGVO).</p>

          <h2 class="landing-h3" style="margin-top: 2rem;">4. Eingesetzte Dienstleister</h2>
          <p>Wir nutzen Supabase (Datenbank/Auth), Stripe (Zahlungen), Vercel (Hosting) und Resend (transaktionale E-Mails). Mit den Anbietern bestehen Auftragsverarbeitungsvertraege, soweit erforderlich.</p>

          <h2 class="landing-h3" style="margin-top: 2rem;">5. Buchungs- und Event-Tracking</h2>
          <p>Zur technischen Analyse des Buchungsprozesses erfassen wir Ereignisse mit einer zufaelligen Session-ID. Das dient der Fehleranalyse und Produktverbesserung und enthaelt keine sensiblen Zahlungsdaten.</p>

          <h2 class="landing-h3" style="margin-top: 2rem;">6. Speicherdauer</h2>
          <p>Wir speichern personenbezogene Daten nur so lange, wie es fuer die genannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen bestehen.</p>

          <h2 class="landing-h3" style="margin-top: 2rem;">7. Deine Rechte</h2>
          <p>Du hast das Recht auf Auskunft, Berichtigung, Loeschung, Einschraenkung der Verarbeitung, Datenuebertragbarkeit und Widerspruch sowie ein Beschwerderecht bei einer Datenschutzaufsichtsbehoerde.</p>
        </div>
      </div>
    </section>
  `;
};
