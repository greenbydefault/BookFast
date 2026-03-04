-- Add addon_selections and guest_count columns to bookings table if they don't exist
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS addon_selections JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS guest_count INTEGER DEFAULT 1;

-- Add comment for documentation
COMMENT ON COLUMN bookings.addon_selections IS 'Stores the detailed selection of addons including quantity and variants';
COMMENT ON COLUMN bookings.guest_count IS 'Number of guests for this booking';
