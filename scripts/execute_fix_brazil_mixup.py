
from supabase import create_client, Client

# Configurações do Supabase (Service Role)
SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def main():
    print("🔧 Fixing Brazil Page Mixup (Artillery/Missiles in Aircraft)...")

    # 1. MK F3 / AMX 155 -> Artillery (Cat 5)
    # The term 'AMX 155' likely got caught by the 'AMX' -> Aircraft rule.
    artillery_terms = ['MK F3', 'AMX 155', 'F3', 'AMX-13 Mk F3']
    for term in artillery_terms:
        try:
            print(f"  > Moving *{term}* to Artillery (5)...")
            supabase.table('equipment').update({'category_id': 5}).ilike('name', f'%{term}%').execute()
        except Exception as e:
            print(f"    Error: {str(e)}")

    # 2. SA-16 / SA-18 / Igla / Gimlet -> Missiles (Cat 6)
    missile_terms = ['SA-16', 'GIMLET', 'IGLA', 'SA-18', 'GROUSE', 'SA-7', 'GRAIL', 'MANPADS']
    for term in missile_terms:
        try:
            print(f"  > Moving *{term}* to Missiles (6)...")
            supabase.table('equipment').update({'category_id': 6}).ilike('name', f'%{term}%').execute()
        except Exception as e:
            print(f"    Error: {str(e)}")

    # 3. Ensure AMX / A-1 stays in Aircraft (Cat 1) - Just to be safe, though specific queries above shouldn't touch it.
    # The logic above moves things containing "AMX 155", but "AMX / A-1" doesn't contain "AMX 155".

    print("\n✅ Brazil Page Updates Applied!")

if __name__ == "__main__":
    main()
