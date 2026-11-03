-- Run once in Supabase SQL Editor BEFORE deploying the review editor.
-- Adds optional attribution metadata without changing existing reviews.
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'Website';
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS tour text NOT NULL DEFAULT '';
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS review_date date;
