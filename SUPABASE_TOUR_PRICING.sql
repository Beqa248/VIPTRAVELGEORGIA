-- Run in Supabase SQL Editor before uploading code. Existing prices default to hidden.
ALTER TABLE public.custom_tours ADD COLUMN IF NOT EXISTS price_mode text NOT NULL DEFAULT 'hidden';
ALTER TABLE public.custom_tours ADD COLUMN IF NOT EXISTS price_amount numeric(12,2);
ALTER TABLE public.custom_tours ADD COLUMN IF NOT EXISTS price_currency text NOT NULL DEFAULT 'USD';
ALTER TABLE public.custom_tours ADD COLUMN IF NOT EXISTS price_unit text NOT NULL DEFAULT 'car';
ALTER TABLE public.custom_tours DROP CONSTRAINT IF EXISTS custom_tours_price_mode_check;
ALTER TABLE public.custom_tours ADD CONSTRAINT custom_tours_price_mode_check CHECK (price_mode IN ('hidden','request','starting'));
ALTER TABLE public.custom_tours DROP CONSTRAINT IF EXISTS custom_tours_price_currency_check;
ALTER TABLE public.custom_tours ADD CONSTRAINT custom_tours_price_currency_check CHECK (price_currency IN ('USD','EUR','GEL'));
ALTER TABLE public.custom_tours DROP CONSTRAINT IF EXISTS custom_tours_price_unit_check;
ALTER TABLE public.custom_tours ADD CONSTRAINT custom_tours_price_unit_check CHECK (price_unit IN ('car','person','group'));
ALTER TABLE public.custom_tours DROP CONSTRAINT IF EXISTS custom_tours_price_amount_check;
ALTER TABLE public.custom_tours ADD CONSTRAINT custom_tours_price_amount_check CHECK (price_amount IS NULL OR price_amount > 0);
