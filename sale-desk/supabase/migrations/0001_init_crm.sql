-- Advance Pro CRM / Sales reporting foundation
-- Apply in Supabase SQL editor or CLI after creating the project.

create type public.user_role as enum ('owner', 'sale');
create type public.lead_status as enum ('new', 'contacted', 'won', 'lost');
create type public.report_status as enum ('collecting', 'summarized');

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
