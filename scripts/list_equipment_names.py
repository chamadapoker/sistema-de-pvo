import os
from supabase import create_client, Client

SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def list_equipments():
    print("📋 Listando 50 equipamentos do banco...")
    res = supabase.table('equipment').select('name, category_id').limit(50).execute()
    for item in res.data:
        print(f"ID: {item.get('id')} | Cat: {item.get('category_id')} | Nome: {item.get('name')}")

if __name__ == "__main__":
    list_equipments()
