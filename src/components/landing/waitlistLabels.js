import { NAV_EN } from '../../locales/en/navigation.js';

export const getWaitlistLabel = (locale = 'de') =>
  locale === 'en' ? NAV_EN.waitlist : 'Zur Warteliste anmelden';
