-- Add challenge mode to conversations and challenge_scorecard artifact type

-- Update conversations mode constraint to include 'challenge'
ALTER TABLE public.conversations DROP CONSTRAINT IF EXISTS conversations_mode_check;
ALTER TABLE public.conversations ADD CONSTRAINT conversations_mode_check CHECK (mode IN (
  'diagnostico', 'financiero', 'pitch', 'qa', 'latam', 'challenge'
));

-- Update artifacts type constraint to include 'challenge_scorecard'
ALTER TABLE public.artifacts DROP CONSTRAINT IF EXISTS artifacts_type_check;
ALTER TABLE public.artifacts ADD CONSTRAINT artifacts_type_check CHECK (type IN (
  'bmc', 'scorecard', 'financial_model',
  'experiment_roadmap', 'competitor_map', 'pitch_outline',
  'funding_map', 'adapted_pitch', 'investor_deck',
  'challenge_scorecard'
));
