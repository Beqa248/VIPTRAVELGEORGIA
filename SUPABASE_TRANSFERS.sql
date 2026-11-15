-- Run in Supabase SQL editor. Existing tables are untouched.
create table if not exists public.transfer_routes (
 slug text primary key check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), names jsonb not null,
 category text not null check(category in ('airport','city','ski','border','mountain')),
 outbound numeric check(outbound >= 0), inbound numeric check(inbound >= 0),
 winter_percent numeric not null default 0 check(winter_percent >= 0), winter_start text not null default '12-01', winter_end text not null default '03-31',
 winter_quote numeric check(winter_quote >= 0), vehicle_prices jsonb not null default '{}',
 cover_url text default '', duration text default '', distance text default '', published boolean not null default true, featured boolean not null default false,
 allow_from boolean not null default true, allow_to boolean not null default true
);
alter table public.transfer_routes enable row level security;
drop policy if exists transfer_read on public.transfer_routes;
create policy transfer_read on public.transfer_routes for select to anon,authenticated using(published or (select public.is_site_admin()));
drop policy if exists transfer_admin on public.transfer_routes;
create policy transfer_admin on public.transfer_routes for all to authenticated using((select public.is_site_admin())) with check((select public.is_site_admin()));
grant select on public.transfer_routes to anon,authenticated;
grant insert,update,delete on public.transfer_routes to authenticated;
insert into public.transfer_routes(slug,names,category,outbound,inbound,winter_percent,winter_quote,featured) values
('batumi-airport','{"en": "Batumi Airport", "ka": "ბათუმის აეროპორტი", "ru": "Аэропорт Батуми", "he": "נמל התעופה באטומי"}'::jsonb,'airport',20,20,0,null,false),
('sarpi','{"en": "Sarpi Border", "ka": "სარფი", "ru": "Сарпи", "he": "גבול סארפי"}'::jsonb,'border',30,30,0,null,false),
('kobuleti','{"en": "Kobuleti", "ka": "ქობულეთი", "ru": "Кобулети", "he": "קובולתי"}'::jsonb,'city',35,35,0,null,false),
('shekvetili','{"en": "Shekvetili", "ka": "შეკვეთილი", "ru": "Шекветили", "he": "שקוותילי"}'::jsonb,'city',45,45,0,null,false),
('ureki','{"en": "Ureki", "ka": "ურეკი", "ru": "Уреки", "he": "אורקי"}'::jsonb,'city',50,50,0,null,false),
('poti','{"en": "Poti", "ka": "ფოთი", "ru": "Поти", "he": "פותי"}'::jsonb,'city',65,65,0,null,false),
('kutaisi-airport','{"en": "Kutaisi Airport", "ka": "ქუთაისის აეროპორტი", "ru": "Аэропорт Кутаиси", "he": "נמל התעופה כותאיסי"}'::jsonb,'airport',120,120,0,null,true),
('kutaisi','{"en": "Kutaisi", "ka": "ქუთაისი", "ru": "Кутаиси", "he": "כותאיסי"}'::jsonb,'city',120,120,0,null,false),
('zugdidi','{"en": "Zugdidi", "ka": "ზუგდიდი", "ru": "Зугдиди", "he": "זוגדידי"}'::jsonb,'city',100,100,0,null,false),
('tbilisi','{"en": "Tbilisi", "ka": "თბილისი", "ru": "Тбилиси", "he": "טביליסי"}'::jsonb,'city',250,250,0,null,true),
('tbilisi-airport','{"en": "Tbilisi Airport", "ka": "თბილისის აეროპორტი", "ru": "Аэропорт Тбилиси", "he": "נמל התעופה טביליסי"}'::jsonb,'airport',300,300,0,null,false),
('borjomi','{"en": "Borjomi", "ka": "ბორჯომი", "ru": "Боржоми", "he": "בורג׳ומי"}'::jsonb,'city',200,200,0,null,false),
('goderdzi','{"en": "Goderdzi", "ka": "გოდერძი", "ru": "Годердзи", "he": "גודרדזי"}'::jsonb,'ski',150,150,27,null,true),
('mestia','{"en": "Mestia / Hatsvali", "ka": "მესტია / ჰაწვალი", "ru": "Местия / Хацвали", "he": "מסטיה / חצוואלי"}'::jsonb,'ski',220,220,22,null,true),
('bakuriani','{"en": "Bakuriani", "ka": "ბაკურიანი", "ru": "Бакуриани", "he": "בקוריאני"}'::jsonb,'ski',230,230,20,null,false),
('gudauri','{"en": "Gudauri", "ka": "გუდაური", "ru": "Гудаури", "he": "גודאורי"}'::jsonb,'ski',330,330,20,null,false),
('kazbegi','{"en": "Kazbegi", "ka": "ყაზბეგი", "ru": "Казбеги", "he": "קזבגי"}'::jsonb,'mountain',350,350,20,null,false),
('tetnuldi','{"en": "Tetnuldi", "ka": "თეთნულდი", "ru": "Тетнулди", "he": "טטנולדי"}'::jsonb,'ski',null,null,20,320,false)
on conflict(slug) do nothing;
