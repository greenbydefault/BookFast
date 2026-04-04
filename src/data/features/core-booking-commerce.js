/**
 * Core features: bookings, payments, invoices
 */
export const coreBookingCommerce = {
  buchungen: {
    slug: 'buchungen',
    meta: {
      title: 'Webflow Terminbuchung verwalten',
      description: 'Webflow Terminbuchung zentral verwalten: Status, Kalender, Bestätigen, Ablehnen, Approval-Flow und E-Mail-Vorlagen in einem Dashboard.',
    },
    hero: {
      headline: 'Jede Buchung an einem Ort – statt in 5 Postfächern.',
      subheadline: 'Status-Filter, Kalender- und Listenansicht, Bestätigen und Ablehnen – in einem Dashboard statt über E-Mail, Telefon und Excel.',
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
      text: 'Verstreute Buchungen kosten dich Stunden pro Woche. Anfragen gehen unter, Status ist unklar, Kunden warten.',
      bullets: [
        'Zentrale Übersicht mit Echtzeit-Status – keine verpassten Anfragen.',
        'Filter nach Status: Wartend, Bestätigt, Abgeschlossen, Abgelehnt.',
        'Kalender- und Listenansicht – für jeden Workflow die passende Ansicht.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So funktioniert die Buchungsverwaltung',
    interactiveHowItWorksHeadline: 'So läuft eine Buchung in BookFast ab.',
    steps: [
      {
        title: 'Buchung eingeht',
        icon: 'list',
        bullets: [
          { title: 'Widget-Buchungen und manuelle Buchungen', description: 'Buchungen kommen über das Widget oder Sie legen sie manuell an.' },
          { title: 'Filter nach Status', description: 'Wartend, Bestätigt, Abgeschlossen, Abgelehnt – auf einen Blick.' },
          { title: 'Kalender- und Listenansicht', description: 'Für jeden Workflow die passende Ansicht.' },
        ],
        reverse: false
      },
      {
        title: 'Manuelle Buchung & Magic Link',
        icon: 'key',
        bullets: [
          { title: 'Magic Link automatisch mit E-Mail', description: 'Bei manuell angelegten Buchungen wird die Bestätigungsmail versendet.' },
          { title: 'Kunde zahlt im Portal oder sieht Rechnung', description: 'Self-Service ohne Rückfragen.' },
          { title: 'Kein manueller Versand nötig', description: 'Alles läuft automatisch.' },
        ],
        reverse: true
      },
      {
        title: 'Prüfen & Bestätigen',
        icon: 'check',
        bullets: [
          { title: 'Bestätigen oder ablehnen', description: 'Sie prüfen jede Anfrage und entscheiden.' },
          { title: 'Automatische Rückerstattung bei Ablehnung', description: 'Bei bezahlten Buchungen über Stripe.' },
          { title: 'Automatisch abschließen nach Termin', description: 'Buchung wird als abgeschlossen markiert.' },
        ],
        reverse: false
      }
    ],
    sections: [
      {
        id: 'approval',
        title: 'Approval-Flow',
        subtitle: 'Erst zahlen, dann bestätigen – volle Kontrolle über jede Buchung.',
        steps: [
          {
            title: 'Kunde bucht',
            icon: 'list',
            bullets: [
              { title: 'Alle neuen Buchungen im Dashboard sichtbar', description: 'Status »Wartend« – Sie sehen sie sofort.' },
              { title: 'Geld ist sicher, bevor Sie bestätigen', description: 'Kunde zahlt direkt im Widget.' },
              { title: 'Keine verpassten Anfragen', description: 'Alles an einem Ort.' },
            ],
            reverse: false
          },
          {
            title: 'Sie bestätigen oder lehnen ab',
            icon: 'check',
            bullets: [
              { title: 'Ein Klick reicht', description: 'Kunde, Datum, Service, Betrag – alle Details sichtbar.' },
              { title: 'Keine manuelle Rücküberweisung nötig', description: 'Bei Ablehnung automatisch über Stripe.' },
              { title: 'Entscheiden Sie in Ruhe', description: 'Volle Kontrolle über jede Anfrage.' },
            ],
            reverse: true
          },
          {
            title: 'Was danach passiert',
            icon: 'key',
            bullets: [
              { title: 'Magic Link automatisch versendet', description: 'Bei Bestätigung – Kunde öffnet Portal.' },
              { title: 'Kunde selbstständig im Portal', description: 'Buchung, Rechnung, Restbetrag zahlen.' },
              { title: 'Refund ohne Ihr Zutun', description: 'Bei Ablehnung – Gutschrift in 5–10 Werktagen.' },
            ],
            reverse: false
          }
        ],
        faq: [
          { question: 'Was passiert mit der Zahlung bei Ablehnung?', answer: 'BookFast löst automatisch die volle Rückerstattung über Stripe aus. Die Gutschrift kann je nach Zahlungsart 5–10 Werktage dauern.' },
          { question: 'Kann ich den Approval-Flow pro Service aktivieren?', answer: 'Ja, du kannst ihn individuell pro Service ein- oder ausschalten.' },
          { question: 'Wie lange habe ich Zeit, eine Anfrage zu bestätigen?', answer: 'Aktuell gibt es kein automatisches Timeout. Du entscheidest in deinem Tempo. Automatische Ablehnung nach X Tagen ist in Planung.' },
        ],
      },
      {
        id: 'email-templates',
        title: 'E-Mail Vorlagen',
        subtitle: '7 Buchungs-Mails – in deinem Ton, nicht in unserem.',
        steps: [
          {
            title: 'Vorlagen einsehen',
            icon: 'mails',
            bullets: [
              { title: '7 Vorlagentypen auf einen Blick', description: 'Buchung eingegangen, bestätigt, abgelehnt, storniert, geändert, Erinnerung, Rückerstattung.' },
              { title: 'Standard-Texte als Startpunkt', description: 'Jede hat einen Standard-Text.' },
              { title: 'Klick auf Karte öffnet Editor', description: 'Im Dashboard unter "E-Mail Vorlagen".' },
            ],
            reverse: false
          },
          {
            title: 'Betreff und Text bearbeiten',
            icon: 'pencil',
            bullets: [
              { title: 'Betreff und Text pro Vorlage', description: 'Bearbeiten Sie nach Bedarf.' },
              { title: 'Platzhalter werden automatisch ersetzt', description: '{{customer_name}}, {{booking_number}}, {{portal_link}}.' },
              { title: 'Liste der Platzhalter im Editor', description: 'Alle verfügbaren Platzhalter sichtbar.' },
            ],
            reverse: true
          },
        ],
        faq: [
          { question: 'Welche Platzhalter kann ich nutzen?', answer: 'Z.B. {{customer_name}}, {{booking_number}}, {{service_name}}, {{object_name}}, {{start_date}}, {{end_date}}, {{total_price}}, {{company_name}}, {{portal_link}}, {{pin_code}}. Die vollständige Liste siehst du im Editor.' },
          { question: 'Kann ich zur Standard-Vorlage zurückkehren?', answer: 'Ja, du kannst angepasste Vorlagen löschen – dann greift wieder die Standard-Vorlage.' },
          { question: 'Welche E-Mails werden automatisch versendet?', answer: '7 Typen: Buchung eingegangen, bestätigt, abgelehnt, storniert, geändert, Erinnerung und Rückerstattung. Jede wird automatisch bei der entsprechenden Aktion ausgelöst.' },
        ],
      },
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Buchungen prüfen und Aufenthalte im Blick behalten.', link: '/features' },
      { icon: '🧘', title: 'Yoga Studios', description: 'Kursplätze und Wartelisten an einem Ort.', link: '/features' },
      { icon: '💇', title: 'Friseure', description: 'Tagesübersicht pro Mitarbeiter, ohne Tabellen-Chaos.', link: '/features' },
    ],
    relatedFeatures: ['zahlungen', 'analytics', 'kundenportal', 'services'],
    tags: ['buchungen', 'workflow', 'status', 'calendar', 'operations', 'approval', 'email-templates'],
    cta: {
      headline: 'Buchungsverwaltung kostenlos testen.',
      primaryCTA: 'Kostenlos starten',
    },
    faq: [
      { question: 'Kann ich Buchungen manuell anlegen?', answer: 'Ja, im Dashboard legst du Buchungen manuell an. Die Bestätigungsmail mit Magic Link zum Kundenportal wird automatisch versendet – der Kunde kann dort zahlen oder die Rechnung einsehen.' },
      { question: 'Was passiert bei einer Ablehnung?', answer: 'Bei bezahlten Buchungen löst BookFast automatisch eine Rückerstattung über Stripe aus. Der Kunde wird per E-Mail informiert.' },
      { question: 'Gibt es eine Kalenderansicht?', answer: 'Ja, du schaltest zwischen Kalender- und Listenansicht um.' },
      { question: 'Kann ich nach Kunden oder Services filtern?', answer: 'Ja, die Buchungsübersicht filtert nach Kunde, Service, Objekt und Datum.' },
      { question: 'Werden Bestätigungs-E-Mails automatisch versendet?', answer: 'Ja. Bei Bestätigung und Ablehnung werden automatische E-Mails an den Kunden versendet. Je nach Aktion folgen weitere Systemmails, z. B. bei Rückerstattungen.' },
    ],
  },
  zahlungen: {
    slug: 'zahlungen',
    meta: {
      title: 'Online Buchung Webflow – Zahlungen',
      description: 'Online Buchung Webflow mit Zahlung vor Termin. Stripe Connect, Anzahlungen, Rückerstattungen – 0 % Provision.',
    },
    hero: {
      headline: 'Geld auf deinem Konto, bevor der Termin startet.',
      subheadline: 'Stripe Connect in unter 5 Minuten aktiv. Deine Kunden zahlen bei Buchung, du erhältst die Auszahlung automatisch – ohne Provision.',
      demoModule: 'zahlungen',
      illustration: '/src/svg/illustrations/landingpage/features/ft_zahlungen.svg',
      trustClaims: ['Keine Kreditkarte nötig', 'In unter 5 Minuten startklar'],
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="pay-connect"]',
      '[data-demo-section="pay-deposit"]',
      '[data-demo-section="pay-payouts"]',
    ],
    problem: {
      text: 'Ohne Vorauszahlung taucht jeder Fünfte nicht auf. Manuelle Rechnungen und Überweisungen fressen deine Zeit.',
      bullets: [
        'Stripe Connect Onboarding in 3 Schritten.',
        'Anzahlungen konfigurierbar (z.B. 30% bei Buchung).',
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
          { title: 'Link zum Onboarding in den BookFast-Einstellungen', description: 'Unter Integration starten Sie das Stripe Connect Onboarding.' },
          { title: 'Konto erstellen oder verbinden', description: 'Gleicher Ablauf wie bei Stripe direkt.' },
          { title: 'Nach Verifizierung sofort einsatzbereit', description: 'BookFast erhebt keine Provision.' },
        ],
        reverse: false
      },
      {
        title: 'Anzahlung konfigurieren',
        icon: 'receipt-euro',
        bullets: [
          { title: 'Einstellung pro Service unter "Services" → Detail', description: 'Prozent oder Festbetrag – je nach Bedarf.' },
          { title: 'Prozent oder Festbetrag', description: 'z.B. 30% bei Buchung.' },
          { title: 'Automatische Berechnung im Checkout', description: 'Kunde zahlt direkt bei Buchung.' },
        ],
        reverse: true
      },
      {
        title: 'Geld erhalten',
        icon: 'money-hand',
        bullets: [
          { title: 'Auszahlung 24h nach Bestätigung', description: 'Beträge landen auf Ihrem Bankkonto.' },
          { title: 'Rückerstattung bei Ablehnung automatisch', description: 'Ohne manuellen Aufwand.' },
          { title: 'Übersicht aller Zahlungen im Dashboard', description: 'Alle Transaktionen auf einen Blick.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: '30% Anzahlung bei Buchung, Rest bei Check-in.', link: '/features' },
      { icon: '🎨', title: 'Tattoo-Studios', description: 'Anzahlung sichert den Termin, weniger No-Shows.', link: '/features' },
      { icon: '🔐', title: 'Escape Rooms', description: 'Volle Zahlung bei Buchung. Kein Aufwand am Tag.', link: '/features' },
    ],
    sections: [],
    relatedFeatures: ['rechnungen', 'buchungen', 'services'],
    tags: ['zahlungen', 'stripe', 'checkout', 'deposit', 'refund', 'kaution', 'gutscheine'],
    faq: [
      { question: 'Welche Zahlungsmethoden werden unterstützt?', answer: 'Aktuell Kreditkarte (Visa, Mastercard, Amex) über Stripe. Klarna und PayPal sind in Planung.' },
      { question: 'Gibt es eine Provision pro Buchung?', answer: 'Nein. BookFast erhebt keine Provision pro Buchung. Es fallen nur die regulären Stripe-Transaktionsgebühren gemäß deinem Stripe-Tarif an.' },
      { question: 'Wie funktioniert die Anzahlung?', answer: 'Du konfigurierst pro Service einen Prozentsatz (z.B. 30%). Der Kunde zahlt den Betrag bei Buchung, den Rest bei Termin.' },
      { question: 'Was passiert bei Stornierung?', answer: 'Bei Ablehnung durch dich wird automatisch rückerstattet. Bei Kundenstornierung greift deine Stornierungspolicy.' },
      { question: 'Wann erhalte ich die Auszahlung?', answer: 'Die Auszahlung läuft automatisch über Stripe. Der genaue Rhythmus hängt von deinem Stripe-Konto und den dort hinterlegten Auszahlungsregeln ab.' },
    ],
  },
  rechnungen: {
    slug: 'rechnungen',
    meta: {
      title: 'Automatische Rechnungen',
      description: 'Automatische Rechnungsgenerierung nach Bestätigung oder Abschluss – das Feature, das anderen fehlt.',
    },
    hero: {
      headline: 'Rechnungen, die sich selbst schreiben.',
      subheadline: 'Nach Bestätigung oder Abschluss wird die Rechnung automatisch erstellt – mit allen Positionen, Add-ons und deinen Firmendaten. Das Feature, das andere Buchungssysteme nicht haben.',
      demoModule: 'rechnungen',
      illustration: '/src/svg/illustrations/landingpage/features/ft_automatische_rechnung.svg',
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="inv-created"]',
      '[data-demo-section="inv-portal"]',
      '[data-demo-section="inv-dashboard"]',
    ],
    problem: {
      text: 'Jede Buchung von Hand abrechnen kostet dich Stunden. Positionen werden vergessen, Kunden fragen nach – und du sitzt am Wochenende an Rechnungen.',
      bullets: [
        'Automatische Generierung nach Bestätigung oder Abschluss.',
        'Alle Buchungsdetails, Add-ons und Rabatte korrekt aufgelistet.',
        'Firmendaten und Steuernummern aus deinen Einstellungen.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So funktionieren automatische Rechnungen',
    interactiveHowItWorksHeadline: 'So entsteht eine Rechnung – automatisch.',
    steps: [
      {
        title: 'Automatisch bei Bestätigung',
        icon: 'receipt-euro',
        bullets: [
          { title: 'Rechnung entsteht mit Bestätigung', description: 'Sobald Sie bestätigen oder die Buchung abgeschlossen wird.' },
          { title: 'Firmendaten einmal hinterlegen', description: 'Steuernummer, Bankverbindung – einmalig in den Einstellungen.' },
          { title: 'Add-ons und Gutscheine korrekt aufgeführt', description: 'Alle Positionen automatisch auf der Rechnung.' },
        ],
        reverse: false
      },
      {
        title: 'Im Kundenportal',
        icon: 'blocks-integration',
        bullets: [
          { title: 'Rechnung ansehen und PDF herunterladen', description: 'Kunde erhält Magic Link per E-Mail.' },
          { title: '"Jetzt bezahlen" bei offenen Beträgen', description: 'Direkt online bezahlen – ohne Rückfragen.' },
          { title: 'Kein manueller E-Mail-Versand nötig', description: 'Alles automatisch.' },
        ],
        reverse: true
      },
      {
        title: 'Im Dashboard & Download',
        icon: 'download-file',
        bullets: [
          { title: 'Rechnung im Buchungsdetail', description: 'Alles an einem Ort.' },
          { title: 'PDF-Download', description: 'Für Ihre Unterlagen oder zum Versand.' },
          { title: 'Per E-Mail an Kunden senden', description: 'Bei Bedarf manuell verschicken.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Rechnung mit Übernachtungen, Reinigungsgebühr und Extras.', link: '/features' },
      { icon: '💼', title: 'Coworking', description: 'Monatliche Rechnung für gebuchte Räume und Stunden.', link: '/features' },
      { icon: '🏥', title: 'Therapeuten', description: 'Rechnung pro Behandlung mit Steuernummer.', link: '/features' },
    ],
    relatedFeatures: ['zahlungen', 'buchungen', 'analytics'],
    tags: ['rechnungen', 'billing', 'tax', 'documents', 'accounting'],
    faq: [
      { question: 'Kann ich das Rechnungsdesign anpassen?', answer: 'Die Rechnung enthält automatisch deine Firmendaten und das BookFast-Standard-Layout. Custom-Templates sind für die Enterprise-Version geplant.' },
      { question: 'Werden Gutscheine auf der Rechnung berücksichtigt?', answer: 'Ja, eingelöste Gutscheine und deren Rabatt werden korrekt auf der Rechnung ausgewiesen.' },
      { question: 'In welchem Format wird die Rechnung erstellt?', answer: 'Als PDF. Kunden können die Rechnung im Kundenportal einsehen und herunterladen.' },
      { question: 'Kann ich Rechnungsnummern konfigurieren?', answer: 'Die Rechnungsnummern werden fortlaufend generiert. Custom-Formate sind in Planung.' },
      { question: 'Kann mein Kunde die Rechnung selbst einsehen?', answer: 'Ja. Über das Kundenportal per Magic Link kann der Kunde die Rechnung ansehen, als PDF herunterladen und offene Beträge direkt bezahlen.' },
    ],
  },
};
