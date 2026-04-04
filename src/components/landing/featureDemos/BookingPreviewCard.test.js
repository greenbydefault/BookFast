/* @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import '../../../locales/en/featureDemoModules/index.js';
import { getFeatureDemoModuleContent } from '../../../lib/getLocaleDemoModule.js';
import { createBookingPreviewCard, initBookingPreviewCard } from './BookingPreviewCard.js';

const mountCard = (locale) => {
  const content = getFeatureDemoModuleContent('buchungen', locale);
  document.body.innerHTML = `<div id="root">${createBookingPreviewCard({ content, locale })}</div>`;
  const root = document.getElementById('root');
  initBookingPreviewCard(root, { content, locale });
  return { root, content };
};

describe('BookingPreviewCard localization', () => {
  it('renders English copy when English module content is provided', () => {
    const { root } = mountCard('en');

    expect(root.textContent).toContain('Bookings');
    expect(root.textContent).toContain('Inbox & status');
    expect(root.textContent).toContain('Widget booking');
    expect(root.textContent).toContain('Send magic link');
  });

  it('keeps interaction labels localized after state changes', () => {
    const { root } = mountCard('en');

    root.querySelector('#booking-demo-send-link')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    root.querySelector('#booking-demo-approve')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(root.textContent).toContain('Magic link sent');
    expect(root.textContent).toContain('Approve');
    expect(root.textContent).toContain('Confirmed');
  });
});
