/**
 * German marketing copy for the landing homepage.
 */
import { HOME_FEATURES_STEPS } from './homeFeatures.js';
import { SHARED_FAQ } from './faq.js';

export { HOME_FEATURES_STEPS };

export const HOME_META = {
  title: null,
  description:
    'Das Webflow Buchungssystem für Terminbuchung & Online-Zahlungen. 0 % Provision, Zahlung vor Termin. In 5 Min. live.',
};

export const HERO = {
  tagline: 'Buchungssystem für Webflow',
  headline: 'Book {logo} Fast jetzt testen.<br>Ohne Anmeldung.',
  logoAlt: 'BookFast Plus-Logo',
  subheadline: 'Workspace-Name eingeben und Live-Demo starten.',
  illustrationAlt: 'Startseiten-Illustration mit BookFast Demo, Buchungen und Zahlung vor Termin',
  formLabel: 'Workspace-Name',
  formPlaceholder: 'z.B. Alpine Chalets, Studio Nordlicht…',
  formButtonText: 'Live-Demo starten',
  formHint: 'Ohne Account Live Demo testen.',
  trustClaims: ['0% Provision', 'Webflow-native', 'Zahlung vor Termin'],
};

export const HOW_IT_WORKS = {
  label: 'Hauptfeatures',
  headline: 'Was BookFast auf einer Webflow-Seite konkret macht.',
};

export const CTA = {
  headline: 'Buchungen auf deiner Website. In 5 Minuten eingerichtet.',
  subheadline: '3 Tage kostenlos testen. Keine Kreditkarte nötig.\nIn unter 5 Minuten startklar.',
};

export const FAQ = SHARED_FAQ;
