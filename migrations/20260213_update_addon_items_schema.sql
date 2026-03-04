-- Add selection_mode to addon_items table
ALTER TABLE addon_items ADD COLUMN IF NOT EXISTS selection_mode TEXT DEFAULT 'quantity';

-- Optional cleanup
-- ALTER TABLE addons DROP COLUMN IF EXISTS content_items;
