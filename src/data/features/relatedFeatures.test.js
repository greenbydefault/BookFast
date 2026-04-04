import { describe, expect, it } from 'vitest';
import '../../locales/en/features/index.js';
import { getFeaturePage } from '../../lib/getLocaleContent.js';
import { getAllFeaturesForSlider, getRelatedFeaturesFor } from './relatedFeatures.js';

describe('relatedFeatures slider content', () => {
  it('returns localized related features for English pages', () => {
    const related = getRelatedFeaturesFor('buchungen', { limit: 3, locale: 'en' });

    expect(related.length).toBeGreaterThan(0);
    related.forEach((feature) => {
      expect(feature.meta.title).toBe(getFeaturePage(feature.slug, 'en')?.meta.title);
      expect(feature.hero.subheadline).toBe(getFeaturePage(feature.slug, 'en')?.hero.subheadline);
    });
  });

  it('returns localized feature data for the pricing slider', () => {
    const features = getAllFeaturesForSlider('en');
    const bookings = features.find((feature) => feature.slug === 'buchungen');

    expect(bookings).toBeDefined();
    expect(bookings?.meta.title).toBe(getFeaturePage('buchungen', 'en')?.meta.title);
    expect(bookings?.hero.subheadline).toBe(getFeaturePage('buchungen', 'en')?.hero.subheadline);
  });
});
