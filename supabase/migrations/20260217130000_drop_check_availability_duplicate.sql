-- Remove duplicate check_availability (5-param) so PostgREST can resolve the 6-param version
DROP FUNCTION IF EXISTS check_availability(uuid, timestamptz, timestamptz, integer, integer);
