import { describe, expect, it } from 'vitest';
import {
  CANONICAL_STATIC_ROUTES,
  PLACEHOLDER_STATIC_ROUTES,
  REDIRECT_ALIAS_ROUTES,
  buildSitemapXml,
} from './marketingSeoConfig.js';

describe('marketingSeoConfig', () => {
  it('includes canonical localized pages and feature detail pages', () => {
    expect(CANONICAL_STATIC_ROUTES).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: '/', locale: 'de', routeType: 'canonical' }),
        expect.objectContaining({ path: '/en', locale: 'en', routeType: 'canonical' }),
        expect.objectContaining({ path: '/features/buchungen', locale: 'de', routeType: 'canonical' }),
        expect.objectContaining({ path: '/en/features/bookings', locale: 'en', routeType: 'canonical' }),
      ]),
    );
  });

  it('keeps placeholders and redirect aliases out of canonical sitemap generation', () => {
    expect(PLACEHOLDER_STATIC_ROUTES).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: '/ressourcen', routeType: 'placeholder' }),
        expect.objectContaining({ path: '/en/resources', routeType: 'placeholder' }),
      ]),
    );

    expect(REDIRECT_ALIAS_ROUTES).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: '/integrationen', targetPath: '/produkt', routeType: 'redirect' }),
        expect.objectContaining({ path: '/en/integrations', targetPath: '/en/product', routeType: 'redirect' }),
      ]),
    );

    const sitemap = buildSitemapXml();
    expect(sitemap).toContain('<loc>https://book-fast.de/produkt</loc>');
    expect(sitemap).toContain('<loc>https://book-fast.de/en/product</loc>');
    expect(sitemap).not.toContain('/integrationen');
    expect(sitemap).not.toContain('/en/integrations');
    expect(sitemap).not.toContain('/ressourcen');
    expect(sitemap).not.toContain('/en/resources');
  });
});
