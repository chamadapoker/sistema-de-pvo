import os
from supabase import create_client
import sys

# URL and Key (Service Role)
SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

def check_stats():
    print(f"Connecting to: {SUPABASE_URL}")
    try:
        sp = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # 1. Total Equipment
        # Note: count='exact' is needed
        eq_res = sp.table('equipment').select('*', count='exact').limit(1).execute()
        total_equipment = eq_res.count
        print(f"✅ Total Equipments: {total_equipment}")

        # 2. Total Categories
        cat_res = sp.table('categories').select('*', count='exact').limit(1).execute()
        total_categories = cat_res.count
        print(f"✅ Total Categories: {total_categories}")

        # 3. Equipments per Category
        # Supabase doesn't do 'GROUP BY' easily via JS/Python client usually without RPC.
        # But we can fetch categories and count via separate queries if N is small.
        # Or just raw SQL if possible? No.
        
        print("\n--- Distribution per Category ---")
        cats = sp.table('categories').select('id, name').execute().data
        for cat in cats:
            c_res = sp.table('equipment').select('*', count='exact').eq('category_id', cat['id']).limit(1).execute()
            print(f"- {cat['name']}: {c_res.count}")

        # 4. Uncategorized
        uncat_res = sp.table('equipment').select('*', count='exact').is_('category_id', 'null').limit(1).execute()
        print(f"- [Uncategorized]: {uncat_res.count}")

    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    check_stats()
