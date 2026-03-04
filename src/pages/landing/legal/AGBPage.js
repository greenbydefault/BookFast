/**
 * AGB (Terms of Service) Page
 */
import { setPageMeta } from '../../../lib/seoHelper.js';

export const renderAGBPage = () => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  setPageMeta('AGB', 'Allgemeine Geschäftsbedingungen von BookFast.');

  content.innerHTML = `
    <section class="landing-section">
      <div class="landing-container-narrow">
        <h1 class="landing-h1" style="font-size: 2.5rem;">Allgemeine Geschäftsbedingungen</h1>
        <div class="landing-text" style="margin-top: 2rem;">

          <h2 class="landing-h3">§ 1 Geltungsbereich</h2>
          <p>Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der BookFast-Plattform. Mit der Registrierung akzeptierst du diese Bedingungen.</p>

          <h2 class="landing-h3" style="margin-top: 2rem;">§ 2 Leistungsbeschreibung</h2>
          <p>BookFast stellt eine SaaS-Plattform zur Verfügung, die es Nutzern ermöglicht, ein Buchungssystem in ihre Website zu integrieren. Die Plattform umfasst ein Booking-Widget, ein Operator-Dashboard und Integrationen mit Drittanbietern.</p>

          <h2 class="landing-h3" style="margin-top: 2rem;">§ 3 Registrierung und Konto</h2>
          <p>Für die Nutzung von BookFast ist eine Registrierung erforderlich. Du bist für die Sicherheit deines Kontos verantwortlich und darfst deine Zugangsdaten nicht an Dritte weitergeben.</p>

          <h2 class="landing-h3" style="margin-top: 2rem;">§ 4 Preise und Zahlung</h2>
          <p>Die aktuellen Preise findest du auf unserer <a href="/preise" data-landing-link>Preisseite</a>. Bezahlte Pläne werden monatlich oder jährlich abgerechnet. Alle Preise verstehen sich zzgl. MwSt.</p>

          <h2 class="landing-h3" style="margin-top: 2rem;">§ 5 Kündigung</h2>
          <p>Monatliche Pläne können jederzeit zum Ende des Abrechnungszeitraums gekündigt werden. Jährliche Pläne können zum Ende der Laufzeit gekündigt werden.</p>

          <h2 class="landing-h3" style="margin-top: 2rem;">§ 6 Haftung</h2>
          <p>BookFast haftet nicht für Schäden, die durch die Nutzung oder Nichtnutzung der bereitgestellten Informationen und Dienste entstehen, sofern kein vorsätzliches oder grob fahrlässiges Verschulden vorliegt.</p>

          <h2 class="landing-h3" style="margin-top: 2rem;">§ 7 Schlussbestimmungen</h2>
          <p>Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist [Ort]. Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>
        </div>
      </div>
    </section>
  `;
};
