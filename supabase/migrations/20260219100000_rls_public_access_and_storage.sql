alter table public.products enable row level security;
alter table public.home_banners enable row level security;
alter table public.product_brands enable row level security;
alter table public.product_categories enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
to anon, authenticated
using (active = true);

drop policy if exists "Public can read active home banners" on public.home_banners;
create policy "Public can read active home banners"
on public.home_banners
for select
to anon, authenticated
using (active = true);

drop policy if exists "Public can read active product brands" on public.product_brands;
create policy "Public can read active product brands"
on public.product_brands
for select
to anon, authenticated
using (active = true);

drop policy if exists "Public can read active categories" on public.product_categories;
create policy "Public can read active categories"
on public.product_categories
for select
to anon, authenticated
using (active = true);

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'products');

drop policy if exists "Authenticated can upload product images" on storage.objects;
create policy "Authenticated can upload product images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'products');

drop policy if exists "Authenticated can update product images" on storage.objects;
create policy "Authenticated can update product images"
on storage.objects
for update
to authenticated
using (bucket_id = 'products')
with check (bucket_id = 'products');

drop policy if exists "Authenticated can delete product images" on storage.objects;
create policy "Authenticated can delete product images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'products');
