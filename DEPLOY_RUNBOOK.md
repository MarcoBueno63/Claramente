# Runbook de Deploy (Produção)

Este runbook cobre pré-deploy, deploy, validação pós-deploy e rollback para a aplicação ClaraMente.

## 1) Pré-deploy (local ou CI)

### 1.1 Validar ambiente

Variáveis mínimas esperadas em produção:

- `DATABASE_URL`
- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`
- `DID_API_KEY`
- `AUTH_TOKEN_SECRET` (para assinatura/validação de token de sessão)

Se usar deploy via Vercel no GitHub Actions, adicionar também:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Comando (PowerShell) para checar presença local:

```powershell
$required = @("DATABASE_URL","OPENAI_API_KEY","ELEVENLABS_API_KEY","DID_API_KEY","AUTH_TOKEN_SECRET");
$missing = $required | Where-Object { -not $env:$_ };
if ($missing.Count -gt 0) { Write-Error ("Variaveis ausentes: " + ($missing -join ", ")); exit 1 } else { Write-Host "Variaveis OK" }
```

### 1.2 Gate de qualidade

```powershell
npm ci
npm run lint
npm test -- --runInBand
npm run build
```

Critério de aprovação:

- Lint sem erro.
- Testes 100% verdes.
- Build de produção concluído com sucesso.

## 2) Deploy

### 2.1 Banco (antes de subir nova versão)

```powershell
npx prisma migrate deploy
```

Recomendação operacional:

- Fazer snapshot/backup antes da migração.
- Aplicar migrações uma única vez por release.

### 2.2 Subir aplicação

Se deploy manual no host:

```powershell
npm ci
npm run build
npm run start
```

Se usar orquestrador (PM2, Docker, plataforma):

- Garantir `NODE_ENV=production`.
- Injetar variáveis de ambiente no runtime.
- Expor porta e rota de saúde.

### 2.3 Deploy na Vercel (CI)

O workflow `.github/workflows/release-gates.yml` já faz deploy automático na Vercel após passar em lint, testes, build e migração.

Sequência usada:

```bash
vercel pull --yes --environment=production --token=$VERCEL_TOKEN
vercel build --prod --token=$VERCEL_TOKEN
vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN
```

Observação:

- O job de deploy roda nas branches `main` e `master`.

## 3) Validação pós-deploy (smoke test)

### 3.1 Health check

```powershell
curl -sS https://SEU_DOMINIO/api/health
```

Esperado: HTTP 200.

### 3.2 Fluxo crítico

Validar rapidamente:

1. Onboarding abre sem erro.
2. Chat responde (`/api/chat`).
3. Sessão inicia (`/api/session/start`).
4. Mensagem de sessão persiste (`/api/session/[id]/message`).
5. Sessão encerra (`/api/session/[id]/end`).
6. Checkout inicia (`/api/payment/checkout`) com contrato esperado.

## 4) Rollback

### 4.1 Critérios de rollback

Disparar rollback se houver qualquer cenário:

- Erros 5xx acima do limite acordado.
- Falha em healthcheck contínuo.
- Quebra do fluxo crítico de sessão/chat/pagamento.

### 4.2 Procedimento

1. Reapontar tráfego para a versão anterior estável.
2. Confirmar healthcheck da versão anterior.
3. Abrir incidente e registrar causa raiz.
4. Só reaplicar release após correção + novo gate completo.

## 5) Pipeline CI/CD (pronto para colar)

Exemplo para GitHub Actions:

```yaml
name: release-gates

on:
  workflow_dispatch:
  push:
    branches: ["main"]

jobs:
  quality-and-build:
    runs-on: ubuntu-latest
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      ELEVENLABS_API_KEY: ${{ secrets.ELEVENLABS_API_KEY }}
      DID_API_KEY: ${{ secrets.DID_API_KEY }}
      AUTH_TOKEN_SECRET: ${{ secrets.AUTH_TOKEN_SECRET }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test -- --runInBand

      - name: Build
        run: npm run build

      - name: Prisma migrate deploy
        run: npx prisma migrate deploy

  deploy-vercel:
    needs: quality-and-build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    env:
      VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build on Vercel
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 6) Comando de release manual (sequência única)

```powershell
npm ci; npm run lint; npm test -- --runInBand; npm run build; npx prisma migrate deploy
```

Se qualquer etapa falhar, cancelar release.
