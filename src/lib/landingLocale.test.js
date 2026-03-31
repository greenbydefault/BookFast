import { describe, it, expect } from 'vitest';
import { getLocaleFromPath, normalizeLandingPath } from './landingLocale.js';

describe('normalizeLandingPath', () => {
  it('maps /index.html to /', () => {
    expect(normalizeLandingPath('/index.html')).toBe('/');
  });

  it('maps /en/ to /en', () => {
    expect(normalizeLandingPath('/en/')).toBe('/en');
  });

  it('leaves /produkt unchanged', () => {
    expect(normalizeLandingPath('/produkt')).toBe('/produkt');
  });
});

describe('getLocaleFromPath', () => {
  it('returns de for root', () => {
    expect(getLocaleFromPath('/')).toBe('de');
  });

  it('returns en for /en', () => {
    expect(getLocaleFromPath('/en')).toBe('en');
  });

  it('returns en for paths under /en/', () => {
    expect(getLocaleFromPath('/en/pricing')).toBe('en');
  });

  it('returns de for German paths', () => {
    expect(getLocaleFromPath('/preise')).toBe('de');
  });

  it('does not treat /english as English locale', () => {
    expect(getLocaleFromPath('/english')).toBe('de');
  });
});
