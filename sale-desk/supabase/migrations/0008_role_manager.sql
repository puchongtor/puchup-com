-- Rename reports → manager (ผู้บริหาร)

update public.profiles
set role = 'manager'
where role in ('reports', 'owner');

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'manager', 'sales'));
