/* @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from 'vitest';
import '../../../locales/en/features/index.js';
import { renderFeaturePage } from './FeaturePageTemplate.js';

describe('FeaturePageTemplate localization', () => {
  beforeEach(() => {
    document.body.innerHTML = '<main id="landing-content"></main>';
  });

  it('uses English breadcrumb hrefs on EN feature pages', () => {
    history.replaceState({}, '', '/en/features/bookings');
    renderFeaturePage('buchungen', 'en');

    const crumbs = Array.from(document.querySelectorAll('.feature-hero__breadcrumb a'));
    expect(crumbs.map((a) => a.getAttribute('href'))).toEqual(['/en', '/en/features']);
    expect(document.querySelector('.feature-hero__hint')?.textContent).toContain('No account');
    expect(document.querySelector('.landing-faq-section-header .landing-h2')?.textContent).toContain(
      'Frequently asked questions about',
    );
  });
});
