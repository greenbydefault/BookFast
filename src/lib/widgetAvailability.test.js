import { describe, expect, it } from 'vitest';
import {
  generateHourlySlots,
  getDaySlotAvailability,
  hasAvailableSlotsForDate,
  normalizeDateKey,
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

  it('keeps a day bookable when at least one hourly slot is still free', () => {
    const service = {
      service_type: 'hourly',
      duration_minutes: 60,
      booking_window_start: '10:00',
      booking_window_end: '12:00',
    };
    const availability = normalizeAvailabilityPayload({
      bookings: [
        {
          id: 'b1',
          date: '2026-04-01T00:00:00+02:00',
          start_time: '10:00',
          end_time: '11:00',
          status: 'confirmed',
        },
      ],
    });

    expect(getDaySlotAvailability(service, {}, availability, '2026-04-01')).toBe(true);
    expect(hasAvailableSlotsForDate(service, {}, availability, '2026-04-01')).toBe(true);
  });

  it('treats a too-small custom-hours window as a no-slot day', () => {
    const service = {
      service_type: 'hourly',
      duration_minutes: 90,
      booking_window_start: '09:00',
      booking_window_end: '18:00',
      custom_hours: [
        {
          days: ['Mi'],
          from: '10:00',
          to: '11:00',
        },
      ],
    };

    expect(generateHourlySlots(service, {}, [], '2026-04-01')).toEqual([]);
    expect(hasAvailableSlotsForDate(service, {}, normalizeAvailabilityPayload({ bookings: [] }), '2026-04-01')).toBe(false);
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
    expect(availability.loaded).toBe(true);
    expect(getDaySlotAvailability(service, {}, availability, '2026-04-01')).toBe(null);
    expect(hasAvailableSlotsForDate(service, {}, availability, '2026-04-01')).toBe(false);
  });

  it('normalizes rpc date fields to yyyy-mm-dd keys', () => {
    const availability = normalizeAvailabilityPayload({
      blocked_dates: ['2026-04-02T00:00:00+02:00'],
      bookings: [
        {
          id: 'b1',
          date: '2026-04-01 00:00:00+02',
          start_time: '10:00',
          end_time: '11:00',
        },
      ],
    });

    expect(normalizeDateKey('2026-04-01T09:15:00.000Z')).toBe('2026-04-01');
    expect(availability.blocked_dates).toEqual(['2026-04-02']);
    expect(availability.bookings[0].date).toBe('2026-04-01');
  });
});
