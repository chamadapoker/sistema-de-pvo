
import os
from supabase import create_client

# Configurações
SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

def seed_users():
    print("👤 Restaurando usuários padrão via Supabase API Direta...")
    # O seed.ts usa Prisma e roda localmente, mas se o Prisma não estiver conectado ao Supabase
    # ou se estamos usando Supabase Auth (GoTrue), o seed.ts só cria na tabela 'User' pública,
    # não no auth.users do Supabase.
    
    # Se o sistema usa `authController.ts` com JWT do Supabase, precisamos criar usuários no Auth.
    # Se usa apenas tabela própria `User` e bcrypt manual (como parece no seed.ts), então o erro pode ser conexão.
    
    # Vou executar o seed.ts via npx ts-node para garantir.
    print("Vou rodar: npx ts-node server/src/seed.ts")

if __name__ == "__main__":
    seed_users()
