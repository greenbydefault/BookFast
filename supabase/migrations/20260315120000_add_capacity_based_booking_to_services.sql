-- Add capacity_based_booking to services (Mehrfachbuchung / kapazitätsbasiert buchbar)
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS capacity_based_booking BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.services.capacity_based_booking IS 'When true, multiple bookings per slot allowed up to object capacity; when false, one booking per slot.';
