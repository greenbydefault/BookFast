/* @vitest-environment jsdom */
import { describe, expect, it, vi } from 'vitest';
import { copyWebflowTemplate } from './WorkspaceSection';

describe('copyWebflowTemplate', () => {
  it('enthaelt editierbare Placeholder, inline SVG arrows und Step-2 Figma-Struktur', async () => {
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
      const hasStepCounter = nodes.some((n) => n?.text === true && n?.v === 'Schritt 2/2');
      const hasStreetBind = nodes.some((n) => n?.data?.attr?.['data-bf-bind'] === 'street');
      const hasHouseBind = nodes.some((n) => n?.data?.attr?.['data-bf-bind'] === 'houseNumber');
      const hasSummaryAddon = nodes.some((n) => n?.data?.attr?.['data-bf-display'] === 'summary-addon');
      const hasSummarySubtotal = nodes.some((n) => n?.data?.attr?.['data-bf-display'] === 'summary-subtotal');
      const hasSummaryTax = nodes.some((n) => n?.data?.attr?.['data-bf-display'] === 'summary-tax');

      expect(hasObjectPlaceholder).toBe(true);
      expect(hasServicePlaceholder).toBe(true);
      expect(hasAddonPlaceholder).toBe(true);
      expect(hasTimeslotPlaceholder).toBe(true);
      expect(hasInlineArrowSvg).toBe(true);
      expect(hasAccordionButtonHeader).toBe(true);
      expect(hasStepCounter).toBe(true);
      expect(hasStreetBind).toBe(true);
      expect(hasHouseBind).toBe(true);
      expect(hasSummaryAddon).toBe(true);
      expect(hasSummarySubtotal).toBe(true);
      expect(hasSummaryTax).toBe(true);
    } finally {
      document.execCommand = originalExec;
    }
  });
});
