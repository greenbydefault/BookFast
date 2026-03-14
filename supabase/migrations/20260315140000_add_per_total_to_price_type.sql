-- Add per_total (gesamt) to price_type options
ALTER TABLE public.services DROP CONSTRAINT IF EXISTS services_price_type_check;
ALTER TABLE public.services ADD CONSTRAINT services_price_type_check
    CHECK (price_type IN ('per_unit', 'per_person', 'per_total'));

COMMENT ON COLUMN public.services.price_type IS 'per_unit = price for duration; per_person = price * guest_count; per_total = flat total price';
