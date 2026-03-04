/**
 * Impressum Page
 */
import { setPageMeta } from '../../../lib/seoHelper.js';

export const renderImpressumPage = () => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  setPageMeta('Impressum', 'Impressum von BookFast.');

  content.innerHTML = `
    <section class="landing-section">
      <div class="landing-container-narrow">
        <h1 class="landing-h1" style="font-size: 2.5rem;">Impressum</h1>
        <div class="landing-text" style="margin-top: 2rem;">
          <h2 class="landing-h3">Angaben gemäß § 5 TMG</h2>
          <p>
            BookFast<br>
            [Firmenname]<br>
            [Straße Nr.]<br>
            [PLZ Ort]<br>
            Deutschland
          </p>

          <h2 class="landing-h3" style="margin-top: 2rem;">Kontakt</h2>
          <p>
            E-Mail: hello@book-fast.de<br>
            Telefon: [Telefonnummer]
          </p>

          <h2 class="landing-h3" style="margin-top: 2rem;">Umsatzsteuer-ID</h2>
          <p>Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz: [USt-ID]</p>

          <h2 class="landing-h3" style="margin-top: 2rem;">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p>
            [Name]<br>
            [Adresse]
          </p>

          <h2 class="landing-h3" style="margin-top: 2rem;">Streitschlichtung</h2>
          <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
        </div>
      </div>
    </section>
  `;
};
