-- Run in Supabase SQL Editor before deploying the updated code.
ALTER TABLE public.recent_tours ADD COLUMN IF NOT EXISTS cover_url text;
ALTER TABLE public.recent_tours ADD COLUMN IF NOT EXISTS video_urls text[] NOT NULL DEFAULT '{}';
-- Videos use the existing tour-videos storage bucket. Verify its upload/read policies
-- and its file size limit permit the files you plan to upload.
