/**
 * Hauptfeatures für die Startseite (Accordion-Sektion)
 * Kurze Übersicht, keine Detail-Schritte.
 * Sprachrichtlinien: SaaS-Landing-Page-Wording-Guidelines-2026.md
 */
export const HOME_FEATURES_STEPS = [
  {
    title: 'Webflow-Native',
    icon: 'globe',
    bullets: [
      { title: 'Embed-Script einfügen, Template in Webflow kopieren', description: 'Beides nötig. Dann ist das Widget live.' },
      { title: 'Kein iFrame, volle Design-Kontrolle', description: 'Das Widget lebt nativ in deiner Seite.' },
      { title: 'In unter 5 Minuten eingerichtet', description: 'Copy, Paste, Live.' },
    ],
  },
  {
    title: '0% Provision',
    icon: 'bank-card',
    bullets: [
      { title: 'Keine BookFast-Provision', description: 'Du zahlst nur die Stripe-Transaktionsgebühren.' },
      { title: 'Stripe Connect in wenigen Minuten', description: 'Onboarding direkt aus den Einstellungen.' },
      { title: 'Auszahlung über dein Stripe-Konto', description: 'Nach deinem Stripe-Auszahlungsplan.' },
    ],
  },
  {
    title: 'Zahlung vor Termin',
    icon: 'money-hand',
    bullets: [
      { title: 'Geld auf deinem Konto, bevor der Termin startet', description: 'Weniger No-Shows durch Vorauszahlung.' },
      { title: 'Anzahlung konfigurierbar', description: 'Prozent pro Service. Der Kunde zahlt bei der Buchung nur den Anteil, den Rest später im Kundenportal.' },
      { title: 'Automatische Rückerstattung bei Ablehnung', description: 'Ohne manuellen Aufwand.' },
    ],
  },
  {
    title: 'Buchungsverwaltung',
    icon: 'list',
    bullets: [
      { title: 'Alle Buchungen an einem Ort', description: 'Eine Liste mit Status-Tabs.' },
      { title: 'Bestätigen oder Ablehnen', description: 'Mit einem Klick.' },
      { title: 'Keine verstreuten Anfragen mehr', description: 'Zentrale Übersicht statt E-Mail-Chaos.' },
    ],
  },
  {
    title: 'Kundenportal',
    icon: 'key',
    bullets: [
      { title: 'Magic Link pro Buchung', description: 'Kein Konto, kein Passwort nötig.' },
      { title: 'Rechnung laden, bezahlen, stornieren', description: 'Self-Service für deine Gäste, geschützt per PIN.' },
      { title: 'Direkt buchen ohne Registrierung', description: 'Weniger Hürden, mehr Buchungen.' },
    ],
  },
];
