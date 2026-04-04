import { describe, expect, it } from 'vitest';
import '../locales/en/featureDemoModules/index.js';
import { getFeatureDemoModuleContent } from './getLocaleDemoModule.js';

describe('getFeatureDemoModuleContent', () => {
  it('returns canonical DE content for German locale', () => {
    const module = getFeatureDemoModuleContent('buchungen', 'de');

    expect(module?.card.title).toBe('Buchungen');
    expect(module?.filters.map((item) => item.label)).toEqual(['Wartend', 'Bestätigt', 'Abgeschlossen']);
  });

  it('returns localized EN content for English locale', () => {
    const module = getFeatureDemoModuleContent('buchungen', 'en');

    expect(module?.card.title).toBe('Bookings');
    expect(module?.sections.magicLink).toBe('Create manually & magic link');
    expect(module?.sourceLabels.manual).toBe('Manual booking');
  });

  it('returns null for unknown module keys', () => {
    expect(getFeatureDemoModuleContent('unknown-module', 'en')).toBeNull();
  });
});
