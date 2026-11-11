-- Advance Pro Sales AI — combined migration (idempotent-ish)
-- Run once in Supabase SQL Editor OR via scripts/run-sales-sql-pg.mjs

do $$ begin
  create type public.user_role as enum ('owner', 'sale');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.lead_status as enum ('new', 'contacted', 'won', 'lost');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.report_status as enum ('collecting', 'summarized');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'sale',
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.sales_reports (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.profiles(id) on delete cascade,
  report_date date not null default current_date,
  raw_transcript text,
  ai_summary text,
  expenses numeric(12,2) default 0,
  customers_contacted integer default 0,
  status public.report_status not null default 'collecting',
  created_at timestamptz not null default now(),
  unique (sale_id, report_date)
);

create table if not exists public.report_messages (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.sales_reports(id) on delete cascade,
  sender text not null check (sender in ('sale', 'assistant')),
  content text,
  image_url text,
  audio_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  interest text,
  details text,
  preferred_time text,
  source text default 'website',
  status public.lead_status not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.sales_reports enable row level security;
alter table public.report_messages enable row level security;
alter table public.leads enable row level security;

alter table public.profiles
  add column if not exists nickname text,
  add column if not exists position text,
  add column if not exists avatar_url text,
  add column if not exists manager_id uuid references public.profiles(id),
  add column if not exists status text not null default 'active',
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_norm text not null,
  address text,
  province text,
  account_owner uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (name_norm)
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  position text,
  phone text,
  line_id text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  sales_id uuid not null references public.profiles(id) on delete cascade,
  company_id uuid references public.companies(id),
  company_name_text text,
  status text not null default 'in_progress'
    check (status in ('in_progress','processing','pending_review','confirmed','void')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  confirmed_at timestamptz,
  distance_km numeric(7,1),
  created_at timestamptz not null default now()
);

create table if not exists public.raw_events (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid references public.visits(id) on delete cascade,
  sales_id uuid not null references public.profiles(id),
  kind text not null check (kind in ('audio','text','image','file')),
  storage_path text,
  mime text,
  text_content text,
  meta jsonb not null default '{}',
  client_created_at timestamptz not null default now(),
  received_at timestamptz not null default now()
);

create table if not exists public.visit_summaries (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references public.visits(id) on delete cascade,
  version int not null default 1,
  status text not null check (status in ('ai_draft','sales_edited','confirmed')),
  data jsonb not null,
  field_sources jsonb not null default '{}',
  field_confidence jsonb not null default '{}',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (visit_id, version)
);

create table if not exists public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id),
  visit_id uuid references public.visits(id),
  assigned_to uuid not null references public.profiles(id),
  title text not null,
  due_date date,
  status text not null default 'open' check (status in ('open','done','dismissed')),
  created_at timestamptz not null default now()
);

alter table public.companies enable row level security;
alter table public.contacts enable row level security;
alter table public.visits enable row level security;
alter table public.raw_events enable row level security;
alter table public.visit_summaries enable row level security;
alter table public.follow_ups enable row level security;
