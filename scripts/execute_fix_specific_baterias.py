
from supabase import create_client, Client

# Configurações do Supabase (Service Role)
SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def main():
    print("🔧 Fixing Specific Misclassified Items from Baterias...")

    # 1. AMX series (AMX-13, AMX-30, AMX-VCI) are Armored Vehicles (Cat 3), usually misclassified as Aircraft (Cat 1) due to 'AMX' jet
    amx_tanks = ['AMX-13', 'AMX-30', 'AMX-VCI', 'AMX-VTT']
    for term in amx_tanks:
        try:
            print(f"  > Moving *{term}* to Armored Vehicles (3)...")
            supabase.table('equipment').update({'category_id': 3}).ilike('name', f'%{term}%').execute()
        except Exception as e:
            print(f"    Error: {str(e)}")

    # 2. COBRA 2000 is an Anti-Tank Missile (Cat 6), misclassified as Helicopter (Cat 2)
    # Be careful not to move AH-1 Cobra (Helicopter)
    try:
        print(f"  > Moving *COBRA 2000* to Missiles (6)...")
        supabase.table('equipment').update({'category_id': 6}).ilike('name', '%COBRA 2000%').execute()
    except Exception as e:
        print(f"    Error: {str(e)}")

    # 3. GUARANI II / IA-50 is an Aircraft (Cat 1), misclassified as Armored Vehicle (Cat 3) (Confused with Guarani APC)
    try:
        print(f"  > Moving *GUARANI II / IA-50* to Aircraft (1)...")
        supabase.table('equipment').update({'category_id': 1}).ilike('name', '%IA-50%').execute()
        supabase.table('equipment').update({'category_id': 1}).ilike('name', '%GUARANI II%').execute()
    except Exception as e:
        print(f"    Error: {str(e)}")

    print("\n✅ Specific Updates Applied!")

if __name__ == "__main__":
    main()
