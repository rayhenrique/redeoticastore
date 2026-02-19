# Rede Ótica Store

Base inicial do MVP em `Next.js 16` com:
- Catálogo público + sacola + checkout via WhatsApp.
- Painel admin com login Supabase, CRUD de produtos e CRM Kanban.
- Persistência exclusiva via Supabase (Postgres + Storage).
- PWA instalável com fallback offline básico.

## Requisitos
- Node.js 20+
- npm 10+

## Setup
1. Instale dependências:
```bash
npm install
```
2. Configure variáveis:
```bash
cp .env.example .env.local
```
3. Rode em desenvolvimento:
```bash
npm run dev
```

## Variáveis de Ambiente
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (para operações administrativas/CLI)
- `ADMIN_EMAIL_ALLOWLIST`

## Scripts
- `npm run dev` inicia app.
- `npm run lint` executa ESLint.
- `npm run build` gera build de produção.
- `npm run test` executa unit/integration (Vitest).
- `npm run test:e2e` executa E2E (Playwright).

## Banco (Supabase)
1. Instale a CLI:
```bash
npm install -g supabase
```
2. Faça login:
```bash
supabase login
```
3. Linke o projeto:
```bash
supabase link --project-ref <PROJECT_REF>
```
4. Aplique as migrations:
```bash
supabase db push
```

## Estrutura Principal
- `src/app/(public)` módulo cliente.
- `src/app/admin` módulo loja.
- `src/app/api` APIs do App Router.
- `src/lib/repositories` camada de acesso a dados (Supabase).
- `src/stores/cart-store.ts` estado da sacola (Zustand).
- `public/manifest.webmanifest` e `public/sw.js` (PWA).
