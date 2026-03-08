/**
 * Hauptfeatures für die Startseite – Accordion-Sektion
 * Kurze Übersicht, keine Detail-Schritte.
 * Sprachrichtlinien: BookFast_UI_Language_Guidelines_v1.0.md
 */
export const HOME_FEATURES_STEPS = [
  {
    title: 'Webflow-Native',
    icon: 'globe',
    bullets: [
      { title: 'Embed-Script einfügen, Template in Webflow kopieren', description: 'Beides nötig – dann ist das Widget live.' },
      { title: 'Kein iFrame – volle Design-Kontrolle', description: 'Das Widget lebt nativ in deiner Seite.' },
      { title: 'In unter 5 Minuten eingerichtet', description: 'Copy, Paste, Live.' },
    ],
  },
  {
    title: '0% Provision',
    icon: 'bank-card',
    bullets: [
      { title: 'Keine BookFast-Provision', description: 'Du zahlst nur die Stripe-Transaktionsgebühren.' },
      { title: 'Stripe Connect in wenigen Minuten', description: 'Onboarding direkt aus den Einstellungen.' },
      { title: 'Auszahlung 24 Stunden nach Bestätigung', description: 'Geld landet auf deinem Konto.' },
    ],
  },
  {
    title: 'Zahlung vor Termin',
    icon: 'money-hand',
    bullets: [
      { title: 'Geld auf deinem Konto, bevor der Termin startet', description: 'Weniger No-Shows durch Vorauszahlung.' },
      { title: 'Kaution konfigurierbar', description: 'Prozentual oder Festbetrag pro Service. Bei Buchung einziehbar – du bist bei größeren Objekten oder teuren Services abgesichert.' },
      { title: 'Automatische Rückerstattung bei Ablehnung', description: 'Ohne manuellen Aufwand.' },
    ],
  },
  {
    title: 'Buchungsverwaltung',
    icon: 'list',
    bullets: [
      { title: 'Alle Buchungen an einem Ort', description: 'Status, Kalender, Listenansicht.' },
      { title: 'Bestätigen oder Ablehnen', description: 'Mit einem Klick.' },
      { title: 'Keine verstreuten Anfragen mehr', description: 'Zentrale Übersicht statt E-Mail-Chaos.' },
    ],
  },
  {
    title: 'Kundenportal',
    icon: 'key',
    bullets: [
      { title: 'Magic Link pro Buchung', description: 'Kein Konto, kein Passwort nötig.' },
      { title: 'Rechnung einsehen, bezahlen, stornieren', description: 'Self-Service für deine Gäste.' },
      { title: 'Direkt buchen ohne Registrierung', description: 'Weniger Hürden, mehr Buchungen.' },
    ],
  },
];
