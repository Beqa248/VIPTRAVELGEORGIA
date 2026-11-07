-- Run once in Supabase SQL Editor before using multiple photos per region.
ALTER TABLE public.travel_regions ADD COLUMN IF NOT EXISTS gallery_images text[] NOT NULL DEFAULT ARRAY[]::text[];
