-- แจ้งเตือนที่ผู้จัดการติกเสร็จแล้ว — จำต่อบัญชี ไม่ผูกเบราว์เซอร์

create table if not exists public.manager_alert_done (
  manager_id uuid not null references public.profiles(id) on delete cascade,
  alert_id text not null,
  title text not null default '',
  company_name text not null default '',
  sales_name text not null default '',
  hint text not null default '',
  href text not null default '',
  alert_when text not null default '',
  done_at timestamptz not null default now(),
  primary key (manager_id, alert_id)
);

create index if not exists manager_alert_done_manager_idx
  on public.manager_alert_done (manager_id, done_at desc);

comment on table public.manager_alert_done is
  'Manager inbox: alerts marked done — server-side so progress survives devices';
