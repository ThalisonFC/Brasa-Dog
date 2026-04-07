-- BrasaDog Atelier - schema base para Supabase
-- Execute no SQL Editor do Supabase.

create extension if not exists "pgcrypto";

create table if not exists public.app_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null default '',
  phone text not null default '',
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_products (
  id text primary key,
  name text not null,
  description text not null,
  image_url text not null,
  base_price numeric(10,2) not null check (base_price >= 0),
  category text not null check (category in ('classicos', 'especiais', 'combos', 'bebidas')),
  available boolean not null default true,
  featured boolean not null default false,
  customization_config jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_site_content (
  id int primary key check (id = 1),
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  id int primary key check (id = 1),
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.app_orders (
  id text primary key,
  items jsonb not null,
  subtotal_price numeric(10,2) not null check (subtotal_price >= 0),
  delivery_fee numeric(10,2) not null default 0 check (delivery_fee >= 0),
  total_price numeric(10,2) not null check (total_price >= 0),
  delivery_mode text not null check (delivery_mode in ('entrega', 'retirada')),
  delivery_address text not null default '',
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  channel text not null default 'whatsapp' check (channel in ('whatsapp')),
  whatsapp_message_sent boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid null references auth.users(id) on delete set null
);

create index if not exists app_orders_created_at_idx on public.app_orders (created_at desc);
create index if not exists app_orders_status_idx on public.app_orders (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.app_profiles;
create trigger trg_profiles_updated_at
before update on public.app_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.app_products;
create trigger trg_products_updated_at
before update on public.app_products
for each row execute function public.set_updated_at();

drop trigger if exists trg_site_content_updated_at on public.app_site_content;
create trigger trg_site_content_updated_at
before update on public.app_site_content
for each row execute function public.set_updated_at();

drop trigger if exists trg_settings_updated_at on public.app_settings;
create trigger trg_settings_updated_at
before update on public.app_settings
for each row execute function public.set_updated_at();

alter table public.app_profiles enable row level security;
alter table public.app_products enable row level security;
alter table public.app_site_content enable row level security;
alter table public.app_settings enable row level security;
alter table public.app_orders enable row level security;

drop policy if exists profiles_select_self_or_admin on public.app_profiles;
create policy profiles_select_self_or_admin on public.app_profiles
for select
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.app_profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists profiles_insert_self on public.app_profiles;
create policy profiles_insert_self on public.app_profiles
for insert
with check (auth.uid() = user_id);

drop policy if exists profiles_update_self_or_admin on public.app_profiles;
create policy profiles_update_self_or_admin on public.app_profiles
for update
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.app_profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
)
with check (
  auth.uid() = user_id
  or exists (
    select 1 from public.app_profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists products_read_all on public.app_products;
create policy products_read_all on public.app_products
for select
using (true);

drop policy if exists products_write_admin on public.app_products;
create policy products_write_admin on public.app_products
for all
using (
  exists (
    select 1 from public.app_profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.app_profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists site_content_read_all on public.app_site_content;
create policy site_content_read_all on public.app_site_content
for select
using (true);

drop policy if exists site_content_write_admin on public.app_site_content;
create policy site_content_write_admin on public.app_site_content
for all
using (
  exists (
    select 1 from public.app_profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.app_profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists settings_read_all on public.app_settings;
create policy settings_read_all on public.app_settings
for select
using (true);

drop policy if exists settings_write_admin on public.app_settings;
create policy settings_write_admin on public.app_settings
for all
using (
  exists (
    select 1 from public.app_profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.app_profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists orders_insert_all on public.app_orders;
create policy orders_insert_all on public.app_orders
for insert
with check (true);

drop policy if exists orders_read_admin on public.app_orders;
create policy orders_read_admin on public.app_orders
for select
using (
  exists (
    select 1 from public.app_profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists orders_update_admin on public.app_orders;
create policy orders_update_admin on public.app_orders
for update
using (
  exists (
    select 1 from public.app_profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.app_profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);

insert into public.app_settings (id, payload)
values (
  1,
  '{
    "maintenanceMode": false,
    "deliveryEnabled": true,
    "pickupEnabled": true,
    "deliveryFee": 10,
    "deliveryEstimateText": "45 minutos a 1 hora"
  }'::jsonb
)
on conflict (id) do nothing;

-- Defina o primeiro admin manualmente após criar usuário auth:
-- update public.app_profiles
-- set role = 'admin'
-- where email = 'seu-admin@dominio.com';
