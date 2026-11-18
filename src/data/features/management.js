/**
 * Management features: Mitarbeiter (remaining after consolidation)
 * Previously: Addons, Gutscheine, Kunden — absorbed into services, zahlungen, analytics.
 */
export const management = {
  mitarbeiter: {
    slug: 'mitarbeiter',
    meta: { title: 'Mitarbeiterverwaltung', description: 'Ordne Mitarbeiter Services zu und lege ihre Arbeitstage fest. Kunden wählen ihren Wunsch-Mitarbeiter bei der Buchung.' },
    hero: {
      headline: 'Kunden buchen den richtigen Mitarbeiter, ohne Rückfrage.',
      subheadline: 'Mitarbeiter anlegen, Services zuordnen, Arbeitstage festlegen. Deine Kunden wählen im Widget, wen sie buchen.',
      demoModule: 'mitarbeiter',
      illustration: '/src/svg/illustrations/landingpage/features/ft_mitarbeiterverwaltung.svg',
      trustClaims: ['Kostenlos testen', 'Keine Kreditkarte nötig', 'In unter 5 Minuten startklar'],
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="staff-profile"]',
      '[data-demo-section="staff-services"]',
      '[data-demo-section="staff-availability"]',
    ],
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So richtest du Mitarbeiter ein',
    interactiveHowItWorksHeadline: 'Team anlegen, Services zuordnen, fertig.',
    problem: { text: 'Wer arbeitet wann? Wer macht welchen Service? Ohne klare Zuordnung endet Terminplanung im Hin und Her zwischen Telefon und Kalender.', bullets: ['Mitarbeiterprofile mit Name und Bild.', 'Zuordnung zu Services: Wer bietet was an.', 'Buchbare Tage pro Mitarbeiter.'] },
    steps: [
      {
        title: 'Team anlegen',
        icon: 'users-2',
        bullets: [
          { title: 'Name pro Mitarbeiter', description: 'Im Mitarbeiter-Detail ergänzt du ein Bild per URL.' },
          { title: 'Profile im Dashboard pflegen', description: 'Änderungen speichern automatisch.' },
          { title: 'So viele Mitarbeiter, wie du brauchst', description: 'Es gibt kein Limit pro Workspace.' },
        ],
        reverse: false
      },
      {
        title: 'Services zuordnen',
        icon: 'gear',
        bullets: [
          { title: 'Services pro Mitarbeiter zuordnen', description: 'Beim Anlegen oder später im Mitarbeiter-Detail.' },
          { title: 'Ein Mitarbeiter, mehrere Services', description: 'Schnitt und Bart: ein Friseur, beide Services.' },
          { title: 'Kunden sehen nur passende Mitarbeiter', description: 'Im Widget erscheinen nur Mitarbeiter, die den gewählten Service anbieten.' },
        ],
        reverse: true
      },
      {
        title: 'Kunden buchen',
        icon: 'check',
        bullets: [
          { title: 'Mitarbeiter-Auswahl im Widget', description: 'Kunden wählen ihren Wunsch-Mitarbeiter oder "Egal".' },
          { title: 'Nur an buchbaren Tagen', description: 'Arbeitet Jennifer montags nicht, kann sie montags niemand buchen.' },
          { title: 'Mitarbeiter steht in der Buchung', description: 'Du siehst im Dashboard, wer den Termin übernimmt.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '💇', title: 'Friseure', description: 'Kunden buchen ihren Lieblingsfriseur.', link: '/features' },
      { icon: '🧘', title: 'Yoga Studios', description: 'Trainer-Auswahl pro Kurstyp.', link: '/features' },
      { icon: '🏥', title: 'Physiotherapie', description: 'Therapeuten pro Behandlungsart zuordnen.', link: '/features' },
    ],
    relatedFeatures: ['buchungen', 'services', 'objekte'],
    tags: ['mitarbeiter', 'team', 'staffing', 'scheduling', 'roles'],
    faq: [
      { question: 'Wie viele Mitarbeiter kann ich anlegen?', answer: 'So viele du brauchst. Mitarbeiter gehören zu einem Workspace.' },
      { question: 'Können Mitarbeiter eigene Verfügbarkeiten haben?', answer: 'Ja, als buchbare Wochentage. Urlaub trägst du im Dashboard unter Urlaub ein, dann sind diese Tage im Widget für ihn gesperrt. Eigene Uhrzeiten oder Pausen pro Mitarbeiter gibt es noch nicht, die Uhrzeiten kommen vom Service oder Objekt.' },
      { question: 'Sehen Kunden die Mitarbeiter im Widget?', answer: 'Ja. Kunden sehen die Mitarbeiter, die den gewählten Service anbieten, und wählen einen aus oder nehmen "Egal".' },
      { question: 'Kann ein Mitarbeiter mehrere Services anbieten?', answer: 'Ja. Du ordnest einem Mitarbeiter beliebig viele Services zu, zum Beispiel Schnitt und Bart beim Friseur.' },
      { question: 'Verhindert BookFast Doppelbuchungen pro Mitarbeiter?', answer: 'Geprüft wird das Objekt. Wenn zwei Mitarbeiter im selben Raum arbeiten, ist der Slot nach der ersten Buchung weg. Eine eigene Kollisionsprüfung pro Mitarbeiter fehlt noch.' },
    ],
  },
};
