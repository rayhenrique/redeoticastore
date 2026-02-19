# Product Requirements Document (PRD)

## 1. Introdução
Este documento descreve os requisitos funcionais e técnicos para o MVP da Rede Ótica Store.

## 2. Personas
* **Cliente Explorador:** Quer ver modelos, preços e disponibilidade antes de falar com alguém. Odeia esperar resposta de "preço inbox".
* **Gerente da Loja:** Precisa subir fotos dos produtos rapidamente pelo celular ou PC e ver quem está interessado para cobrar a equipe de vendas.

## 3. User Stories

### Público (Loja)
* **US01:** Como cliente, quero filtrar armações por Gênero, Marca e Tipo (Solar/Grau) para encontrar o que busco rápido.
* **US02:** Como cliente, quero adicionar múltiplas armações a uma "Sacola" para enviar uma única mensagem de interesse.
* **US03:** Como cliente, quero clicar em "Tenho Interesse" e ser redirecionado ao WhatsApp já com a lista de produtos na mensagem.
* **US04:** Como cliente, quero ver um aviso de que a disponibilidade está sujeita a confirmação.

### Admin (Backoffice)
* **US05:** Como admin, quero fazer login seguro para acessar o painel.
* **US06:** Como admin, quero cadastrar produtos com Nome, Preço, Fotos, Marca e Status (Disponível/Indisponível).
* **US07:** Como admin, quero visualizar um quadro Kanban com os leads que vieram do site.
* **US08:** Como admin, quero mover um card de lead de "Novo" para "Vendido" ou "Perdido".

## 4. Requisitos Funcionais

### 4.1. Catálogo & Navegação
* Listagem em Grid responsivo (Mobile First).
* Filtros laterais (Desktop) ou Drawer (Mobile).
* Busca por texto (nome do modelo/marca).

### 4.2. Fluxo de "Checkout" (Lead Capture)
1.  Usuário adiciona itens à Sacola.
2.  Clica em "Finalizar no WhatsApp".
3.  **Modal Obrigatório:** Solicita `Nome` e `WhatsApp`.
4.  Sistema salva os dados na tabela `leads` do Supabase.
5.  Sistema monta a URL `wa.me` com a mensagem: *"Olá! Me chamo [Nome] e tenho interesse nestes produtos: [Lista de Links/Nomes]."*
6.  Redireciona o usuário para o App do WhatsApp.

### 4.3. Painel Administrativo
* **Dashboard:** Visão rápida de novos leads hoje.
* **Produtos:** CRUD completo. Upload de imagens via Supabase Storage.
* **CRM Kanban:** Colunas fixas: `Novos`, `Em Atendimento`, `Vendido`, `Arquivado`.
    * O card deve mostrar: Nome do Cliente, Qtd de Itens, Data/Hora.

## 5. Requisitos Não-Funcionais
* **Performance:** Imagens otimizadas (Next.js Image) para carregamento rápido em 4G.
* **Segurança:** Row Level Security (RLS) no Supabase. Apenas Admins podem ler a tabela `leads` e escrever em `products`. Público pode apenas ler `products` e escrever em `leads`.
* **Stack:** Next.js 14 (App Router), Tailwind CSS, shadcn/ui, Supabase, Lucide Icons.

## 6. Modelo de Dados (Supabase)

### `products`
* `id`: uuid (PK)
* `created_at`: timestamp
* `name`: text
* `description`: text
* `price`: numeric
* `images`: text[] (array de URLs)
* `brand`: text
* `category`: text (solar, grau)
* `active`: boolean (default true)

### `leads`
* `id`: uuid (PK)
* `created_at`: timestamp
* `name`: text
* `whatsapp`: text
* `status`: text (default 'new')
* `products_interest`: jsonb (snapshot dos produtos no momento do clique)