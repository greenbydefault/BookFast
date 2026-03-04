-- Add 'per_booking' to the addon_pricing_type enum if it doesn't exist
ALTER TYPE addon_pricing_type ADD VALUE IF NOT EXISTS 'per_booking';
