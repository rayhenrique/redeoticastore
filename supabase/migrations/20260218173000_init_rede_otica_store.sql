create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  price numeric,
  images text[] not null default '{}',
  brand text not null,
  category text not null check (category in ('solar', 'grau')),
  active boolean default true not null
);

create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  whatsapp text not null,
  status text default 'new' not null check (status in ('new', 'contacted', 'sold', 'archived')),
  products_interest jsonb not null default '[]'::jsonb
);

alter table public.products enable row level security;
alter table public.leads enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
to anon, authenticated
using (active = true);

drop policy if exists "Authenticated can manage products" on public.products;
create policy "Authenticated can manage products"
on public.products
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can insert leads" on public.leads;
create policy "Public can insert leads"
on public.leads
for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated can read leads" on public.leads;
create policy "Authenticated can read leads"
on public.leads
for select
to authenticated
using (true);

drop policy if exists "Authenticated can update leads" on public.leads;
create policy "Authenticated can update leads"
on public.leads
for update
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;
