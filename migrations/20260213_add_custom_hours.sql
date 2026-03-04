-- Add custom_hours JSONB column to objects and services
-- Format: [{ "days": ["Mo", "Di"], "from": "10:00", "to": "18:00" }, ...]
-- When null, global booking_window_start/end applies

ALTER TABLE objects ADD COLUMN IF NOT EXISTS custom_hours JSONB DEFAULT NULL;
ALTER TABLE services ADD COLUMN IF NOT EXISTS custom_hours JSONB DEFAULT NULL;
