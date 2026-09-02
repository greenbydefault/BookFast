/**
 * Shared marketing-chrome copy (nav, FAQ shell, waitlist, CTA, pricing, feature template).
 * Path locale is the source of truth — no i18next.
 */

export const UI_CHROME = {
  de: {
    skipLink: 'Zum Inhalt springen',
    nav: {
      logoTitle: 'BookFast Startseite',
      menuLabel: 'Menü',
      menuTitle: 'Menü öffnen oder schließen',
      langSwitchLabel: 'Sprache',
      mobileNavLabel: 'Mobile Navigation',
      product: 'Produkt',
      features: 'Features',
      pricing: 'Preise',
      dashboard: 'Zum Dashboard',
      waitlist: 'Zur Warteliste anmelden',
    },
    faq: {
      tagline: 'FAQ',
      headingBookfast: 'Häufige Fragen zu BookFast.',
      headingFeature: (title) => `Häufige Fragen zu ${title || 'BookFast'}.`,
      colHeading: 'Häufige Fragen',
      empty: 'Keine Fragen für dieses Feature.',
    },
    waitlist: {
      closeLabel: 'Modal schließen',
      closeTitle: 'Wartelisten-Modal schließen',
      title: 'Zur Warteliste anmelden',
      subtitle:
        'Wir sind gerade in der Testphase. Trag dich ein und wir melden uns, sobald BookFast für dich bereit ist.',
      emailLabel: 'E-Mail',
      placeholder: 'deine@email.de',
      submit: 'Eintragen',
      submitTitle: 'Zur BookFast Warteliste eintragen',
      submitting: 'Wird eingetragen…',
      successTitle: 'Mail ist raus.',
      successBody:
        'Wir haben dir eine Bestätigungsmail geschickt. Link klicken, dann stehst du auf der Liste.',
      done: 'Schließen',
      doneTitle: 'Modal schließen',
      rateLimit: 'Zu viele Versuche. Bitte warte kurz und probiere es erneut.',
      serverError: 'Ein interner Fehler ist aufgetreten. Bitte versuche es später erneut.',
      genericError: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.',
    },
    cta: {
      primary: 'Live-Demo starten',
      illustrationAlt: 'BookFast Call-to-Action Illustration zur Einrichtung des Buchungssystems',
    },
    pricing: {
      monthly: 'Monatlich',
      annual: 'Jährlich',
      monthlyTitle: 'Monatliche Abrechnung wählen',
      annualTitle: 'Jährliche Abrechnung wählen',
      saveBadge: '2 Monate gratis',
      workspaces: 'Workspaces',
      workspaceAria: 'Anzahl der Workspaces',
      workspaceTitle: 'Anzahl der Workspaces auswählen',
      free: 'Kostenlos',
      forever: 'für immer',
      perMonth: '/Monat',
      perYear: '/Jahr',
      ctaDefault: 'Kostenlos testen',
    },
    feature: {
      demoHint: "Tippe, klicke, probier's aus. Kein Account.",
      illustrationAlt: (title) => `Illustration zum Feature ${title} in BookFast`,
      notFoundTitle: 'Feature nicht gefunden',
      notFoundBody: (slug) => `Das Feature "${slug}" existiert noch nicht.`,
      allFeatures: 'Alle Features',
      allFeaturesTitle: 'Alle Features anzeigen',
      howItWorksLabel: "So funktioniert's",
      howItWorksHeadline: (title, n) => `${title} in ${n} Schritten.`,
      relatedLabel: 'Weitere Features',
      breadcrumbHome: 'Home',
      breadcrumbFeatures: 'Features',
      breadcrumbNavLabel: 'Brotkrumennavigation',
    },
    hero: {
      demoError: 'Die Demo konnte nicht gestartet werden. Bitte versuche es erneut.',
    },
    legal: {
      bindingNotice: 'Es gilt die deutsche Fassung.',
    },
  },
  en: {
    skipLink: 'Skip to content',
    nav: {
      logoTitle: 'BookFast homepage',
      menuLabel: 'Menu',
      menuTitle: 'Open or close menu',
      langSwitchLabel: 'Language',
      mobileNavLabel: 'Mobile navigation',
      product: 'Product',
      features: 'Features',
      pricing: 'Pricing',
      dashboard: 'Go to Dashboard',
      waitlist: 'Join the waitlist',
    },
    faq: {
      tagline: 'FAQ',
      headingBookfast: 'Frequently asked questions about BookFast.',
      headingFeature: (title) => `Frequently asked questions about ${title || 'BookFast'}.`,
      colHeading: 'Frequently asked questions',
      empty: 'No questions for this feature.',
    },
    waitlist: {
      closeLabel: 'Close modal',
      closeTitle: 'Close waitlist modal',
      title: 'Join the waitlist',
      subtitle:
        'We are in a test phase. Leave your email. We write when you can get in.',
      emailLabel: 'Email',
      placeholder: 'you@email.com',
      submit: 'Join',
      submitTitle: 'Join the BookFast waitlist',
      submitting: 'Joining…',
      successTitle: 'Check your inbox.',
      successBody:
        'We sent a confirmation mail. Click the link, then you are on the list.',
      done: 'Close',
      doneTitle: 'Close modal',
      rateLimit: 'Too many attempts. Please wait a moment and try again.',
      serverError: 'An internal error occurred. Please try again later.',
      genericError: 'Something went wrong. Please try again.',
    },
    cta: {
      primary: 'Start live demo',
      illustrationAlt: 'BookFast call-to-action illustration for setting up the booking system',
    },
    pricing: {
      monthly: 'Monthly',
      annual: 'Yearly',
      monthlyTitle: 'Choose monthly billing',
      annualTitle: 'Choose yearly billing',
      saveBadge: '2 months free',
      workspaces: 'Workspaces',
      workspaceAria: 'Number of workspaces',
      workspaceTitle: 'Select number of workspaces',
      free: 'Free',
      forever: 'forever',
      perMonth: '/month',
      perYear: '/year',
      ctaDefault: 'Start for free',
    },
    feature: {
      demoHint: 'Tap, click, try it. No account.',
      illustrationAlt: (title) => `Illustration for the ${title} feature in BookFast`,
      notFoundTitle: 'Feature not found',
      notFoundBody: (slug) => `The feature "${slug}" does not exist yet.`,
      allFeatures: 'All features',
      allFeaturesTitle: 'View all features',
      howItWorksLabel: 'How it works',
      howItWorksHeadline: (title, n) => `${title} in ${n} steps.`,
      relatedLabel: 'More features',
      breadcrumbHome: 'Home',
      breadcrumbFeatures: 'Features',
      breadcrumbNavLabel: 'Breadcrumb',
    },
    hero: {
      demoError: 'The demo could not be started. Please try again.',
    },
    legal: {
      bindingNotice: 'The German version is legally binding.',
    },
  },
};

/**
 * @param {'de'|'en'} [locale]
 */
export const getUiChrome = (locale = 'de') => (locale === 'en' ? UI_CHROME.en : UI_CHROME.de);
