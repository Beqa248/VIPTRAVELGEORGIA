-- Run once in Supabase SQL Editor before deploying the patch.
ALTER TABLE public.travel_regions ADD COLUMN IF NOT EXISTS archived boolean NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS travel_regions_archived_idx ON public.travel_regions(archived);
-- Public SELECT policy must exclude archived items, including direct API requests.
DROP POLICY IF EXISTS "Anyone can view published regions" ON public.travel_regions;
CREATE POLICY "Anyone can view published regions" ON public.travel_regions FOR SELECT TO anon USING (published = true AND archived = false);
-- Existing authenticated admin RLS policy is preserved.
