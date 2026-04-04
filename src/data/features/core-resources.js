/**
 * Core features: analytics, objects, services
 */
export const coreResources = {
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
      { icon: '🌍', title: 'Zielgruppe verstehen', description: 'Browser, Geräte, Länder und Städte deiner Besucher.', link: '/features/analytics' },
    ],
    sections: [],
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
    sections: [],
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
    sections: [],
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
