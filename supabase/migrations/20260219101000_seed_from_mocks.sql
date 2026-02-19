insert into public.product_categories (id, created_at, name, slug, icon, image, active)
values
  ('11111111-1111-4111-8111-111111111111', '2026-02-18T10:00:00.000Z', 'Solar', 'solar', 'sun', null, true),
  ('22222222-2222-4222-8222-222222222222', '2026-02-18T10:01:00.000Z', 'Grau', 'grau', 'glasses', null, true),
  ('33333333-3333-4333-8333-333333333333', '2026-02-18T10:02:00.000Z', 'Infantil', 'infantil', 'baby', null, true),
  ('44444444-4444-4444-8444-444444444444', '2026-02-18T10:03:00.000Z', 'Acessórios', 'acessorios', 'briefcase', null, true)
on conflict (slug) do update
set
  name = excluded.name,
  icon = excluded.icon,
  image = excluded.image,
  active = excluded.active;

insert into public.product_brands (id, created_at, name, image, active)
values
  ('aaaaaaaa-1111-4111-8111-111111111111', '2026-02-18T11:00:00.000Z', 'Rede Ótica Store', '/branding/05.jpg', true),
  ('bbbbbbbb-2222-4222-8222-222222222222', '2026-02-18T11:01:00.000Z', 'Mood', '/branding/08.jpg', true),
  ('cccccccc-3333-4333-8333-333333333333', '2026-02-18T11:02:00.000Z', 'Classic', '/branding/06.jpg', true),
  ('dddddddd-4444-4444-8444-444444444444', '2026-02-18T11:03:00.000Z', 'Urban', '/branding/06.jpg', true),
  ('eeeeeeee-5555-4555-8555-555555555555', '2026-02-18T11:04:00.000Z', 'Premium', '/branding/07.jpg', true)
on conflict (name) do update
set
  image = excluded.image,
  active = excluded.active;

insert into public.home_banners (id, created_at, title, subtitle, cta, image, position, active)
values
  ('f1111111-1111-4111-8111-111111111111', '2026-02-18T10:20:00.000Z', 'SUA IDADE, SEU DESCONTO', 'Óculos completos com desconto de acordo com sua idade.', 'Ver ofertas', '/branding/07.jpg', 1, true),
  ('f2222222-2222-4222-8222-222222222222', '2026-02-18T10:21:00.000Z', 'CARNAVAL MOOD', 'Neste carnaval, seus olhos também merecem cuidado.', 'Explorar coleção', '/branding/08.jpg', 2, true)
on conflict (id) do update
set
  title = excluded.title,
  subtitle = excluded.subtitle,
  cta = excluded.cta,
  image = excluded.image,
  position = excluded.position,
  active = excluded.active;

insert into public.products (id, created_at, name, description, price, images, brand, category, active)
values
  ('a1111111-1111-4111-8111-111111111111', '2026-02-18T10:30:00.000Z', 'Solar Street Black', 'Armação solar retangular com acabamento fosco.', 289.9, array['/branding/08.jpg', '/branding/06.jpg'], 'Rede Ótica Store', 'solar', true),
  ('b2222222-2222-4222-8222-222222222222', '2026-02-17T13:15:00.000Z', 'Solar Mood Carnaval', 'Óculos solar oversized com lentes degradê.', 349.9, array['/branding/07.jpg', '/branding/08.jpg'], 'Mood', 'solar', true),
  ('c3333333-3333-4333-8333-333333333333', '2026-02-16T09:40:00.000Z', 'Grau Classic Light', 'Armação de grau leve para uso diário.', 259.9, array['/branding/06.jpg', '/branding/08.jpg'], 'Classic', 'grau', true),
  ('d4444444-4444-4444-8444-444444444444', '2026-02-14T11:05:00.000Z', 'Grau Urban Slim', 'Armação de grau moderna com ponte anatômica.', 319.9, array['/branding/06.jpg', '/branding/07.jpg'], 'Urban', 'grau', true),
  ('e5555555-5555-4555-8555-555555555555', '2026-02-12T08:20:00.000Z', 'Solar Gold Drop', 'Modelo premium com acabamento dourado.', 419.9, array['/branding/07.jpg'], 'Premium', 'solar', false)
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  images = excluded.images,
  brand = excluded.brand,
  category = excluded.category,
  active = excluded.active;

insert into public.admin_users (id, created_at, name, email, role, active)
values
  ('99999999-1111-4111-8111-111111111111', '2026-02-18T09:10:00.000Z', 'Admin Principal', 'admin@redeotica.com.br', 'admin', true),
  ('99999999-2222-4222-8222-222222222222', '2026-02-18T09:20:00.000Z', 'Vendedor Loja', 'vendedor@redeotica.com.br', 'seller', true)
on conflict (email) do update
set
  name = excluded.name,
  role = excluded.role,
  active = excluded.active;
