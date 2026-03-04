-- Add missing German invoice requirements to workspaces table
ALTER TABLE workspaces 
ADD COLUMN IF NOT EXISTS managing_directors TEXT,
ADD COLUMN IF NOT EXISTS register_court TEXT,
ADD COLUMN IF NOT EXISTS register_number TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;
