/* @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { createPricingCard } from './PricingCard.js';

describe('PricingCard localization', () => {
  it('renders English toggle chrome and Agency-safe copy', () => {
    const html = createPricingCard({
      locale: 'en',
      name: 'Agency',
      price: '29,49',
      workspaces: 10,
      cta: 'Start with Agency',
    });

    expect(html).toContain('Monthly');
    expect(html).toContain('Yearly');
    expect(html).toContain('2 months free');
    expect(html).toContain('aria-label="Number of workspaces"');
    expect(html).toContain('Agency');
  });
});
