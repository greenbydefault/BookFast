/**
 * Normalization helpers for the bookable_days data model.
 *
 * Canonical persisted format: { mon: bool, tue: bool, wed: bool, thu: bool, fri: bool, sat: bool, sun: bool }
 * UI shorthand format: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
 */

const DAY_IDS   = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const DAY_KEYS  = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAYS_LONG = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

export { DAY_IDS, DAY_KEYS, DAYS_LONG };

/** Convert UI shorthand array → persisted object */
export const toBookableDaysObject = (arr = []) => {
  const obj = {};
  DAY_KEYS.forEach((key, i) => { obj[key] = arr.includes(DAY_IDS[i]); });
  return obj;
};

/** Convert persisted object → UI shorthand array */
export const toBookableDaysArray = (obj = {}) =>
  DAY_KEYS.filter((key) => obj[key]).map((key) => DAY_IDS[DAY_KEYS.indexOf(key)]);

/** Get long-form day names for active days in a persisted object */
export const getActiveDayNames = (obj = {}) =>
  DAY_KEYS.filter((k) => obj[k]).map((k) => DAYS_LONG[DAY_KEYS.indexOf(k)]);
