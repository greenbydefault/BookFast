/**
 * Core features: bookings, payments, invoices
 */
export const coreBookingCommerce = {
  buchungen: {
    slug: 'buchungen',
    meta: {
      title: 'Webflow Terminbuchung verwalten',
      description: 'Webflow Terminbuchung zentral verwalten: Status-Tabs, Bestätigen, Ablehnen, manuelle Buchungen und Magic Link zum Kundenportal in einem Dashboard.',
    },
    hero: {
      headline: 'Jede Buchung an einem Ort, statt in fünf Postfächern.',
      subheadline: 'Status-Tabs, Bestätigen und Ablehnen, manuelle Buchungen mit Magic Link. Ein Dashboard statt E-Mail, Telefon und Excel.',
      demoModule: 'buchungen',
      illustration: '/src/svg/illustrations/landingpage/features/ft_buchungsverwaltung.svg',
      trustClaims: ['Keine Kreditkarte nötig', 'In unter 5 Minuten startklar'],
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="bk-inbox"]',
      '[data-demo-section="bk-magic-link"]',
      '[data-demo-section="bk-review"]',
    ],
    problem: {
      text: 'Verstreute Buchungen kosten dich Stunden pro Woche. Anfragen gehen unter, der Status ist unklar, Kunden warten.',
      bullets: [
        'Eine Liste mit allen Buchungen, neue Anfragen erscheinen ohne Neuladen.',
        'Tabs nach Status: Wartet, Offene Zahlungen, Bestätigt, Abgeschlossen, Storniert.',
        'Bestätigen oder Ablehnen mit einem Klick, die Erstattung macht Stripe.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So funktioniert die Buchungsverwaltung',
    interactiveHowItWorksHeadline: 'So läuft eine Buchung in BookFast ab.',
    steps: [
      {
        title: 'Buchung geht ein',
        icon: 'list',
        bullets: [
          { title: 'Widget-Buchungen und manuelle Buchungen', description: 'Buchungen kommen über das Widget, oder du legst sie im Dashboard an.' },
          { title: 'Tabs nach Status', description: 'Wartet, Offene Zahlungen, Bestätigt, Aktiv, Abgeschlossen, Abgelehnt, Nicht erschienen, Storniert.' },
          { title: 'Details in der Seitenleiste', description: 'Kunde, Objekt, Service, Zeitraum, Extras und Betrag auf einen Blick.' },
        ],
        reverse: false
      },
      {
        title: 'Manuelle Buchung & Magic Link',
        icon: 'key',
        bullets: [
          { title: 'Buchung für Telefon- oder Mailanfragen anlegen', description: 'Kunde, Objekt, Service, Mitarbeiter, Zeitraum, Gäste und Extras eintragen.' },
          { title: 'Bestätigung per E-Mail mit einem Häkchen', description: 'Die Mail enthält Magic Link und PIN zum Kundenportal.' },
          { title: 'Kunde zahlt im Portal', description: 'Nach der Zahlung springt die Buchung auf Bestätigt.' },
        ],
        reverse: true
      },
      {
        title: 'Prüfen & bestätigen',
        icon: 'check',
        bullets: [
          { title: 'Bestätigen oder ablehnen', description: 'Du prüfst jede Anfrage und entscheidest.' },
          { title: 'Erstattung bei Ablehnung', description: 'Bei bezahlten Buchungen erstattet Stripe den vollen Betrag.' },
          { title: 'Nach dem Termin abgeschlossen', description: 'Ist das Ende vorbei, zeigt BookFast die Buchung als abgeschlossen.' },
        ],
        reverse: false
      }
    ],
    sections: [
      {
        id: 'approval',
        title: 'Freigabe',
        subtitle: 'Erst zahlen, dann bestätigen. Du entscheidest über jede Buchung.',
        steps: [
          {
            title: 'Kunde bucht und zahlt',
            icon: 'list',
            bullets: [
              { title: 'Neue Buchungen landen im Tab "Wartet"', description: 'Du siehst sie ohne Neuladen.' },
              { title: 'Geld ist da, bevor du bestätigst', description: 'Der Kunde zahlt per Karte direkt im Widget.' },
              { title: 'Keine verpassten Anfragen', description: 'Alles an einem Ort.' },
            ],
            reverse: false
          },
          {
            title: 'Du bestätigst oder lehnst ab',
            icon: 'check',
            bullets: [
              { title: 'Ein Klick reicht', description: 'Kunde, Datum, Service, Betrag. Alle Details sichtbar.' },
              { title: 'Keine Rücküberweisung von Hand', description: 'Bei Ablehnung erstattet Stripe den vollen Betrag.' },
              { title: 'Auch ohne Stripe', description: 'Unbezahlte Anfragen landen als Ausstehend in derselben Liste.' },
            ],
            reverse: true
          },
          {
            title: 'Was danach passiert',
            icon: 'key',
            bullets: [
              { title: 'Bestätigungsmail geht automatisch raus', description: 'Mit Magic Link und PIN zum Kundenportal.' },
              { title: 'Kunde im Portal', description: 'Buchung ansehen, Rechnung laden, stornieren.' },
              { title: 'Erstattung ohne dein Zutun', description: 'Bei Ablehnung. Die Gutschrift dauert je nach Bank 5 bis 10 Werktage.' },
            ],
            reverse: false
          }
        ],
        faq: [
          { question: 'Was passiert mit der Zahlung bei Ablehnung?', answer: 'BookFast löst die volle Rückerstattung über Stripe aus. Die Gutschrift dauert je nach Karte 5 bis 10 Werktage.' },
          { question: 'Kann ich die Freigabe pro Service abschalten?', answer: 'Nein. Bezahlte Widget-Buchungen landen immer erst im Tab "Wartet" und brauchen deine Bestätigung. Eine Sofortbestätigung pro Service gibt es noch nicht.' },
          { question: 'Wie lange habe ich Zeit, eine Anfrage zu bestätigen?', answer: 'Es gibt kein Zeitlimit. Die Buchung wartet, bis du entscheidest.' },
        ],
      },
      {
        id: 'email-templates',
        title: 'E-Mail Vorlagen',
        subtitle: 'Die Bestätigungsmail in deinem Ton, nicht in unserem.',
        steps: [
          {
            title: 'Vorlagen einsehen',
            icon: 'mails',
            bullets: [
              { title: '7 Anlässe im Editor', description: 'Buchung eingegangen, akzeptiert, abgelehnt, storniert, geändert, Erinnerung, Rückerstattung.' },
              { title: 'Standard-Texte als Startpunkt', description: 'Jede Vorlage hat einen Standard-Text.' },
              { title: 'Unter Einstellungen → E-Mail Vorlagen', description: 'Klick auf eine Vorlage öffnet den Editor mit Vorschau.' },
            ],
            reverse: false
          },
          {
            title: 'Betreff und Text bearbeiten',
            icon: 'pencil',
            bullets: [
              { title: 'Betreff, Text und Button pro Vorlage', description: 'Änderungen speichern automatisch.' },
              { title: 'Platzhalter werden beim Versand ersetzt', description: '{{customer_name}}, {{booking_number}}, {{portal_link}}, {{pin_code}}.' },
              { title: 'Liste der Platzhalter im Editor', description: 'Alle verfügbaren Platzhalter sichtbar.' },
            ],
            reverse: true
          },
        ],
        faq: [
          { question: 'Welche Platzhalter kann ich nutzen?', answer: '{{customer_name}}, {{booking_number}}, {{service_name}}, {{object_name}}, {{start_date}}, {{end_date}}, {{total_price}}, {{company_name}}, {{portal_link}} und {{pin_code}}. Die Liste siehst du auch im Editor.' },
          { question: 'Welche E-Mails gehen automatisch raus?', answer: 'Aktuell die Bestätigung: wenn du eine bezahlte Widget-Buchung bestätigst und wenn du eine manuelle Buchung mit Häkchen "Bestätigung per E-Mail senden" anlegst. Beide enthalten Magic Link und PIN. Der automatische Versand für die übrigen Anlässe folgt.' },
          { question: 'Von welcher Adresse kommen die Mails?', answer: 'Als Absender steht dein Firmenname "via BookFast", verschickt über noreply@book-fast.de.' },
        ],
      },
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Buchungen prüfen und Aufenthalte im Blick behalten.', link: '/features' },
      { icon: '🧘', title: 'Yoga Studios', description: 'Kursplätze mit kapazitätsbasierter Buchung an einem Ort.', link: '/features' },
      { icon: '💇', title: 'Friseure', description: 'Jede Buchung mit Mitarbeiter, ohne Tabellen-Chaos.', link: '/features' },
    ],
    relatedFeatures: ['zahlungen', 'analytics', 'kundenportal', 'services'],
    tags: ['buchungen', 'workflow', 'status', 'operations', 'approval', 'email-templates'],
    cta: {
      headline: 'Buchungsverwaltung kostenlos testen.',
      primaryCTA: 'Kostenlos starten',
    },
    faq: [
      { question: 'Kann ich Buchungen manuell anlegen?', answer: 'Ja. Mit Häkchen bei "Bestätigung per E-Mail senden" bekommt der Kunde Magic Link und PIN. Im Portal zahlt er per Karte, danach ist die Buchung bestätigt.' },
      { question: 'Was passiert bei einer Ablehnung?', answer: 'Bei bezahlten oder angezahlten Buchungen erstattet Stripe automatisch alles, was eingegangen ist. Eine Ablehnungsmail an den Kunden verschickt BookFast noch nicht.' },
      { question: 'Gibt es eine Kalenderansicht?', answer: 'Noch nicht. Die Buchungen siehst du als Liste mit Status-Tabs. Beim manuellen Anlegen zeigt dir ein Kalender, welche Tage frei sind.' },
      { question: 'Kann ich eine Buchung umbuchen?', answer: 'Noch nicht. Du kannst stornieren und neu anlegen.' },
      { question: 'Werden Bestätigungs-E-Mails automatisch versendet?', answer: 'Ja, beim Bestätigen einer bezahlten Widget-Buchung und bei manuellen Buchungen mit Häkchen. Die Mail enthält Magic Link und PIN zum Kundenportal.' },
    ],
  },
  zahlungen: {
    slug: 'zahlungen',
    meta: {
      title: 'Zahlungen für Webflow-Buchungen',
      description: 'Online Buchung Webflow mit Zahlung vor Termin. Stripe Connect, Kartenzahlung im Widget, Erstattung bei Ablehnung.',
    },
    hero: {
      headline: 'Geld auf deinem Konto, bevor der Termin startet.',
      subheadline: 'Stripe Connect in unter 5 Minuten aktiv. Deine Kunden zahlen bei der Buchung per Karte, die Auszahlung läuft über dein Stripe-Konto.',
      demoModule: 'zahlungen',
      illustration: '/src/svg/illustrations/landingpage/features/ft_zahlungen.svg',
      trustClaims: ['Keine Kreditkarte nötig', 'In unter 5 Minuten startklar'],
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="pay-connect"]',
      '[data-demo-section="pay-checkout"]',
      '[data-demo-section="pay-payouts"]',
    ],
    problem: {
      text: 'Ohne Vorauszahlung bleiben Termine leer, und du merkst es erst, wenn niemand kommt. Manuelle Rechnungen und Überweisungen fressen deine Zeit.',
      bullets: [
        'Stripe Connect Onboarding in 3 Schritten.',
        'Der Kunde zahlt bei der Buchung, inklusive Reinigungsgebühr, Extras und Gutschein.',
        'Automatische Rückerstattung bei Ablehnung.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So richtest du Zahlungen ein',
    interactiveHowItWorksHeadline: 'In 3 Schritten zu automatischen Zahlungen.',
    steps: [
      {
        title: 'Stripe verbinden',
        icon: 'bank-card',
        bullets: [
          { title: 'Onboarding unter Einstellungen → Integration', description: 'Dort startest du Stripe Connect mit "Einrichtung starten".' },
          { title: 'Konto erstellen und verifizieren', description: 'Stripe fragt deine Daten ab, BookFast zeigt den Status.' },
          { title: 'Nach der Verifizierung bereit', description: 'Ab dann ist Kartenzahlung im Widget aktiv.' },
        ],
        reverse: false
      },
      {
        title: 'Betrag im Checkout',
        icon: 'receipt-euro',
        bullets: [
          { title: 'Preis aus dem Service', description: 'Pro Stunde, Tag oder Nacht, pro Person oder gesamt.' },
          { title: 'Reinigungsgebühr und Extras inklusive', description: 'Add-ons und Gutscheine rechnet BookFast automatisch ein.' },
          { title: 'Voll oder als Anzahlung', description: 'Per Karte im Stripe Checkout, auf Wunsch nur ein Prozentsatz pro Service. Der Slot ist währenddessen 30 Minuten reserviert.' },
        ],
        reverse: true
      },
      {
        title: 'Geld erhalten',
        icon: 'money-hand',
        bullets: [
          { title: 'Auszahlung über Stripe', description: 'Nach dem Auszahlungsplan deines Stripe-Kontos.' },
          { title: 'Rückerstattung bei Ablehnung automatisch', description: 'Ohne manuellen Aufwand.' },
          { title: 'Zahlungen in Insights', description: 'Gestartete und erfolgreiche Zahlungen, Erfolgsquote und Erstattungen.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Anzahlung bei der Buchung, Rest vor der Anreise im Kundenportal.', link: '/features' },
      { icon: '🎨', title: 'Tattoo-Studios', description: 'Bezahlt gebucht heißt: Der Termin ist ernst gemeint.', link: '/features' },
      { icon: '🔐', title: 'Escape Rooms', description: 'Volle Zahlung bei Buchung. Kein Aufwand am Tag.', link: '/features' },
    ],
    sections: [],
    relatedFeatures: ['rechnungen', 'buchungen', 'services'],
    tags: ['zahlungen', 'stripe', 'checkout', 'refund', 'gutscheine'],
    faq: [
      { question: 'Welche Zahlungsmethoden werden unterstützt?', answer: 'Aktuell Kreditkarte (Visa, Mastercard, Amex) über Stripe. Klarna und PayPal sind in Planung.' },
      { question: 'Gibt es eine Provision pro Buchung?', answer: 'Nein. BookFast erhebt keine Provision pro Buchung. Es fallen nur die regulären Stripe-Transaktionsgebühren gemäß deinem Stripe-Tarif an.' },
      { question: 'Kann ich eine Anzahlung verlangen?', answer: 'Ja, in Prozent pro Service. Der Kunde zahlt bei der Buchung nur diesen Anteil per Karte. Den Restbetrag zahlt er später über den Link im Kundenportal.' },
      { question: 'Was passiert bei Stornierung?', answer: 'Lehnst du eine bezahlte oder angezahlte Buchung ab, erstattet Stripe automatisch alles, was eingegangen ist. Storniert der Kunde selbst im Portal, gibt es keine automatische Erstattung. Die löst du bei Bedarf in Stripe aus.' },
      { question: 'Wann erhalte ich die Auszahlung?', answer: 'Die Auszahlung läuft automatisch über Stripe. Der Rhythmus hängt von deinem Stripe-Konto und den dort hinterlegten Auszahlungsregeln ab.' },
    ],
  },
  rechnungen: {
    slug: 'rechnungen',
    meta: {
      title: 'Automatische Rechnungen',
      description: 'Zu jeder Buchung eine Rechnung als PDF, mit Positionen, Add-ons, Rabatt und deinen Firmendaten. Im Dashboard und im Kundenportal.',
    },
    hero: {
      headline: 'Zu jeder Buchung gibt es die Rechnung schon.',
      subheadline: 'Positionen, Add-ons, Rabatt, deine Firmendaten. Als PDF im Dashboard und im Kundenportal.',
      demoModule: 'rechnungen',
      illustration: '/src/svg/illustrations/landingpage/features/ft_automatische_rechnung.svg',
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="inv-created"]',
      '[data-demo-section="inv-portal"]',
      '[data-demo-section="inv-dashboard"]',
    ],
    problem: {
      text: 'Jede Buchung von Hand abrechnen kostet dich Stunden. Positionen werden vergessen, Kunden fragen nach, und du sitzt am Wochenende an Rechnungen.',
      bullets: [
        'Die Rechnung baut sich aus der Buchung, du tippst nichts ab.',
        'Service, Reinigungsgebühr, Add-ons und Gutschein-Rabatt stehen drauf.',
        'Firmendaten, Steuernummer und Bankverbindung aus deinen Einstellungen.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So funktionieren automatische Rechnungen',
    interactiveHowItWorksHeadline: 'So entsteht eine Rechnung, ohne dass du sie schreibst.',
    steps: [
      {
        title: 'Aus der Buchung gebaut',
        icon: 'receipt-euro',
        bullets: [
          { title: 'Jede Buchung hat ihre Rechnung', description: 'Du musst nichts anlegen oder freigeben.' },
          { title: 'Firmendaten einmal hinterlegen', description: 'Unter Einstellungen → Account: Steuernummer, USt-IdNr., Bank, Geschäftsführer.' },
          { title: 'Add-ons und Gutscheine korrekt aufgeführt', description: 'Mit Menge, Einzelpreis, Rabatt und enthaltener USt.' },
        ],
        reverse: false
      },
      {
        title: 'Im Kundenportal',
        icon: 'blocks-integration',
        bullets: [
          { title: 'Rechnung ansehen und PDF herunterladen', description: 'Der Kunde öffnet das Portal über Magic Link und PIN.' },
          { title: '"Jetzt bezahlen" bei offenen Beträgen', description: 'Per Karte, ohne Rückfragen.' },
          { title: 'Kein Rechnungsversand von dir', description: 'Der Kunde holt sich das PDF selbst.' },
        ],
        reverse: true
      },
      {
        title: 'Im Dashboard & Download',
        icon: 'download-file',
        bullets: [
          { title: 'Rechnung im Buchungsdetail', description: 'Alles an einem Ort.' },
          { title: 'PDF-Download', description: 'Für deine Unterlagen oder die Buchhaltung.' },
          { title: 'Nummer im Format RE-Jahr-Nummer', description: 'Zum Beispiel RE-2026-0042.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Rechnung mit Übernachtungen, Reinigungsgebühr und Extras.', link: '/features' },
      { icon: '💼', title: 'Coworking', description: 'Rechnung pro gebuchtem Raum, mit Beamer und Catering als Add-on.', link: '/features' },
      { icon: '🏥', title: 'Therapeuten', description: 'Rechnung pro Behandlung mit Steuernummer.', link: '/features' },
    ],
    relatedFeatures: ['zahlungen', 'buchungen', 'analytics'],
    tags: ['rechnungen', 'billing', 'tax', 'documents', 'accounting'],
    faq: [
      { question: 'Kann ich das Rechnungsdesign anpassen?', answer: 'Nein. Die Rechnung nutzt das BookFast-Layout mit deinen Firmendaten. Eigene Vorlagen sind geplant.' },
      { question: 'Werden Gutscheine auf der Rechnung berücksichtigt?', answer: 'Ja, der Rabatt steht als eigene Zeile auf der Rechnung.' },
      { question: 'In welchem Format wird die Rechnung erstellt?', answer: 'Als PDF. Du lädst sie im Buchungsdetail herunter, dein Kunde im Kundenportal.' },
      { question: 'Bekommt der Kunde die Rechnung per Mail?', answer: 'Nicht als Anhang. Die Bestätigungsmail enthält den Magic Link, im Portal lädt der Kunde das PDF selbst.' },
      { question: 'Geht das auch als Kleinunternehmer ohne USt.?', answer: 'Noch nicht. Einen Rechnungsmodus ohne USt. nach § 19 UStG gibt es aktuell nicht.' },
    ],
  },
};
