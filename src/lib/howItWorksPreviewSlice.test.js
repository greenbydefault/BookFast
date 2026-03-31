import { describe, it, expect, beforeEach } from 'vitest';
import { getHowItWorksPreviewHtml } from './howItWorksPreviewSlice.js';

const buildFixture = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div id="feature-hero-demo">
      <div class="feature-hero__card-frame" id="frame-live">
        <div class="feature-demo-card" id="card-live">
          <div class="feature-demo-card__body" id="body-live">
            <div data-demo-section="slice-a" id="sec-a"><span>A</span></div>
            <div data-demo-section="slice-b" id="sec-b"><span>B</span></div>
          </div>
        </div>
      </div>
    </div>
  `;
  return container;
};

describe('getHowItWorksPreviewHtml', () => {
  let container;

  beforeEach(() => {
    container = buildFixture();
  });

  it('returns empty string when hero frame is missing', () => {
    const empty = document.createElement('div');
    expect(getHowItWorksPreviewHtml(empty, 0, {})).toBe('');
  });

  it('without sliceSelectors returns full frame clone without ids', () => {
    const html = getHowItWorksPreviewHtml(container, 0, {});
    expect(html).toContain('feature-hero__card-frame');
    expect(html).toContain('data-demo-section="slice-a"');
    expect(html).toContain('data-demo-section="slice-b"');
    expect(html).not.toMatch(/id="frame-live"/);
    expect(html).not.toMatch(/id="body-live"/);
  });

  it('with sliceSelectors replaces body with only the matching section', () => {
    const selectors = ['[data-demo-section="slice-a"]', '[data-demo-section="slice-b"]'];
    const html0 = getHowItWorksPreviewHtml(container, 0, { sliceSelectors: selectors });
    expect(html0).toContain('data-demo-section="slice-a"');
    expect(html0).toContain('<span>A</span>');
    expect(html0).not.toContain('<span>B</span>');

    const html1 = getHowItWorksPreviewHtml(container, 1, { sliceSelectors: selectors });
    expect(html1).toContain('data-demo-section="slice-b"');
    expect(html1).toContain('<span>B</span>');
    expect(html1).not.toContain('<span>A</span>');
  });

  it('falls back to full clone when selector matches nothing', () => {
    const html = getHowItWorksPreviewHtml(container, 0, {
      sliceSelectors: ['[data-demo-section="missing"]'],
    });
    expect(html).toContain('data-demo-section="slice-a"');
    expect(html).toContain('data-demo-section="slice-b"');
  });

  it('falls back to full clone when stepIndex is out of range', () => {
    const html = getHowItWorksPreviewHtml(container, 5, {
      sliceSelectors: ['[data-demo-section="slice-a"]'],
    });
    expect(html).toContain('data-demo-section="slice-a"');
    expect(html).toContain('data-demo-section="slice-b"');
  });
});
