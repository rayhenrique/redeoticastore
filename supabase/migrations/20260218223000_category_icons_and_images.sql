alter table public.product_categories
add column if not exists icon text,
add column if not exists image text;

update public.product_categories
set icon = coalesce(icon, case
  when slug = 'solar' then 'sun'
  when slug = 'grau' then 'glasses'
  else 'sparkles'
end)
where icon is null;
