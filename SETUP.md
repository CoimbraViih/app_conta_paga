# Conta Paga — Setup Guide

## 1. Supabase

### Crie um projeto
1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto (anote a senha do banco)

### Execute o schema SQL
No painel do Supabase, vá em **SQL Editor** e execute o conteúdo de `supabase-schema.sql`:

```sql
-- cria a tabela transactions com RLS
-- (copie o arquivo supabase-schema.sql)
```

### Habilite autenticação por e-mail
- Vá em **Authentication → Providers → Email**
- Certifique-se de que está habilitado
- Para desenvolvimento local, desative "Confirm email" (opcional)

### Obtenha as credenciais
- Vá em **Project Settings → API**
- Copie `Project URL` e `anon public key`

## 2. Variáveis de ambiente

Edite o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## 3. Rodando localmente

```bash
cd conta-paga
npm install
npm run dev
```

Acesse: http://localhost:3000

## 4. Deploy na Vercel

1. Faça push do repositório para o GitHub
2. Importe o projeto na [Vercel](https://vercel.com)
3. Adicione as variáveis de ambiente no painel da Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!
