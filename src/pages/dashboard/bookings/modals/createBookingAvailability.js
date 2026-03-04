const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const DAY_TOKEN_TO_KEY = {
    mo: 'monday',
    mon: 'monday',
    monday: 'monday',
    montag: 'monday',
    di: 'tuesday',
    tue: 'tuesday',
    tues: 'tuesday',
    tuesday: 'tuesday',
    dienstag: 'tuesday',
    mi: 'wednesday',
    wed: 'wednesday',
    wednesday: 'wednesday',
    mittwoch: 'wednesday',
    do: 'thursday',
    thu: 'thursday',
    thur: 'thursday',
    thurs: 'thursday',
    thursday: 'thursday',
    donnerstag: 'thursday',
    fr: 'friday',
    fri: 'friday',
    friday: 'friday',
    freitag: 'friday',
    sa: 'saturday',
    sat: 'saturday',
    saturday: 'saturday',
    samstag: 'saturday',
    so: 'sunday',
    sun: 'sunday',
    sunday: 'sunday',
    sonntag: 'sunday',
};

export const parseISODate = (value) => {
    if (!value) return null;
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
};

export const formatISODate = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : parseISODate(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const extractTimePart = (value) => {
    if (!value) return null;
    const text = String(value).trim();
    const match = text.match(/(\d{1,2}):(\d{2})/);
    if (match) {
        return `${String(Number(match[1])).padStart(2, '0')}:${match[2]}`;
    }
    const parsed = new Date(text);
    if (!Number.isNaN(parsed.getTime())) {
        return `${String(parsed.getHours()).padStart(2, '0')}:${String(parsed.getMinutes()).padStart(2, '0')}`;
    }
    return null;
};

export const parseTimeToMinutes = (timeStr) => {
    const hhmm = extractTimePart(timeStr);
    if (!hhmm) return null;
    const [h, m] = hhmm.split(':').map(Number);
    if (!Number.isFinite(h) || !Number.isFinite(m) || h < 0 || h > 23 || m < 0 || m > 59) return null;
    return h * 60 + m;
};

export const formatMinutesToTime = (minutes) => {
    const clamped = Math.max(0, Math.min(23 * 60 + 59, Number(minutes) || 0));
    const h = String(Math.floor(clamped / 60)).padStart(2, '0');
    const m = String(clamped % 60).padStart(2, '0');
    return `${h}:${m}`;
};

const normalizeDayToken = (token) => {
    if (!token) return null;
    const raw = String(token)
        .trim()
        .toLowerCase()
        .replace(/[ä]/g, 'ae')
        .replace(/[ö]/g, 'oe')
        .replace(/[ü]/g, 'ue')
        .replace(/[ß]/g, 'ss')
        .replace(/\./g, '');
    return DAY_TOKEN_TO_KEY[raw] || null;
};

const weekdayKeyFromISO = (dateISO) => {
    const d = parseISODate(dateISO);
    if (!d) return null;
    const mondayBasedIndex = (d.getDay() + 6) % 7;
    return DAY_KEYS[mondayBasedIndex] || null;
};

const resolveCustomWindowForDate = (customHours, dateISO) => {
    if (!Array.isArray(customHours) || customHours.length === 0) return null;
    const dayKey = weekdayKeyFromISO(dateISO);
    if (!dayKey) return null;
    for (const entry of customHours) {
        const dayTokens = Array.isArray(entry?.days)
            ? entry.days
            : entry?.days
                ? [entry.days]
                : [];
        const matchesDay = dayTokens.some((day) => normalizeDayToken(day) === dayKey);
        if (!matchesDay) continue;
        const start = parseTimeToMinutes(entry?.from);
        const end = parseTimeToMinutes(entry?.to);
        if (start !== null && end !== null && end > start) {
            return { start, end };
        }
    }
    return null;
};

export const resolveWindowForDate = (service, object, dateISO) => {
    const serviceCustom = resolveCustomWindowForDate(service?.custom_hours, dateISO);
    if (serviceCustom) return serviceCustom;

    const serviceStart = parseTimeToMinutes(service?.booking_window_start);
    const serviceEnd = parseTimeToMinutes(service?.booking_window_end);
    if (serviceStart !== null && serviceEnd !== null && serviceEnd > serviceStart) {
        return { start: serviceStart, end: serviceEnd };
    }

    const objectCustom = resolveCustomWindowForDate(object?.custom_hours, dateISO);
    if (objectCustom) return objectCustom;

    const objectStart = parseTimeToMinutes(object?.booking_window_start);
    const objectEnd = parseTimeToMinutes(object?.booking_window_end);
    if (objectStart !== null && objectEnd !== null && objectEnd > objectStart) {
        return { start: objectStart, end: objectEnd };
    }

    return {
        start: parseTimeToMinutes('09:00'),
        end: parseTimeToMinutes('18:00'),
    };
};

export const extractBookingsForDay = (availabilityData, dateISO) => {
    const source = Array.isArray(availabilityData?.bookings) ? availabilityData.bookings : [];
    const result = [];
    source.forEach((entry) => {
        if (!entry) return;
        if (Array.isArray(entry.bookings)) {
            if (entry.date && entry.date !== dateISO) return;
            entry.bookings.forEach((inner) => {
                if (inner) result.push({ ...inner, date: inner.date || entry.date });
            });
            return;
        }
        if (entry.date && entry.date !== dateISO) return;
        result.push(entry);
    });
    return result;
};

export const normalizeBookingInterval = (booking) => {
    if (!booking) return null;
    let start = parseTimeToMinutes(booking.start_time ?? booking.start ?? booking.from);
    let end = parseTimeToMinutes(booking.end_time ?? booking.end ?? booking.to);

    if (start === null || end === null) {
        const startDate = new Date(booking.start_time ?? booking.start ?? booking.from ?? '');
        const endDate = new Date(booking.end_time ?? booking.end ?? booking.to ?? '');
        if (!Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime())) {
            start = startDate.getHours() * 60 + startDate.getMinutes();
            end = endDate.getHours() * 60 + endDate.getMinutes();
        }
    }

    if (start === null || end === null || end <= start) return null;
    return { start, end };
};

export const isSameDay = (a, b) => !!a && !!b && formatISODate(a) === formatISODate(b);
export const isInRange = (day, start, end) => start && end && parseISODate(day) > parseISODate(start) && parseISODate(day) < parseISODate(end);
export const isPastDate = (day) => parseISODate(day) < new Date(new Date().setHours(0, 0, 0, 0));
