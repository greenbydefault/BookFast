import { describe, it, expect } from 'vitest';
import {
  FEATURE_DE_TO_EN_SLUG,
  deFeatureSlugToEn,
  enFeatureSlugToDe,
} from './featureSlugLocale.js';

describe('feature slug locale', () => {
  it('round-trips every mapped slug', () => {
    for (const [de, en] of Object.entries(FEATURE_DE_TO_EN_SLUG)) {
      expect(deFeatureSlugToEn(de)).toBe(en);
      expect(enFeatureSlugToDe(en)).toBe(de);
    }
  });

  it('returns null for unknown slugs', () => {
    expect(deFeatureSlugToEn('nope')).toBeNull();
    expect(enFeatureSlugToDe('nope')).toBeNull();
  });
});
