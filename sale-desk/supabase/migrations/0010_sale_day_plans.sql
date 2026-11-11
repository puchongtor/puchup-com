-- กำหนดการเช้าของ Sale (วันละ 1 แผ่นต่อคน)

create table if not exists public.sale_day_plans (
  id uuid primary key default gen_random_uuid(),
  sales_id uuid not null references public.profiles(id) on delete cascade,
  day_key text not null,
  stops jsonb not null default '[]'::jsonb,
  note text,
  source text not null default 'coach'
    check (source in ('coach', 'manual')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (sales_id, day_key)
);

create index if not exists sale_day_plans_day_key_idx
  on public.sale_day_plans (day_key);

create index if not exists sale_day_plans_sales_day_idx
  on public.sale_day_plans (sales_id, day_key);

comment on table public.sale_day_plans is
  'Morning agenda for field sales — visible to manager for the day';
