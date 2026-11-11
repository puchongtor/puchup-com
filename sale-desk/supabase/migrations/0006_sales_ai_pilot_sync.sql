-- Pilot sync: profiles without Auth yet + email + manager role

do $$ begin
  alter type public.user_role add value if not exists 'manager';
exception when duplicate_object then null;
end $$;

alter table public.profiles
  drop constraint if exists profiles_id_fkey;

alter table public.profiles
  add column if not exists email text;

alter table public.profiles
  alter column id set default gen_random_uuid();
