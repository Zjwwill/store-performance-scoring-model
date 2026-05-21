create extension if not exists pgcrypto;

create table if not exists public.store_scores (
  id uuid primary key default gen_random_uuid(),
  month text not null,
  store text not null,
  store_type text not null,
  missing_invoice_count integer not null default 0,
  invoice_error_count integer not null default 0,
  mid_inventory_late boolean not null default false,
  end_inventory_late boolean not null default false,
  weekly_report_late_count integer not null default 0,
  weekly_report_format_error_count integer not null default 0,
  severe_price_issue boolean not null default false,
  cash_missing_days integer not null default 0,
  deposit_late_count integer not null default 0,
  cash_mismatch_count integer not null default 0,
  employee_meal_missing_count integer not null default 0,
  waste_log_issue_count integer not null default 0,
  employee_info_error_count integer not null default 0,
  sling_late_count integer not null default 0,
  opus_assigned boolean not null default false,
  opus_late_count integer not null default 0,
  inventory_deduction numeric not null default 0,
  cash_deduction numeric not null default 0,
  waste_deduction numeric not null default 0,
  labor_deduction numeric not null default 0,
  opus_deduction numeric not null default 0,
  total_deduction numeric not null default 0,
  final_score numeric not null default 0,
  remark text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint store_scores_month_store_unique unique (month, store)
);

create table if not exists public.score_history (
  id uuid primary key default gen_random_uuid(),
  score_id uuid references public.store_scores(id) on delete set null,
  action_type text not null,
  old_data jsonb,
  new_data jsonb,
  changed_by text not null default '',
  changed_at timestamptz not null default now()
);

create index if not exists idx_store_scores_month_store on public.store_scores(month, store);
create index if not exists idx_score_history_score_id on public.score_history(score_id);
create index if not exists idx_score_history_changed_at on public.score_history(changed_at desc);

create table if not exists public.execution_compliance_records (
  id uuid primary key default gen_random_uuid(),
  store_id text not null,
  check_date date not null,
  month text not null,
  section_type text not null default 'execution_compliance',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint execution_compliance_records_identity_unique unique (store_id, check_date, section_type),
  constraint execution_compliance_records_section_type_check check (section_type = 'execution_compliance')
);

create index if not exists idx_execution_compliance_records_store_date
on public.execution_compliance_records(store_id, check_date);

create index if not exists idx_execution_compliance_records_store_month
on public.execution_compliance_records(store_id, month);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_store_scores_updated_at on public.store_scores;
drop trigger if exists set_execution_compliance_records_updated_at on public.execution_compliance_records;

create trigger set_store_scores_updated_at
before update on public.store_scores
for each row
execute function public.set_updated_at();

create trigger set_execution_compliance_records_updated_at
before update on public.execution_compliance_records
for each row
execute function public.set_updated_at();

alter table public.store_scores enable row level security;
alter table public.score_history enable row level security;
alter table public.execution_compliance_records enable row level security;

drop policy if exists "Public can manage store scores" on public.store_scores;
drop policy if exists "Public can manage execution compliance records" on public.execution_compliance_records;
drop policy if exists "Public can view score history" on public.score_history;
drop policy if exists "Public can write score history" on public.score_history;

create policy "Public can manage store scores"
on public.store_scores
for all
using (true)
with check (true);

create policy "Public can manage execution compliance records"
on public.execution_compliance_records
for all
using (true)
with check (true);

create policy "Public can view score history"
on public.score_history
for select
using (true);

create policy "Public can write score history"
on public.score_history
for insert
with check (true);

grant select, insert, update, delete on public.execution_compliance_records to anon, authenticated;
