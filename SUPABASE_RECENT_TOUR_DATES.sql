begin;
alter table public.recent_tours alter column tour_date drop not null;
alter table public.recent_tours alter column tour_date drop default;
alter table public.recent_tours add column if not exists tour_end_date date;
alter table public.recent_tours drop constraint if exists recent_tours_valid_date_range;
alter table public.recent_tours add constraint recent_tours_valid_date_range check (tour_end_date is null or (tour_date is not null and tour_end_date >= tour_date));
commit;
