-- Add new artifact types: funding_map and adapted_pitch
ALTER TABLE public.artifacts DROP CONSTRAINT IF EXISTS artifacts_type_check;
ALTER TABLE public.artifacts ADD CONSTRAINT artifacts_type_check CHECK (type IN (
  'bmc', 'scorecard', 'financial_model',
  'experiment_roadmap', 'competitor_map', 'pitch_outline',
  'funding_map', 'adapted_pitch'
));
