# Deploy na VPS (Hostinger + CloudPanel)

Este guia sobe o projeto **Rede Ótica Store** no subdomínio:

- `redeoticastore.kltecnologia.com`

## 1) Configurar DNS do subdomínio

No DNS do seu domínio, crie/valide um registro:

- Tipo: `A`
- Nome/Host: `redeoticastore`
- Valor: `IP da sua VPS`

Aguarde a propagação antes de configurar SSL.

## 2) Criar o site Node.js no CloudPanel

No CloudPanel:

1. `+ Add Site`
2. `Create a Node.js Site`
3. Preencha:
   - Domain: `redeoticastore.kltecnologia.com`
   - Node.js Version: `22` (ou `20`)
   - App Port: `3009`
4. Concluir criação.

## 3) Acessar a VPS via SSH

Use o usuário do site criado pelo CloudPanel (não root):

```bash
ssh <site-user>@<ip-da-vps>
cd ~/htdocs/redeoticastore.kltecnologia.com
```

## 4) Clonar o projeto

```bash
git clone https://github.com/rayhenrique/redeoticastore.git .
```

## 5) Criar variáveis de ambiente de produção

Crie o arquivo `.env` na VPS:

```bash
nano .env
```

Exemplo base:

```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://redeoticastore.kltecnologia.com
NEXT_PUBLIC_WHATSAPP_NUMBER=55SEUNUMERO
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL_ALLOWLIST=admin@redeotica.com.br
```

## 6) Aplicar migrations do Supabase via CLI

```bash
npm install -g supabase
supabase login
supabase link --project-ref <PROJECT_REF>
supabase db push
```

## 7) Instalar dependências e gerar build

```bash
npm ci
npm run build
```

## 8) Subir aplicação com PM2

Execute como **usuário do site** (`kltecnologia-redeoticastore`):

```bash
npm install -g pm2
pm2 delete redeoticastore 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
```

## 9) Garantir inicialização automática no boot

1. Ainda como **usuário do site**, rode:

```bash
pm2 startup
```

2. O comando acima vai imprimir um `sudo env ... pm2 startup ...`.
   Execute esse comando como **root**, com caminho absoluto do PM2 do usuário:

```bash
sudo env PATH=$PATH:/home/kltecnologia-redeoticastore/.nvm/versions/node/v22.22.0/bin \
/home/kltecnologia-redeoticastore/.nvm/versions/node/v22.22.0/lib/node_modules/pm2/bin/pm2 \
startup systemd -u kltecnologia-redeoticastore --hp /home/kltecnologia-redeoticastore
```

3. Volte ao usuário do site e rode novamente:

```bash
pm2 save
```

4. Opcional (como root), valide:

```bash
systemctl status pm2-kltecnologia-redeoticastore
```

## 10) Ativar SSL (Let's Encrypt) no CloudPanel

No site:

1. `SSL/TLS`
2. `Actions` -> `New Let's Encrypt Certificate`
3. Selecione `redeoticastore.kltecnologia.com`
4. Instale o certificado.

## 11) Testar aplicação

- URL: `https://redeoticastore.kltecnologia.com`

Comandos úteis:

```bash
pm2 status
pm2 logs redeoticastore --lines 100
```

## 12) Fluxo de atualização (novos deploys)

```bash
cd ~/htdocs/redeoticastore.kltecnologia.com
git pull origin main
npm install -g supabase
supabase link --project-ref <PROJECT_REF>
supabase db push
npm ci
npm run build
pm2 restart ecosystem.config.js --only redeoticastore
pm2 save
```

## 13) Verificação rápida da porta

```bash
pm2 status
pm2 logs redeoticastore --lines 100
ss -lntp | grep 3009
```

## Importante

- Rode `pm2 start/restart/save` **somente no usuário do site**.
- Use `root` apenas para `systemctl ...` e para o comando `pm2 startup ...`.
- Não rode `npm start` manual quando o app já estiver no PM2.

## Referências oficiais

- Add Site (Node.js): https://www.cloudpanel.io/docs/v2/frontend-area/add-site/
- Node.js + PM2: https://www.cloudpanel.io/docs/v2/nodejs/deployment/pm2/
- SSL/TLS: https://www.cloudpanel.io/docs/v2/frontend-area/tls/
- Site Settings: https://www.cloudpanel.io/docs/v2/frontend-area/settings/
- dploy (opcional): https://www.cloudpanel.io/docs/v2/dploy/installation/
