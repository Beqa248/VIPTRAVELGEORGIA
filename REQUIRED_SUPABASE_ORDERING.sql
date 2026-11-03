-- Run once before deploying this update. Existing records are preserved.
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS sort_order integer;
ALTER TABLE public.recent_tours ADD COLUMN IF NOT EXISTS sort_order integer;

WITH numbered AS (SELECT id, row_number() OVER (ORDER BY created_at DESC, id) AS n FROM public.videos)
UPDATE public.videos v SET sort_order = numbered.n FROM numbered WHERE v.id = numbered.id AND v.sort_order IS NULL;

WITH numbered AS (SELECT id, row_number() OVER (ORDER BY created_at DESC, id) AS n FROM public.recent_tours)
UPDATE public.recent_tours v SET sort_order = numbered.n FROM numbered WHERE v.id = numbered.id AND v.sort_order IS NULL;
