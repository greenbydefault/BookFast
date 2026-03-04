-- Add content_items JSONB column to addons table
-- Stores items with variants and selection modes
ALTER TABLE addons ADD COLUMN IF NOT EXISTS content_items JSONB DEFAULT NULL;
