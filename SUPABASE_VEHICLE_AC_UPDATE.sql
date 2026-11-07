-- Run once in Supabase SQL Editor before using the updated vehicle Admin form.
-- Existing rows, RLS policies, and other vehicle fields are preserved.
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS air_conditioning boolean NOT NULL DEFAULT false;
-- Optional: after migration, tick A/C in Admin for each vehicle that has it.
