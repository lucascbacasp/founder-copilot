-- Add journey progress tracking to founder_profiles
ALTER TABLE public.founder_profiles
ADD COLUMN IF NOT EXISTS journey_progress JSONB DEFAULT '{"completed": [], "skipped": []}'::jsonb;
