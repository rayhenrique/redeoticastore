alter table public.leads enable row level security;

-- Remove qualquer policy anterior da tabela para evitar conflito de regras.
do $$
declare
  p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'leads'
  loop
    execute format('drop policy if exists %I on public.leads', p.policyname);
  end loop;
end $$;

-- Checkout público: inserir lead anonimamente/autenticado.
create policy "Public can insert leads"
on public.leads
for insert
to anon, authenticated
with check (
  name is not null
  and whatsapp is not null
  and jsonb_typeof(products_interest) = 'array'
);

-- Operação administrativa: leitura e atualização para usuários autenticados.
create policy "Authenticated can read leads"
on public.leads
for select
to authenticated
using (true);

create policy "Authenticated can update leads"
on public.leads
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated can delete leads"
on public.leads
for delete
to authenticated
using (true);
