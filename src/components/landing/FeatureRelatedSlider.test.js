import { describe, expect, it } from 'vitest';
import '../../locales/en/features/index.js';
import { getFeaturePage } from '../../lib/getLocaleContent.js';
import { createFeatureRelatedSlider } from './FeatureRelatedSlider.js';

describe('FeatureRelatedSlider localization', () => {
  it('renders English CTA and accessibility copy for English sliders', () => {
    const bookings = { ...getFeaturePage('buchungen', 'en'), slug: 'buchungen' };
    const html = createFeatureRelatedSlider({
      currentTitle: bookings.meta.title,
      features: [bookings],
      locale: 'en',
    });

    expect(html).toContain('View feature');
    expect(html).toContain('aria-label="Previous slide"');
    expect(html).toContain('aria-label="Next slide"');
    expect(html).toContain('title="Show previous slide"');
    expect(html).toContain('title="Show next slide"');
    expect(html).toContain(`alt="Illustration for ${bookings.meta.title} feature"`);
  });
});
