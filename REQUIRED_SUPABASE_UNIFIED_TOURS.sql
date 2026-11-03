-- Run once in Supabase SQL Editor BEFORE uploading the Next.js files.
-- Existing tour_page_media and existing tour pages are NOT changed.
CREATE TABLE IF NOT EXISTS public.custom_tours (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 title text NOT NULL,
 description text NOT NULL DEFAULT '',
 duration_days integer NOT NULL DEFAULT 1 CHECK (duration_days BETWEEN 1 AND 60),
 category text NOT NULL DEFAULT 'other',
 itinerary text NOT NULL DEFAULT '',
 cover_url text,
 gallery_images text[] NOT NULL DEFAULT '{}',
 published boolean NOT NULL DEFAULT false,
 sort_order integer NOT NULL DEFAULT 100,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.custom_tours ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read published custom tours" ON public.custom_tours;
CREATE POLICY "Public read published custom tours" ON public.custom_tours FOR SELECT TO anon,authenticated USING (published OR (SELECT public.is_site_admin()));
DROP POLICY IF EXISTS "Admins manage custom tours" ON public.custom_tours;
CREATE POLICY "Admins manage custom tours" ON public.custom_tours FOR ALL TO authenticated USING ((SELECT public.is_site_admin())) WITH CHECK ((SELECT public.is_site_admin()));
-- This uses your existing is_site_admin() function and tour-media storage bucket.
-- Do not paste any API secret keys into the website code.

-- Existing tours are now editable in the same table as newly created tours.
ALTER TABLE public.custom_tours ADD COLUMN IF NOT EXISTS is_original boolean NOT NULL DEFAULT false;
-- Preserve any existing custom tours and any prior edits; only insert missing originals.
INSERT INTO public.custom_tours (slug,title,description,cover_url,published,sort_order,is_original) VALUES ('adjara','Adjarian Mountains','Waterfalls, stone arch bridges and mountain villages above Batumi.','/images/photo-003.jpg',true,10,true) ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.custom_tours (slug,title,description,cover_url,published,sort_order,is_original) VALUES ('martvili','Martvili Canyons & Prometheus Caves','Emerald canyons, boat rides and the colorful stalactite halls of Prometheus Cave.','/images/photo-009.jpg',true,20,true) ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.custom_tours (slug,title,description,cover_url,published,sort_order,is_original) VALUES ('gomis','Gomis Mta','High mountain meadows, wooden huts and sunsets above the clouds.','/images/photo-018.jpg',true,30,true) ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.custom_tours (slug,title,description,cover_url,published,sort_order,is_original) VALUES ('svaneti','Svaneti','Medieval tower villages, glaciers, alpine lakes and waterfalls under snowy peaks.','/images/photo-026.jpg',true,40,true) ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.custom_tours (slug,title,description,cover_url,published,sort_order,is_original) VALUES ('kobuleti','Kobuleti Coastline','Black Sea coast, seaside parks and family-friendly sights around Kobuleti.','/images/photo-044.jpg',true,50,true) ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.custom_tours (slug,title,description,cover_url,published,sort_order,is_original) VALUES ('dashbashi','Dashbashi Canyon & Diamond Bridge','Cascading waterfalls into a clear green pool, plus the diamond-shaped glass bridge.','/images/photo-051.jpg',true,60,true) ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.custom_tours (slug,title,description,cover_url,published,sort_order,is_original) VALUES ('vardzia','Vardzia & Rabati Castle','A cave city carved into the rock and the restored medieval castle in Akhaltsikhe.','/images/photo-057.jpg',true,70,true) ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.custom_tours (slug,title,description,cover_url,published,sort_order,is_original) VALUES ('tusheti','Tusheti','Stone tower villages with wooden balconies and dramatic mountain roads.','/images/photo-064.jpg',true,80,true) ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.custom_tours (slug,title,description,cover_url,published,sort_order,is_original) VALUES ('beshumi','Beshumi & Green Lake','A mountain village of wooden houses among meadows and forests, and Green Lake.','/images/photo-073.jpg',true,90,true) ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.custom_tours (slug,title,description,cover_url,published,sort_order,is_original) VALUES ('kazbegi','Kazbegi & Juta','Gergeti Trinity Church, Mount Kazbek and the Juta valley.','/images/photo-080.jpg',true,100,true) ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.custom_tours (slug,title,description,cover_url,published,sort_order,is_original) VALUES ('highlights','Georgia Highlights & many more','The best-known sights of Georgia in one route.','/images/photo-086.jpg',true,110,true) ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.custom_tours (slug,title,description,cover_url,published,sort_order,is_original) VALUES ('airport-transfers','Airport transfers','Pickup from Batumi or Kutaisi airport in a comfortable car.',NULL,true,120,true) ON CONFLICT (slug) DO NOTHING;
