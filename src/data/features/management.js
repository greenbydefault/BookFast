/**
 * Management features: Mitarbeiter (remaining after consolidation)
 * Previously: Addons, Gutscheine, Kunden — absorbed into services, zahlungen, analytics.
 */
export const management = {
  mitarbeiter: {
    slug: 'mitarbeiter',
    meta: { title: 'Mitarbeiterverwaltung', description: 'Ordne Mitarbeiter Services zu. Kunden wählen ihren Wunsch-Mitarbeiter bei der Buchung.' },
    hero: {
      headline: 'Kunden buchen den richtigen Mitarbeiter – automatisch.',
      subheadline: 'Mitarbeiter anlegen, Services zuordnen, fertig. Deine Kunden sehen im Widget die Verfügbarkeit pro Teammitglied und buchen direkt.',
      demoModule: 'mitarbeiter',
      illustration: '/src/svg/illustrations/landingpage/features/ft_mitarbeiterverwaltung.svg',
      trustClaims: ['Kostenlos testen', 'Keine Kreditkarte nötig', 'In unter 5 Minuten startklar'],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So richtest du Mitarbeiter ein',
    interactiveHowItWorksHeadline: 'Team anlegen, Services zuordnen, fertig.',
    problem: { text: 'Wer ist wann verfügbar? Wer macht welchen Service? Ohne klare Zuordnung endet Terminplanung im Hin-und-Her zwischen Telefon und Kalender.', bullets: ['Mitarbeiterprofile mit Bild und Name.', 'Zuordnung zu Services: Wer bietet was an.', 'Kunden sehen Verfügbarkeit pro Mitarbeiter.'] },
    steps: [
      {
        title: 'Team anlegen',
        icon: 'users-2',
        bullets: [
          { title: 'Name und optional Bild pro Mitarbeiter', description: 'Name und optional Bild – damit Kunden sofort sehen, wen sie buchen.' },
          { title: 'Profile im Dashboard pflegen', description: 'Einmal anlegen, jederzeit aktualisieren – ohne Aufwand.' },
          { title: 'Unbegrenzt viele Mitarbeiter in Pro und Enterprise', description: 'Team wächst – keine Limits in Pro und Enterprise.' },
        ],
        reverse: false
      },
      {
        title: 'Services zuordnen',
        icon: 'spark-magic',
        bullets: [
          { title: 'Services pro Mitarbeiter im Detail zuordnen', description: 'Im Mitarbeiter-Detail ordnest du die passenden Services zu.' },
          { title: 'Ein Mitarbeiter kann mehrere Services anbieten', description: 'Schnitt und Bart – ein Friseur, mehrere Services möglich.' },
          { title: 'Kunden sehen nur Mitarbeiter mit passenden Services', description: 'Relevante Auswahl – keine unnötigen Optionen im Widget.' },
        ],
        reverse: true
      },
      {
        title: 'Kunden buchen',
        icon: 'check',
        bullets: [
          { title: 'Mitarbeiter-Auswahl im Widget sichtbar', description: 'Kunden wählen direkt – Lieblingsfriseur oder beliebig.' },
          { title: 'Slots pro Mitarbeiter angezeigt', description: 'Verfügbarkeit automatisch – kein doppelter Kalender nötig.' },
          { title: 'Kein zusätzlicher Aufwand – alles automatisch', description: 'Einmal eingerichtet – alles läuft von selbst.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '💇', title: 'Friseure', description: 'Kunden buchen ihren Lieblingsfriseur.', link: '/features' },
      { icon: '🧘', title: 'Yoga Studios', description: 'Trainer-Auswahl pro Kurstyp.', link: '/features' },
      { icon: '🏥', title: 'Physiotherapie', description: 'Therapeuten-Buchung mit Fachgebiet.', link: '/features' },
    ],
    relatedFeatures: ['buchungen', 'services', 'objekte'],
    tags: ['mitarbeiter', 'team', 'staffing', 'scheduling', 'roles'],
    faq: [
      { question: 'Wie viele Mitarbeiter kann ich anlegen?', answer: 'Du kannst Mitarbeiter pro Workspace verwalten. Wie viele Workspaces dir zur Verfügung stehen, hängt von deinem Plan ab.' },
      { question: 'Können Mitarbeiter eigene Verfügbarkeiten haben?', answer: 'Aktuell werden Verfügbarkeiten über die Objekt-Einstellungen gesteuert. Mitarbeiter-eigene Kalender sind in Planung.' },
      { question: 'Sehen Kunden die Mitarbeiter im Widget?', answer: 'Ja. Kunden sehen Name und optional Bild und wählen ihren Wunsch-Mitarbeiter direkt bei der Buchung aus.' },
      { question: 'Kann ein Mitarbeiter mehrere Services anbieten?', answer: 'Ja. Du ordnest einem Mitarbeiter beliebig viele Services zu – z. B. Schnitt und Bart beim Friseur.' },
      { question: 'Gibt es ein Limit für Mitarbeiter?', answer: 'Mitarbeiter werden innerhalb deiner Workspaces verwaltet. Relevante Limits ergeben sich über die Workspace-Anzahl deines Plans.' },
    ],
  },
};
