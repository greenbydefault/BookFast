/**
 * About Page
 */
import { createHero } from '../../components/landing/Hero.js';
import { createCTASection } from '../../components/landing/CTASection.js';
import { iconImg } from '../../lib/landingAssets.js';
import { setPageMeta, setBreadcrumbSchema, setHreflangAlternates } from '../../lib/seoHelper.js';
import { setLandingContent } from '../../lib/landingContent.js';

export const renderAboutPage = (locale = 'de') => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  const isEn = locale === 'en';

  setPageMeta(
    isEn ? 'About us' : 'Über uns',
    isEn
      ? 'Why BookFast exists: Webflow booking without iframes and without a cut per booking.'
      : 'Warum es BookFast gibt: Webflow-Buchung ohne iFrame und ohne Schnitt pro Buchung.',
    { locale },
  );
  setBreadcrumbSchema([
    { name: 'Home', url: isEn ? '/en' : '/' },
    { name: isEn ? 'About' : 'Über uns', url: isEn ? '/en/about' : '/ueber-uns' },
  ]);
  setHreflangAlternates([
    { hreflang: 'de', path: '/ueber-uns' },
    { hreflang: 'en', path: '/en/about' },
  ]);

  setLandingContent(content, `
    ${createHero({
      headline: isEn ? 'We built the booking tool we kept installing for clients.' : 'Wir haben das Booking-Tool gebaut, das wir bei Kunden immer nachgerüstet haben.',
      subheadline: isEn
        ? 'Webflow sites deserved a widget that stays on the page, takes payment before the slot, and does not skim a commission. The plugins we found did at least one of those wrong.'
        : 'Webflow-Seiten brauchen ein Widget, das auf der Seite bleibt, vor dem Termin kassiert und keine Provision abzweigt. Die Plugins, die wir gefunden haben, haben mindestens eins davon falsch gemacht.',
      illustrationAlt: isEn
        ? 'Illustration of BookFast’s origin and digital booking'
        : 'Illustration zur Entstehung von BookFast und digitaler Buchungsabwicklung',
      secondaryCTA: '',
      primaryCTA: isEn ? 'Start for free' : 'Kostenlos starten',
    })}

    <section class="landing-section">
      <div class="landing-container-narrow">
        <h2 class="landing-h2">${isEn ? 'What we would not ship' : 'Was wir nicht ausliefern wollten'}</h2>
        <p class="landing-text" style="margin-top: 1rem;">
          ${isEn
            ? `An iframe that ignores your type. A redirect to a domain nobody booked on. A "free" widget that takes a cut of every appointment. BookFast is the widget plus the operator dashboard, on your Webflow site, with Stripe and invoices attached.`
            : `Ein iFrame, der deine Schrift ignoriert. Ein Redirect auf eine Domain, auf der niemand gebucht hat. Ein "kostenloses" Widget, das an jeder Buchung mitverdient. BookFast ist das Widget plus das Operator-Dashboard, auf deiner Webflow-Seite, mit Stripe und Rechnung dran.`}
        </p>
        <p class="landing-text" style="margin-top: 1rem;">
          ${isEn
            ? '3 days free, no card. If the demo does not book a test slot on your own page, we failed.'
            : '3 Tage kostenlos, keine Karte. Wenn die Demo auf deiner Seite keinen Test-Slot bucht, haben wir den Job nicht gemacht.'}
        </p>
      </div>
    </section>

    <section class="landing-section landing-section-alt">
      <div class="landing-container">
        <div class="text-center" style="margin-bottom: 2.5rem;">
          <h2 class="landing-h2">${isEn ? 'How we price and ship' : 'Wie wir Preise und Features machen'}</h2>
        </div>
        <div class="landing-grid landing-grid-3" style="max-width: 960px; margin: 0 auto;">
          <div style="padding: 2rem; background: white; border-radius: 12px; border: 1px solid var(--color-stone-200); text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">${iconImg('target.svg')}</div>
            <h3 class="landing-h4">${isEn ? 'Same features on every plan' : 'Dieselben Features in jedem Plan'}</h3>
            <p class="landing-text-sm">${isEn ? 'You pay for workspace count. Not for unlocking analytics later.' : 'Du zahlst für die Anzahl Workspaces. Nicht dafür, Analytics später freizuschalten.'}</p>
          </div>
          <div style="padding: 2rem; background: white; border-radius: 12px; border: 1px solid var(--color-stone-200); text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">${iconImg('Bulp.svg')}</div>
            <h3 class="landing-h4">${isEn ? 'Live in minutes, not a workshop' : 'Live in Minuten, kein Workshop'}</h3>
            <p class="landing-text-sm">${isEn ? 'Script tag, template copy, Stripe Connect. If it needs a consultant, we built it wrong.' : 'Script-Tag, Template-Copy, Stripe Connect. Wenn dafür ein Consultant nötig ist, haben wir es falsch gebaut.'}</p>
          </div>
          <div style="padding: 2rem; background: white; border-radius: 12px; border: 1px solid var(--color-stone-200); text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">${iconImg('gear.svg')}</div>
            <h3 class="landing-h4">${isEn ? 'You set the rules' : 'Du setzt die Regeln'}</h3>
            <p class="landing-text-sm">${isEn ? 'Hours, buffers, cleaning fee, minimum notice. The widget follows the service, not a generic template.' : 'Zeiten, Puffer, Reinigungsgebühr, Mindestvorlauf. Das Widget folgt dem Service, keinem Einheits-Template.'}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-container-narrow text-center">
        <h2 class="landing-h2">${isEn ? 'Team' : 'Team'}</h2>
        <p class="landing-text" style="margin-top: 1rem;">
          ${isEn
            ? 'Small team in Germany. We still design in Webflow. If a booking plugin needs a workaround in the Designer, we feel it first.'
            : 'Kleines Team in Deutschland. Wir gestalten selbst in Webflow. Wenn ein Booking-Plugin im Designer einen Workaround braucht, merken wir das zuerst.'}
        </p>
      </div>
    </section>

    ${createCTASection({
      locale,
      headline: isEn ? 'Run a test booking on a Webflow page.' : 'Testbuchung auf einer Webflow-Seite durchklicken.',
      subheadline: isEn ? '3 days. No card. Under 5 minutes if the site is ready.' : '3 Tage. Keine Karte. Unter 5 Minuten, wenn die Seite steht.',
      ...(isEn ? { primaryCTA: 'Start live demo' } : {}),
    })}
  `);
};
