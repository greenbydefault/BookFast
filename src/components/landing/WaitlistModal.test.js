/* @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from 'vitest';
import { openWaitlistModal } from './WaitlistModal.js';

describe('WaitlistModal localization', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('waitlist-modal')?.remove();
  });

  it('renders English copy when the path is /en', () => {
    history.replaceState({}, '', '/en');
    openWaitlistModal();

    const modal = document.getElementById('waitlist-modal');
    expect(modal?.getAttribute('role')).toBe('dialog');
    expect(modal?.querySelector('#waitlist-modal-title')?.textContent).toBe('Join the waitlist');
    expect(modal?.querySelector('#waitlist-submit-btn')?.textContent?.trim()).toBe('Join');
  });
});
