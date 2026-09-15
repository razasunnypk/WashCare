-- ============================================================
-- WashCare Laundry Manager — Supabase setup
-- Run this once in your project's SQL editor.
-- ============================================================

create table if not exists public.orders (
  id          text primary key,
  no          text not null,
  data        jsonb not null default '{}'::jsonb,
  device      text,
  deleted     boolean not null default false,
  updated_at  timestamptz not null default now()
);

create index if not exists orders_updated_at_idx on public.orders (updated_at);
create index if not exists orders_no_idx on public.orders (no);

create table if not exists public.app_config (
  key         text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Security: only signed-in staff can read or write anything.
-- Without these policies the anon key would expose customer data.
-- ------------------------------------------------------------
alter table public.orders     enable row level security;
alter table public.app_config enable row level security;

drop policy if exists "staff read orders"   on public.orders;
drop policy if exists "staff write orders"  on public.orders;
drop policy if exists "staff update orders" on public.orders;
drop policy if exists "staff read config"   on public.app_config;
drop policy if exists "staff write config"  on public.app_config;
drop policy if exists "staff update config" on public.app_config;

create policy "staff read orders"   on public.orders     for select to authenticated using (true);
create policy "staff write orders"  on public.orders     for insert to authenticated with check (true);
create policy "staff update orders" on public.orders     for update to authenticated using (true) with check (true);
create policy "staff read config"   on public.app_config for select to authenticated using (true);
create policy "staff write config"  on public.app_config for insert to authenticated with check (true);
create policy "staff update config" on public.app_config for update to authenticated using (true) with check (true);

-- ------------------------------------------------------------
-- Live updates between devices
-- ------------------------------------------------------------
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.app_config;
