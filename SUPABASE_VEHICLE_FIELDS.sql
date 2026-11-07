-- Run once in Supabase SQL Editor. Safe for existing vehicle records.
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS luggage_capacity text NOT NULL DEFAULT '';
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS air_conditioning boolean NOT NULL DEFAULT false;
-- Then open Admin > Vehicles and edit each vehicle to enter luggage and tick A/C as appropriate.
