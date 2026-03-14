-- Add price_type to services: per_unit (pro Stunde/Tag/Nacht) or per_person
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS price_type TEXT DEFAULT 'per_unit' CHECK (price_type IN ('per_unit', 'per_person'));

COMMENT ON COLUMN public.services.price_type IS 'per_unit = price for duration; per_person = price multiplied by guest_count';
