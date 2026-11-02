-- Run once in Supabase SQL Editor. Never expose service_role keys in the browser.
create table if not exists public.admin_users (user_id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.vehicles (id uuid primary key default gen_random_uuid(),name text not null,description text default '',passengers integer default 0 check(passengers between 0 and 100),images text[] not null default '{}',published boolean not null default false,created_at timestamptz not null default now());
create table if not exists public.tour_photos (id uuid primary key default gen_random_uuid(),title text not null,description text default '',image_url text not null,published boolean not null default false,created_at timestamptz not null default now());
create table if not exists public.reviews (id uuid primary key default gen_random_uuid(),name text not null check(char_length(name) between 1 and 80),country text default '',text text not null check(char_length(text) between 10 and 1500),rating integer not null check(rating between 1 and 5),language text not null default 'en' check(language in ('en','ru','he')),approved boolean not null default false,created_at timestamptz not null default now());
create or replace function public.is_site_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.admin_users where user_id=auth.uid()) $$;
revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to authenticated, anon;
alter table public.admin_users enable row level security;
alter table public.vehicles enable row level security;
alter table public.tour_photos enable row level security;
alter table public.reviews enable row level security;
create policy "admin own profile" on public.admin_users for select to authenticated using (user_id=auth.uid());
create policy "public published vehicles" on public.vehicles for select to anon,authenticated using (published=true or (select public.is_site_admin()));
create policy "admin vehicles write" on public.vehicles for all to authenticated using ((select public.is_site_admin())) with check ((select public.is_site_admin()));
create policy "public published photos" on public.tour_photos for select to anon,authenticated using (published=true or (select public.is_site_admin()));
create policy "admin photos write" on public.tour_photos for all to authenticated using ((select public.is_site_admin())) with check ((select public.is_site_admin()));
create policy "public approved reviews" on public.reviews for select to anon,authenticated using (approved=true or (select public.is_site_admin()));
create policy "public submit reviews" on public.reviews for insert to anon,authenticated with check (approved=false);
create policy "admin review management" on public.reviews for all to authenticated using ((select public.is_site_admin())) with check ((select public.is_site_admin()));
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('tour-media','tour-media',true,6291456,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;
create policy "admin upload tour media" on storage.objects for insert to authenticated with check(bucket_id='tour-media' and (select public.is_site_admin()));
create policy "admin delete tour media" on storage.objects for delete to authenticated using(bucket_id='tour-media' and (select public.is_site_admin()));
-- After creating your admin user in Supabase Authentication > Users, run separately:
-- insert into public.admin_users(user_id) values ('YOUR-AUTH-USER-UUID');

-- Add-on: private lead inbox and booking pipeline. Apply after the base schema.
create table if not exists public.inquiries (
 id uuid primary key default gen_random_uuid(),
 name text not null check(char_length(name) between 2 and 100),
 email text not null check(char_length(email) between 5 and 180),
 phone text default '',
 start_date date, end_date date,
 travelers integer not null default 2 check(travelers between 1 and 40),
 budget text default '', vehicle text default '', destinations text[] not null default '{}',
 interests text default '', language text not null default 'en' check(language in ('en','ru','he')),
 consent boolean not null default false check(consent=true),
 source text not null default 'tour-builder',
 status text not null default 'new' check(status in ('new','contacted','quoted','deposit_pending','confirmed','completed','cancelled')),
 created_at timestamptz not null default now());
alter table public.inquiries enable row level security;
create policy "public create inquiry" on public.inquiries for insert to anon,authenticated with check(status='new' and consent=true and source='tour-builder');
create policy "admin read inquiries" on public.inquiries for select to authenticated using ((select public.is_site_admin()));
create policy "admin update inquiries" on public.inquiries for update to authenticated using ((select public.is_site_admin())) with check ((select public.is_site_admin()));
create policy "admin delete inquiries" on public.inquiries for delete to authenticated using ((select public.is_site_admin()));
