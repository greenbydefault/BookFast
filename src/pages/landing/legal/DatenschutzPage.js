/**
 * Datenschutz (Privacy Policy) Page
 */
import { setPageMeta } from '../../../lib/seoHelper.js';

export const renderDatenschutzPage = () => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  setPageMeta('Datenschutz', 'Datenschutzerklärung von BookFast.');

  content.innerHTML = `
    <section class="landing-section">
      <div class="landing-container-narrow">
        <h1 class="landing-h1" style="font-size: 2.5rem;">Datenschutzerklärung</h1>
        <div class="landing-text" style="margin-top: 2rem;">

          <h2 class="landing-h3">1. Datenschutz auf einen Blick</h2>
          <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit deinen personenbezogenen Daten passiert, wenn du diese Website besuchst.</p>

          <h2 class="landing-h3" style="margin-top: 2rem;">2. Allgemeine Hinweise</h2>
          <p>Die Betreiber dieser Seiten nehmen den Schutz deiner persönlichen Daten sehr ernst. Wir behandeln deine personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>

          <h2 class="landing-h3" style="margin-top: 2rem;">3. Datenerfassung auf dieser Website</h2>
          <h3 class="landing-h4">Wer ist verantwortlich für die Datenerfassung?</h3>
          <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Die Kontaktdaten findest du im Impressum.</p>

          <h3 class="landing-h4" style="margin-top: 1rem;">Wie erfassen wir deine Daten?</h3>
          <p>Deine Daten werden zum einen dadurch erhoben, dass du uns diese mitteilst (z.B. Kontaktformular, Registrierung). Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst (z.B. Browser, Betriebssystem, Uhrzeit des Seitenaufrufs).</p>

          <h2 class="landing-h3" style="margin-top: 2rem;">4. Hosting</h2>
          <p>Diese Website wird bei einem externen Dienstleister gehostet. Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert.</p>

          <h2 class="landing-h3" style="margin-top: 2rem;">5. Zahlungsabwicklung</h2>
          <p>Für die Zahlungsabwicklung nutzen wir Stripe (Stripe, Inc.). Stripe ist ein zertifizierter PCI-DSS-konformer Zahlungsdienstleister. Mehr Informationen: <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener">Stripe Datenschutz</a>.</p>

          <h2 class="landing-h3" style="margin-top: 2rem;">6. Deine Rechte</h2>
          <p>Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Wende dich dazu an: hello@bookfast.app</p>
        </div>
      </div>
    </section>
  `;
};
