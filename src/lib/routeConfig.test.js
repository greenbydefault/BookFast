import { describe, it, expect } from 'vitest';
import {
  CANONICAL_ROUTE_PAIRS,
  PLACEHOLDER_ROUTE_PAIRS,
  REDIRECT_ROUTE_PAIRS,
  ROUTE_PAIRS,
  DE_TO_EN_PATH,
  EN_TO_DE_PATH,
  LANDING_DE_PATHS,
} from './routeConfig.js';

describe('routeConfig', () => {
  it('every DE path has an EN counterpart and vice versa', () => {
    for (const pair of ROUTE_PAIRS) {
      expect(pair.de).toBeTruthy();
      expect(pair.en).toBeTruthy();
      expect(pair.en.startsWith('/en')).toBe(true);
    }
  });

  it('keeps canonical, placeholder, and redirect routes separated', () => {
    expect(CANONICAL_ROUTE_PAIRS.every((pair) => pair.routeType === 'canonical')).toBe(true);
    expect(PLACEHOLDER_ROUTE_PAIRS.every((pair) => pair.routeType === 'placeholder')).toBe(true);
    expect(REDIRECT_ROUTE_PAIRS.every((pair) => pair.routeType === 'redirect')).toBe(true);
  });

  it('DE_TO_EN_PATH and EN_TO_DE_PATH are consistent inverses', () => {
    for (const [de, en] of Object.entries(DE_TO_EN_PATH)) {
      expect(EN_TO_DE_PATH[en]).toBe(de);
    }
    for (const [en, de] of Object.entries(EN_TO_DE_PATH)) {
      expect(DE_TO_EN_PATH[de]).toBe(en);
    }
  });

  it('LANDING_DE_PATHS contains all DE paths from ROUTE_PAIRS', () => {
    for (const pair of ROUTE_PAIRS) {
      expect(LANDING_DE_PATHS.has(pair.de)).toBe(true);
    }
  });

  it('includes all known marketing routes', () => {
    const expectedDePaths = [
      '/', '/produkt', '/preise', '/integrationen', '/ressourcen',
      '/ueber-uns', '/kontakt', '/features', '/impressum',
      '/datenschutz', '/agb', '/waitlist/confirm',
    ];
    for (const p of expectedDePaths) {
      expect(DE_TO_EN_PATH[p]).toBeDefined();
    }
  });

  it('stores redirect targets for alias routes', () => {
    expect(REDIRECT_ROUTE_PAIRS).toEqual([
      expect.objectContaining({
        de: '/integrationen',
        en: '/en/integrations',
        redirectTarget: { de: '/produkt', en: '/en/product' },
      }),
    ]);
  });
});
