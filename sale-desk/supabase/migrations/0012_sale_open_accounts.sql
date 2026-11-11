-- สมุดลูกค้าที่ยังเปิดอยู่ (ไม่ใช่ CRM เต็ม) — ผู้จัดการวางข้อมูลดิบ + เลขาจัด

create table if not exists public.sale_open_accounts (
  id uuid primary key default gen_random_uuid(),
  company_name text not null default '',
  contact_name text,
  phone text,
  note text,
  status text not null default 'open'
    check (status in ('open', 'waiting', 'done', 'dropped')),
  owner_sales_id uuid references public.profiles(id) on delete set null,
  next_action text,
  next_action_at timestamptz,
  source_raw text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sale_open_accounts_status_idx
  on public.sale_open_accounts (status, updated_at desc);

create index if not exists sale_open_accounts_next_action_idx
  on public.sale_open_accounts (next_action_at)
  where next_action_at is not null and status in ('open', 'waiting');

create table if not exists public.sale_open_account_events (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.sale_open_accounts(id) on delete cascade,
  role text not null check (role in ('manager', 'assistant')),
  text text not null,
  created_at timestamptz not null default now()
);

create index if not exists sale_open_account_events_account_idx
  on public.sale_open_account_events (account_id, created_at);

comment on table public.sale_open_accounts is
  'Open/active customer notebook for managers — AI fills from raw text; not a full CRM';
