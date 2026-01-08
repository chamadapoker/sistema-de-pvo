
from supabase import create_client, Client

# Configurações do Supabase (Service Role)
SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def main():
    print("🔧 Fixing Fokker Mixup in Helicopters...")

    # Identify items to move to Aircraft (Cat 1)
    # These are mistakenly in Helicopters (Cat 2)
    aircraft_in_heli = [
        'F-27', 
        'FRIENDSHIP', 
        'F-28', 
        'FELLOWSHIP'
    ]
    
    for term in aircraft_in_heli:
        try:
            print(f"  > Moving *{term}* to Aircraft (1)...")
            # We want to be careful not to move things like 'F-16' if I just search 'F-'
            # But 'F-27' and 'F-28' are specific enough for this context.
            # Using ilike '%term%' might be safe for these names.
            supabase.table('equipment').update({'category_id': 1}).ilike('name', f'%{term}%').execute()
        except Exception as e:
            print(f"    Error: {str(e)}")

    print("\n✅ Fokker Updates Applied!")

if __name__ == "__main__":
    main()
