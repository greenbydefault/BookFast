/**
 * Compare Pages Configuration
 * Each entry drives the ComparePageTemplate.
 */

export const comparePages = {
  flowbookings: {
    slug: 'flowbookings',
    name: 'FlowBookings',
    meta: {
      title: 'BookFast vs. FlowBookings – Funktionen im Vergleich',
      description: 'BookFast vs. FlowBookings: Direkter Feature-Vergleich für Webflow-Buchungstools. Analytics, Rechnungen, Multi-Workspace – was bietet was?',
    },
    hero: {
      headline: 'BookFast vs. FlowBookings – der direkte Vergleich',
      subheadline: 'Beide Tools integrieren Buchungen in Webflow. BookFast bringt zusätzlich Analytics, automatische Rechnungen und Multi-Workspace.',
    },
    keyDifferences: [
      { title: 'Analytics & Drop-off-Daten', description: 'BookFast zeigt dir, wo Kunden im Buchungsflow abspringen. So optimierst du deine Conversion. FlowBookings bietet nur Buchungs- und Revenue-Reports.' },
      { title: 'Multi-Workspace', description: 'Mehrere Standorte oder Marken in einem Account – ohne separate Abos. Bei FlowBookings brauchst du für jeden Standort einen eigenen Account.' },
      { title: 'Automatische Rechnungen', description: 'Rechnungen entstehen bei BookFast automatisch nach Bestätigung oder Abschluss. Bei FlowBookings erstellst du sie manuell.' },
    ],
    comparison: {
      columns: ['Feature', 'BookFast', 'FlowBookings'],
      rows: [
        { feature: 'Webflow-Integration', values: [true, true] },
        { feature: 'Stripe Connect (0 % Provision)', values: [true, true] },
        { feature: 'Multi-Workspace', values: [true, false] },
        { feature: 'Analytics & Funnel / Drop-off', values: [true, false] },
        { feature: 'Automatische Rechnungen', values: [true, false] },
        { feature: 'Kundenportal (Magic Link)', values: [true, false] },
        { feature: 'Add-ons & Upsells', values: [true, false] },
        { feature: 'Gutscheine & Rabattcodes', values: [true, false] },
        { feature: 'Approval-Flow', values: [true, false] },
        { feature: 'Übernachtungsbuchungen', values: [true, true] },
        { feature: 'Mitarbeiterverwaltung', values: [true, false] },
        { feature: 'Anzahlung / Kaution', values: [true, false] },
        { feature: 'Reinigungspuffer / Buffer-Zeit', values: [true, true] },
        { feature: 'Custom Working Hours', values: [true, true] },
        { feature: 'E-Mail-Reminder', values: [true, true] },
        { feature: 'Zapier', values: [false, true] },
        { feature: 'Webhooks', values: [true, false] },
      ],
    },
    forWhom: 'FlowBookings passt für einfache Buchungen mit nativen Webflow-Forms. BookFast ist die bessere Wahl, wenn du Analytics, automatische Rechnungen, mehrere Standorte oder ein Kundenportal brauchst.',
    faq: [
      { question: 'Kann ich von FlowBookings zu BookFast wechseln?', answer: 'Ja. Du erstellst einen BookFast-Account, richtest deine Angebote ein und bettest das Widget ein. Bestehende FlowBookings-Buchungen bleiben dort – neue laufen über BookFast.' },
      { question: 'Bietet BookFast auch Webflow-native Integration?', answer: 'Ja. BookFast lebt nativ in deiner Webflow-Seite – per Embed-Script oder Template-Copy. Kein iFrame, kein Redirect.' },
      { question: 'Warum hat BookFast Analytics und FlowBookings nicht?', answer: 'BookFast trackt den gesamten Buchungsflow: Conversion-Funnel, Drop-off-Raten und Payment-Completion. So siehst du, wo Kunden abspringen, und kannst gezielt optimieren.' },
      { question: 'Erhebt BookFast eine Provision pro Buchung?', answer: 'Nein. Du zahlst nur den monatlichen Festpreis. Keine Provision, keine versteckten Kosten.' },
      { question: 'Kann ich mit BookFast mehrere Standorte verwalten?', answer: 'Ja. Multi-Workspace ist ein Kernfeature. Du verwaltest mehrere Standorte oder Marken in einem Account – ohne separate Abos.' },
    ],
  },

  cozycal: {
    slug: 'cozycal',
    name: 'CozyCal',
    meta: {
      title: 'BookFast vs. CozyCal',
      description: 'BookFast vs. CozyCal – Webflow-native Integration, keine Provision, Analytics und Rechnungen.',
    },
    hero: {
      headline: 'BookFast vs. CozyCal',
      subheadline: 'CozyCal ist ein solides Scheduling-Tool. BookFast ist speziell für Webflow gebaut und bietet mehr Kontrolle.',
    },
    keyDifferences: [
      { title: 'Webflow-native', description: 'BookFast lebt nativ in deiner Webflow-Seite. CozyCal nutzt iFrames oder externe Redirects.' },
      { title: 'Keine Provision', description: 'BookFast erhebt keine Provision pro Buchung. CozyCal berechnet bei manchen Plänen Transaktionsgebühren.' },
      { title: 'Regel-Engine', description: 'Buffer, Overnight, Approval-Flow – BookFast bietet eine klare Regel-Engine für komplexe Szenarien.' },
    ],
    comparison: {
      columns: ['Feature', 'BookFast', 'CozyCal'],
      rows: [
        { feature: 'Webflow-native', values: [true, false] },
        { feature: 'Keine Provision', values: [true, 'Teilweise'] },
        { feature: 'Stripe Connect', values: [true, true] },
        { feature: 'Multi-Workspace', values: [true, false] },
        { feature: 'Analytics', values: [true, false] },
        { feature: 'Automatische Rechnungen', values: [true, false] },
        { feature: 'Overnight-Buchungen', values: [true, false] },
        { feature: 'Approval-Flow', values: [true, false] },
        { feature: 'Add-ons', values: [true, false] },
        { feature: 'Gutscheine', values: [true, false] },
      ],
    },
    forWhom: 'CozyCal ist gut für einfache Terminbuchungen. Wenn du Webflow nutzt und mehr Kontrolle, Analytics und Rechnungen brauchst, ist BookFast die bessere Wahl.',
    faq: [
      { question: 'Nutzt CozyCal iFrames?', answer: 'Ja, CozyCal bindet das Buchungsformular per iFrame oder externem Link ein. BookFast dagegen lebt nativ in deiner Webflow-Seite – ohne iFrame, ohne Redirect.' },
      { question: 'Erhebt CozyCal eine Provision?', answer: 'Bei manchen Plänen ja. BookFast erhebt keine Provision – du zahlst nur den monatlichen Festpreis.' },
      { question: 'Kann ich mit BookFast Übernachtungen anbieten?', answer: 'Ja. Stundenbuchungen, Tagesbuchungen und Übernachtungen mit Check-in/Check-out, Mindestaufenthalt und Reinigungspuffer. CozyCal bietet das nicht.' },
      { question: 'Hat BookFast automatische Rechnungen?', answer: 'Ja. Nach Bestätigung oder Abschluss einer Buchung wird die Rechnung automatisch generiert. Bei CozyCal musst du Rechnungen manuell erstellen.' },
      { question: 'Wie wechsle ich von CozyCal zu BookFast?', answer: 'Account erstellen, Angebote einrichten, Widget einbetten. Deine bestehenden CozyCal-Buchungen bleiben dort – neue Buchungen laufen über BookFast.' },
    ],
  },

  bookla: {
    slug: 'bookla',
    name: 'Bookla',
    meta: {
      title: 'BookFast vs. Bookla',
      description: 'BookFast vs. Bookla – Vergleich der Webflow-Buchungstools.',
    },
    hero: {
      headline: 'BookFast vs. Bookla',
      subheadline: 'Beide Tools richten sich an Webflow-Nutzer. Hier siehst du die Unterschiede.',
    },
    keyDifferences: [
      { title: 'Analytics & Conversion', description: 'BookFast bietet detaillierte Funnel-Analyse. Bookla bietet grundlegende Statistiken.' },
      { title: 'Automatische Rechnungen', description: 'BookFast generiert Rechnungen automatisch. Bei Bookla ist das nicht verfügbar.' },
      { title: 'Flexibles Pricing', description: 'Stunden, Tage, Übernachtungen, Anzahlungen – alles in einem Tool.' },
    ],
    comparison: {
      columns: ['Feature', 'BookFast', 'Bookla'],
      rows: [
        { feature: 'Webflow-Integration', values: [true, true] },
        { feature: 'Stripe Connect', values: [true, true] },
        { feature: 'Analytics', values: [true, 'Basis'] },
        { feature: 'Automatische Rechnungen', values: [true, false] },
        { feature: 'Multi-Workspace', values: [true, false] },
        { feature: 'Add-ons', values: [true, false] },
        { feature: 'Approval-Flow', values: [true, false] },
        { feature: 'Overnight', values: [true, true] },
        { feature: 'Gutscheine', values: [true, false] },
      ],
    },
    forWhom: 'Bookla ist eine solide Option für einfache Buchungen. BookFast bietet mehr Tiefe bei Analytics, Rechnungen und Verwaltungsfeatures.',
    faq: [
      { question: 'Was kann BookFast, was Bookla nicht bietet?', answer: 'BookFast bietet detaillierte Funnel-Analyse, automatische Rechnungen, Multi-Workspace, Add-ons, Gutscheine und einen Approval-Flow. Bookla konzentriert sich auf grundlegende Buchungsfunktionen.' },
      { question: 'Sind beide Tools Webflow-native?', answer: 'Ja, beide integrieren sich in Webflow. BookFast bietet zusätzlich Template-Copy und native Datenattribute für maximale Design-Kontrolle.' },
      { question: 'Erhebt Bookla eine Provision?', answer: 'Die Preismodelle unterscheiden sich. BookFast erhebt keine Provision – nur einen monatlichen Festpreis.' },
      { question: 'Kann ich mit BookFast Analytics nutzen?', answer: 'Ja. BookFast zeigt Conversion-Funnel, Drop-off-Raten und Revenue-Tracking. Bookla bietet nur grundlegende Statistiken.' },
      { question: 'Wie migriere ich von Bookla zu BookFast?', answer: 'Account erstellen, Objekte und Services einrichten, Widget einbetten. Bestehende Bookla-Buchungen bleiben dort – neue laufen über BookFast.' },
    ],
  },

  schedulinks: {
    slug: 'schedulinks',
    name: 'ScheduLinks',
    meta: {
      title: 'BookFast vs. ScheduLinks',
      description: 'BookFast vs. ScheduLinks – Welches Webflow-Buchungstool passt besser?',
    },
    hero: {
      headline: 'BookFast vs. ScheduLinks',
      subheadline: 'ScheduLinks verbindet Calendly mit Webflow. BookFast ist ein nativer Webflow-Booking-Stack.',
    },
    keyDifferences: [
      { title: 'Kein Calendly nötig', description: 'BookFast ist ein eigenständiges System. Du brauchst kein externes Scheduling-Tool.' },
      { title: 'Integrierte Zahlungen', description: 'BookFast hat Stripe Connect direkt integriert – kein zusätzliches Setup nötig.' },
      { title: 'Volle Kontrolle', description: 'Objekte, Services, Mitarbeiter, Add-ons, Rechnungen – alles in einem Dashboard.' },
    ],
    comparison: {
      columns: ['Feature', 'BookFast', 'ScheduLinks'],
      rows: [
        { feature: 'Eigenständiges System', values: [true, 'Calendly-Brücke'] },
        { feature: 'Stripe Connect', values: [true, false] },
        { feature: 'Zahlungen im Widget', values: [true, false] },
        { feature: 'Analytics', values: [true, false] },
        { feature: 'Rechnungen', values: [true, false] },
        { feature: 'Multi-Workspace', values: [true, false] },
        { feature: 'Add-ons', values: [true, false] },
        { feature: 'Overnight', values: [true, false] },
      ],
    },
    forWhom: 'ScheduLinks ist nützlich, wenn du bereits Calendly nutzt und es in Webflow einbinden willst. BookFast ist die Wahl, wenn du ein vollständiges, eigenes Buchungssystem willst.',
    faq: [
      { question: 'Brauche ich mit BookFast noch Calendly?', answer: 'Nein. BookFast ist ein eigenständiges Buchungssystem mit Zahlungen, Rechnungen und Analytics. Du brauchst kein externes Scheduling-Tool.' },
      { question: 'Bietet ScheduLinks Online-Zahlungen?', answer: 'Nein. ScheduLinks ist eine Brücke zwischen Calendly und Webflow – ohne eigene Zahlungsintegration. BookFast hat Stripe Connect direkt integriert.' },
      { question: 'Kann ich mit BookFast Add-ons und Gutscheine anbieten?', answer: 'Ja. Du kannst Zusatzoptionen (Add-ons) und Rabattcodes konfigurieren. ScheduLinks bietet diese Funktionen nicht.' },
      { question: 'Hat BookFast Analytics?', answer: 'Ja. Conversion-Funnel, Drop-off-Raten und Revenue-Tracking sind integriert. ScheduLinks bietet keine eigene Analyse.' },
      { question: 'Wie wechsle ich von ScheduLinks zu BookFast?', answer: 'Du erstellst einen BookFast-Account, richtest deine Services ein und bettest das Widget ein. Da ScheduLinks auf Calendly basiert, bleiben bestehende Termine dort.' },
    ],
  },
};
