import {
  CANONICAL_ROUTE_PAIRS,
  PLACEHOLDER_ROUTE_PAIRS,
  REDIRECT_ROUTE_PAIRS,
} from './routeConfig.js';
import { FEATURE_DE_TO_EN_SLUG } from './featureSlugLocale.js';

const BASE_URL = 'https://book-fast.de';

const toLocalizedRouteRecords = (pairs, routeType) =>
  pairs.flatMap((pair) => ([
    { key: `${pair.key}:de`, groupKey: pair.key, locale: 'de', path: pair.de, routeType },
    { key: `${pair.key}:en`, groupKey: pair.key, locale: 'en', path: pair.en, routeType },
  ]));

export const CANONICAL_STATIC_ROUTES = Object.freeze([
  ...toLocalizedRouteRecords(CANONICAL_ROUTE_PAIRS, 'canonical'),
  ...Object.entries(FEATURE_DE_TO_EN_SLUG).flatMap(([deSlug, enSlug]) => ([
    {
      key: `feature:${deSlug}:de`,
      groupKey: `feature:${deSlug}`,
      locale: 'de',
      path: `/features/${deSlug}`,
      routeType: 'canonical',
    },
    {
      key: `feature:${deSlug}:en`,
      groupKey: `feature:${deSlug}`,
      locale: 'en',
      path: `/en/features/${enSlug}`,
      routeType: 'canonical',
    },
  ])),
]);

export const PLACEHOLDER_STATIC_ROUTES = Object.freeze(
  toLocalizedRouteRecords(PLACEHOLDER_ROUTE_PAIRS, 'placeholder'),
);

export const REDIRECT_ALIAS_ROUTES = Object.freeze(
  REDIRECT_ROUTE_PAIRS.flatMap((pair) => ([
    {
      key: `${pair.key}:de`,
      groupKey: pair.key,
      locale: 'de',
      path: pair.de,
      routeType: 'redirect',
      targetPath: pair.redirectTarget.de,
    },
    {
      key: `${pair.key}:en`,
      groupKey: pair.key,
      locale: 'en',
      path: pair.en,
      routeType: 'redirect',
      targetPath: pair.redirectTarget.en,
    },
  ])),
);

export const ALL_STATIC_ROUTES = Object.freeze([
  ...CANONICAL_STATIC_ROUTES,
  ...PLACEHOLDER_STATIC_ROUTES,
]);

const xmlEscape = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

export const buildSitemapXml = () => {
  const urls = CANONICAL_STATIC_ROUTES.map(({ path }) => `${BASE_URL}${path}`);
  const rows = urls
    .map((url) => `  <url><loc>${xmlEscape(url)}</loc></url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows}
</urlset>
`;
};
