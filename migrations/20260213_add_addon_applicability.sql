-- Create enum for addon item applicability
DO $$ BEGIN
    CREATE TYPE addon_applicability AS ENUM ('booking', 'guest');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Move applicability to addon_items (per content item, not per addon)
ALTER TABLE addon_items
ADD COLUMN IF NOT EXISTS applicability addon_applicability NOT NULL DEFAULT 'guest';

-- Remove from addons if it was added there previously
ALTER TABLE addons DROP COLUMN IF EXISTS applicability;

-- Comments:
-- 'booking': This item applies once per booking (e.g. Aufguss-Set)
-- 'guest':   This item applies per guest (e.g. Bademantel)
