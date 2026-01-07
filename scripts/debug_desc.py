
import os
from supabase import create_client

SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

def check_one_description():
    print("🕵️ Investigando descrições nos equipamentos...")
    sp = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Pegar 5 aeronaves aleatórias
    res = sp.table('equipment').select('*').eq('category_id', 1).limit(5).execute()
    
    for item in res.data:
        print(f"\n[{item['code']}] {item['name']}")
        desc = item.get('description', '')
        if desc:
            print(f"  📝 Descrição ({len(desc)} chars): {desc[:100]}...")
        else:
            print("  ❌ DESCRIÇÃO VAZIA!")

if __name__ == "__main__":
    check_one_description()
