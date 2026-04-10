/* @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { createCTASection } from './CTASection.js';

describe('CTASection', () => {
  it('uses locale-aware defaults for english CTA sections', () => {
    const html = createCTASection({
      locale: 'en',
      headline: 'Try BookFast for free.',
      primaryCTA: 'Start live demo',
    });

    document.body.innerHTML = html;

    const primary = document.querySelector('.landing-btn-primary');
    const secondary = document.querySelector('.landing-btn-secondary');

    expect(primary?.getAttribute('href')).toBe('/en');
    expect(primary?.textContent?.trim()).toBe('Start live demo');
    expect(secondary?.textContent?.trim()).toBe('Join the waitlist');
    expect(secondary?.hasAttribute('data-landing-waitlist')).toBe(true);
    expect(secondary?.getAttribute('data-landing-link')).toBeNull();
  });
});
