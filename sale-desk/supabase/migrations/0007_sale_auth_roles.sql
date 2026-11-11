-- Sale portal auth: username + roles admin | reports | sales

alter table public.profiles
  add column if not exists username text,
  add column if not exists password_hash text;

create unique index if not exists profiles_username_lower_uidx
  on public.profiles (lower(username))
  where username is not null;

-- role column → text with app roles
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles'
      and column_name = 'role' and udt_name = 'user_role'
  ) then
    alter table public.profiles alter column role drop default;
    alter table public.profiles
      alter column role type text
      using (
        case role::text
          when 'sale' then 'sales'
          when 'owner' then 'reports'
          when 'manager' then 'reports'
          else role::text
        end
      );
  end if;
end $$;

update public.profiles
set role = case role
  when 'sale' then 'sales'
  when 'owner' then 'reports'
  when 'manager' then 'reports'
  else role
end
where role in ('sale', 'owner', 'manager');

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'reports', 'sales'));

alter table public.profiles alter column role set default 'sales';
