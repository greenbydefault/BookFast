/**
 * HTML/Attribute sanitization helpers.
 * Use these whenever interpolating dynamic strings into innerHTML.
 */

const ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const ESCAPE_RE = /[&<>"']/g;

/** Escape a string for safe use inside HTML text nodes / innerHTML. */
export const escapeHtml = (str = '') =>
  String(str).replace(ESCAPE_RE, (ch) => ESCAPE_MAP[ch]);

/** Escape a string for safe use inside an HTML attribute value. */
export const escapeAttr = escapeHtml;
