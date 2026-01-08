import os
from supabase import create_client
import sys

SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

def diagnose():
    print(f"Connecting to: {SUPABASE_URL}")
    try:
        sp = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # 1. Fetch Categories Map
        print("\n--- Categories ---")
        cats = sp.table('categories').select('*').execute().data
        cat_map = {c['id']: c['name'] for c in cats}
        for c in cats:
            print(f"ID: {c['id']} - {c['name']}")

        # 2. Inspect 'A 29'
        print("\n--- Inspecting 'A 29' ---")
        res = sp.table('equipment').select('*').ilike('name', '%A 29%').execute()
        
        for item in res.data:
            cat_name = cat_map.get(item['category_id'], 'UNKNOWN')
            print(f"ID: {item['id']}")
            print(f"Name: {item['name']}")
            print(f"Category ID: {item['category_id']} ({cat_name})")
            print(f"Description (First 100 chars): {item['description'][:100] if item['description'] else 'None'}")
            print("-" * 20)

        # 3. Check for specific text mentioned by user
        print("\n--- Items with 'Categoria Tanques' in description ---")
        # Note: ILIKE query on description
        bad_desc_res = sp.table('equipment').select('id, name, category_id').ilike('description', '%Categoria Tanques%').limit(5).execute()
        print(f"Count (limit 5): {len(bad_desc_res.data)}")
        for item in bad_desc_res.data:
             print(f"Found: {item['name']} (Cat: {item['category_id']})")

    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    diagnose()
