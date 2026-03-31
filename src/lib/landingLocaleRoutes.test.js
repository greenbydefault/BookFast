import { describe, it, expect } from 'vitest';
import { getLocaleSwitchTarget } from './landingLocaleRoutes.js';

describe('getLocaleSwitchTarget', () => {
  it('maps home DE to EN', () => {
    expect(getLocaleSwitchTarget('/', 'en')).toBe('/en');
  });

  it('maps home EN to DE', () => {
    expect(getLocaleSwitchTarget('/en', 'de')).toBe('/');
  });

  it('maps German feature URL to English feature URL', () => {
    expect(getLocaleSwitchTarget('/features/buchungen', 'en')).toBe('/en/features/bookings');
  });

  it('maps English feature URL to German feature URL', () => {
    expect(getLocaleSwitchTarget('/en/features/bookings', 'de')).toBe('/features/buchungen');
  });

  it('maps pricing path', () => {
    expect(getLocaleSwitchTarget('/preise', 'en')).toBe('/en/pricing');
    expect(getLocaleSwitchTarget('/en/pricing', 'de')).toBe('/preise');
  });

  it('returns same path when target locale already active', () => {
    expect(getLocaleSwitchTarget('/preise', 'de')).toBe('/preise');
    expect(getLocaleSwitchTarget('/en/pricing', 'en')).toBe('/en/pricing');
  });

  it('prefix-swaps unmapped DE path to EN', () => {
    expect(getLocaleSwitchTarget('/some/unknown', 'en')).toBe('/en/some/unknown');
  });

  it('prefix-swaps unmapped EN path to DE', () => {
    expect(getLocaleSwitchTarget('/en/unknown', 'de')).toBe('/unknown');
  });

  it('unknown DE feature slug falls back to EN features hub', () => {
    expect(getLocaleSwitchTarget('/features/nonexistent', 'en')).toBe('/en/features');
  });

  it('unknown EN feature slug falls back to DE features hub', () => {
    expect(getLocaleSwitchTarget('/en/features/nonexistent', 'de')).toBe('/features');
  });

  it('prefix-swaps nested unmapped paths', () => {
    expect(getLocaleSwitchTarget('/foo/bar/baz', 'en')).toBe('/en/foo/bar/baz');
    expect(getLocaleSwitchTarget('/en/foo/bar/baz', 'de')).toBe('/foo/bar/baz');
  });
});
