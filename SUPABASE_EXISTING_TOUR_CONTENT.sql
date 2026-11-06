-- Run once in Supabase SQL Editor. Existing tour content remains unchanged.
CREATE TABLE IF NOT EXISTS public.tour_content (
 slug text PRIMARY KEY,
 overview text NOT NULL DEFAULT '',
 itinerary text NOT NULL DEFAULT '',
 updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.tour_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tour content public read" ON public.tour_content;
CREATE POLICY "Tour content public read" ON public.tour_content FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Tour content admin insert" ON public.tour_content;
CREATE POLICY "Tour content admin insert" ON public.tour_content FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (select auth.uid())));
DROP POLICY IF EXISTS "Tour content admin update" ON public.tour_content;
CREATE POLICY "Tour content admin update" ON public.tour_content FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (select auth.uid()))) WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (select auth.uid())));
