-- Run once in Supabase SQL Editor. Safe to rerun; does not overwrite edited region rows.
create table if not exists public.travel_regions (
 id uuid primary key default gen_random_uuid(),
 slug text unique,
 title text not null,
 description text not null default '',
 image_url text not null default '',
 link_url text not null default '/tours',
 sort_order integer not null default 0,
 published boolean not null default true,
 created_at timestamptz not null default now()
);
create index if not exists travel_regions_order_idx on public.travel_regions(sort_order);
alter table public.travel_regions enable row level security;
drop policy if exists "Anyone can view published regions" on public.travel_regions;
create policy "Anyone can view published regions" on public.travel_regions for select to anon using (published = true);
drop policy if exists "Admins can manage regions" on public.travel_regions;
create policy "Admins can manage regions" on public.travel_regions for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
insert into public.travel_regions(slug,title,description,image_url,link_url,sort_order,published) values
('adjara','Adjara highlands','Waterfalls, stone arch bridges, mountain villages and sunsets above the clouds.','/images/photo-002.jpg','/adjara',0,true),
('black-sea-coast','Black Sea coast','Seaside parks, Black Sea views and coastal road trips.','/images/photo-044.jpg','/kobuleti',1,true),
('western-georgia','Western Georgia','Canyons, caves, waterfalls and lush nature.','/images/photo-009.jpg','/martvili',2,true),
('svaneti','Svaneti','Stone towers, glaciers, alpine lakes and mountain adventures.','/images/photo-027.jpg','/svaneti',3,true),
('kazbegi-juta','Kazbegi & Juta','Mountain scenery, iconic viewpoints and scenic drives.','/images/photo-078.jpg','/kazbegi',4,true),
('southern-georgia','Southern Georgia','Vardzia cave city, Rabati Castle and breathtaking history.','/images/photo-056.jpg','/vardzia',5,true),
('tbilisi-mtskheta','Tbilisi & Mtskheta','Landmarks, architecture, food and culture.','/images/photo-086.jpg','/highlights',6,true),
('tusheti','Tusheti','Remote villages and one of Georgia’s most dramatic mountain roads.','/images/photo-063.jpg','/tusheti',7,true)
on conflict (slug) do nothing;
