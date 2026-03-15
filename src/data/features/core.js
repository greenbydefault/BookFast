/**
 * Core features: Buchungen, Zahlungen, Rechnungen, Analytics, Objekte, Services
 */
export const core = {
  buchungen: {
    slug: 'buchungen',
    meta: {
      title: 'Webflow Terminbuchung verwalten',
      description: 'Webflow Terminbuchung zentral verwalten: Status, Kalender, Bestätigen und Ablehnen in einem Dashboard.',
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
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Buchungen prüfen und Aufenthalte im Blick behalten.', link: '/features' },
      { icon: '🧘', title: 'Yoga Studios', description: 'Kursplätze und Wartelisten an einem Ort.', link: '/features' },
      { icon: '💇', title: 'Friseure', description: 'Tagesübersicht pro Mitarbeiter, ohne Tabellen-Chaos.', link: '/features' },
    ],
    relatedFeatures: ['zahlungen', 'analytics', 'approval', 'kundenportal'],
    tags: ['buchungen', 'workflow', 'status', 'calendar', 'operations'],
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
    relatedFeatures: ['rechnungen', 'buchungen', 'kaution'],
    tags: ['zahlungen', 'stripe', 'checkout', 'deposit', 'refund'],
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
      subheadline: 'Nach Bestätigung oder Abschluss wird die Rechnung automatisch erstellt – mit allen Positionen, Add-ons und deinen Firmendaten. Das Feature, das andere Buchungstools nicht haben.',
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
    relatedFeatures: ['zahlungen', 'buchungen', 'kunden'],
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
      illustration: '/src/svg/illustrations/empty-state-analytics.svg',
    },
    problem: {
      text: 'Andere Buchungstools zeigen dir Buchungszahlen. Aber nicht, warum 70% deiner Besucher den Checkout nicht abschließen.',
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
      { icon: '🌍', title: 'Zielgruppe verstehen', description: 'Browser, Geräte, Länder und Städte deiner Besucher.', link: '/features/kunden' },
    ],
    relatedFeatures: ['buchungen', 'zahlungen', 'integration'],
    tags: ['analytics', 'tracking', 'reports', 'conversion', 'insights'],
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
    relatedFeatures: ['services', 'verfuegbarkeit', 'buffer'],
    tags: ['objekte', 'resources', 'availability', 'capacity', 'locations'],
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
    relatedFeatures: ['objekte', 'overnight', 'zeitfenster'],
    tags: ['services', 'pricing', 'duration', 'configuration', 'catalog'],
    faq: [
      { question: 'Kann ich verschiedene Preise pro Service haben?', answer: 'Ja, jeder Service hat seinen eigenen Preis.' },
      { question: 'Kann ein Objekt mehrere Services haben?', answer: 'Ja, einem Raum kannst du z.B. Stundenmiete und Tagesmiete zuordnen.' },
      { question: 'Was ist der Unterschied zwischen stündlich, täglich und Übernachtung?', answer: 'Stündlich: Buchung in Stunden-Slots. Täglich: Buchung ganzer Tage. Übernachtung: Check-in/Check-out mit Nachtlogik und optionalem Mindestaufenthalt.' },
      { question: 'Kann ich Add-ons einem Service zuordnen?', answer: 'Ja. Pro Service konfigurierst du optionale Extras, die Kunden im Buchungsprozess dazubuchen können – z. B. Yogamatte oder Beamer.' },
      { question: 'Kann ich Mitarbeiter einem Service zuordnen?', answer: 'Ja. Kunden können beim Buchen einen Mitarbeiter auswählen, wenn du die Mitarbeiter-Zuordnung für den Service aktivierst.' },
    ],
  },
};
