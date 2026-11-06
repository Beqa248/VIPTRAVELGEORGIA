-- Run once in Supabase SQL Editor BEFORE uploading code.
-- Price settings for existing AND newly created tours.
CREATE TABLE IF NOT EXISTS public.tour_prices (
 slug text PRIMARY KEY,
 price_mode text NOT NULL DEFAULT 'hidden' CHECK (price_mode IN ('starting','request','hidden')),
 price_amount numeric(12,2) CHECK (price_amount IS NULL OR price_amount > 0),
 price_currency text NOT NULL DEFAULT 'USD' CHECK (price_currency IN ('USD','EUR','GEL')),
 price_unit text NOT NULL DEFAULT 'car' CHECK (price_unit IN ('car','person','group'))
);
ALTER TABLE public.tour_prices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read tour prices" ON public.tour_prices;
CREATE POLICY "Public read tour prices" ON public.tour_prices FOR SELECT TO anon,authenticated USING (true);
DROP POLICY IF EXISTS "Admins manage tour prices" ON public.tour_prices;
CREATE POLICY "Admins manage tour prices" ON public.tour_prices FOR ALL TO authenticated
 USING (EXISTS(SELECT 1 FROM public.admin_users WHERE user_id=auth.uid()))
 WITH CHECK (EXISTS(SELECT 1 FROM public.admin_users WHERE user_id=auth.uid()));
-- Retain columns used by the previously supplied New Tours editor.
ALTER TABLE public.custom_tours
 ADD COLUMN IF NOT EXISTS price_mode text NOT NULL DEFAULT 'hidden',
 ADD COLUMN IF NOT EXISTS price_amount numeric(12,2),
 ADD COLUMN IF NOT EXISTS price_currency text NOT NULL DEFAULT 'USD',
 ADD COLUMN IF NOT EXISTS price_unit text NOT NULL DEFAULT 'car';
