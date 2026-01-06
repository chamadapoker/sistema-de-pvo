import requests

PROJECT_REF = "baoboggeqhksaxkuudap"
ACCESS_TOKEN = "sbp_bf907a9ca211f2204d9c53622208006dc5877cc1"
URL = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/api-keys" # Apenas para testar conectividade básica
# Na verdade, vou usar a biblioteca supabase-py para tentar fazer um select simples

from supabase import create_client, Client

url: str = f"https://{PROJECT_REF}.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"
supabase: Client = create_client(url, key)

def check_tables():
    print("Verificando tabelas existentes...")
    
    # 1. Verificar Categories
    try:
        res = supabase.table('categories').select("count", count='exact').limit(1).execute()
        print(f"✅ Tabela 'categories' existe (Count: {res.count})")
    except Exception as e:
        print(f"❌ Tabela 'categories' com erro ou inexistente: {str(e)}")

    # 2. Verificar Equipment
    try:
        res = supabase.table('equipment').select("count", count='exact').limit(1).execute()
        print(f"✅ Tabela 'equipment' existe (Count: {res.count})")
    except Exception as e:
        print(f"❌ Tabela 'equipment' com erro ou inexistente: {str(e)}")

if __name__ == "__main__":
    check_tables()
