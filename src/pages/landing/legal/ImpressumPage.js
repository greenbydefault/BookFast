/**
 * Impressum Page
 */
import { setPageMeta, setBreadcrumbSchema, setHreflangAlternates } from '../../../lib/seoHelper.js';
import { legalConfig } from '../../../data/legalConfig.js';

export const renderImpressumPage = (locale = 'de') => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  const isEn = locale === 'en';

  setPageMeta(
    isEn ? 'Imprint' : 'Impressum',
    isEn ? 'Imprint of BookFast.' : 'Impressum von BookFast.',
    { locale },
  );
  setBreadcrumbSchema(
    isEn
      ? [
          { name: 'Home', url: '/en' },
          { name: 'Imprint', url: '/en/imprint' },
        ]
      : [
          { name: 'Home', url: '/' },
          { name: 'Impressum', url: '/impressum' },
        ],
  );
  setHreflangAlternates([
    { hreflang: 'de', path: '/impressum' },
    { hreflang: 'en', path: '/en/imprint' },
  ]);

  const c = legalConfig;
  content.innerHTML = `
    <section class="landing-section">
      <div class="landing-container-narrow">
        <h1 class="landing-h1">${isEn ? 'Imprint' : 'Impressum'}</h1>
        <div class="landing-text landing-legal-content">
          <h2 class="landing-h3">${isEn ? 'Information pursuant to § 5 TMG' : 'Angaben gemäß § 5 TMG'}</h2>
          <p>
            BookFast<br>
            ${c.companyName}<br>
            ${c.street}<br>
            ${c.cityZip}<br>
            ${c.country}
          </p>

          <h2 class="landing-h3">${isEn ? 'Contact' : 'Kontakt'}</h2>
          <p>
            E-Mail: <a href="mailto:${c.email}">${c.email}</a><br>
            ${isEn ? 'Contact form (messages)' : 'Kontaktformular (Nachrichten)'}: <a href="mailto:${c.emailContactForm}">${c.emailContactForm}</a><br>
            ${isEn ? 'Phone' : 'Telefon'}: ${c.phone}
          </p>

          <h2 class="landing-h3">${isEn ? 'VAT ID' : 'Umsatzsteuer-ID'}</h2>
          <p>${isEn ? 'VAT identification number pursuant to § 27a of the German VAT Act:' : 'Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:'} ${c.vatId}</p>

          <h2 class="landing-h3">${isEn ? 'Responsible for content pursuant to § 55 (2) RStV' : 'Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV'}</h2>
          <p>
            ${c.responsibleName}<br>
            ${c.responsibleAddress}
          </p>

          <h2 class="landing-h3">${isEn ? 'Dispute resolution' : 'Streitschlichtung'}</h2>
          <p>${isEn
            ? 'We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.'
            : 'Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.'}</p>
        </div>
      </div>
    </section>
  `;
};
