-- Run in Supabase SQL Editor on the existing project. This is an additive migration.
-- It preserves your existing vehicles, reviews, images, inquiries, and users.
create table if not exists public.videos (
 id uuid primary key default gen_random_uuid(),
 title text not null, description text not null default '',
 video_url text not null, cover_url text,
 published boolean not null default false,
 created_at timestamptz not null default now()
);
create table if not exists public.recent_tours (
 id uuid primary key default gen_random_uuid(),
 title text not null, description text not null default '',
 tour_date date, images text[] not null default '{}',
 published boolean not null default false,
 created_at timestamptz not null default now()
);
alter table public.reviews add column if not exists tour text not null default '';
alter table public.videos enable row level security;
alter table public.recent_tours enable row level security;
drop policy if exists "public published videos" on public.videos;
create policy "public published videos" on public.videos for select to anon,authenticated using (published=true or (select public.is_site_admin()));
drop policy if exists "admin manage videos" on public.videos;
create policy "admin manage videos" on public.videos for all to authenticated using ((select public.is_site_admin())) with check ((select public.is_site_admin()));
drop policy if exists "public published recent tours" on public.recent_tours;
create policy "public published recent tours" on public.recent_tours for select to anon,authenticated using (published=true or (select public.is_site_admin()));
drop policy if exists "admin manage recent tours" on public.recent_tours;
create policy "admin manage recent tours" on public.recent_tours for all to authenticated using ((select public.is_site_admin())) with check ((select public.is_site_admin()));
-- Explicit public storage read; admin-only writes.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('tour-videos','tour-videos',true,104857600,array['video/mp4','video/webm','video/quicktime'])
on conflict (id) do update set public=true,file_size_limit=104857600,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists "admin upload tour videos" on storage.objects;
create policy "admin upload tour videos" on storage.objects for insert to authenticated with check(bucket_id='tour-videos' and (select public.is_site_admin()));
drop policy if exists "admin delete tour videos" on storage.objects;
create policy "admin delete tour videos" on storage.objects for delete to authenticated using(bucket_id='tour-videos' and (select public.is_site_admin()));
-- Public submissions are forced to remain unapproved; admin approval is separate.
-- Existing review RLS policies from supabase-setup.sql must already be applied.
