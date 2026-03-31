import { describe, it, expect } from 'vitest';
import { getFeaturePage, getAllFeaturePages } from './getLocaleContent.js';
import '../../src/locales/en/features/index.js';

describe('getFeaturePage', () => {
  it('returns DE feature data by default', () => {
    const page = getFeaturePage('buchungen', 'de');
    expect(page).toBeDefined();
    expect(page.slug).toBe('buchungen');
    expect(page.meta.title).toBeTruthy();
  });

  it('returns null for unknown slug', () => {
    expect(getFeaturePage('nonexistent', 'de')).toBeNull();
    expect(getFeaturePage('nonexistent', 'en')).toBeNull();
  });

  it('returns EN feature data when registered', () => {
    const page = getFeaturePage('buchungen', 'en');
    expect(page).toBeDefined();
    expect(page.slug).toBe('buchungen');
    expect(page.meta.title).not.toBe('Webflow Terminbuchung verwalten');
  });

  it('getAllFeaturePages returns merged EN+DE for en locale', () => {
    const all = getAllFeaturePages('en');
    expect(all.buchungen).toBeDefined();
    expect(all.objekte).toBeDefined();
    expect(all.buchungen.meta.title).not.toBe('Webflow Terminbuchung verwalten');
  });

  it('getAllFeaturePages returns DE for de locale', () => {
    const all = getAllFeaturePages('de');
    expect(all.buchungen.meta.title).toBe('Webflow Terminbuchung verwalten');
  });
});
