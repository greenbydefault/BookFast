/**
 * Platform features: Integration, Kundenportal
 */
export const platform = {
  integration: {
    slug: 'integration',
    meta: { title: 'Webflow Booking Widget', description: 'Webflow Booking Widget: Template in den Designer einfügen, Script einbinden. BookFast lebt nativ in deiner Webflow-Seite, ohne iFrame.' },
    hero: {
      headline: 'Dein Booking-Widget lebt in Webflow, nicht in einem iFrame.',
      subheadline: 'Booking Flow Template in den Designer einfügen, Script-Tag einbinden, fertig. Kein Redirect, kein iFrame.',
      illustration: '/src/svg/illustrations/landingpage/features/ft_integrationen.svg',
      demoModule: 'integration',
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="int-template"]',
      '[data-demo-section="int-embed"]',
      '[data-demo-section="int-domain"]',
    ],
    problem: { text: 'iFrames sehen fremd aus, Redirects kosten Conversion. Deine Besucher merken den Bruch und springen ab.', bullets: ['Booking Flow als echte Webflow-Elemente in deiner Seite.', 'Ein Script-Tag verbindet die Elemente mit deinem Workspace.', 'Du gestaltest alles im Webflow Designer.'] },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So integrierst du BookFast',
    interactiveHowItWorksHeadline: 'Widget einbetten in unter 5 Minuten.',
    steps: [
      {
        title: 'Template einfügen',
        icon: 'copy',
        bullets: [
          { title: '"Template kopieren" unter Einstellungen → Workspace', description: 'Der Booking Flow liegt danach in deiner Zwischenablage.' },
          { title: 'Im Webflow Designer einfügen', description: 'Mit Cmd+V landen alle Schritte als normale Webflow-Elemente auf der Seite.' },
          { title: 'Alle Schritte dabei', description: 'Objekt, Service, Mitarbeiter, Extras, Kalender, Zeitslots, Gutschein, Zusammenfassung.' },
        ],
        reverse: false
      },
      {
        title: 'Script einbinden',
        icon: 'blocks-integration',
        bullets: [
          { title: '"Code kopieren" und vor </body> einfügen', description: 'In Webflow unter Site Settings → Custom Code.' },
          { title: 'Ein Attribut: data-site-id', description: 'Es verbindet die Seite mit deinem Workspace.' },
          { title: 'Kein iFrame', description: 'Das Script füllt die Elemente auf deiner Seite mit Live-Daten.' },
        ],
        reverse: true
      },
      {
        title: 'Verbindung prüfen',
        icon: 'check',
        bullets: [
          { title: 'Verknüpfte Domain im Dashboard', description: 'Mit "Verbindung prüfen" siehst du, ob das Widget aktiv ist.' },
          { title: 'Design bleibt deins', description: 'Schriften, Farben, Abstände stellst du im Designer ein.' },
          { title: 'Tracking läuft automatisch', description: 'Ab dem ersten Aufruf landen die Events in Insights.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🌐', title: 'Webflow-Designer', description: 'Für Agenturen und Freelancer, die Kunden-Projekte bauen.', link: '/produkt' },
    ],
    relatedFeatures: ['buchungen', 'zahlungen', 'workspaces'],
    tags: ['integration', 'website', 'widget', 'embed'],
    faq: [
      { question: 'Funktioniert es nur mit Webflow?', answer: 'Das Template gibt es für Webflow. Das Script braucht auf der Seite die Elemente mit den data-bf-Attributen. Auf anderen Systemen müsstest du dieses Markup selbst nachbauen.' },
      { question: 'Brauche ich Template und Script?', answer: 'Ja. Das Template liefert die Elemente, das Script verbindet sie mit deinem Workspace.' },
      { question: 'Kann ich das Widget-Design anpassen?', answer: 'Ja, komplett. Das Template besteht aus normalen Webflow-Elementen, die du im Designer gestaltest.' },
      { question: 'Brauche ich Programmierkenntnisse?', answer: 'Nein. Template einfügen und einen Script-Tag kopieren. Beides ohne Code.' },
      { question: 'In welcher Sprache läuft das Widget?', answer: 'Auf Deutsch. Eine englische Widget-Version gibt es noch nicht.' },
    ],
  },

  kundenportal: {
    slug: 'kundenportal',
    meta: {
      title: 'Kundenportal',
      description: 'Magic Link mit PIN für Rechnung, Zahlung und Stornierung. Buchen ohne Konto.',
    },
    hero: {
      headline: 'Kein Login, kein Konto. Deine Kunden buchen trotzdem.',
      subheadline: 'Ein Magic Link pro Buchung: ansehen, bezahlen, stornieren. Deine Kunden erledigen das selbst, ohne Passwort und ohne Rückfragen an dich.',
      demoModule: 'kundenportal',
      illustration: '/src/svg/illustrations/landingpage/features/ft_kundenportal.svg',
      trustClaims: ['Keine Kreditkarte nötig', 'In unter 5 Minuten startklar'],
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="cp-frictionless"]',
      '[data-demo-section="cp-magic-link"]',
      '[data-demo-section="cp-self-service"]',
    ],
    problem: {
      text: 'Ein Pflichtkonto vor der Buchung ist eine extra Seite. Viele Gäste schließen dort nicht ab.',
      bullets: [
        'Buchen ohne Konto.',
        'Magic Link pro Buchung: ansehen, zahlen, stornieren.',
        'Kein Passwort, weniger Abbrüche.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So funktioniert das Kundenportal',
    interactiveHowItWorksHeadline: 'Buchen, verwalten, bezahlen. Ohne Konto.',
    steps: [
      {
        title: 'Buchen ohne Hürden',
        icon: 'blocks-integration',
        bullets: [
          { title: 'Buchung direkt im Widget abschließen', description: 'Keine Passwort-Eingabe, keine Registrierung.' },
          { title: 'Nur Name, E-Mail und Adresse', description: 'Mehr fragt das Widget nicht ab.' },
          { title: 'Zahlung im selben Durchgang', description: 'Per Karte, direkt nach der Auswahl.' },
        ],
        reverse: false
      },
      {
        title: 'Magic Link mit PIN',
        icon: 'key',
        bullets: [
          { title: 'Link und 5-stellige PIN per E-Mail', description: 'Kommt mit der Bestätigung. Der Kunde öffnet den Link und gibt die PIN ein.' },
          { title: 'Rechnung ansehen und PDF laden', description: 'Self-Service ohne Rückfragen.' },
          { title: 'Offene Beträge bezahlen', description: 'Bei unbezahlten Buchungen erscheint "Jetzt bezahlen".' },
        ],
        reverse: true
      },
      {
        title: 'Selbst stornieren',
        icon: 'check',
        bullets: [
          { title: 'Stornieren mit E-Mail-Abgleich', description: 'Der Kunde bestätigt mit seiner E-Mail-Adresse.' },
          { title: 'Du siehst es sofort im Dashboard', description: 'Die Buchung steht dann auf Storniert.' },
          { title: 'Link gilt bis 60 Tage nach dem Termin', description: 'Danach läuft der Zugang ab.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Gäste laden ihre Rechnung selbst und stornieren im Portal.', link: '/features' },
      { icon: '💇', title: 'Friseure & Salons', description: 'Manuell angelegte Termine bezahlt der Kunde über den Magic Link.', link: '/features' },
    ],
    relatedFeatures: ['rechnungen', 'buchungen', 'zahlungen'],
    tags: ['kundenportal', 'selfservice', 'magic-link', 'status', 'payments'],
    cta: {
      headline: 'Kundenportal kostenlos testen.',
      primaryCTA: 'Kostenlos starten',
      subheadline: '',
    },
    faq: [
      { question: 'Müssen sich deine Kunden registrieren?', answer: 'Nein. Weder zum Buchen noch zum Einsehen der Buchung. Magic Link und PIN reichen.' },
      { question: 'Wird der Link automatisch verschickt?', answer: 'Ja, wenn du eine bezahlte Widget-Buchung bestätigst, und bei manuell angelegten Buchungen mit Häkchen "Bestätigung per E-Mail senden".' },
      { question: 'Kann der Kunde auch bezahlen?', answer: 'Ja. Bei unbezahlten Buchungen erscheint "Jetzt bezahlen". Die Zahlung läuft per Karte über Stripe.' },
      { question: 'Wie ist der Zugang geschützt?', answer: 'Jeder Link ist einzigartig pro Buchung und zusätzlich mit einer 5-stelligen PIN geschützt. Nur wer beides hat, kommt ins Portal.' },
      { question: 'Bekommt der Kunde bei Storno sein Geld zurück?', answer: 'Nicht automatisch. Die Buchung wird storniert, eine Erstattung löst du bei Bedarf in Stripe aus. Eigene Stornoregeln mit Fristen gibt es noch nicht.' },
      { question: 'Kann der Kunde umbuchen?', answer: 'Noch nicht. Er kann stornieren und neu buchen.' },
    ],
  },
};
