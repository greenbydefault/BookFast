/**
 * Impressum Page
 */
import { setPageMeta, setBreadcrumbSchema } from '../../../lib/seoHelper.js';
import { legalConfig } from '../../../data/legalConfig.js';

export const renderImpressumPage = () => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  setPageMeta('Impressum', 'Impressum von BookFast.');
  setBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Impressum', url: '/impressum' },
  ]);

  const c = legalConfig;
  content.innerHTML = `
    <section class="landing-section">
      <div class="landing-container-narrow">
        <h1 class="landing-h1">Impressum</h1>
        <div class="landing-text landing-legal-content">
          <h2 class="landing-h3">Angaben gemäß § 5 TMG</h2>
          <p>
            BookFast<br>
            ${c.companyName}<br>
            ${c.street}<br>
            ${c.cityZip}<br>
            ${c.country}
          </p>

          <h2 class="landing-h3">Kontakt</h2>
          <p>
            E-Mail: <a href="mailto:${c.email}">${c.email}</a><br>
            Kontaktformular (Nachrichten): <a href="mailto:${c.emailContactForm}">${c.emailContactForm}</a><br>
            Telefon: ${c.phone}
          </p>

          <h2 class="landing-h3">Umsatzsteuer-ID</h2>
          <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: ${c.vatId}</p>

          <h2 class="landing-h3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p>
            ${c.responsibleName}<br>
            ${c.responsibleAddress}
          </p>

          <h2 class="landing-h3">Streitschlichtung</h2>
          <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
        </div>
      </div>
    </section>
  `;
};
