-- Enable pg_cron extension (must be done by superuser, usually already enabled on Supabase)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Function to auto-complete confirmed bookings with past end_time
CREATE OR REPLACE FUNCTION auto_complete_bookings()
RETURNS void AS $$
BEGIN
    UPDATE bookings
    SET status = 'completed',
        updated_at = NOW()
    WHERE status = 'confirmed'
      AND end_time < NOW();
END;
$$ LANGUAGE plpgsql;

-- Schedule the cron job to run every hour
-- Note: Supabase pg_cron jobs run in the 'postgres' database
SELECT cron.schedule(
    'auto-complete-bookings',  -- job name
    '0 * * * *',               -- every hour at minute 0
    'SELECT auto_complete_bookings();'
);

-- To check scheduled jobs: SELECT * FROM cron.job;
-- To unschedule: SELECT cron.unschedule('auto-complete-bookings');
