-- Run once in Supabase SQL Editor before deploying the updated tour Admin.
-- Retains existing records and permissions; adds one optional translations field.
ALTER TABLE public.custom_tours
  ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb;
