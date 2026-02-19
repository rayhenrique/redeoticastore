create table if not exists public.product_brands (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null unique,
  image text not null,
  active boolean default true not null
);

alter table public.product_brands enable row level security;

drop policy if exists "Public can read active product brands" on public.product_brands;
create policy "Public can read active product brands"
on public.product_brands
for select
to anon, authenticated
using (active = true);

drop policy if exists "Authenticated can manage product brands" on public.product_brands;
create policy "Authenticated can manage product brands"
on public.product_brands
for all
to authenticated
using (true)
with check (true);

insert into public.product_brands (name, image, active)
values
  ('Rede Ótica Store', '/branding/05.jpg', true),
  ('Mood', '/branding/08.jpg', true),
  ('Classic', '/branding/06.jpg', true)
on conflict (name) do nothing;
