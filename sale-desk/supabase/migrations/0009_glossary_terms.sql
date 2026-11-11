-- Glossary สินค้า Advance Pro (อนุมัติแล้วใช้ใน prompt เลขา/STT)
create table if not exists public.glossary_terms (
  id uuid primary key default gen_random_uuid(),
  org_id text not null default 'advancepro',
  canonical text not null,
  category text,
  aliases text[] not null default '{}',
  lang text not null default 'th',
  status text not null default 'approved'
    check (status in ('approved', 'pending', 'rejected')),
  source text not null default 'website'
    check (source in ('website', 'import', 'manual', 'ai_suggested')),
  seen_count int not null default 0,
  example_event_id uuid,
  approved_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (org_id, canonical)
);

create index if not exists glossary_terms_status_idx
  on public.glossary_terms (org_id, status);

alter table public.glossary_terms enable row level security;
