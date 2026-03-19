const PROD_APP_ORIGIN = 'https://app.book-fast.de';
const PROD_LANDING_ORIGIN = 'https://book-fast.de';

export const isLocalDev = () =>
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const getAppUrl = (path = '') => {
  const origin = isLocalDev() ? window.location.origin : PROD_APP_ORIGIN;
  return path ? `${origin}${path}` : origin;
};

export const getLandingUrl = (path = '') => {
  const origin = isLocalDev() ? window.location.origin : PROD_LANDING_ORIGIN;
  return path ? `${origin}${path}` : origin;
};

export const getEmbedBaseUrl = () =>
  import.meta.env.VITE_EMBED_BASE_URL || getAppUrl();
