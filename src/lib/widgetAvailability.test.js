import { describe, expect, it } from 'vitest';
import {
  generateHourlySlots,
  hasAvailableSlotsForDate,
  normalizeAvailabilityPayload,
} from './widgetAvailability.js';

describe('widget availability helpers', () => {
  it('marks a confirmed booking slot as unavailable', () => {
    const service = {
      service_type: 'hourly',
      duration_minutes: 60,
      booking_window_start: '10:00',
      booking_window_end: '11:00',
    };
    const object = {};
    const availability = {
      blocked_dates: [],
      bookings: [
        {
          id: 'b1',
          date: '2026-04-01',
          start_time: '10:00',
          end_time: '11:00',
          status: 'confirmed',
        },
      ],
      error: null,
    };

    const slots = generateHourlySlots(service, object, availability.bookings, '2026-04-01');

    expect(slots).toEqual([{ start: '10:00', available: false }]);
    expect(hasAvailableSlotsForDate(service, object, availability, '2026-04-01')).toBe(false);
  });

  it('treats failed availability payloads as unavailable instead of free', () => {
    const service = {
      service_type: 'hourly',
      duration_minutes: 60,
      booking_window_start: '10:00',
      booking_window_end: '12:00',
    };
    const availability = normalizeAvailabilityPayload({
      __rpc_failed: true,
      error: 'rpc failed',
    });

    expect(availability.error).toBe('rpc failed');
    expect(hasAvailableSlotsForDate(service, {}, availability, '2026-04-01')).toBe(false);
  });
});
