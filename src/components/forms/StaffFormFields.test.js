import { describe, it, expect, beforeEach } from 'vitest';
import { createStaffFormFields } from './StaffFormFields.js';

// Inject a minimal SVG sprite so getIconString doesn't break
beforeEach(() => {
  document.body.innerHTML = `
    <svg style="display:none">
      <symbol id="icon-calender-days-date"></symbol>
      <symbol id="icon-clock"></symbol>
      <symbol id="icon-gear"></symbol>
      <symbol id="icon-user"></symbol>
    </svg>`;
});

describe('StaffFormFields', () => {
  it('renders without crashing', () => {
    const { element } = createStaffFormFields();
    expect(element).toBeTruthy();
    expect(element.querySelector('[data-field="name"]')).toBeTruthy();
  });

  it('renders day toggles for all 7 days', () => {
    const { element } = createStaffFormFields();
    const days = element.querySelectorAll('.day-toggle');
    expect(days.length).toBe(7);
  });

  it('marks active days correctly', () => {
    const { element } = createStaffFormFields({
      state: { bookableDays: ['Mo', 'Fr'] },
    });
    const active = element.querySelectorAll('.day-toggle.active');
    expect(active.length).toBe(2);
    expect(active[0].textContent.trim()).toBe('Mo');
    expect(active[1].textContent.trim()).toBe('Fr');
  });

  it('toggles day on click and reports via onChange', () => {
    let lastState = null;
    const { element } = createStaffFormFields({
      state: { bookableDays: ['Mo', 'Di', 'Mi'] },
      onChange: (s) => { lastState = s; },
    });
    const moBtn = element.querySelector('[data-day="Mo"]');
    moBtn.click();
    expect(lastState).toBeTruthy();
    expect(lastState.bookableDays).not.toContain('Mo');
    expect(lastState.bookableDays).toContain('Di');
  });

  it('reports name changes via onChange', () => {
    let lastState = null;
    const { element } = createStaffFormFields({
      onChange: (s) => { lastState = s; },
    });
    const input = element.querySelector('[data-field="name"]');
    input.value = 'Test';
    input.dispatchEvent(new Event('input'));
    expect(lastState.name).toBe('Test');
  });

  it('getState returns current state', () => {
    const { getState, element } = createStaffFormFields({
      state: { name: 'Anna', bookableDays: ['Mo'] },
    });
    expect(getState().name).toBe('Anna');
    expect(getState().bookableDays).toEqual(['Mo']);
  });

  it('renders services multi-select', () => {
    const { element } = createStaffFormFields({
      options: {
        services: [
          { value: 's1', label: 'Service A' },
          { value: 's2', label: 'Service B' },
        ],
      },
    });
    const select = element.querySelector('.multi-select-dropdown');
    expect(select).toBeTruthy();
  });
});
