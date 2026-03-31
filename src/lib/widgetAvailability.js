const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export const createAvailabilityState = (overrides = {}) => ({
  blocked_dates: [],
  bookings: [],
  error: null,
  ...overrides,
});

export function normalizeAvailabilityPayload(payload, fallbackError = 'Verfugbarkeit konnte nicht geladen werden.') {
  if (!payload || payload.__rpc_failed) {
    return createAvailabilityState({ error: payload?.error || fallbackError });
  }

  return createAvailabilityState({
    blocked_dates: Array.isArray(payload.blocked_dates) ? payload.blocked_dates : [],
    bookings: Array.isArray(payload.bookings) ? payload.bookings : [],
  });
}

function parseDateString(value) {
  if (!value) return null;
  const [year, month, day] = String(value).split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function dayOfWeek(value) {
  const date = parseDateString(value);
  const day = date?.getDay?.() ?? 1;
  return day === 0 ? 6 : day - 1;
}

function parseTime(value) {
  if (!value) return 0;
  const [hours, minutes] = String(value).split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

function formatTime(minutes) {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

export function generateHourlySlots(service, object, booked = [], dateStr = null) {
  if (!service || service.service_type !== 'hourly') return [];

  const ds = dateStr;
  const dayAbbr = ds ? DAYS[dayOfWeek(ds)] : null;
  const serviceCustom = dayAbbr && service.custom_hours?.length
    ? service.custom_hours.find((hours) => hours.days?.includes(dayAbbr))
    : null;
  const objectCustom = dayAbbr && !serviceCustom && object?.custom_hours?.length
    ? object.custom_hours.find((hours) => hours.days?.includes(dayAbbr))
    : null;
  const customHours = serviceCustom || objectCustom;
  const start = parseTime(customHours?.from || service.booking_window_start || object?.booking_window_start || '09:00');
  const end = parseTime(customHours?.to || service.booking_window_end || object?.booking_window_end || '18:00');
  const duration = service.duration_minutes || 60;
  const step = service.fixed_start_times ? duration + (service.buffer_after_minutes || 0) : 30;
  const bufferBefore = service.buffer_before_minutes || 0;
  const bufferAfter = service.buffer_after_minutes || 0;
  const slots = [];

  for (let current = start; current + duration <= end; current += step) {
    const slotStart = current - bufferBefore;
    const slotEnd = current + duration + bufferAfter;
    const isBooked = booked.some((booking) => {
      const bookingStart = parseTime(booking.start_time);
      let bookingEnd = parseTime(booking.end_time);
      if (bookingEnd <= bookingStart && bookingEnd === 0) bookingEnd = 24 * 60;
      return !(slotEnd <= bookingStart || slotStart >= bookingEnd);
    });
    slots.push({ start: formatTime(current), available: !isBooked });
  }

  return slots;
}

export function hasAvailableSlotsForDate(service, object, availability, dateStr) {
  if (!service || service.service_type !== 'hourly') return true;
  if (!availability || availability.error) return false;
  const bookings = (availability.bookings || []).filter((booking) => String(booking?.date || '').slice(0, 10) === dateStr);
  return generateHourlySlots(service, object, bookings, dateStr).some((slot) => slot.available);
}
