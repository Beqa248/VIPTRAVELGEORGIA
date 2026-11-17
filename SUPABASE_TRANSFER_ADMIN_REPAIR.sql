-- Run only if the admin list remains empty or reports permission errors.
-- Requires the existing transfer_routes table and is_site_admin() function.
begin;
alter table public.transfer_routes enable row level security;
grant select on public.transfer_routes to anon, authenticated;
grant insert, update, delete on public.transfer_routes to authenticated;
drop policy if exists transfer_read on public.transfer_routes;
create policy transfer_read on public.transfer_routes for select to anon, authenticated using (published or (select public.is_site_admin()));
drop policy if exists transfer_admin on public.transfer_routes;
create policy transfer_admin on public.transfer_routes for all to authenticated using ((select public.is_site_admin())) with check ((select public.is_site_admin()));
create table if not exists public.transfer_private_pricing (slug text primary key references public.transfer_routes(slug) on delete cascade, settings jsonb not null default '{}');
alter table public.transfer_private_pricing enable row level security;
revoke all on public.transfer_private_pricing from anon, authenticated;
grant select, insert, update, delete on public.transfer_private_pricing to authenticated;
drop policy if exists private_transfer_admin on public.transfer_private_pricing;
create policy private_transfer_admin on public.transfer_private_pricing for all to authenticated using ((select public.is_site_admin())) with check ((select public.is_site_admin()));
commit;
-- Diagnostic: list existing routes without changing prices or reseeding deleted rows.
select slug, names->>'en' as destination, published from public.transfer_routes order by slug;
