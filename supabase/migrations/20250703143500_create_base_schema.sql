/*
  Migration: Create base schema for Tattoo Studio
  Purpose: Creates profiles, tattoos, availabilities, appointments, products, orders, order_items tables. Adds indexes and comprehensive Row Level Security (RLS) policies in line with PRD.
*/

-- ensure pgcrypto for gen_random_uuid()
create extension if not exists "pgcrypto";

/* -------------------------------------------------------------------------
 1. profiles
 ------------------------------------------------------------------------- */
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text not null unique,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);
comment on table public.profiles is 'User profiles extending auth.users; includes admin flag.';

/* -------------------------------------------------------------------------
 2. tattoos
 ------------------------------------------------------------------------- */
create table public.tattoos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text not null,
  category text,
  created_at timestamptz not null default now()
);
comment on table public.tattoos is 'Portfolio tattoo entries.';

/* -------------------------------------------------------------------------
 3. availabilities
 ------------------------------------------------------------------------- */
create table public.availabilities (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  time_start time not null,
  time_end time not null,
  is_booked boolean not null default false
);
comment on table public.availabilities is 'Artist availability time-slots.';
create index availabilities_date_time_idx on public.availabilities (date, time_start);

/* -------------------------------------------------------------------------
 4. appointments
 ------------------------------------------------------------------------- */
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  date date not null,
  time_start time not null,
  time_end time not null,
  status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now()
);
comment on table public.appointments is 'Client appointment bookings.';

/* -------------------------------------------------------------------------
 5. products
 ------------------------------------------------------------------------- */
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  image_url text not null,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
comment on table public.products is 'Shop merchandise.';

/* -------------------------------------------------------------------------
 6. orders
 ------------------------------------------------------------------------- */
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  total_cents integer not null check (total_cents >= 0),
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
comment on table public.orders is 'Customer orders.';

/* -------------------------------------------------------------------------
 7. order_items
 ------------------------------------------------------------------------- */
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  quantity integer not null check (quantity > 0),
  price_cents integer not null check (price_cents >= 0)
);
comment on table public.order_items is 'Items linked to orders.';
create index order_items_order_idx on public.order_items (order_id);

/* -------------------------------------------------------------------------
 Enable Row Level Security (RLS)
 ------------------------------------------------------------------------- */
alter table public.profiles      enable row level security;
alter table public.tattoos       enable row level security;
alter table public.availabilities enable row level security;
alter table public.appointments  enable row level security;
alter table public.products      enable row level security;
alter table public.orders        enable row level security;
alter table public.order_items   enable row level security;

/* -------------------------------------------------------------------------
 RLS Policies
 ------------------------------------------------------------------------- */

-- ----------------------------------------------------------------------
-- profiles
-- ----------------------------------------------------------------------
create policy "user can select own profile" on public.profiles
for select to authenticated
using ( id = (select auth.uid()) );

create policy "admin can select all profiles" on public.profiles
for select to authenticated
using ( (select is_admin from public.profiles where id = (select auth.uid())) );

-- ----------------------------------------------------------------------
-- tattoos
-- ----------------------------------------------------------------------
create policy "public select tattoos" on public.tattoos
for select to authenticated, anon
using ( true );

create policy "admin insert tattoos" on public.tattoos
for insert to authenticated
with check ( (select is_admin from public.profiles where id = (select auth.uid())) );

create policy "admin update tattoos" on public.tattoos
for update to authenticated
using ( (select is_admin from public.profiles where id = (select auth.uid())) )
with check ( (select is_admin from public.profiles where id = (select auth.uid())) );

create policy "admin delete tattoos" on public.tattoos
for delete to authenticated
using ( (select is_admin from public.profiles where id = (select auth.uid())) );

-- ----------------------------------------------------------------------
-- availabilities
-- ----------------------------------------------------------------------
create policy "public select open slots" on public.availabilities
for select to authenticated, anon
using ( is_booked = false );

create policy "admin select all availabilities" on public.availabilities
for select to authenticated
using ( (select is_admin from public.profiles where id = (select auth.uid())) );

create policy "admin insert availabilities" on public.availabilities
for insert to authenticated
with check ( (select is_admin from public.profiles where id = (select auth.uid())) );

create policy "admin update availabilities" on public.availabilities
for update to authenticated
using ( (select is_admin from public.profiles where id = (select auth.uid())) )
with check ( (select is_admin from public.profiles where id = (select auth.uid())) );

create policy "admin delete availabilities" on public.availabilities
for delete to authenticated
using ( (select is_admin from public.profiles where id = (select auth.uid())) );

-- ----------------------------------------------------------------------
-- appointments
-- ----------------------------------------------------------------------
create policy "user select own appointments" on public.appointments
for select to authenticated
using ( user_id = (select auth.uid()) );

create policy "admin select all appointments" on public.appointments
for select to authenticated
using ( (select is_admin from public.profiles where id = (select auth.uid())) );

create policy "user create appointment" on public.appointments
for insert to authenticated
with check ( user_id = (select auth.uid()) );

create policy "admin create appointment" on public.appointments
for insert to authenticated
with check ( (select is_admin from public.profiles where id = (select auth.uid())) );

create policy "user update own appointment" on public.appointments
for update to authenticated
using ( user_id = (select auth.uid()) )
with check ( user_id = (select auth.uid()) );

create policy "admin update appointments" on public.appointments
for update to authenticated
using ( (select is_admin from public.profiles where id = (select auth.uid())) )
with check ( (select is_admin from public.profiles where id = (select auth.uid())) );

-- ----------------------------------------------------------------------
-- products
-- ----------------------------------------------------------------------
create policy "public select active products" on public.products
for select to authenticated, anon
using ( is_active = true );

create policy "admin select all products" on public.products
for select to authenticated
using ( (select is_admin from public.profiles where id = (select auth.uid())) );

create policy "admin insert products" on public.products
for insert to authenticated
with check ( (select is_admin from public.profiles where id = (select auth.uid())) );

create policy "admin update products" on public.products
for update to authenticated
using ( (select is_admin from public.profiles where id = (select auth.uid())) )
with check ( (select is_admin from public.profiles where id = (select auth.uid())) );

create policy "admin delete products" on public.products
for delete to authenticated
using ( (select is_admin from public.profiles where id = (select auth.uid())) );

-- ----------------------------------------------------------------------
-- orders
-- ----------------------------------------------------------------------
create policy "user select own orders" on public.orders
for select to authenticated
using ( user_id = (select auth.uid()) );

create policy "admin select all orders" on public.orders
for select to authenticated
using ( (select is_admin from public.profiles where id = (select auth.uid())) );

create policy "user insert order" on public.orders
for insert to authenticated
with check ( user_id = (select auth.uid()) );

create policy "admin insert orders" on public.orders
for insert to authenticated
with check ( (select is_admin from public.profiles where id = (select auth.uid())) );

create policy "admin update orders" on public.orders
for update to authenticated
using ( (select is_admin from public.profiles where id = (select auth.uid())) )
with check ( (select is_admin from public.profiles where id = (select auth.uid())) );

-- ----------------------------------------------------------------------
-- order_items
-- ----------------------------------------------------------------------
create policy "user select own order items" on public.order_items
for select to authenticated
using ( order_id in (
  select id from public.orders where user_id = (select auth.uid())
) );

create policy "admin select all order items" on public.order_items
for select to authenticated
using ( (select is_admin from public.profiles where id = (select auth.uid())) );

create policy "user insert order items" on public.order_items
for insert to authenticated
with check ( order_id in (
  select id from public.orders where user_id = (select auth.uid())
) );

create policy "admin insert order items" on public.order_items
for insert to authenticated
with check ( (select is_admin from public.profiles where id = (select auth.uid())) );

create policy "admin update order items" on public.order_items
for update to authenticated
using ( (select is_admin from public.profiles where id = (select auth.uid())) )
with check ( (select is_admin from public.profiles where id = (select auth.uid())) );

create policy "admin delete order items" on public.order_items
for delete to authenticated
using ( (select is_admin from public.profiles where id = (select auth.uid())) );