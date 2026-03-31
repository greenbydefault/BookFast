/**
 * Core features: Buchungen, Zahlungen, Rechnungen, Analytics, Objekte, Services
 */
export const core = {
  buchungen: {
    slug: 'buchungen',
    meta: {
      title: 'Webflow Terminbuchung verwalten',
      description: 'Webflow Terminbuchung zentral verwalten: Status, Kalender, Bestätigen, Ablehnen, Approval-Flow und E-Mail-Vorlagen in einem Dashboard.',
    },
    hero: {
      headline: 'Jede Buchung an einem Ort – statt in 5 Postfächern.',
      subheadline: 'Status-Filter, Kalender- und Listenansicht, Bestätigen und Ablehnen – in einem Dashboard statt über E-Mail, Telefon und Excel.',
      illustration: '/src/svg/illustrations/landingpage/features/ft_buchungsverwaltung.svg',
      trustClaims: ['Keine Kreditkarte nötig', 'In unter 5 Minuten startklar'],
    },
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
      illustration: '/src/svg/illustrations/landingpage/features/ft_zahlungen.svg',
      trustClaims: ['Keine Kreditkarte nötig', 'In unter 5 Minuten startklar'],
    },
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
    sections: [
      {
        id: 'anzahlung',
        title: 'Kaution & Anzahlung',
        subtitle: '30% bei Buchung – der Rest beim Termin.',
        steps: [
          {
            title: 'Anzahlung aktivieren',
            icon: 'bank-card',
            bullets: [
              { title: 'Einstellung pro Service im Detail', description: 'In den Service-Einstellungen einschalten.' },
              { title: 'Prozent oder Festbetrag wählbar', description: 'z.B. 30% oder 50€ Kaution.' },
              { title: 'Sofortiger Einzug bei Buchung', description: 'Restbetrag bei Termin oder nach Abschluss.' },
            ],
            reverse: false
          },
          {
            title: 'Automatisch eingezogen',
            icon: 'money-hand',
            bullets: [
              { title: 'Einzug bei Buchung automatisch', description: 'Stripe zieht den Betrag ein.' },
              { title: 'Restbetrag auf Rechnung ausgewiesen', description: 'Kann bei Termin bezahlt werden.' },
              { title: 'Rückerstattung bei Ablehnung automatisch', description: 'Bei Ablehnung durch Sie.' },
            ],
            reverse: true
          },
        ],
        faq: [
          { question: 'Wird die Anzahlung auf der Rechnung angezeigt?', answer: 'Ja, Anzahlung und Restbetrag werden auf der Rechnung ausgewiesen.' },
          { question: 'Kann ich die Anzahlung als Prozentsatz konfigurieren?', answer: 'Ja. Du wählst zwischen Prozent (z. B. 30 %) oder Festbetrag (z. B. 50 €) – pro Service individuell.' },
          { question: 'Reduziert eine Anzahlung No-Shows?', answer: 'In vielen Fällen ja. Eine Anzahlung erhöht die Verbindlichkeit bei der Buchung und senkt dadurch typischerweise die No-Show-Rate.' },
        ],
      },
      {
        id: 'gutscheine',
        title: 'Gutscheine & Rabattcodes',
        subtitle: 'Rabattcodes, die Buchungen bringen – nicht nur Klicks.',
        steps: [
          {
            title: 'Code erstellen',
            icon: 'ticket-percent',
            bullets: [
              { title: 'Prozent oder Festbetrag pro Code', description: 'z.B. YOGA25 für 25% oder 10€ Rabatt.' },
              { title: 'Nutzungslimit und Gültigkeitsdatum optional', description: 'Im Dashboard unter "Gutscheine" anlegen.' },
              { title: 'Code sofort nach Erstellung gültig', description: 'Keine Wartezeit.' },
            ],
            reverse: false
          },
          {
            title: 'Verteilen & Tracken',
            icon: 'chart',
            bullets: [
              { title: 'Eingabe im Checkout-Schritt des Widgets', description: 'Kunden geben den Code ein.' },
              { title: 'Automatische Prüfung von Gültigkeit und Limit', description: 'Gültig, Limit nicht erreicht, Zeitraum ok.' },
              { title: 'Einsätze pro Code im Dashboard sichtbar', description: 'Wie oft wurde der Code eingelöst?' },
            ],
            reverse: true
          },
        ],
        faq: [
          { question: 'Können Gutscheine auf bestimmte Services beschränkt werden?', answer: 'Aktuell gelten Gutscheine für alle Services. Servicespezifische Einschränkung ist in Planung.' },
          { question: 'Wird der Rabatt auf der Rechnung angezeigt?', answer: 'Ja, eingelöste Gutscheine werden als Rabatt auf der Rechnung ausgewiesen.' },
          { question: 'Kann ich ein Nutzungslimit pro Code setzen?', answer: 'Ja. Du legst fest, wie oft ein Code eingelöst werden kann – z. B. maximal 50 Mal.' },
        ],
      },
    ],
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
      illustration: '/src/svg/illustrations/landingpage/features/ft_automatische_rechnung.svg',
    },
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

  analytics: {
    slug: 'analytics',
    meta: {
      title: 'Analytics & Insights',
      description: 'Conversion-Funnel, Drop-off-Raten, Traffic-Daten und Zahlungs-Statistiken – Daten die andere Booking-Tools nicht zeigen.',
    },
    hero: {
      headline: 'Sieh genau, wo Kunden abspringen.',
      subheadline: 'Conversion-Funnel, Drop-off-Analyse und Traffic-Daten – verstehe, warum Besucher nicht buchen und wo du optimieren kannst.',
      demoModule: 'analytics',
      illustration: '/src/svg/illustrations/empty-state-analytics.svg',
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="an-overview"]',
      '[data-demo-section="an-funnel"]',
      '[data-demo-section="an-optimize"]',
    ],
    problem: {
      text: 'Andere Buchungssysteme zeigen dir Buchungszahlen. Aber nicht, warum 70% deiner Besucher den Checkout nicht abschließen.',
      bullets: [
        'Conversion-Funnel: Widget geladen → Buchung gestartet → Checkout → Zahlung.',
        'Drop-off-Analyse zeigt, wo Kunden abspringen.',
        'Traffic-Daten: Browser, Geräte, Länder, Städte.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So nutzen Sie Analytics',
    interactiveHowItWorksHeadline: 'Vom Widget-Aufruf bis zur Conversion – alles sichtbar.',
    steps: [
      {
        title: 'Widget einbetten',
        icon: 'globe',
        bullets: [
          { title: 'Tracking startet automatisch mit Widget-Einbindung', description: 'Widget-Aufrufe, Buchungsstarts, Checkouts und Zahlungen.' },
          { title: 'Keine zusätzliche Konfiguration nötig', description: 'Das Tracking startet mit dem ersten Aufruf.' },
          { title: 'DSGVO-konform, keine externen Cookies', description: 'Datenschutz gewährleistet.' },
        ],
        reverse: false
      },
      {
        title: 'Insights öffnen',
        icon: 'chart',
        bullets: [
          { title: 'Funnel-Visualisierung zeigt jeden Schritt', description: 'Widget geladen → Buchung gestartet → Checkout → Zahlung.' },
          { title: 'Drop-off-Analyse identifiziert Schwachstellen', description: 'Wo springen Kunden ab?' },
          { title: 'Traffic- und Payment-Metriken auf einen Blick', description: 'Browser, Geräte, Länder, Städte.' },
        ],
        reverse: true
      },
      {
        title: 'Optimieren',
        icon: 'target',
        bullets: [
          { title: 'Engpässe im Funnel gezielt angehen', description: 'Wo springen die meisten Kunden ab?' },
          { title: 'A/B-Tests oder Anpassungen priorisieren', description: 'Datenbasiert statt Bauchgefühl.' },
          { title: 'Mit Vergleichszeiträumen Fortschritt messen', description: 'Letzter Monat, 3, 6 oder 12 Monate.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '📈', title: 'Conversion optimieren', description: 'Finde heraus, wo Kunden im Buchungsprozess abspringen.', link: '/features/buchungen' },
      { icon: '💰', title: 'Revenue tracken', description: 'Verfolge Umsatz, Zahlungserfolgsrate und Refunds.', link: '/features/zahlungen' },
      { icon: '🌍', title: 'Zielgruppe verstehen', description: 'Browser, Geräte, Länder und Städte deiner Besucher.', link: '/features/analytics#kunden' },
    ],
    sections: [
      {
        id: 'kunden',
        title: 'Kundenverwaltung',
        subtitle: 'Wer bucht, wann, wie oft – Kundendaten ohne CRM.',
        steps: [
          {
            title: 'Automatisch erfasst',
            icon: 'user',
            bullets: [
              { title: 'Speicherung bei jeder Buchung automatisch', description: 'Name, E-Mail – ob Widget oder manuell angelegt.' },
              { title: 'Wiederbucher werden erkannt', description: 'Erscheinen als bestehende Kunden mit Historie.' },
              { title: 'Kein manueller Eintrag nötig', description: 'Alles läuft automatisch.' },
            ],
            reverse: false
          },
          {
            title: 'Historie & Beziehungen pflegen',
            icon: 'list',
            bullets: [
              { title: 'Alle Buchungen pro Kunde aufgelistet', description: 'Wer hat wann was gebucht?' },
              { title: 'Zahlungs- und Rechnungshistorie', description: 'Welche Beträge sind offen?' },
              { title: 'Notizen pro Kunde hinterlegen', description: 'Präferenzen oder besondere Wünsche.' },
            ],
            reverse: true
          },
        ],
        faq: [
          { question: 'Werden Kundendaten automatisch gespeichert?', answer: 'Ja, bei jeder Buchung werden Kontaktdaten automatisch in der Kundendatenbank hinterlegt.' },
          { question: 'Werden Wiederbuchungen erkannt?', answer: 'Ja. BookFast erkennt wiederkehrende Kunden anhand der E-Mail-Adresse und ordnet alle Buchungen dem gleichen Kundenprofil zu.' },
          { question: 'Ist die Kundenverwaltung DSGVO-konform?', answer: 'Ja. Alle Daten werden auf EU-Servern gespeichert. Du kannst Kundendaten auf Anfrage löschen.' },
        ],
      },
    ],
    relatedFeatures: ['buchungen', 'zahlungen', 'integration'],
    tags: ['analytics', 'tracking', 'reports', 'conversion', 'insights', 'kunden', 'crm'],
    faq: [
      { question: 'Werden die Daten in Echtzeit angezeigt?', answer: 'Ja, Analytics-Daten werden in Echtzeit erfasst und im Dashboard angezeigt.' },
      { question: 'Welche Zeiträume kann ich auswählen?', answer: 'Letzter Monat, letzte 3, 6 oder 12 Monate. Mit Vergleichswerten zum vorherigen Zeitraum.' },
      { question: 'Brauche ich ein externes Analytics-Tool?', answer: 'Nein, BookFast hat eigene Analytics. Du kannst aber weiterhin Google Analytics oder Plausible parallel nutzen.' },
      { question: 'Welche Daten werden erfasst?', answer: 'Widget-Aufrufe, Buchungsstarts, Checkouts, Zahlungen, Browser, OS, Geräte, Länder und Städte. Alles DSGVO-konform.' },
      { question: 'Ist das Tracking DSGVO-konform?', answer: 'Ja. Das Tracking läuft ohne externe Analytics-Cookies und die Daten werden auf EU-Servern verarbeitet.' },
    ],
  },

  objekte: {
    slug: 'objekte',
    meta: { title: 'Objektverwaltung', description: 'Räume, Wohnungen, Studios – alle buchbaren Objekte mit Kapazität, Bildern und Verfügbarkeiten.' },
    hero: {
      headline: 'Räume, Wohnungen, Plätze – an einem Ort verwaltet.',
      subheadline: 'Jedes Objekt mit Kapazität, Fotos, buchbaren Tagen und individuellen Regeln. Einmal einrichten, dauerhaft im Griff.',
      demoModule: 'objekte',
      illustration: '/src/svg/illustrations/landingpage/features/ft_objektverwaltung.svg',
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So richtest du Objekte ein',
    interactiveHowItWorksHeadline: 'So richtest du deine Objekte ein.',
    problem: { text: 'Jedes Objekt hat eigene Regeln, Kapazitäten und Zeiten. Ohne System verlierst du den Überblick – und Kunden buchen, was nicht verfügbar ist.', bullets: ['Kapazität und buchbare Tage pro Objekt konfigurieren.', 'Buchungsfenster: Wie weit im Voraus können Kunden buchen?', 'Reinigungspuffer zwischen Buchungen.'] },
    steps: [
      {
        title: 'Objekt erstellen',
        icon: 'package',
        bullets: [
          { title: 'Name, Beschreibung und Kapazität Pflicht', description: 'Name, Kapazität, Beschreibung – damit Kunden sofort wissen, was sie buchen.' },
          { title: 'Bilder helfen bei der Auswahl', description: 'Fotos erhöhen Vertrauen und reduzieren Rückfragen vor der Buchung deutlich.' },
          { title: 'Pro Objekt individuelle Einstellungen möglich', description: 'Zeiten, Puffer, Übernachtung – alles individuell pro Objekt klar konfigurierbar, jederzeit.' },
        ],
        reverse: false
      },
      {
        title: 'Verfügbarkeit setzen',
        icon: 'calender-days-date',
        bullets: [
          { title: 'Buchbare Tage und Uhrzeiten pro Objekt', description: 'Mo–Fr, 8–20 Uhr – konfigurierbar pro Objekt.' },
          { title: 'Buchungsfenster: z.B. maximal 3 Monate im Voraus', description: 'Wie weit im Voraus können Kunden buchen? Du legst fest.' },
          { title: 'Puffer zwischen Buchungen für Reinigung oder Umbau', description: 'Zeit zwischen Buchungen – für Reinigung oder Umbau.' },
        ],
        reverse: true
      },
      {
        title: 'Services zuordnen',
        icon: 'spark-magic',
        bullets: [
          { title: 'Services unter Objekt-Detail zuordnen', description: 'Im Objekt-Detail ordnest du die passenden Services zu.' },
          { title: 'Ein Objekt kann mehrere Services haben', description: 'Ein Raum: Stunden- und Tagesmiete – alles möglich.' },
          { title: 'Ohne Zuordnung keine Buchung möglich', description: 'Mindestens ein Service pro Objekt – sonst keine Buchung.' },
        ],
        reverse: false
      },
      {
        title: 'Im Widget prüfen',
        icon: 'spark-magic',
        bullets: [
          { title: 'Objektanzeige aus Kundensicht prüfen', description: 'So sehen Kunden dein Objekt – prüfe vor dem Go-Live.' },
          { title: 'Texte und Einstellungen bei Bedarf anpassen', description: 'Anpassen, bis alles klar ist.' },
          { title: 'Buchungsfluss testen, bevor du live gehst', description: 'Test durchklicken – dann starten.' },
        ],
        reverse: true
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Jede Wohnung als eigenes Objekt.', link: '/features' },
      { icon: '💼', title: 'Coworking', description: 'Räume und Schreibtische verwalten.', link: '/features' },
    ],
    sections: [
      {
        id: 'verfuegbarkeit',
        title: 'Verfügbarkeitsprüfung',
        subtitle: 'Nie wieder doppelt gebucht – Echtzeit-Slot-Reservierung.',
        steps: [
          {
            title: 'Kunde bucht',
            icon: 'check',
            bullets: [
              { title: 'Reservierung beim Checkout-Start', description: 'Slot wird sofort reserviert.' },
              { title: 'Echtzeit-Blockierung während der Buchung', description: 'Slot ist für andere blockiert.' },
              { title: 'Kein Wettlauf um denselben Slot', description: 'Doppelbuchungen von vornherein verhindert.' },
            ],
            reverse: false
          },
          {
            title: 'Kein Konflikt',
            icon: 'lock',
            bullets: [
              { title: 'Reservierte Slots für andere ausgeblendet', description: 'Live-Aktualisierung – keine Verzögerung.' },
              { title: 'Bei Stornierung sofort wieder buchbar', description: 'Slot wird freigegeben.' },
              { title: 'Kein Slot wird doppelt vergeben', description: 'Das System garantiert es.' },
            ],
            reverse: true
          },
        ],
        faq: [
          { question: 'Was passiert wenn zwei Kunden gleichzeitig buchen?', answer: 'Der erste der den Checkout startet, reserviert den Slot. Der zweite sieht den Slot als nicht mehr verfügbar.' },
          { question: 'Wie schnell wird die Verfügbarkeit aktualisiert?', answer: 'In Echtzeit. Sobald ein Checkout gestartet wird, ist der Slot für andere blockiert.' },
        ],
      },
      {
        id: 'buffer',
        title: 'Reinigungspuffer',
        subtitle: 'Zeit zwischen Terminen – automatisch blockiert.',
        steps: [
          {
            title: 'Puffer festlegen',
            icon: 'clean',
            bullets: [
              { title: 'Pufferzeit pro Service konfigurierbar', description: 'z.B. 30 Minuten für Umbau oder 4 Stunden für Reinigung.' },
              { title: 'In Minuten oder Stunden', description: 'In den Service-Einstellungen festlegen.' },
              { title: 'Kunden sehen nur die buchbaren Slots', description: 'Puffer im Hintergrund eingerechnet.' },
            ],
            reverse: false
          },
          {
            title: 'Automatisch blockiert',
            icon: 'lock',
            bullets: [
              { title: 'Blockierung automatisch nach jeder Buchung', description: '10–12 Uhr mit 30min Puffer: nächster Slot ab 12:30 Uhr.' },
              { title: 'Puffer in Verfügbarkeitsberechnung eingerechnet', description: 'Slots werden automatisch angepasst.' },
              { title: 'Kein manueller Kalender-Eintrag nötig', description: 'Alles läuft im Hintergrund.' },
            ],
            reverse: true
          },
        ],
        faq: [
          { question: 'Sehen Kunden den Puffer?', answer: 'Nein, Kunden sehen nur die verfügbaren Zeitslots. Der Puffer ist im Hintergrund eingerechnet.' },
          { question: 'Kann ich verschiedene Puffer pro Service haben?', answer: 'Ja, jeder Service hat seine eigene Pufferzeit-Konfiguration.' },
        ],
      },
      {
        id: 'zeitfenster',
        title: 'Zeitfenster & Buchungsregeln',
        subtitle: 'Gebucht wird nur, wenn du es erlaubst.',
        steps: [
          {
            title: 'Zeitfenster setzen',
            icon: 'calender-days-date',
            bullets: [
              { title: 'Buchbare Zeiten pro Tag und Objekt', description: 'z.B. Mo–Fr 8–18 Uhr oder Sa 9–13 Uhr.' },
              { title: 'Unterschiedliche Fenster pro Wochentag möglich', description: 'Pro Tag individuell konfigurierbar.' },
              { title: 'Außerhalb der Zeiten keine Buchung', description: 'Kunden können nur buchen, wenn Sie es erlauben.' },
            ],
            reverse: false
          },
          {
            title: 'Vorlauf definieren',
            icon: 'clock-check',
            bullets: [
              { title: 'Maximaler Buchungszeitraum (z.B. 3 Monate)', description: 'Wie weit im Voraus können Kunden buchen?' },
              { title: 'Mindestvorlaufzeit (z.B. 24h)', description: 'Keine last-minute Buchungen.' },
              { title: 'Flexible Anpassung an Ihr Geschäftsmodell', description: 'Individuell konfigurierbar.' },
            ],
            reverse: true
          },
        ],
        faq: [
          { question: 'Kann ich verschiedene Zeiten pro Wochentag setzen?', answer: 'Ja, du kannst pro Tag unterschiedliche Zeitfenster konfigurieren.' },
          { question: 'Was ist eine Mindestvorlaufzeit?', answer: 'Die Mindestvorlaufzeit verhindert kurzfristige Buchungen – z. B. mindestens 24 Stunden im Voraus. Slots, die zu kurzfristig sind, werden ausgeblendet.' },
          { question: 'Gelten Zeitfenster pro Objekt oder pro Service?', answer: 'Pro Objekt. Jedes Objekt hat eigene buchbare Tage und Uhrzeiten. Services übernehmen die Verfügbarkeit des zugeordneten Objekts.' },
        ],
      },
      {
        id: 'sperrzeiten',
        title: 'Urlaub & Sperrzeiten',
        subtitle: 'Geschlossen heißt geschlossen – ohne manuelle Slot-Pflege.',
        steps: [
          {
            title: 'Scope wählen',
            icon: 'funnel',
            bullets: [
              { title: 'Workspace = alle Buchungen aus', description: 'Ganzes Business geschlossen.' },
              { title: 'Objekt = nur dieses Objekt blockiert', description: 'z.B. Renovierung einer Wohnung.' },
              { title: 'Mitarbeiter oder Service', description: 'Nur seine Slots oder nur dieser Service blockiert.' },
            ],
            reverse: false
          },
          {
            title: 'Zeitraum festlegen',
            icon: 'calender-days-date',
            bullets: [
              { title: 'Start- und Enddatum verpflichtend', description: 'Zeitraum definieren.' },
              { title: 'Beschreibung optional', description: 'z.B. Betriebsferien, Renovierung.' },
              { title: 'Slots sofort blockiert', description: 'Kunden sehen sie nicht mehr als verfügbar.' },
            ],
            reverse: true
          },
        ],
        faq: [
          { question: 'Kann ich Urlaub für einzelne Objekte setzen?', answer: 'Ja, du wählst den Scope: Ganzes Workspace, Objekt, Mitarbeiter oder Service. So blockierst du nur den Bereich, den du sperren möchtest.' },
          { question: 'Werden bestehende Buchungen beeinflusst?', answer: 'Nein, Urlaub blockiert nur neue Buchungen. Bestehende Buchungen bleiben unverändert.' },
          { question: 'Wird der Urlaub im Widget angezeigt?', answer: 'Nein. Kunden sehen gesperrte Tage einfach nicht als verfügbar. Es erscheint kein Hinweis auf den Grund der Sperrung.' },
        ],
      },
    ],
    relatedFeatures: ['services', 'workspaces', 'buchungen'],
    tags: ['objekte', 'resources', 'availability', 'capacity', 'locations', 'buffer', 'zeitfenster', 'verfuegbarkeit', 'urlaub'],
    faq: [
      { question: 'Wie viele Objekte kann ich anlegen?', answer: 'Objekte verwaltest du innerhalb deiner Workspaces. Welche Workspace-Anzahl du nutzen kannst, hängt von deinem Plan ab.' },
      { question: 'Kann ich Bilder hochladen?', answer: 'Ja. Bilder und Beschreibungen pro Objekt – Kunden sehen sie im Buchungs-Widget.' },
      { question: 'Kann ich buchbare Tage und Zeiten pro Objekt setzen?', answer: 'Ja. Du konfigurierst pro Objekt individuelle Verfügbarkeiten – z. B. Mo–Fr 8–20 Uhr. Außerhalb dieser Zeiten ist nicht buchbar.' },
      { question: 'Was ist ein Reinigungspuffer?', answer: 'Eine konfigurierbare Zeitspanne zwischen Buchungen – z. B. 2 Stunden für Reinigung oder Umbau. Kunden sehen den Puffer nicht, er wird im Hintergrund berechnet.' },
      { question: 'Kann ich Objekte nachträglich bearbeiten?', answer: 'Ja, jederzeit. Du kannst Name, Beschreibung, Kapazität, Bilder und Verfügbarkeiten anpassen. Bestehende Buchungen bleiben unverändert.' },
    ],
  },

  services: {
    slug: 'services',
    meta: { title: 'Service-Konfiguration', description: 'Stunden-, Tages- oder Übernachtungsbuchungen – konfiguriere deine Services flexibel.' },
    hero: {
      headline: 'Stunden, Tage, Nächte – ein System für jeden Buchungstyp.',
      subheadline: 'Konfiguriere Preise, Dauern, Puffer und Regeln pro Service. Ob 30-Minuten-Termin oder Wochenbuchung – BookFast passt sich deinem Angebot an.',
      demoModule: 'services',
      illustration: '/src/svg/illustrations/landingpage/features/ft_service_konfi.svg',
    },
    problem: { text: 'Stundenmiete, Tagesmiete, Übernachtung – jeder Typ braucht eigene Logik. Mit einem starren System biegst du dein Angebot zurecht statt es abzubilden.', bullets: ['Drei Service-Typen: hourly, daily, overnight.', 'Individuelle Preise, Dauern und Zeitfenster.', 'Objekt-, Mitarbeiter- und Addon-Zuordnung pro Service.'] },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So richtest du Services ein',
    interactiveHowItWorksHeadline: 'Service anlegen, Regeln setzen, loslegen.',
    steps: [
      {
        title: 'Service-Typ wählen',
        icon: 'gear',
        bullets: [
          { title: 'Drei Typen: stündlich, täglich, Übernachtung', description: 'Typ bestimmt Buchungslogik und Preisberechnung.' },
          { title: 'Pro Typ eigene Zusatzoptionen', description: 'z.B. Check-in/out bei Übernachtungen oder Mindestbuchungsdauer.' },
          { title: 'Kunden buchen im Widget', description: 'Wie Sie den Typ wählen, so buchen Ihre Kunden.' },
        ],
        reverse: false
      },
      {
        title: 'Preis & Dauer setzen',
        icon: 'receipt-euro',
        bullets: [
          { title: 'Preis pro Einheit und optionale Mindestdauer', description: '€/Stunde, €/Tag oder €/Nacht.' },
          { title: 'Zeitfenster und Regeln pro Service', description: 'Verfügbarkeit aus Objekt-Einstellungen übernommen.' },
          { title: 'Anzahlung, Approval und Puffer individuell einstellbar', description: 'Pro Service separat konfigurierbar.' },
        ],
        reverse: true
      },
      {
        title: 'Zuordnungen',
        icon: 'spark-magic',
        bullets: [
          { title: 'Objekte: mindestens eins pro Service', description: 'Ohne Zuordnung keine Buchung möglich.' },
          { title: 'Mitarbeiter: optional, für Personal-Auswahl', description: 'Kunde wählt beim Buchen einen Mitarbeiter.' },
          { title: 'Add-ons: optionale Extras pro Service', description: 'z.B. Yogamatte oder Beamer.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🧘', title: 'Yoga-Kurse', description: 'Stündliche Sessions mit verschiedenen Trainern.', link: '/features' },
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Overnight mit Check-in/out.', link: '/features' },
    ],
    sections: [
      {
        id: 'overnight',
        title: 'Übernachtungsbuchungen',
        subtitle: 'Check-in/Check-out-Zeiten, Mindestaufenthalt und Reinigungspuffer für Unterkünfte.',
        steps: [
          {
            title: 'Overnight-Service erstellen',
            icon: 'date-cog',
            bullets: [
              { title: 'Service-Typ "Übernachtung" wählen', description: 'Eigene Optionen für Unterkünfte.' },
              { title: 'Check-in/out und Mindestaufenthalt', description: 'Konfigurierbar pro Service.' },
              { title: 'Preis pro Nacht, automatische Berechnung', description: 'Service einem Objekt zuordnen.' },
            ],
            reverse: false
          },
          {
            title: 'Check-in/out & Nachtbuchung',
            icon: 'calender-days-date',
            bullets: [
              { title: 'Check-in und Check-out Zeiten konfigurierbar', description: 'z.B. 15:00 Einchecken, 10:00 Auschecken.' },
              { title: 'Puffer nach Check-out automatisch blockiert', description: 'z.B. 4 Stunden für Reinigung.' },
              { title: 'Kalender-Ansicht mit verfügbaren Nächten', description: 'An- und Abreisedatum wählen.' },
            ],
            reverse: true
          },
        ],
        faq: [
          { question: 'Kann ich verschiedene Preise pro Nacht setzen?', answer: 'Aktuell ein Preis pro Nacht pro Service. Saisonpreise sind in Planung.' },
          { question: 'Wird der Reinigungspuffer nach Check-out berücksichtigt?', answer: 'Ja, du konfigurierst den Buffer der nach dem Check-out automatisch blockiert wird.' },
          { question: 'Kann ich einen Mindestaufenthalt festlegen?', answer: 'Ja. Pro Service legst du die minimale Anzahl an Nächten fest – z. B. mindestens 2 Nächte.' },
        ],
      },
      {
        id: 'addons',
        title: 'Add-ons & Extras',
        subtitle: 'Extras im Checkout – mehr Umsatz pro Buchung.',
        steps: [
          {
            title: 'Add-ons erstellen & zuordnen',
            icon: 'package',
            bullets: [
              { title: 'Name, Beschreibung und Preis pro Einheit', description: 'Klare Angaben steigern die Buchungsrate.' },
              { title: 'Zuordnung pro Service im Detail', description: 'Welches Extra bei welchem Service.' },
              { title: 'Extras erscheinen im Checkout-Schritt', description: 'Kunden wählen optional dazu.' },
            ],
            reverse: false
          },
          {
            title: 'Umsatz steigern',
            icon: 'receipt-euro',
            bullets: [
              { title: 'Mehrpreis automatisch in Rechnung und Zahlung', description: 'Korrekt berechnet und ausgewiesen.' },
              { title: 'Ein Add-on kann vielen Services zugeordnet werden', description: 'z.B. Yogamatte nur bei Yoga-Kursen.' },
              { title: 'Kein manueller Aufwand – alles automatisch', description: 'Einmal eingerichtet, fertig.' },
            ],
            reverse: true
          },
        ],
        faq: [
          { question: 'Werden Add-ons auf der Rechnung angezeigt?', answer: 'Ja, jedes gebuchte Add-on wird als separate Position auf der Rechnung aufgelistet.' },
          { question: 'Kann ein Add-on mehreren Services zugeordnet werden?', answer: 'Ja. Ein Add-on (z. B. Reinigung) kann beliebig vielen Services zugeordnet werden.' },
          { question: 'Werden Add-ons im Preis automatisch berechnet?', answer: 'Ja. Der Gesamtpreis wird inklusive Add-ons automatisch berechnet und an Stripe übergeben.' },
        ],
      },
    ],
    relatedFeatures: ['objekte', 'zahlungen', 'mitarbeiter'],
    tags: ['services', 'pricing', 'duration', 'configuration', 'catalog', 'overnight', 'addons'],
    faq: [
      { question: 'Kann ich verschiedene Preise pro Service haben?', answer: 'Ja, jeder Service hat seinen eigenen Preis.' },
      { question: 'Kann ein Objekt mehrere Services haben?', answer: 'Ja, einem Raum kannst du z.B. Stundenmiete und Tagesmiete zuordnen.' },
      { question: 'Was ist der Unterschied zwischen stündlich, täglich und Übernachtung?', answer: 'Stündlich: Buchung in Stunden-Slots. Täglich: Buchung ganzer Tage. Übernachtung: Check-in/Check-out mit Nachtlogik und optionalem Mindestaufenthalt.' },
      { question: 'Kann ich Add-ons einem Service zuordnen?', answer: 'Ja. Pro Service konfigurierst du optionale Extras, die Kunden im Buchungsprozess dazubuchen können – z. B. Yogamatte oder Beamer.' },
      { question: 'Kann ich Mitarbeiter einem Service zuordnen?', answer: 'Ja. Kunden können beim Buchen einen Mitarbeiter auswählen, wenn du die Mitarbeiter-Zuordnung für den Service aktivierst.' },
    ],
  },
};
