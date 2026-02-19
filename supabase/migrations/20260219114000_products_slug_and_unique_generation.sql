alter table public.products
add column if not exists slug text;

create or replace function public.slugify_text(value text)
returns text
language sql
immutable
as $$
  select nullif(
    trim(
      both '-'
      from regexp_replace(
        lower(
          translate(
            coalesce(value, ''),
            'áàãâäéèêëíìîïóòõôöúùûüçñ',
            'aaaaaeeeeiiiiooooouuuucn'
          )
        ),
        '[^a-z0-9]+',
        '-',
        'g'
      )
    ),
    ''
  );
$$;

create or replace function public.generate_unique_product_slug(
  base_slug text,
  current_id uuid default null
)
returns text
language plpgsql
as $$
declare
  normalized_base text := coalesce(nullif(base_slug, ''), 'produto');
  candidate text := normalized_base;
  suffix integer := 2;
begin
  while exists (
    select 1
    from public.products p
    where p.slug = candidate
      and (current_id is null or p.id <> current_id)
  ) loop
    candidate := normalized_base || '-' || suffix;
    suffix := suffix + 1;
  end loop;

  return candidate;
end;
$$;

create or replace function public.set_product_slug()
returns trigger
language plpgsql
as $$
begin
  new.slug := public.generate_unique_product_slug(public.slugify_text(new.name), new.id);
  return new;
end;
$$;

drop trigger if exists trg_products_set_slug on public.products;
create trigger trg_products_set_slug
before insert or update of name on public.products
for each row
execute function public.set_product_slug();

update public.products p
set slug = public.generate_unique_product_slug(public.slugify_text(p.name), p.id)
where p.slug is null
   or p.slug = ''
   or p.slug <> public.slugify_text(p.name);

alter table public.products
alter column slug set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_slug_key'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
    add constraint products_slug_key unique (slug);
  end if;
end $$;
