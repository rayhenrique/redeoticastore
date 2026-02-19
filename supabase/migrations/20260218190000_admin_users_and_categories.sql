do $$
begin
  if exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'products'
      and constraint_name = 'products_category_check'
  ) then
    alter table public.products drop constraint products_category_check;
  end if;
end $$;

create table if not exists public.product_categories (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  slug text not null unique,
  active boolean default true not null
);

create table if not exists public.admin_users (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null unique,
  role text default 'seller' not null check (role in ('admin', 'seller')),
  active boolean default true not null
);

alter table public.product_categories enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Authenticated can read categories" on public.product_categories;
create policy "Authenticated can read categories"
on public.product_categories
for select
to authenticated
using (true);

drop policy if exists "Authenticated can manage categories" on public.product_categories;
create policy "Authenticated can manage categories"
on public.product_categories
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can read admin users" on public.admin_users;
create policy "Authenticated can read admin users"
on public.admin_users
for select
to authenticated
using (true);

drop policy if exists "Authenticated can manage admin users" on public.admin_users;
create policy "Authenticated can manage admin users"
on public.admin_users
for all
to authenticated
using (true)
with check (true);

insert into public.product_categories (name, slug, active)
values
  ('Solar', 'solar', true),
  ('Grau', 'grau', true)
on conflict (slug) do nothing;
