/* @vitest-environment jsdom */
import { describe, expect, it, vi } from 'vitest';
import { copyWebflowTemplate } from './WorkspaceSection';

describe('copyWebflowTemplate', () => {
  it('enthaelt editierbare Placeholder und inline SVG arrows', async () => {
    const clipboardStore = {};
    const originalExec = document.execCommand;

    document.execCommand = vi.fn((cmd) => {
      if (cmd !== 'copy') return false;
      const evt = new Event('copy', { bubbles: true, cancelable: true });
      Object.defineProperty(evt, 'clipboardData', {
        value: {
          setData: (type, value) => {
            clipboardStore[type] = value;
          }
        }
      });
      document.dispatchEvent(evt);
      return true;
    });

    try {
      await copyWebflowTemplate();

      expect(clipboardStore['application/json']).toBeTruthy();
      const parsed = JSON.parse(clipboardStore['application/json']);
      const nodes = parsed?.payload?.nodes || [];

      const hasObjectPlaceholder = nodes.some((n) => n?.data?.attr?.['data-bf-template'] === 'object-item');
      const hasServicePlaceholder = nodes.some((n) => n?.data?.attr?.['data-bf-template'] === 'service-item');
      const hasAddonPlaceholder = nodes.some((n) => n?.data?.attr?.['data-bf-template'] === 'addon-item');
      const hasTimeslotPlaceholder = nodes.some((n) => n?.data?.attr?.['data-bf-template'] === 'timeslot-item');
      const hasInlineArrowSvg = nodes.some((n) => n?.tag === 'svg' && n?.classes?.length);
      const hasAccordionButtonHeader = nodes.some((n) => n?.classes?.length && n?.data?.tag === 'button' && n?.data?.attr?.type === 'button');

      expect(hasObjectPlaceholder).toBe(true);
      expect(hasServicePlaceholder).toBe(true);
      expect(hasAddonPlaceholder).toBe(true);
      expect(hasTimeslotPlaceholder).toBe(true);
      expect(hasInlineArrowSvg).toBe(true);
      expect(hasAccordionButtonHeader).toBe(true);
    } finally {
      document.execCommand = originalExec;
    }
  });
});
