/**
 * Feature Pages Configuration
 * Each entry drives the FeaturePageTemplate.
 * Add new features here – no code changes needed.
 */

export const featurePages = {
  buchungen: {
    slug: 'buchungen',
    meta: {
      title: 'Buchungsverwaltung',
      description: 'Alle Buchungen zentral – Status, Kalender, Bestätigen und Ablehnen in einem Dashboard. Ohne E-Mail-Chaos.',
    },
    hero: {
      headline: 'Buchungen zentral – ohne E-Mail-Chaos.',
      subheadline: 'Organisiere alle Buchungen in einem klaren Ablauf – Status-Filter, Kalender und Listenansicht. Bestätigen, ablehnen, stornieren – alles an einem Ort.',
    },
    problem: {
      text: 'Buchungen über E-Mail, Telefon und verschiedene Tools zu verwalten kostet Zeit und führt zu Fehlern. Ohne zentrale Übersicht verpasst du Anfragen.',
      bullets: [
        'Zentrale Übersicht mit Echtzeit-Status – keine verpassten Anfragen.',
        'Filter nach Status: Wartend, Bestätigt, Abgeschlossen, Abgelehnt.',
        'Kalender- und Listenansicht – für jeden Workflow die passende Ansicht.',
      ],
    },
    journey: [
      { title: 'Buchung eingeht', description: 'Buchungen kommen über das Widget oder du legst sie manuell an. Status-Filter, Kalender und Listenansicht – alles an einem Ort.', bullets: ['Widget-Buchungen und manuelle Buchungen', 'Filter nach Status', 'Kalender- und Listenansicht'], reverse: false },
      { title: 'Manuelle Buchung & Magic Link', description: 'Bei manuell angelegten Buchungen wird automatisch eine Bestätigungsmail mit Magic Link versendet. Der Kunde zahlt im Portal oder sieht Rechnung und Buchungsdetails – kein manueller Versand nötig.', bullets: ['Magic Link automatisch mit E-Mail', 'Kunde zahlt im Portal oder sieht Rechnung', 'Kein manueller Versand nötig'], reverse: true },
      { title: 'Prüfen & Bestätigen', description: 'Du prüfst jede Anfrage und bestätigst oder lehnst ab. Bei Ablehnung wird automatisch rückerstattet. Nach dem Termin wird die Buchung als abgeschlossen markiert.', bullets: ['Bestätigen oder ablehnen', 'Automatische Rückerstattung bei Ablehnung', 'Automatisch abschließen nach Termin'], reverse: false },
    ],
    steps: [
      { title: 'Buchung eingeht', description: 'Kunde bucht über dein Widget oder du legst manuell an. Status: Wartend.' },
      { title: 'Prüfen & Bestätigen', description: 'Du prüfst die Anfrage und bestätigst oder lehnst ab.' },
      { title: 'Automatisch abschließen', description: 'Nach dem Termin wird die Buchung als abgeschlossen markiert.' },
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Buchungen prüfen und Aufenthalte im Blick behalten.', link: '/features' },
      { icon: '🧘', title: 'Yoga Studios', description: 'Kursplätze und Wartelisten an einem Ort.', link: '/features' },
      { icon: '💇', title: 'Friseure', description: 'Tagesübersicht pro Mitarbeiter, ohne Tabellen-Chaos.', link: '/features' },
    ],
    relatedFeatures: ['zahlungen', 'analytics', 'approval', 'kundenportal'],
    cta: {
      headline: 'Buchungsverwaltung kostenlos testen.',
      primaryCTA: 'Kostenlos starten',
    },
    faq: [
      { question: 'Kann ich Buchungen manuell anlegen?', answer: 'Ja, im Dashboard legst du Buchungen manuell an. Die Bestätigungsmail mit Magic Link zum Kundenportal wird automatisch versendet – der Kunde kann dort zahlen oder die Rechnung einsehen.' },
      { question: 'Was passiert bei einer Ablehnung?', answer: 'Bei bezahlten Buchungen löst BookFast automatisch eine Rückerstattung über Stripe aus. Der Kunde wird per E-Mail informiert.' },
      { question: 'Gibt es eine Kalenderansicht?', answer: 'Ja, du schaltest zwischen Kalender- und Listenansicht um.' },
      { question: 'Kann ich nach Kunden oder Services filtern?', answer: 'Ja, die Buchungsübersicht filtert nach Kunde, Service, Objekt und Datum.' },
    ],
  },

  zahlungen: {
    slug: 'zahlungen',
    meta: {
      title: 'Online-Zahlungen',
      description: 'Stripe Connect, Anzahlungen, automatische Rückerstattungen. Zahlung vor Termin – ohne Provision.',
    },
    hero: {
      headline: 'Zahlung vor Termin – automatisch.',
      subheadline: 'Stripe Connect in unter 5 Minuten eingerichtet. Kunden zahlen direkt, das Geld geht auf dein Konto.',
    },
    problem: {
      text: 'Ohne Vorauszahlung steigt die No-Show-Rate. Manuelle Rechnungen und Überweisungen kosten Zeit. Provision pro Buchung frisst die Marge.',
      bullets: [
        'Stripe Connect Onboarding in 3 Schritten.',
        'Anzahlungen konfigurierbar (z.B. 30% bei Buchung).',
        'Automatische Rückerstattung bei Ablehnung.',
      ],
    },
    steps: [
      {
        title: 'Stripe verbinden',
        description: 'In den Einstellungen unter "Integration" startest du das Stripe Connect Onboarding. Du erstellst oder verbindest dein Stripe-Konto, gibst deine Geschäftsdaten ein und wirst verifiziert – das dauert in der Regel unter 5 Minuten. BookFast erhebt keine Provision, du zahlst nur die üblichen Stripe-Transaktionsgebühren.',
        bullets: ['Link zum Onboarding in den BookFast-Einstellungen', 'Konto erstellen oder verbinden – gleicher Ablauf wie bei Stripe direkt', 'Nach Verifizierung sofort einsatzbereit'],
        reverse: false
      },
      {
        title: 'Anzahlung konfigurieren',
        description: 'Pro Service legst du fest, ob und wie viel Anzahlung du willst. Du kannst einen Prozentsatz (z.B. 30%) oder einen Festbetrag setzen. Der Kunde zahlt den Betrag direkt bei Buchung, den Rest zahlst du bei Termin oder nach Abschluss ein. Ohne manuelle Nachverfolgung.',
        bullets: ['Einstellung pro Service unter "Services" → Detail', 'Prozent oder Festbetrag – je nach Bedarf', 'Automatische Berechnung im Checkout'],
        reverse: true
      },
      {
        title: 'Geld erhalten',
        description: 'Sobald du eine Buchung bestätigst oder sie abgeschlossen wird, löst Stripe die Auszahlung aus. In der Regel landen die Beträge innerhalb von 24 Stunden auf deinem hinterlegten Bankkonto. Bei Ablehnung wird automatisch rückerstattet – ohne manuellen Aufwand.',
        bullets: ['Auszahlung 24h nach Bestätigung', 'Rückerstattung bei Ablehnung automatisch', 'Übersicht aller Zahlungen im Dashboard'],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: '30% Anzahlung bei Buchung, Rest bei Check-in.', link: '/features' },
      { icon: '🎨', title: 'Tattoo-Studios', description: 'Anzahlung sichert den Termin, weniger No-Shows.', link: '/features' },
      { icon: '🔐', title: 'Escape Rooms', description: 'Volle Zahlung bei Buchung. Kein Aufwand am Tag.', link: '/features' },
    ],
    relatedFeatures: ['rechnungen', 'buchungen', 'kaution'],
    faq: [
      { question: 'Welche Zahlungsmethoden werden unterstützt?', answer: 'Aktuell Kreditkarte (Visa, Mastercard, Amex) über Stripe. Klarna und PayPal sind in Planung.' },
      { question: 'Gibt es eine Provision pro Buchung?', answer: 'Nein. BookFast erhebt keine Provision. Du zahlst nur die Stripe-Transaktionsgebühren (1,4% + 0,25€ in Europa).' },
      { question: 'Wie funktioniert die Anzahlung?', answer: 'Du konfigurierst pro Service einen Prozentsatz (z.B. 30%). Der Kunde zahlt den Betrag bei Buchung, den Rest bei Termin.' },
      { question: 'Was passiert bei Stornierung?', answer: 'Bei Ablehnung durch dich wird automatisch rückerstattet. Bei Kundenstornierung greift deine Stornierungspolicy.' },
    ],
  },

  rechnungen: {
    slug: 'rechnungen',
    meta: {
      title: 'Automatische Rechnungen',
      description: 'Automatische Rechnungsgenerierung nach Bestätigung oder Abschluss – das Feature, das anderen fehlt.',
    },
    hero: {
      headline: 'Rechnungen? Erledigt. Automatisch.',
      subheadline: 'Nach Bestätigung oder Abschluss einer Buchung wird die Rechnung automatisch generiert. Das Feature, das andere Buchungssysteme nicht haben.',
    },
    problem: {
      text: 'Manuelle Rechnungserstellung nach jeder Buchung kostet Stunden pro Woche. Fehler schleichen sich ein, Kunden warten.',
      bullets: [
        'Automatische Generierung nach Bestätigung oder Abschluss.',
        'Alle Buchungsdetails, Add-ons und Rabatte korrekt aufgelistet.',
        'Firmendaten und Steuernummern aus deinen Einstellungen.',
      ],
    },
    journey: [
      { title: 'Automatisch bei Bestätigung', description: 'Sobald du eine Buchung bestätigst oder sie abgeschlossen wird, wird die Rechnung automatisch erstellt. Firmendaten, Steuernummer und Bankverbindung legst du einmalig in den Einstellungen fest.', bullets: ['Rechnung entsteht mit Bestätigung', 'Firmendaten einmal hinterlegen', 'Add-ons und Gutscheine korrekt aufgeführt'], reverse: false },
      { title: 'Im Kundenportal', description: 'Der Kunde erhält per Magic Link Zugang zum Kundenportal. Dort kann er die Rechnung ansehen, als PDF herunterladen und bei Bedarf direkt online bezahlen – ohne Rückfragen.', bullets: ['Rechnung ansehen und PDF herunterladen', '"Jetzt bezahlen" bei offenen Beträgen', 'Kein manueller E-Mail-Versand nötig'], reverse: true },
      { title: 'Im Dashboard & Download', description: 'Im Buchungsdetail siehst du die Rechnung, kannst sie als PDF herunterladen und bei Bedarf per E-Mail verschicken. Alles an einem Ort.', bullets: ['Rechnung im Buchungsdetail', 'PDF-Download', 'Per E-Mail an Kunden senden'], reverse: false },
    ],
    steps: [
      { title: 'Firmendaten einmal hinterlegen', description: 'Firmenname, Steuernummer, Bankverbindung – einmalig in den Einstellungen.' },
      { title: 'Buchung bestätigen', description: 'Bei Bestätigung oder Abschluss wird die Rechnung automatisch erstellt.' },
      { title: 'Rechnung versenden', description: 'Automatischer Versand per E-Mail an den Kunden.' },
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Rechnung mit Übernachtungen, Reinigungsgebühr und Extras.', link: '/features' },
      { icon: '💼', title: 'Coworking', description: 'Monatliche Rechnung für gebuchte Räume und Stunden.', link: '/features' },
      { icon: '🏥', title: 'Therapeuten', description: 'Rechnung pro Behandlung mit Steuernummer.', link: '/features' },
    ],
    relatedFeatures: ['zahlungen', 'buchungen', 'kunden'],
    faq: [
      { question: 'Kann ich das Rechnungsdesign anpassen?', answer: 'Die Rechnung enthält automatisch deine Firmendaten und das BookFast-Standard-Layout. Custom-Templates sind für die Enterprise-Version geplant.' },
      { question: 'Werden Gutscheine auf der Rechnung berücksichtigt?', answer: 'Ja, eingelöste Gutscheine und deren Rabatt werden korrekt auf der Rechnung ausgewiesen.' },
      { question: 'In welchem Format wird die Rechnung erstellt?', answer: 'Als PDF, die automatisch per E-Mail an den Kunden gesendet wird.' },
      { question: 'Kann ich Rechnungsnummern konfigurieren?', answer: 'Die Rechnungsnummern werden fortlaufend generiert. Custom-Formate sind in Planung.' },
    ],
  },

  analytics: {
    slug: 'analytics',
    meta: {
      title: 'Analytics & Insights',
      description: 'Conversion-Funnel, Drop-off-Raten, Traffic-Daten und Zahlungs-Statistiken – Daten die andere Booking-Tools nicht zeigen.',
    },
    hero: {
      headline: 'Conversion-Daten, die andere nicht zeigen.',
      subheadline: 'Funnel-Analyse, Drop-off-Raten, Traffic-Statistiken und Payment-Tracking – verstehe wo Kunden abspringen.',
    },
    problem: {
      text: 'Die meisten Buchungssysteme zeigen dir nur die Anzahl der Buchungen. Aber wo springen Kunden ab? Welche Services konvertieren am besten?',
      bullets: [
        'Conversion-Funnel: Widget geladen → Buchung gestartet → Checkout → Zahlung.',
        'Drop-off-Analyse zeigt, wo Kunden abspringen.',
        'Traffic-Daten: Browser, Geräte, Länder, Städte.',
      ],
    },
    steps: [
      {
        title: 'Widget einbetten',
        description: 'Sobald du das BookFast-Widget auf deiner Website oder in Webflow einbettest, werden automatisch Daten erfasst: Widget-Aufrufe, Buchungsstarts, Checkouts und Zahlungen. Du musst nichts weiter konfigurieren – das Tracking startet mit dem ersten Aufruf.',
        bullets: ['Tracking startet automatisch mit Widget-Einbindung', 'Keine zusätzliche Konfiguration nötig', 'DSGVO-konform, keine externen Cookies'],
        reverse: false
      },
      {
        title: 'Insights öffnen',
        description: 'Im Dashboard navigierst du zu "Insights". Dort siehst du den Conversion-Funnel (Widget geladen → Buchung gestartet → Checkout → Zahlung), Drop-off-Raten an jeder Stelle, Traffic-Daten (Browser, Geräte, Länder, Städte) und Payment-Statistiken. Du kannst verschiedene Zeiträume vergleichen.',
        bullets: ['Funnel-Visualisierung zeigt jeden Schritt', 'Drop-off-Analyse identifiziert Schwachstellen', 'Traffic- und Payment-Metriken auf einen Blick'],
        reverse: true
      },
      {
        title: 'Optimieren',
        description: 'Nutze die Daten, um Engpässe zu finden: Wo springen die meisten Kunden ab? Welche Services konvertieren am besten? Mit diesen Erkenntnissen passt du dein Angebot, deine Preise oder deinen Buchungsflow an und steigerst die Conversion – datenbasiert statt Bauchgefühl.',
        bullets: ['Engpässe im Funnel gezielt angehen', 'A/B-Tests oder Anpassungen priorisieren', 'Mit Vergleichszeiträumen Fortschritt messen'],
        reverse: false
      }
    ],
    useCases: [
      { icon: '📈', title: 'Conversion optimieren', description: 'Finde heraus, wo Kunden im Buchungsprozess abspringen.', link: '/features/buchungen' },
      { icon: '💰', title: 'Revenue tracken', description: 'Verfolge Umsatz, Zahlungserfolgsrate und Refunds.', link: '/features/zahlungen' },
      { icon: '🌍', title: 'Zielgruppe verstehen', description: 'Browser, Geräte, Länder und Städte deiner Besucher.', link: '/features/kunden' },
    ],
    relatedFeatures: ['buchungen', 'zahlungen', 'integration'],
    faq: [
      { question: 'Werden die Daten in Echtzeit angezeigt?', answer: 'Ja, Analytics-Daten werden in Echtzeit erfasst und im Dashboard angezeigt.' },
      { question: 'Welche Zeiträume kann ich auswählen?', answer: 'Letzter Monat, letzte 3, 6 oder 12 Monate. Mit Vergleichswerten zum vorherigen Zeitraum.' },
      { question: 'Brauche ich ein externes Analytics-Tool?', answer: 'Nein, BookFast hat eigene Analytics. Du kannst aber weiterhin Google Analytics oder Plausible parallel nutzen.' },
      { question: 'Welche Daten werden erfasst?', answer: 'Widget-Aufrufe, Buchungsstarts, Checkouts, Zahlungen, Browser, OS, Geräte, Länder und Städte. Alles DSGVO-konform.' },
    ],
  },

  // ── Teil 7: Restliche 14 Feature-Seiten ──────────────

  objekte: {
    slug: 'objekte',
    meta: { title: 'Objektverwaltung', description: 'Räume, Wohnungen, Studios – verwalte alle buchbaren Objekte mit Kapazität, Bildern und Verfügbarkeiten.' },
    hero: { headline: 'Deine Objekte. Klar organisiert.', subheadline: 'Erstelle Räume, Wohnungen oder Plätze mit Kapazität, buchbaren Tagen und individuellen Einstellungen.' },
    problem: { text: 'Ohne zentrale Objektverwaltung verlierst du den Überblick. Jedes Objekt hat eigene Regeln, Kapazitäten und Verfügbarkeiten.', bullets: ['Kapazität und buchbare Tage pro Objekt konfigurieren.', 'Buchungsfenster: Wie weit im Voraus können Kunden buchen?', 'Reinigungspuffer zwischen Buchungen.'] },
    steps: [
      {
        title: 'Objekt erstellen',
        description: 'Im Dashboard unter "Objekte" legst du jedes buchbare Objekt an: Raum, Wohnung, Studio oder Platz. Du vergibst einen Namen, eine Beschreibung, die Kapazität (z.B. Anzahl Personen) und lädst Bilder hoch. Diese Infos sehen Kunden später im Buchungs-Widget. Je klarer die Beschreibung, desto weniger Rückfragen.',
        bullets: ['Name, Beschreibung und Kapazität Pflicht', 'Bilder helfen bei der Auswahl', 'Pro Objekt individuelle Einstellungen möglich'],
        reverse: false
      },
      {
        title: 'Verfügbarkeit setzen',
        description: 'Pro Objekt konfigurierst du die buchbaren Tage (z.B. Mo–Fr) und Zeitfenster (z.B. 8–20 Uhr). Außerdem das Buchungsfenster: Wie weit im Voraus können Kunden buchen? Optional legst du einen Reinigungspuffer fest – die Zeit zwischen zwei Buchungen, in der nicht gebucht werden kann.',
        bullets: ['Buchbare Tage und Uhrzeiten pro Objekt', 'Buchungsfenster: z.B. maximal 3 Monate im Voraus', 'Puffer zwischen Buchungen für Reinigung oder Umbau'],
        reverse: true
      },
      {
        title: 'Services zuordnen',
        description: 'Jedes Objekt braucht mindestens einen Service – z.B. Stundenmiete, Tagesmiete oder Übernachtung. Du ordnest im Objekt-Detail die passenden Services zu. Ein Objekt kann mehrere Services haben: z.B. ein Raum mit Stunden- und Tagesmiete. Ohne Zuordnung kann das Objekt nicht gebucht werden.',
        bullets: ['Services unter Objekt-Detail zuordnen', 'Ein Objekt kann mehrere Services haben', 'Ohne Zuordnung keine Buchung möglich'],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Jede Wohnung als eigenes Objekt.', link: '/features' },
      { icon: '💼', title: 'Coworking', description: 'Räume und Schreibtische verwalten.', link: '/features' },
    ],
    relatedFeatures: ['services', 'verfuegbarkeit', 'buffer'],
    faq: [
      { question: 'Wie viele Objekte kann ich anlegen?', answer: 'Im Free-Plan 1 Objekt, in Pro und Enterprise unbegrenzt.' },
      { question: 'Kann ich Bilder hochladen?', answer: 'Ja, du kannst Bilder und Beschreibungen für jedes Objekt hinterlegen.' },
    ],
  },

  services: {
    slug: 'services',
    meta: { title: 'Service-Konfiguration', description: 'Stunden-, Tages- oder Übernachtungsbuchungen – konfiguriere deine Services flexibel.' },
    hero: { headline: 'Flexibel buchbar. Jeder Service-Typ.', subheadline: 'Stundenmiete, Tagesmiete oder Übernachtung – konfiguriere Preise, Dauern und Regeln pro Service.' },
    problem: { text: 'Nicht jeder Service funktioniert gleich. Manche sind stundenbasiert, andere tageweise, andere über Nacht. Ein starres System passt nicht.', bullets: ['Drei Service-Typen: hourly, daily, overnight.', 'Individuelle Preise, Dauern und Zeitfenster.', 'Objekt-, Mitarbeiter- und Addon-Zuordnung pro Service.'] },
    steps: [
      {
        title: 'Service-Typ wählen',
        description: 'Beim Anlegen eines Services wählst du den Typ: Stundenmiete (hourly), Tagesmiete (daily) oder Übernachtung (overnight). Jeder Typ hat eigene Optionen – z.B. Check-in/out bei Übernachtungen oder Mindestbuchungsdauer bei Stunden. Das bestimmt, wie Kunden im Widget buchen und wie der Preis berechnet wird.',
        bullets: ['Drei Typen: stündlich, täglich, Übernachtung', 'Typ bestimmt Buchungslogik und Preisberechnung', 'Pro Typ eigene Zusatzoptionen'],
        reverse: false
      },
      {
        title: 'Preis & Dauer setzen',
        description: 'Du legst den Preis pro Einheit fest (z.B. €/Stunde, €/Tag, €/Nacht), optional eine Mindestbuchungsdauer und Zeitfenster. Die Verfügbarkeit wird automatisch aus den Objekt-Einstellungen übernommen. Du kannst pro Service auch Anzahlung, Approval-Flow oder Puffer separat konfigurieren.',
        bullets: ['Preis pro Einheit und optionale Mindestdauer', 'Zeitfenster und Regeln pro Service', 'Anzahlung, Approval und Puffer individuell einstellbar'],
        reverse: true
      },
      {
        title: 'Zuordnungen',
        description: 'Jeder Service muss mindestens einem Objekt zugeordnet werden – nur so können Kunden den Service buchen. Optional ordnest du Mitarbeiter zu (dann wählt der Kunde beim Buchen einen Mitarbeiter) und Add-ons (Extras wie Yogamatte oder Beamer). Die Zuordnungen erfolgen im Service-Detail unter den jeweiligen Tabs.',
        bullets: ['Objekte: mindestens eins pro Service', 'Mitarbeiter: optional, für Personal-Auswahl', 'Add-ons: optionale Extras pro Service'],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🧘', title: 'Yoga-Kurse', description: 'Stündliche Sessions mit verschiedenen Trainern.', link: '/features' },
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Overnight mit Check-in/out.', link: '/features' },
    ],
    relatedFeatures: ['objekte', 'overnight', 'zeitfenster'],
    faq: [
      { question: 'Kann ich verschiedene Preise pro Service haben?', answer: 'Ja, jeder Service hat seinen eigenen Preis.' },
      { question: 'Kann ein Objekt mehrere Services haben?', answer: 'Ja, einem Raum kannst du z.B. Stundenmiete und Tagesmiete zuordnen.' },
    ],
  },

  integration: {
    slug: 'integration',
    meta: { title: 'Webflow-Integration', description: 'Embed-Script oder Template-Copy – BookFast lebt nativ in deiner Webflow-Seite.' },
    hero: { headline: 'Native Webflow-Integration.', subheadline: 'Ein Script-Tag oder Template-Copy – dein Booking-Widget lebt in deiner Webflow-Seite, nicht in einem iFrame.' },
    problem: { text: 'iFrames passen nie zum Design. Externe Redirects kosten Conversion. Du brauchst eine native Lösung.', bullets: ['Embed-Script: Ein Tag in den Body, fertig.', 'Template-Copy: Widget in den Webflow Designer importieren.', 'Datenattribute statt iFrame – volle Design-Kontrolle.'] },
    steps: [
      {
        title: 'Methode wählen',
        description: 'BookFast bietet zwei Wege: Das Embed-Script ist der schnellste – du kopierst ein Script-Tag in den Body deiner Seite, und das Widget erscheint automatisch. Mit Template-Copy importierst du den kompletten Booking-Flow in den Webflow Designer und hast maximale Kontrolle über Layout und Styling. Beide funktionieren ohne iFrame.',
        bullets: ['Embed-Script: ein Tag, fertig – funktioniert auf jeder Website', 'Template-Copy: für Webflow, volle Design-Kontrolle', 'Kein iFrame – natives Einbetten'],
        reverse: false
      },
      {
        title: 'Code einbetten',
        description: 'Für Embed: Den Script-Tag aus den BookFast-Einstellungen kopieren und in den Body deiner HTML-Seite oder in Webflow (Custom Code, vor </body>) einfügen. Für Template-Copy: Das Export-Template in Webflow importieren. Das Widget wird asynchron geladen und beeinflusst die Ladezeit kaum.',
        bullets: ['Script-Tag in Body oder Webflow Custom Code', 'Template-Copy: Import im Webflow Designer', 'Asynchrones Laden, minimaler Performance-Impact'],
        reverse: true
      },
      {
        title: 'Anpassen',
        description: 'Mit Datenattributen steuerst du, was im Widget angezeigt wird: z.B. welcher Workspace, welche Objekte oder Services. Du setzt data-bookfast-workspace, data-bookfast-objects und weitere Attribute auf dem Container-Element. Das Widget übernimmt deine Webflow-Styles automatisch – es lebt in deiner Seite, nicht in einem fremden iFrame.',
        bullets: ['Datenattribute für Workspace, Objekte, Services', 'Design wird von deiner Seite übernommen', 'Keine separaten Widget-Styles nötig'],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🌐', title: 'Webflow-Designer', description: 'Für Agenturen und Freelancer die Kunden-Projekte bauen.', link: '/produkt' },
    ],
    relatedFeatures: ['buchungen', 'zahlungen', 'workspaces'],
    faq: [
      { question: 'Funktioniert es nur mit Webflow?', answer: 'Nein, das Embed-Script funktioniert auf jeder Website. Template-Copy ist Webflow-exklusiv.' },
      { question: 'Beeinflusst es die Ladezeit?', answer: 'Minimal. Das Script wird asynchron geladen und hat keinen Einfluss auf die Core Web Vitals.' },
    ],
  },

  kundenportal: {
    slug: 'kundenportal',
    meta: {
      title: 'Kundenportal',
      description: 'Magic Link für Rechnung, Zahlung und Stornierung. Buchen und verwalten ohne Konto – weniger Friction, mehr Conversion.',
    },
    hero: {
      headline: 'Buchen ohne Anmeldung. Verwalten per Magic Link.',
      subheadline: 'Deine Kunden buchen direkt im Widget. Ein Link pro Buchung – einsehen, bezahlen, stornieren. Weniger Aufwand für dich.',
      trustClaims: ['Keine Kreditkarte nötig', 'In unter 5 Minuten startklar'],
    },
    problem: {
      text: 'Registrierung und Kundenkonto bremsen: Viele brechen ab. Deine Kunden brauchen trotzdem Zugang zu Buchung, Rechnung und Stornierung – am besten ohne erneutes Einloggen.',
      bullets: [
        'Direkt buchen, direkt verwalten – kein Konto nötig.',
        'Magic Link pro Buchung – einsehen, bezahlen, stornieren.',
        'Weniger Friction, weniger Abbrüche, mehr Buchungen.',
      ],
    },
    journey: [
      { title: 'Buchen ohne Hürden', description: 'Deine Kunden buchen direkt über das Widget. Keine Passwort-Eingabe, keine Konto-Hürde. Weniger Reibung = mehr Abschlüsse.', bullets: ['Direkter Buchungsabschluss im Widget', 'Keine Konto-Pflicht für deine Kunden', 'Mehr Abschlüsse durch weniger Friction'], reverse: false },
      { title: 'Magic Link – alles einsehen & verwalten', description: 'Jede Buchung erhält einen persönlichen Link. Dein Kunde öffnet ihn per E-Mail, gibt die PIN ein – sieht Buchung, Rechnung, zahlt oder storniert. Weniger Support-Anfragen für dich.', bullets: ['Magic Link pro Buchung mit PIN-Schutz', 'Rechnung ansehen, PDF laden, online bezahlen', 'Stornieren – Self-Service für deine Kunden'], reverse: true },
      { title: 'Mehrwert für Kunde und Anbieter', description: 'Deine Kunden haben Kontrolle ohne Aufwand. Du sparst Zeit – keine Passwort-Mails, keine Konto-Verwaltung. Einzigartiger Link + PIN pro Buchung.', bullets: ['Selbstbedienung für deine Kunden', 'Weniger Support, mehr Buchungen', 'Einzigartiger Link + PIN pro Buchung'], reverse: false },
    ],
    steps: [
      { title: 'Kunde bucht', description: 'Direkt über das Widget auf deiner Website.' },
      { title: 'Magic Link per E-Mail', description: 'Automatisch mit Bestätigung – oder bei manuell angelegter Buchung.' },
      { title: 'Portal öffnen & handeln', description: 'PIN eingeben – Rechnung sehen, PDF laden, zahlen oder stornieren.' },
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Deine Gäste buchen und zahlen direkt – Rechnung und Stornierung im Portal.', link: '/features' },
      { icon: '💇', title: 'Friseure & Salons', description: 'Termin direkt buchbar – Rechnung und Stornierung über den Magic Link.', link: '/features' },
    ],
    relatedFeatures: ['rechnungen', 'buchungen', 'zahlungen'],
    cta: {
      headline: 'Kundenportal kostenlos testen.',
      primaryCTA: 'Kostenlos starten',
      subheadline: '3 Tage kostenlos testen. Keine Kreditkarte nötig. In unter 5 Minuten startklar.',
    },
    faq: [
      { question: 'Müssen sich deine Kunden registrieren?', answer: 'Nein. Weder zum Buchen noch zum Einsehen der Buchung. Der Magic Link mit PIN reicht.' },
      { question: 'Wird der Link automatisch verschickt?', answer: 'Ja, bei Bestätigung einer Buchung und bei manuell angelegten Buchungen (wenn aktiviert) verschickt BookFast den Magic Link per E-Mail.' },
      { question: 'Kann der Kunde auch bezahlen?', answer: 'Ja, bei unbezahlten Buchungen erscheint ein „Jetzt bezahlen“-Button. Die Zahlung läuft über Stripe.' },
      { question: 'Wie ist der Zugang geschützt?', answer: 'Jeder Link ist einzigartig pro Buchung. Zusätzlich ist der Zugang per PIN geschützt – nur wer beides hat, kommt ins Portal.' },
    ],
  },

  mitarbeiter: {
    slug: 'mitarbeiter',
    meta: {
      title: 'Mitarbeiterverwaltung',
      description: 'Deine Kunden wählen den passenden Mitarbeiter bei der Buchung. Profile anlegen, Services zuordnen – Verfügbarkeit automatisch sichtbar.',
    },
    hero: {
      headline: 'Team-Buchungen leicht gemacht.',
      subheadline: 'Leg Profile mit Bild und Name an, ordne sie Services zu. Deine Kunden wählen direkt beim Buchen – der richtige Mitarbeiter, der richtige Slot.',
      trustClaims: ['Keine Kreditkarte nötig', 'In unter 5 Minuten startklar'],
    },
    problem: {
      text: 'Ohne klare Zuordnung weiß niemand, wer wann verfügbar ist. Terminplanung wird zum Chaos.',
      bullets: [
        'Profile mit Bild und Name – deine Kunden sehen, wen sie buchen.',
        'Services pro Mitarbeiter – jeder bietet nur das an, was er kann.',
        'Verfügbarkeit automatisch abgeleitet – keine doppelten Kalender.',
      ],
    },
    steps: [
      {
        title: 'Team anlegen',
        description: 'Im Dashboard unter "Mitarbeiter" legst du jedes Teammitglied an: Name, optional Bild und Profil. Einmal angelegt, ordnest du die Person den passenden Services zu. Deine Kunden sehen später im Buchungs-Widget, wen sie buchen – z.B. ihren Lieblingsfriseur oder den passenden Therapeuten.',
        bullets: ['Name und optional Bild pro Mitarbeiter', 'Profile im Dashboard pflegen', 'Unbegrenzt viele Mitarbeiter in Pro und Enterprise'],
        reverse: false
      },
      {
        title: 'Services zuordnen',
        description: 'Pro Mitarbeiter ordnest du die Services zu, die angeboten werden. Ein Friseur bietet vielleicht Schnitt und Bart an, ein anderer nur Färben. Die Zuordnung erfolgt im Mitarbeiter-Detail unter "Services". Ohne Zuordnung wird der Mitarbeiter im Widget nicht angezeigt.',
        bullets: ['Services pro Mitarbeiter im Detail zuordnen', 'Ein Mitarbeiter kann mehrere Services anbieten', 'Deine Kunden sehen nur Mitarbeiter mit passenden Services'],
        reverse: true
      },
      {
        title: 'Deine Kunden buchen',
        description: 'Sobald Mitarbeiter angelegt und Services zugeordnet sind, erscheinen sie im Buchungs-Widget. Deine Kunden wählen zuerst den gewünschten Mitarbeiter (oder "egal") und dann einen verfügbaren Zeitslot. Die Verfügbarkeit wird aus den Objekt- und Zeit-Einstellungen abgeleitet – kein zusätzlicher Aufwand.',
        bullets: ['Mitarbeiter-Auswahl im Widget sichtbar', 'Slots pro Mitarbeiter angezeigt', 'Alles automatisch – keine manuellen Kalendereinträge'],
        reverse: false
      }
    ],
    useCases: [
      { icon: '💇', title: 'Friseure', description: 'Deine Kunden buchen ihren Lieblingsfriseur direkt.', link: '/features' },
      { icon: '🧘', title: 'Yoga Studios', description: 'Trainer-Auswahl pro Kurstyp für deine Kunden.', link: '/features' },
      { icon: '🏥', title: 'Physiotherapie', description: 'Therapeuten-Buchung mit Fachgebiet – klare Zuordnung.', link: '/features' },
    ],
    relatedFeatures: ['buchungen', 'zeitfenster', 'services'],
    cta: {
      subheadline: '3 Tage kostenlos testen. Keine Kreditkarte nötig. In unter 5 Minuten startklar.',
    },
    faq: [
      { question: 'Wie viele Mitarbeiter kann ich anlegen?', answer: 'Unbegrenzt in Pro und Enterprise.' },
      { question: 'Können Mitarbeiter eigene Verfügbarkeiten haben?', answer: 'Aktuell werden Verfügbarkeiten über die Objekt-Einstellungen gesteuert. Mitarbeiter-eigene Kalender sind in Planung.' },
    ],
  },

  addons: {
    slug: 'addons',
    meta: { title: 'Add-ons & Extras', description: 'Upsells bei der Buchung – Yogamatte, Beamer, Reinigung und mehr als buchbare Extras.' },
    hero: { headline: 'Mehr Umsatz mit Add-ons.', subheadline: 'Biete Extras bei der Buchung an: Yogamatte, Beamer, Reinigung, Frühstück – was immer dein Business braucht.' },
    problem: { text: 'Ohne Add-ons verschenkst du Umsatz. Kunden sind bei der Buchung bereit, Extras dazuzunehmen – wenn man sie fragt.', bullets: ['Add-ons pro Service konfigurierbar.', 'Preis pro Add-on separat festlegbar.', 'Auf der Rechnung korrekt ausgewiesen.'] },
    steps: [
      {
        title: 'Add-ons erstellen',
        description: 'Im Dashboard unter "Add-ons" legst du jedes Extra an: Name (z.B. "Yogamatte"), kurze Beschreibung und Preis. Das Add-on erscheint später im Buchungs-Widget, wenn es den passenden Services zugeordnet ist. Name und Beschreibung helfen Kunden bei der Entscheidung – klare Angaben steigern die Buchungsrate.',
        bullets: ['Name und Beschreibung helfen Kunden bei der Entscheidung', 'Preis pro Einheit – auch Mehrfachbuchung möglich', 'Add-on erscheint erst nach Service-Zuordnung im Widget'],
        reverse: false
      },
      {
        title: 'Services zuordnen',
        description: 'Jedes Add-on muss einem oder mehreren Services zugeordnet werden. Nur bei diesen Services wird das Extra im Widget angeboten. So kannst du z.B. "Yogamatte" nur bei Yoga-Kursen zeigen, "Beamer" nur bei Meeting-Raum-Buchungen. Die Zuordnung bearbeitest du im Add-on-Detail.',
        bullets: ['Zuordnung pro Add-on in den Details bearbeiten', 'Ein Add-on kann vielen Services zugeordnet werden', 'Feine Steuerung: welches Extra bei welchem Service'],
        reverse: true
      },
      {
        title: 'Umsatz steigern',
        description: 'Sobald Add-ons erstellt und zugeordnet sind, erscheinen sie automatisch im Buchungs-Widget. Kunden wählen optional Extras dazu – der Mehrpreis wird korrekt berechnet und auf der Rechnung ausgewiesen. Kein weiterer Aufwand, alles läuft automatisch.',
        bullets: ['Extras erscheinen im Checkout-Schritt', 'Mehrpreis automatisch in Rechnung und Zahlung', 'Kein manueller Aufwand – alles automatisch'],
        reverse: false
      }
    ],
    useCases: [
      { icon: '💼', title: 'Coworking', description: 'Beamer, Whiteboard, Catering als Extras.', link: '/features' },
      { icon: '🧘', title: 'Yoga', description: 'Yogamatte, Handtuch, Tee.', link: '/features' },
    ],
    relatedFeatures: ['gutscheine', 'zahlungen', 'rechnungen'],
    faq: [
      { question: 'Werden Add-ons auf der Rechnung angezeigt?', answer: 'Ja, jedes gebuchte Add-on wird als separate Position auf der Rechnung aufgelistet.' },
      { question: 'Kann ich Add-ons als Pflicht markieren?', answer: 'Aktuell sind Add-ons optional. Pflicht-Add-ons sind in Planung.' },
    ],
  },

  gutscheine: {
    slug: 'gutscheine',
    meta: { title: 'Gutscheine & Rabattcodes', description: 'Erstelle Rabattcodes mit Prozent- oder Festbetrag-Rabatt, Nutzungslimits und Gültigkeitszeitraum.' },
    hero: { headline: 'Rabattcodes die konvertieren.', subheadline: 'Erstelle Gutscheine mit Prozent- oder Festbetrag-Rabatt. Mit Nutzungslimits und Gültigkeitszeitraum.' },
    problem: { text: 'Aktionen und Rabatte manuell zu verwalten ist fehleranfällig. Ohne System werden Codes doppelt verwendet oder vergessen.', bullets: ['Prozent- oder Festbetrag-Rabatt.', 'Nutzungslimit pro Code.', 'Gültigkeitszeitraum konfigurierbar.'] },
    steps: [
      {
        title: 'Code erstellen',
        description: 'Im Dashboard unter "Gutscheine" erstellst du einen neuen Rabattcode. Du vergibst einen Namen (z.B. YOGA25), wählst den Typ: Prozent-Rabatt oder Festbetrag. Dann legst du den Betrag fest (z.B. 25% oder 10€) und optional ein Nutzungslimit sowie einen Gültigkeitszeitraum. Der Code ist sofort aktiv.',
        bullets: ['Prozent oder Festbetrag pro Code', 'Nutzungslimit und Gültigkeitsdatum optional', 'Code sofort nach Erstellung gültig'],
        reverse: false
      },
      {
        title: 'Verteilen',
        description: 'Den Code teilst du über Newsletter, Social Media, Flyer oder direkt mit Kunden. Im Buchungs-Widget können Kunden den Code im Checkout eingeben. Er wird automatisch geprüft – gültig, Limit nicht erreicht, Zeitraum ok. Bei Erfolg wird der Rabatt direkt angezeigt und auf der Rechnung ausgewiesen.',
        bullets: ['Eingabe im Checkout-Schritt des Widgets', 'Automatische Prüfung von Gültigkeit und Limit', 'Rabatt sofort sichtbar im Buchungsprozess'],
        reverse: true
      },
      {
        title: 'Tracking',
        description: 'Im Dashboard unter "Gutscheine" siehst du für jeden Code, wie oft er eingelöst wurde. So behältst du den Überblick über Aktionen und kannst beliebte Codes verlängern oder neue erstellen. Der Rabatt wird korrekt auf der Rechnung ausgewiesen – für dich und den Kunden transparent.',
        bullets: ['Einsätze pro Code im Dashboard sichtbar', 'Rabatt auf Rechnung korrekt ausgewiesen', 'Beliebte Codes leicht identifizierbar'],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🧘', title: 'Yoga Studios', description: 'YOGA25 für 25% auf die erste Stunde.', link: '/features' },
      { icon: '🎉', title: 'Saisonaktionen', description: 'SOMMER2025 für saisonale Rabatte.', link: '/features/buchungen' },
    ],
    relatedFeatures: ['addons', 'zahlungen', 'buchungen'],
    faq: [
      { question: 'Können Gutscheine auf bestimmte Services beschränkt werden?', answer: 'Aktuell gelten Gutscheine für alle Services. Servicespezifische Einschränkung ist in Planung.' },
      { question: 'Wird der Rabatt auf der Rechnung angezeigt?', answer: 'Ja, eingelöste Gutscheine werden als Rabatt auf der Rechnung ausgewiesen.' },
    ],
  },

  kunden: {
    slug: 'kunden',
    meta: { title: 'Kundenverwaltung', description: 'Übersicht aller Kunden mit Buchungshistorie, Kontaktdaten und Notizen.' },
    hero: { headline: 'Deine Kunden. Im Blick.', subheadline: 'Alle Kunden mit Buchungshistorie, Kontaktdaten und Umsatz auf einen Blick.' },
    problem: { text: 'Ohne zentrale Kundendatenbank verpasst du Stammkunden und kannst Beziehungen nicht pflegen.', bullets: ['Automatische Kundendatenbank aus Buchungen.', 'Buchungshistorie pro Kunde einsehen.', 'Kontaktdaten und Umsatzübersicht.'] },
    steps: [
      {
        title: 'Automatisch erfasst',
        description: 'Bei jeder Buchung – ob über das Widget oder manuell angelegt – werden Kontaktdaten (Name, E-Mail) automatisch in der Kundendatenbank gespeichert. Du musst nichts manuell anlegen. Wiederbucher werden erkannt und erscheinen als bestehende Kunden mit Historie.',
        bullets: ['Speicherung bei jeder Buchung automatisch', 'Wiederbucher werden erkannt', 'Kein manueller Eintrag nötig'],
        reverse: false
      },
      {
        title: 'Historie einsehen',
        description: 'Im Kunden-Detail siehst du alle Buchungen, Zahlungen und Rechnungen pro Kunde. So behältst du den Überblick: Wer hat wann was gebucht? Welche Beträge sind offen? Das hilft bei Rückfragen und bei der Pflege von Stammkundenbeziehungen.',
        bullets: ['Alle Buchungen pro Kunde aufgelistet', 'Zahlungs- und Rechnungshistorie', 'Schnelle Antworten bei Kundenanfragen'],
        reverse: true
      },
      {
        title: 'Beziehungen pflegen',
        description: 'Stammkunden erkennst du an der Buchungshistorie. Du kannst pro Kunde Notizen hinterlegen – z.B. Präferenzen oder besondere Wünsche. So personalisierst du den Service ohne externe CRM-Tools. Export als CSV ist in Planung für tiefergehende Auswertungen.',
        bullets: ['Notizen pro Kunde hinterlegen', 'Stammkunden an Historie erkennbar', 'Export geplant für weitere Auswertung'],
        reverse: false
      }
    ],
    useCases: [
      { icon: '💇', title: 'Friseure', description: 'Stammkunden und ihre Vorlieben im Blick.', link: '/features' },
      { icon: '🏥', title: 'Therapeuten', description: 'Patientenhistorie und Behandlungsverläufe.', link: '/features' },
    ],
    relatedFeatures: ['buchungen', 'rechnungen', 'analytics'],
    faq: [
      { question: 'Werden Kundendaten automatisch gespeichert?', answer: 'Ja, bei jeder Buchung werden Kontaktdaten automatisch in der Kundendatenbank hinterlegt.' },
      { question: 'Kann ich Kunden exportieren?', answer: 'Export als CSV ist in Planung.' },
    ],
  },

  verfuegbarkeit: {
    slug: 'verfuegbarkeit',
    meta: { title: 'Verfügbarkeitsprüfung', description: 'Echtzeit-Slot-Reservierung verhindert Doppelbuchungen automatisch.' },
    hero: { headline: 'Keine Doppelbuchungen. Garantiert.', subheadline: 'Echtzeit-Verfügbarkeitsprüfung reserviert Zeitslots sofort. Konflikte werden automatisch verhindert.' },
    problem: { text: 'Doppelbuchungen sind peinlich und kosten Kunden. Ohne Echtzeit-Prüfung sind sie unvermeidlich.', bullets: ['Sofortige Slot-Reservierung bei Checkout-Start.', 'Konfliktlogik prüft Überschneidungen.', 'Buchbare Tage und Zeitfenster pro Objekt.'] },
    steps: [
      {
        title: 'Objekt konfigurieren',
        description: 'Pro Objekt legst du in den Einstellungen fest: An welchen Tagen und zu welchen Uhrzeiten kann gebucht werden? Wie weit im Voraus (Buchungsfenster)? Gibt es einen Puffer zwischen Buchungen? Diese Regeln bestimmen, welche Slots im Widget als verfügbar angezeigt werden. Ohne Konfiguration sind standardmäßig alle Slots offen.',
        bullets: ['Buchbare Tage und Zeitfenster pro Objekt', 'Buchungsfenster und Puffer konfigurierbar', 'Regeln bestimmen die verfügbaren Slots'],
        reverse: false
      },
      {
        title: 'Kunde bucht',
        description: 'Sobald ein Kunde den Checkout startet und einen Slot auswählt, wird dieser Slot sofort reserviert. Die Reservierung erfolgt in Echtzeit – der Slot ist für andere blockiert, auch wenn der Kunde noch bezahlt oder das Formular ausfüllt. So werden Doppelbuchungen von vornherein verhindert.',
        bullets: ['Reservierung beim Checkout-Start', 'Echtzeit-Blockierung während der Buchung', 'Kein Wettlauf um denselben Slot'],
        reverse: true
      },
      {
        title: 'Kein Konflikt',
        description: 'Andere Kunden sehen den reservierten Slot nicht mehr als verfügbar. Die Verfügbarkeit wird live aktualisiert – es gibt keine Verzögerung. Wenn eine Buchung storniert wird, wird der Slot sofort wieder freigegeben. Das System garantiert: Kein Slot wird doppelt vergeben.',
        bullets: ['Reservierte Slots für andere ausgeblendet', 'Live-Aktualisierung der Verfügbarkeit', 'Bei Stornierung sofort wieder buchbar'],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Keine Überlappung von Aufenthalten.', link: '/features' },
      { icon: '💼', title: 'Coworking', description: 'Meeting-Rooms nicht doppelt belegt.', link: '/features' },
    ],
    relatedFeatures: ['objekte', 'buffer', 'zeitfenster'],
    faq: [
      { question: 'Was passiert wenn zwei Kunden gleichzeitig buchen?', answer: 'Der erste der den Checkout startet, reserviert den Slot. Der zweite sieht den Slot als nicht mehr verfügbar.' },
      { question: 'Wie schnell wird die Verfügbarkeit aktualisiert?', answer: 'In Echtzeit. Sobald ein Checkout gestartet wird, ist der Slot für andere blockiert.' },
    ],
  },

  buffer: {
    slug: 'buffer',
    meta: { title: 'Reinigungspuffer', description: 'Automatische Pufferzeit zwischen Buchungen für Reinigung, Auf-/Abbau oder Vorbereitung.' },
    hero: { headline: 'Pufferzeit zwischen Buchungen.', subheadline: 'Konfiguriere automatische Puffer nach jeder Buchung: Für Reinigung, Umbau oder Vorbereitung.' },
    problem: { text: 'Ohne Puffer werden Termine Rücken an Rücken gebucht. Keine Zeit für Reinigung oder Vorbereitung.', bullets: ['Pufferzeit in Minuten oder Stunden.', 'Pro Service individuell konfigurierbar.', 'Automatisch in die Verfügbarkeit eingerechnet.'] },
    steps: [
      {
        title: 'Puffer festlegen',
        description: 'Pro Service legst du in den Einstellungen eine Pufferzeit fest – z.B. 30 Minuten für Raum-Umbau oder 4 Stunden für Reinigung nach Check-out. Die Pufferzeit wird automatisch nach jeder Buchung eingerechnet. Kunden sehen den Puffer nicht, sie sehen nur die tatsächlich verfügbaren Slots.',
        bullets: ['Pufferzeit pro Service konfigurierbar', 'In Minuten oder Stunden', 'Kunden sehen nur die buchbaren Slots'],
        reverse: false
      },
      {
        title: 'Automatisch blockiert',
        description: 'Nach jeder Buchung blockiert BookFast automatisch den Puffer-Zeitraum. Ein Slot von 10–12 Uhr mit 30min Puffer bedeutet: Der nächste Slot beginnt erst um 12:30 Uhr. Kein manuelles Eintragen in Kalender nötig – alles läuft im Hintergrund.',
        bullets: ['Blockierung automatisch nach jeder Buchung', 'Puffer in Verfügbarkeitsberechnung eingerechnet', 'Kein manueller Kalender-Eintrag nötig'],
        reverse: true
      },
      {
        title: 'Kein Stress',
        description: 'Du hast zwischen den Buchungen genug Zeit für Reinigung, Umbau oder Vorbereitung. Keine Termine Rücken an Rücken, keine Hetze. Das System kümmert sich darum – du konzentrierst dich auf dein Business.',
        bullets: ['Genug Zeit zwischen Terminen', 'Pro Service individuell einstellbar', 'Ruhe zwischen den Buchungen'],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: '4h Reinigungspuffer nach Check-out.', link: '/features' },
      { icon: '💼', title: 'Coworking', description: '15min für Raum-Umbau.', link: '/features' },
    ],
    relatedFeatures: ['verfuegbarkeit', 'objekte', 'overnight'],
    faq: [
      { question: 'Sehen Kunden den Puffer?', answer: 'Nein, Kunden sehen nur die verfügbaren Zeitslots. Der Puffer ist im Hintergrund eingerechnet.' },
      { question: 'Kann ich verschiedene Puffer pro Service haben?', answer: 'Ja, jeder Service hat seine eigene Pufferzeit-Konfiguration.' },
    ],
  },

  zeitfenster: {
    slug: 'zeitfenster',
    meta: { title: 'Zeitfenster & Buchungsregeln', description: 'Definiere buchbare Zeiten, Mindestvorlaufzeit und maximales Buchungsfenster.' },
    hero: { headline: 'Kontrolle über deine Zeitslots.', subheadline: 'Definiere wann gebucht werden kann: Öffnungszeiten, Mindestvorlaufzeit, maximales Buchungsfenster.' },
    problem: { text: 'Ohne klare Zeitregeln buchen Kunden zu unmöglichen Zeiten oder zu kurzfristig.', bullets: ['Buchbare Zeitfenster pro Tag definieren.', 'Mindestvorlaufzeit (z.B. 24h im Voraus).', 'Maximaler Buchungszeitraum (z.B. 3 Monate im Voraus).'] },
    steps: [
      {
        title: 'Zeitfenster setzen',
        description: 'Pro Objekt konfigurierst du die buchbaren Zeiten: z.B. Mo–Fr 8–18 Uhr oder Sa 9–13 Uhr. Du kannst pro Wochentag unterschiedliche Zeitfenster setzen. Außerhalb dieser Zeiten werden keine Slots angezeigt – Kunden können nur buchen, wenn du es erlaubst.',
        bullets: ['Buchbare Zeiten pro Tag und Objekt', 'Unterschiedliche Fenster pro Wochentag möglich', 'Außerhalb der Zeiten keine Buchung'],
        reverse: false
      },
      {
        title: 'Vorlauf definieren',
        description: 'Du legst fest, wie weit im Voraus Kunden buchen können: z.B. maximal 3 Monate. Außerdem die Mindestvorlaufzeit: z.B. Buchungen müssen 24 Stunden im Voraus erfolgen, nicht last-minute. So vermeidest du Buchungen zu unmöglichen Zeiten oder zu kurzfristig.',
        bullets: ['Maximaler Buchungszeitraum (z.B. 3 Monate)', 'Mindestvorlaufzeit (z.B. 24h)', 'Flexible Anpassung an dein Geschäftsmodell'],
        reverse: true
      },
      {
        title: 'Regeln aktiv',
        description: 'Das Widget zeigt nur Slots, die innerhalb deiner Regeln liegen. Keine Buchung außerhalb der Öffnungszeiten, keine zu kurzfristigen Termine. Die Regeln greifen automatisch – du musst nichts manuell prüfen.',
        bullets: ['Nur gültige Slots im Widget sichtbar', 'Regeln greifen automatisch', 'Keine manuelle Kontrolle nötig'],
        reverse: false
      }
    ],
    useCases: [
      { icon: '💇', title: 'Friseure', description: 'Termine nur während Öffnungszeiten.', link: '/features' },
      { icon: '💼', title: 'Coworking', description: 'Meeting-Rooms 08:00-20:00.', link: '/features' },
    ],
    relatedFeatures: ['verfuegbarkeit', 'objekte', 'buffer'],
    faq: [
      { question: 'Kann ich verschiedene Zeiten pro Wochentag setzen?', answer: 'Ja, du kannst pro Tag unterschiedliche Zeitfenster konfigurieren.' },
      { question: 'Können Kunden auch am Wochenende buchen?', answer: 'Ja, du konfigurierst die buchbaren Tage individuell.' },
    ],
  },

  approval: {
    slug: 'approval',
    meta: { title: 'Approval-Flow', description: 'Erst zahlen, dann bestätigen – du behältst die volle Kontrolle über jede Buchung.' },
    hero: { headline: 'Erst zahlen. Dann bestätigen.', subheadline: 'Mit dem Approval-Flow zahlst der Kunde bei Buchung, aber du bestätigst oder lehnst manuell ab. Volle Kontrolle.' },
    problem: { text: 'Nicht jede Buchung passt. Manchmal musst du prüfen, ob der Gast, die Gruppe oder der Zeitraum passt.', bullets: ['Buchung geht als "Wartend" ein.', 'Zahlung wird sofort eingezogen.', 'Du bestätigst oder lehnst ab – bei Ablehnung automatische Rückerstattung.'] },
    steps: [
      {
        title: 'Approval aktivieren',
        description: 'In den Service-Einstellungen schaltest du den Approval-Flow ein. Ab dann laufen Buchungen für diesen Service nicht mehr direkt durch: Der Kunde zahlt sofort, aber die Buchung landet bei dir mit Status "Wartend". Du prüfst jede Anfrage und bestätigst oder lehnst ab. Perfekt für Services, bei denen du vorher prüfen willst (z.B. Gäste-Check, Motivabsprache).',
        bullets: ['Einstellung pro Service im Detail', 'Zahlung sofort, Bestätigung manuell', 'Ideal für prüfungspflichtige Buchungen'],
        reverse: false
      },
      {
        title: 'Buchung prüfen',
        description: 'Neue Buchungen erscheinen im Dashboard mit Status "Wartend". Du siehst alle Details: Kunde, Datum, Service, Betrag. Du prüfst, ob die Buchung passt – z.B. ob der Gast oder das Motiv für dein Business geeignet ist. Dann entscheidest du: bestätigen oder ablehnen.',
        bullets: ['Status "Wartend" im Dashboard', 'Alle Buchungsdetails einsehbar', 'Manuelle Prüfung vor Freigabe'],
        reverse: true
      },
      {
        title: 'Bestätigen oder ablehnen',
        description: 'Bei Bestätigung wird die Buchung freigegeben – der Kunde erhält die Bestätigungsmail, der Termin ist fix. Bei Ablehnung löst BookFast automatisch eine volle Rückerstattung über Stripe aus. Der Kunde wird per E-Mail informiert. Du musst keine manuelle Rücküberweisung vornehmen.',
        bullets: ['Bestätigen: Buchung wird freigegeben', 'Ablehnen: automatische Rückerstattung', 'Kunde wird in beiden Fällen informiert'],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Gäste-Check vor Buchungsbestätigung.', link: '/features' },
      { icon: '🎨', title: 'Tattoo-Studios', description: 'Motivabsprache vor dem Termin.', link: '/features' },
    ],
    relatedFeatures: ['buchungen', 'zahlungen', 'rechnungen'],
    faq: [
      { question: 'Was passiert mit der Zahlung bei Ablehnung?', answer: 'Bei Ablehnung wird automatisch eine volle Rückerstattung über Stripe ausgelöst.' },
      { question: 'Kann ich den Approval-Flow pro Service aktivieren?', answer: 'Ja, du kannst ihn individuell pro Service ein- oder ausschalten.' },
    ],
  },

  overnight: {
    slug: 'overnight',
    meta: { title: 'Übernachtungsbuchungen', description: 'Check-in/Check-out-Zeiten, Mindestaufenthalt und Reinigungspuffer für Unterkünfte.' },
    hero: { headline: 'Buchungssystem für Übernachtungen.', subheadline: 'Check-in/out-Zeiten, Mindestaufenthalt, Nachtpreise und Reinigungspuffer – alles konfigurierbar.' },
    problem: { text: 'Übernachtungsbuchungen sind komplexer als Stundenbuchungen. Check-in/out, Mindestaufenthalte und Reinigung müssen berücksichtigt werden.', bullets: ['Check-in und Check-out Zeiten konfigurierbar.', 'Mindestaufenthalt in Nächten.', 'Preis pro Nacht, automatische Berechnung.'] },
    steps: [
      {
        title: 'Overnight-Service erstellen',
        description: 'Beim Anlegen eines Services wählst du den Typ "Übernachtung" (overnight). Dieser Typ hat eigene Optionen: Check-in- und Check-out-Zeiten, Mindestaufenthalt in Nächten, Preis pro Nacht. Du ordnest den Service einem Objekt zu – z.B. einer Ferienwohnung – und konfigurierst optional einen Reinigungspuffer nach Check-out.',
        bullets: ['Service-Typ "Übernachtung" wählen', 'Check-in/out und Mindestaufenthalt', 'Preis pro Nacht, automatische Berechnung'],
        reverse: false
      },
      {
        title: 'Check-in/out setzen',
        description: 'Du legst fest, ab wann Gäste einchecken können (z.B. 15:00) und bis wann sie auschecken müssen (z.B. 10:00). Der Reinigungspuffer wird automatisch nach Check-out eingerechnet – z.B. 4 Stunden, damit die Wohnung vor dem nächsten Gast sauber ist. Die Zeiten erscheinen in Bestätigungen und im Kundenportal.',
        bullets: ['Check-in und Check-out Zeiten konfigurierbar', 'Puffer nach Check-out automatisch blockiert', 'Zeiten in Bestätigung und Portal sichtbar'],
        reverse: true
      },
      {
        title: 'Kunden buchen Nächte',
        description: 'Im Widget wählen Kunden An- und Abreisedatum – das System zeigt einen Kalender mit verfügbaren Nächten. Die Gesamtzahl der Nächte und der Preis werden automatisch berechnet. Doppelbuchungen oder Überlappungen sind ausgeschlossen – die Verfügbarkeit wird in Echtzeit geprüft.',
        bullets: ['Kalender-Ansicht mit verfügbaren Nächten', 'Automatische Preisberechnung', 'Keine Überlappungen möglich'],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Komplette Übernachtungsverwaltung.', link: '/features' },
      { icon: '🚐', title: 'Wohnmobil-Vermietung', description: 'Mietdauer in Nächten.', link: '/features' },
    ],
    relatedFeatures: ['buffer', 'verfuegbarkeit', 'kaution'],
    faq: [
      { question: 'Kann ich verschiedene Preise pro Nacht setzen?', answer: 'Aktuell ein Preis pro Nacht pro Service. Saisonpreise sind in Planung.' },
      { question: 'Wird der Reinigungspuffer nach Check-out berücksichtigt?', answer: 'Ja, du konfigurierst den Buffer der nach dem Check-out automatisch blockiert wird.' },
    ],
  },

  workspaces: {
    slug: 'workspaces',
    meta: { title: 'Multi-Workspace', description: 'Mehrere Standorte oder Marken in einem Account verwalten – jeder mit eigenen Einstellungen.' },
    hero: { headline: 'Ein Account. Alle Standorte.', subheadline: 'Verwalte mehrere Standorte, Marken oder Projekte in einem Account mit separaten Einstellungen.' },
    problem: { text: 'Bei anderen Tools brauchst du für jeden Standort einen eigenen Account. Das wird schnell teuer und unübersichtlich.', bullets: ['Workspace pro Standort oder Marke.', 'Eigene Objekte, Services und Einstellungen pro Workspace.', 'Ein Login für alles.'] },
    steps: [
      {
        title: 'Workspace erstellen',
        description: 'Im Dashboard erstellst du einen neuen Workspace – z.B. für einen zweiten Standort oder eine eigene Marke. Du vergibst einen Namen und optional eigene Einstellungen. Jeder Workspace hat seine eigenen Objekte, Services, Buchungen und Einstellungen. Ein Account, mehrere getrennte Umgebungen.',
        bullets: ['Neuer Workspace mit Name anlegen', 'Jeder Workspace völlig getrennt', 'Ideal für Standorte oder Marken'],
        reverse: false
      },
      {
        title: 'Setup konfigurieren',
        description: 'Pro Workspace richtest du das Setup ein: Objekte, Services, Preise, Mitarbeiter, Add-ons. Alles unabhängig vom anderen Workspace. Du kannst denselben Stripe-Account nutzen oder getrennte – je nach Bedarf. Die Buchungen und Kunden sind pro Workspace getrennt.',
        bullets: ['Objekte, Services, Preise pro Workspace', 'Mitarbeiter und Add-ons getrennt', 'Buchungen und Kunden pro Workspace'],
        reverse: true
      },
      {
        title: 'Wechseln',
        description: 'Im Dashboard wechselst du mit einem Klick zwischen Workspaces. Die Sidebar zeigt den aktuellen Workspace, und du wechselst per Dropdown oder Workspace-Liste. Ein Login für alles – keine separaten Accounts nötig.',
        bullets: ['Wechsel per Dropdown oder Liste', 'Ein Login für alle Workspaces', 'Schneller Kontextwechsel'],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Mehrere Standorte', description: 'Ferienwohnungen in verschiedenen Regionen.', link: '/features' },
      { icon: '💇', title: 'Salon-Ketten', description: 'Mehrere Filialen zentral verwalten.', link: '/features' },
    ],
    relatedFeatures: ['objekte', 'integration', 'analytics'],
    faq: [
      { question: 'Haben Workspaces separate Daten?', answer: 'Ja, jeder Workspace hat eigene Objekte, Services, Buchungen und Einstellungen.' },
      { question: 'Kann ich Mitarbeiter einem Workspace zuordnen?', answer: 'Ja, Mitarbeiter werden pro Workspace verwaltet.' },
    ],
  },

  kaution: {
    slug: 'kaution',
    meta: { title: 'Kaution & Anzahlung', description: 'Konfigurierbare Anzahlung oder Kaution pro Service – prozentual oder als Festbetrag.' },
    hero: { headline: 'Anzahlung sichert den Termin.', subheadline: 'Konfiguriere eine Anzahlung pro Service (z.B. 30%). Reduziere No-Shows und sichere deinen Umsatz.' },
    problem: { text: 'Ohne Anzahlung steigt die No-Show-Rate. Kunden die nichts gezahlt haben, erscheinen häufiger nicht zum Termin.', bullets: ['Prozentualer Anzahlungsbetrag pro Service.', 'Automatisch bei Buchung eingezogen.', 'Restbetrag bei Termin oder nach Abschluss.'] },
    steps: [
      {
        title: 'Anzahlung aktivieren',
        description: 'In den Service-Einstellungen schaltest du die Anzahlung (Deposit) ein. Du kannst einen Prozentsatz (z.B. 30%) oder einen Festbetrag wählen. Die Anzahlung wird bei Buchung sofort eingezogen – der Restbetrag bleibt offen und wird bei Termin oder nach Abschluss fällig. Reduziert No-Shows deutlich.',
        bullets: ['Einstellung pro Service im Detail', 'Prozent oder Festbetrag wählbar', 'Sofortiger Einzug bei Buchung'],
        reverse: false
      },
      {
        title: 'Prozentsatz setzen',
        description: 'Du legst fest, wie viel der Kunde bei Buchung zahlt: z.B. 30% des Gesamtpreises oder 50€ als Kaution. Der Restbetrag erscheint auf der Rechnung und kann bei Termin bezahlt werden. Du kannst pro Service unterschiedliche Prozentsätze setzen – z.B. bei teuren Services höhere Anzahlung.',
        bullets: ['Prozent oder Festbetrag pro Service', 'Restbetrag auf Rechnung ausgewiesen', 'Individuell pro Service konfigurierbar'],
        reverse: true
      },
      {
        title: 'Automatisch eingezogen',
        description: 'Sobald der Kunde im Checkout bezahlt, zieht Stripe automatisch den Anzahlungsbetrag ein. Kein manuelles Nachfragen, keine Überweisungsnummern. Das Geld geht auf dein Konto, der Kunde erhält die Bestätigung. Bei Ablehnung durch dich wird automatisch rückerstattet.',
        bullets: ['Einzug bei Buchung automatisch', 'Kein manueller Zahlungseingang nötig', 'Rückerstattung bei Ablehnung automatisch'],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: '30% Anzahlung bei Buchung.', link: '/features' },
      { icon: '🎨', title: 'Tattoo-Studios', description: 'Kaution gegen No-Shows.', link: '/features' },
      { icon: '🚲', title: 'Verleih', description: 'Kaution für Equipment-Schutz.', link: '/features' },
    ],
    relatedFeatures: ['zahlungen', 'approval', 'rechnungen'],
    faq: [
      { question: 'Wird die Anzahlung auf der Rechnung angezeigt?', answer: 'Ja, Anzahlung und Restbetrag werden auf der Rechnung ausgewiesen.' },
      { question: 'Was passiert bei Stornierung?', answer: 'Bei Stornierung durch dich wird die Anzahlung automatisch rückerstattet. Bei Kundenstornierung greift deine Policy.' },
    ],
  },
};
