/**
 * Platform features: Integration, Kundenportal
 */
export const platform = {
  integration: {
    slug: 'integration',
    meta: { title: 'Webflow Booking Widget', description: 'Webflow Booking Widget: Embed-Script oder Template-Copy. BookFast lebt nativ in deiner Webflow-Seite – kein iFrame.' },
    hero: {
      headline: 'Dein Booking-Widget lebt in Webflow – nicht in einem iFrame.',
      subheadline: 'Ein Script-Tag oder Template-Copy, und dein Buchungswidget ist Teil deiner Seite. Volle Design-Kontrolle, kein Redirect, keine Conversion-Verluste.',
      illustration: '/src/svg/illustrations/landingpage/features/ft_integrationen.svg',
      demoModule: 'integration',
    },
    problem: { text: 'iFrames sehen fremd aus, Redirects kosten Conversion. Deine Besucher merken den Bruch – und springen ab.', bullets: ['Embed-Script: Ein Tag in den Body, fertig.', 'Template-Copy: Widget in den Webflow Designer importieren.', 'Datenattribute statt iFrame – volle Design-Kontrolle.'] },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So integrierst du BookFast',
    interactiveHowItWorksHeadline: 'Widget einbetten in unter 5 Minuten.',
    steps: [
      {
        title: 'Methode wählen',
        icon: 'puzzle',
        bullets: [
          { title: 'Embed-Script: ein Tag, fertig', description: 'Funktioniert auf jeder Website.' },
          { title: 'Template-Copy: für Webflow', description: 'Volle Design-Kontrolle im Webflow Designer.' },
          { title: 'Kein iFrame – natives Einbetten', description: 'Widget lebt in Ihrer Seite.' },
        ],
        reverse: false
      },
      {
        title: 'Code einbetten',
        icon: 'copy',
        bullets: [
          { title: 'Script-Tag in Body oder Webflow Custom Code', description: 'Vor </body> einfügen.' },
          { title: 'Template-Copy: Import im Webflow Designer', description: 'Export-Template importieren.' },
          { title: 'Asynchrones Laden', description: 'Minimaler Performance-Impact.' },
        ],
        reverse: true
      },
      {
        title: 'Anpassen',
        icon: 'gear',
        bullets: [
          { title: 'Datenattribute für Workspace, Objekte, Services', description: 'data-bookfast-workspace, data-bookfast-objects.' },
          { title: 'Design wird von Ihrer Seite übernommen', description: 'Webflow-Styles automatisch.' },
          { title: 'Keine separaten Widget-Styles nötig', description: 'Natives Einbetten.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🌐', title: 'Webflow-Designer', description: 'Für Agenturen und Freelancer die Kunden-Projekte bauen.', link: '/produkt' },
    ],
    relatedFeatures: ['buchungen', 'zahlungen', 'workspaces'],
    tags: ['integration', 'website', 'widget', 'embed', 'api'],
    faq: [
      { question: 'Funktioniert es nur mit Webflow?', answer: 'Nein, das Embed-Script funktioniert auf jeder Website. Template-Copy ist Webflow-exklusiv.' },
      { question: 'Beeinflusst es die Ladezeit?', answer: 'Minimal. Das Script wird asynchron geladen und hat keinen Einfluss auf die Core Web Vitals.' },
      { question: 'Kann ich das Widget-Design anpassen?', answer: 'Bei Template-Copy hast du volle Design-Kontrolle im Webflow Designer. Beim Embed-Script übernimmt das Widget die Styles deiner Seite automatisch.' },
      { question: 'Brauche ich Programmierkenntnisse?', answer: 'Nein. Embed-Script: Copy-Paste eines Script-Tags. Template-Copy: Import im Webflow Designer. Beides ohne Code.' },
      { question: 'Kann ich mehrere Widgets auf einer Seite einbetten?', answer: 'Ja. Du kannst verschiedene Objekte oder Services über Datenattribute gezielt ansprechen – z. B. ein Widget pro Raum.' },
    ],
  },

  kundenportal: {
    slug: 'kundenportal',
    meta: {
      title: 'Kundenportal',
      description: 'Magic Link für Rechnung, Zahlung und Stornierung. Buchen und verwalten ohne Konto – weniger Friction, mehr Conversion.',
    },
    hero: {
      headline: 'Kein Login, kein Konto – deine Kunden buchen trotzdem.',
      subheadline: 'Ein Magic Link pro Buchung: einsehen, bezahlen, stornieren. Deine Kunden verwalten alles selbst – ohne Passwort und ohne Rückfragen an dich.',
      illustration: '/src/svg/illustrations/landingpage/features/ft_kundenportal.svg',
      trustClaims: ['Keine Kreditkarte nötig', 'In unter 5 Minuten startklar'],
    },
    problem: {
      text: 'Jede Registrierung ist eine Hürde. Studien zeigen: Bis zu 30% der Nutzer brechen ab, wenn sie ein Konto erstellen müssen.',
      bullets: [
        'Direkt buchen, direkt verwalten – kein Konto nötig.',
        'Magic Link pro Buchung – einsehen, bezahlen, stornieren.',
        'Weniger Friction, weniger Abbrüche, mehr Buchungen.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So funktioniert das Kundenportal',
    interactiveHowItWorksHeadline: 'Buchen, verwalten, bezahlen – ohne Konto.',
    steps: [
      {
        title: 'Buchen ohne Hürden',
        icon: 'blocks-integration',
        bullets: [
          { title: 'Direkter Buchungsabschluss im Widget', description: 'Keine Passwort-Eingabe, keine Konto-Hürde.' },
          { title: 'Keine Konto-Pflicht für Ihre Kunden', description: 'Weniger Reibung = mehr Abschlüsse.' },
          { title: 'Mehr Abschlüsse durch weniger Friction', description: 'Kunden buchen direkt über das Widget.' },
        ],
        reverse: false
      },
      {
        title: 'Magic Link – alles einsehen & verwalten',
        icon: 'key',
        bullets: [
          { title: 'Magic Link pro Buchung mit PIN-Schutz', description: 'Kunde öffnet Link per E-Mail, gibt PIN ein.' },
          { title: 'Rechnung ansehen, PDF laden, online bezahlen', description: 'Self-Service ohne Rückfragen.' },
          { title: 'Stornieren – Self-Service für Ihre Kunden', description: 'Weniger Support-Anfragen für Sie.' },
        ],
        reverse: true
      },
      {
        title: 'Mehrwert für Kunde und Anbieter',
        icon: 'check',
        bullets: [
          { title: 'Selbstbedienung für Ihre Kunden', description: 'Kontrolle ohne Aufwand.' },
          { title: 'Weniger Support, mehr Buchungen', description: 'Keine Passwort-Mails, keine Konto-Verwaltung.' },
          { title: 'Einzigartiger Link + PIN pro Buchung', description: 'Sicher und einfach.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Deine Gäste buchen und zahlen direkt – Rechnung und Stornierung im Portal.', link: '/features' },
      { icon: '💇', title: 'Friseure & Salons', description: 'Termin direkt buchbar – Rechnung und Stornierung über den Magic Link.', link: '/features' },
    ],
    relatedFeatures: ['rechnungen', 'buchungen', 'zahlungen'],
    tags: ['kundenportal', 'selfservice', 'magic-link', 'status', 'payments'],
    cta: {
      headline: 'Kundenportal kostenlos testen.',
      primaryCTA: 'Kostenlos starten',
      subheadline: '',
    },
    faq: [
      { question: 'Müssen sich deine Kunden registrieren?', answer: 'Nein. Weder zum Buchen noch zum Einsehen der Buchung. Der Magic Link mit PIN reicht.' },
      { question: 'Wird der Link automatisch verschickt?', answer: 'Ja, bei Bestätigung einer Buchung und bei manuell angelegten Buchungen (wenn aktiviert) verschickt BookFast den Magic Link per E-Mail.' },
      { question: 'Kann der Kunde auch bezahlen?', answer: 'Ja, bei unbezahlten Buchungen erscheint ein „Jetzt bezahlen"-Button. Die Zahlung läuft über Stripe.' },
      { question: 'Wie ist der Zugang geschützt?', answer: 'Jeder Link ist einzigartig pro Buchung. Zusätzlich ist der Zugang per PIN geschützt – nur wer beides hat, kommt ins Portal.' },
      { question: 'Kann der Kunde im Portal stornieren?', answer: 'Ja, wenn du Stornierungen im Self-Service erlaubst. Der Kunde klickt „Stornieren" und die Rückerstattung wird automatisch ausgelöst.' },
    ],
  },
};
