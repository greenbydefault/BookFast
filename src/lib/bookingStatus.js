const resolveDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

export const getEffectiveBookingStatus = (booking, now = new Date()) => {
    const status = booking?.status || 'pending';

    if (status !== 'confirmed') return status;

    const startTime = resolveDate(booking.start_time);
    const endTime = resolveDate(booking.end_time);

    if (endTime && endTime < now) return 'completed';
    if (startTime && endTime && startTime <= now && endTime >= now) return 'active';
    return status;
};

export const bookingMatchesFilter = (booking, filter, now = new Date()) => {
    if (!filter || filter === 'all') return true;
    if (filter === 'unpaid') return booking?.payment_status === 'unpaid';

    const effectiveStatus = getEffectiveBookingStatus(booking, now);
    return effectiveStatus === filter;
};

export const applyBookingFilterToQuery = (query, filter, nowIso = new Date().toISOString()) => {
    if (!filter || filter === 'all') return query;

    if (filter === 'active') {
        return query.eq('status', 'confirmed').lte('start_time', nowIso).gte('end_time', nowIso);
    }
    if (filter === 'confirmed') {
        return query.eq('status', 'confirmed').gt('start_time', nowIso);
    }
    if (filter === 'completed') {
        return query.or(`status.eq.completed,and(status.eq.confirmed,end_time.lt.${nowIso})`);
    }
    if (filter === 'unpaid') {
        return query.eq('payment_status', 'unpaid');
    }

    return query.eq('status', filter);
};
