alter table public.travel_regions add column if not exists translations jsonb not null default '{}'::jsonb;
