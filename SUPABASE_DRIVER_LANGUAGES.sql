-- Run once in Supabase SQL Editor before deploying the code.
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS driver_languages text[] NOT NULL DEFAULT '{}'::text[];
