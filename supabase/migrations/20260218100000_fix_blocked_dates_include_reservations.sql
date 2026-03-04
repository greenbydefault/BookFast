-- Fix: blocked_dates soll auch aktive Slot-Reservierungen für daily/overnight enthalten
-- Eigene Session-Reservierungen werden ausgeschlossen (p_session_id)
CREATE OR REPLACE FUNCTION get_availability_for_range(
    p_object_id UUID,
    p_start_date DATE,
    p_end_date DATE,
    p_session_id TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_bookings JSONB;
  v_reservations JSONB;
BEGIN
  SELECT COALESCE(
    jsonb_agg(jsonb_build_object(
      'id', b.id,
      'date', (b.start_time AT TIME ZONE 'Europe/Berlin')::date,
      'start_time', to_char(b.start_time AT TIME ZONE 'Europe/Berlin', 'HH24:MI'),
      'end_time', to_char(b.end_time AT TIME ZONE 'Europe/Berlin', 'HH24:MI'),
      'status', b.status
    )),
    '[]'::jsonb
  ) INTO v_bookings
  FROM bookings b
  WHERE b.object_id = p_object_id
    AND b.status NOT IN ('cancelled', 'rejected')
    AND (b.start_time AT TIME ZONE 'Europe/Berlin')::date >= p_start_date
    AND (b.start_time AT TIME ZONE 'Europe/Berlin')::date <= p_end_date;

  SELECT COALESCE(
    jsonb_agg(entry),
    '[]'::jsonb
  ) INTO v_reservations
  FROM (
    SELECT jsonb_build_object(
      'id', sr.id,
      'date', d::date,
      'start_time', to_char(
        GREATEST(sr.start_time, (d::date AT TIME ZONE 'Europe/Berlin')::timestamptz),
        'HH24:MI'
      ),
      'end_time', to_char(
        LEAST(sr.end_time, ((d::date + 1) AT TIME ZONE 'Europe/Berlin')::timestamptz - interval '1 second'),
        'HH24:MI'
      ),
      'status', 'reservation'
    ) as entry
    FROM slot_reservations sr,
    LATERAL generate_series(
      (sr.start_time AT TIME ZONE 'Europe/Berlin')::date,
      (sr.end_time AT TIME ZONE 'Europe/Berlin')::date,
      '1 day'::interval
    ) d
    WHERE sr.object_id = p_object_id
      AND sr.expires_at > now()
      AND (p_session_id IS NULL OR sr.browser_session_id IS DISTINCT FROM p_session_id)
      AND (sr.start_time AT TIME ZONE 'Europe/Berlin')::date <= p_end_date
      AND (sr.end_time AT TIME ZONE 'Europe/Berlin')::date >= p_start_date
  ) sub;

  SELECT jsonb_build_object(
    'bookings', v_bookings || v_reservations,
    'blocked_dates', COALESCE((
      SELECT jsonb_agg(DISTINCT blocked_date)
      FROM (
        SELECT (b.start_time AT TIME ZONE 'Europe/Berlin')::date as blocked_date
        FROM bookings b
        JOIN services s ON s.id = b.service_id
        WHERE b.object_id = p_object_id
          AND b.status NOT IN ('cancelled', 'rejected')
          AND s.service_type IN ('daily', 'overnight')
          AND (b.start_time AT TIME ZONE 'Europe/Berlin')::date >= p_start_date
          AND (b.start_time AT TIME ZONE 'Europe/Berlin')::date <= p_end_date
        UNION ALL
        SELECT d::date as blocked_date
        FROM slot_reservations sr
        JOIN services s ON s.id = sr.service_id
        CROSS JOIN LATERAL generate_series(
          (sr.start_time AT TIME ZONE 'Europe/Berlin')::date,
          (sr.end_time AT TIME ZONE 'Europe/Berlin')::date,
          '1 day'::interval
        ) d
        WHERE sr.object_id = p_object_id
          AND sr.expires_at > now()
          AND (p_session_id IS NULL OR sr.browser_session_id IS DISTINCT FROM p_session_id)
          AND s.service_type IN ('daily', 'overnight')
          AND d::date >= p_start_date
          AND d::date <= p_end_date
      ) blocked
    ), '[]'::jsonb)
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;
