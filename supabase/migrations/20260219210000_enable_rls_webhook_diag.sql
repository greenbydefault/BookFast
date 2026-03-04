-- Enable RLS on Supabase internal webhook diagnostic table
-- No policies = anon/authenticated blocked; service role bypasses RLS

ALTER TABLE public._webhook_diag ENABLE ROW LEVEL SECURITY;
