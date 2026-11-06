-- Run once in Supabase SQL Editor before deploying the code.
alter table public.custom_tours add column if not exists archived boolean not null default false;
create index if not exists custom_tours_archived_idx on public.custom_tours (archived);
-- Keep existing RLS policies. No Storage files are deleted.
