create table if not exists public.home_banners (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  subtitle text not null,
  cta text not null,
  image text not null,
  position integer default 1 not null,
  active boolean default true not null
);

alter table public.home_banners enable row level security;

drop policy if exists "Public can read active home banners" on public.home_banners;
create policy "Public can read active home banners"
on public.home_banners
for select
to anon, authenticated
using (active = true);

drop policy if exists "Authenticated can manage home banners" on public.home_banners;
create policy "Authenticated can manage home banners"
on public.home_banners
for all
to authenticated
using (true)
with check (true);

insert into public.home_banners (title, subtitle, cta, image, position, active)
values
  (
    'SUA IDADE, SEU DESCONTO',
    'Óculos completos com desconto de acordo com sua idade.',
    'Ver ofertas',
    '/branding/07.jpg',
    1,
    true
  ),
  (
    'CARNAVAL MOOD',
    'Neste carnaval, seus olhos também merecem cuidado.',
    'Explorar coleção',
    '/branding/08.jpg',
    2,
    true
  )
on conflict do nothing;
