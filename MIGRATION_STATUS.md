# Status da Migração PVO -> Supabase

## ✅ Banco de Dados
As tabelas `categories` e `equipment` **já existem** no Supabase. O erro de SQL que você viu ("policy already exists") confirma que a estrutura já estava pronta (provavelmente criada parcialmente em tentativas anteriores que pareciam ter falhado mas não falharam totalmente, ou pelo seu comando manual).

## 🚀 Migração em Andamento
Um script de migração está rodando em segundo plano (`migrate_to_supabase.py` corrigido).
- **Status atual:** Migrando imagens da Pasta 1.
- **Progresso:** Enviando imagens para o Storage e inserindo registros na tabela `equipment`.
- **Previsão:** Devido ao grande número de imagens (~3000+), isso pode levar alguns minutos.

## 🖥️ Frontend Configurado
O cliente (`client`) já foi configurado para conectar ao Supabase:
1. Arquivo `src/lib/supabase.ts` criado.
2. Arquivo `.env` criado com a URL e Chave Anônima corretas.

## ⚠️ Backend (Node.js)
O backend (`server`) ainda está configurado para usar **SQLite**.
Para mudar para Supabase Postgres:
1. Obtenha a Connection String no painel do Supabase (Settings > Database > Connection String > URI).
2. Atualize o arquivo `server/.env` com `DATABASE_URL="postgresql://postgres:[SUA-SENHA]@[HOST]:5432/postgres"`.
3. Rode `npx prisma db pull` no diretório `server` para atualizar o schema.

**Você pode monitorar o progresso da migração observando os logs do terminal ou checando a quantidade de linhas na tabela `equipment` no painel do Supabase.**
