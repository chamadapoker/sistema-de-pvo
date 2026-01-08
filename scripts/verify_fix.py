import os
from supabase import create_client
import sys

SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

def verify():
    print(f"Connecting to: {SUPABASE_URL}")
    try:
        sp = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # 1. Check A-29
        print("\n--- Verifying A-29 ---")
        a29_res = sp.table('equipment').select('name, description').ilike('name', '%A 29%').limit(1).execute()
        
        if a29_res.data:
            desc = a29_res.data[0]['description']
            print(f"Name: {a29_res.data[0]['name']}")
            print(f"Description Start: {desc[:50]}...")
            if "Super Tucano" in desc:
                print("✅ A-29 Description Updated Successfully!")
            else:
                print("❌ A-29 Description NOT updated yet.")
        else:
            print("⚠️ No A-29 found to verify.")

        # 2. Check for leftover 'Categoria Tanques' in Aircrafts (Cat 1)
        print("\n--- Verifying Cleanup (Aircrafts) ---")
        bad_res = sp.table('equipment').select('count', count='exact') \
            .eq('category_id', 1) \
            .ilike('description', '%Categoria Tanques%') \
            .execute()
            
        remaining_errors = bad_res.count
        print(f"Remaining errors in Aircrafts: {remaining_errors}")
        
        if remaining_errors == 0:
            print("✅ CLEANUP SUCCESSFUL: No aircrafts labeled as tanks.")
        else:
            print(f"❌ CLEANUP FAILED: {remaining_errors} aircrafts still labeled as tanks.")

    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify()
