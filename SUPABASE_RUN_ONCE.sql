-- Run ONCE in Supabase SQL Editor before uploading the patch.
-- Existing vehicle data and RLS policies are preserved.
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS luggage_capacity text NOT NULL DEFAULT '';
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS drivetrain text NOT NULL DEFAULT '';
