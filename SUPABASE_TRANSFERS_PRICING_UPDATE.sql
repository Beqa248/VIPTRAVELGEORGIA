begin;
create table if not exists public.transfer_private_pricing (slug text primary key references public.transfer_routes(slug) on delete cascade, settings jsonb not null default '{}');
alter table public.transfer_private_pricing enable row level security;
revoke all on public.transfer_private_pricing from anon, authenticated;
grant select,insert,update,delete on public.transfer_private_pricing to authenticated;
drop policy if exists private_transfer_admin on public.transfer_private_pricing;
create policy private_transfer_admin on public.transfer_private_pricing for all to authenticated using ((select public.is_site_admin())) with check ((select public.is_site_admin()));
update public.transfer_routes set outbound=ceil(outbound/10)*10,inbound=ceil(inbound/10)*10 where outbound is not null or inbound is not null;
commit;
