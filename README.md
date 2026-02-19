# Rede Ótica Store

Base inicial do MVP em `Next.js 16` com:
- Catálogo público + sacola + checkout via WhatsApp.
- Painel admin com login Supabase, CRUD de produtos e CRM Kanban.
- Estratégia `mock-first` com troca por provider Supabase via env.
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
- `DATA_PROVIDER=mock|supabase`
- `NEXT_PUBLIC_DATA_PROVIDER=mock|supabase`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_EMAIL_ALLOWLIST`
- `ADMIN_BYPASS_AUTH` (use `true` para navegação admin sem Supabase em modo demo)

## Scripts
- `npm run dev` inicia app.
- `npm run lint` executa ESLint.
- `npm run build` gera build de produção.
- `npm run test` executa unit/integration (Vitest).
- `npm run test:e2e` executa E2E (Playwright).

## Banco (Supabase)
- Migração SQL inicial em:
`supabase/migrations/20260218173000_init_rede_otica_store.sql`

## Estrutura Principal
- `src/app/(public)` módulo cliente.
- `src/app/admin` módulo loja.
- `src/app/api` APIs do App Router.
- `src/lib/repositories` camada mock/supabase.
- `src/stores/cart-store.ts` estado da sacola (Zustand).
- `public/manifest.webmanifest` e `public/sw.js` (PWA).
