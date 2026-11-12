-- PuchUp contact chatbot inbox (shared with marketing site /contact)

create extension if not exists "pgcrypto";

create table if not exists public.contact_sessions (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz not null default now(),
  page_path text not null default '/contact/',
  user_agent text,
  meta jsonb not null default '{}'::jsonb
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.contact_sessions (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_session_created_idx
  on public.contact_messages (session_id, created_at);

create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.contact_sessions (id) on delete cascade,
  name text,
  channel text,
  need text,
  raw_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists contact_leads_session_uidx
  on public.contact_leads (session_id);

create table if not exists public.contact_alerts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.contact_sessions (id) on delete cascade,
  reason text not null,
  status text not null default 'unread' check (status in ('unread', 'read')),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists contact_alerts_status_created_idx
  on public.contact_alerts (status, created_at desc);

alter table public.contact_sessions enable row level security;
alter table public.contact_messages enable row level security;
alter table public.contact_leads enable row level security;
alter table public.contact_alerts enable row level security;
