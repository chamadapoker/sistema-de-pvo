
from supabase import create_client, Client

# Configurações do Supabase (Service Role para poder escrever)
SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def main():
    print("🔧 Fixing Misplaced Categories using Supabase Client...")

    # 1. Blindados (Cat 3)
    blindados = [
        'Cascavel', 'Urutu', 'Guarani', 'M113', 'M60', 'Leopard', 
        'T-72', 'T-90', 'T-62', 'T-54', 'T-55', 'BMP', 'BTR', 
        'Abrams', 'Bradley', 'Marder', 'Gepard', 'Centauro', 'Scimitar', 'Warrior', 'Challenger', 
        'Leclerc', 'AMX-30', 'AMX-13', 'SK 105', 'M8 Greyhound'
    ]
    
    for term in blindados:
        try:
            print(f"  > Moving *{term}* to Armored Vehicles (3)...")
            # Update where name matches term AND category is NOT 3
            # Supabase-py doesn't support extensive filtering in update easily without RLS or specific logic,
            # but we can just update all matching names.
            supabase.table('equipment').update({'category_id': 3}).ilike('name', f'%{term}%').execute()
        except Exception as e:
            print(f"    Error: {str(e)}")

    # 2. Aeronaves (Cat 1) - NOT Helicopters
    aeronaves = [
        'F-5', 'Tucano', 'A-29', 'Super Tucano', 'AMX', 'A-1', 'Mirage', 'Gripen', 
        'F-16', 'F-15', 'F-18', 'F-14', 'F-22', 'F-35', 'Su-27', 'Su-30', 'Su-35', 'Su-57', 
        'MiG-29', 'MiG-21', 'J-7', 'J-10', 'J-20', 'Rafale', 'Eurofighter', 'Tornado', 'Harrier',
        'KC-390', 'C-130', 'Hercules', 'B-52', 'B-1', 'Tu-95', 'Tu-160'
    ]

    for term in aeronaves:
        try:
            print(f"  > Moving *{term}* to Aircraft (1)...")
            supabase.table('equipment').update({'category_id': 1}).ilike('name', f'%{term}%').execute()
        except Exception as e:
            print(f"    Error: {str(e)}")

    # 3. Helicópteros (Cat 2)
    helicopteros = [
        'Mi-8', 'Mi-17', 'Mi-24', 'Mi-35', 'Hind', 'Hip', 'Ka-50', 'Ka-52', 
        'Black Hawk', 'UH-60', 'Apache', 'AH-64', 'Chinook', 'CH-47', 
        'Super Puma', 'Cougar', 'Caracal', 'Fennec', 'Panther', 'Esquilo', 'Sabre', 'Viper', 'Cobra'
    ]

    for term in helicopteros:
        try:
            print(f"  > Moving *{term}* to Helicopters (2)...")
            supabase.table('equipment').update({'category_id': 2}).ilike('name', f'%{term}%').execute()
        except Exception as e:
            print(f"    Error: {str(e)}")
            
    # 4. Artilharia (Cat 5)
    artilharia = [
        'M109', 'M101', 'M114', 'Caesar', 'Astros', 'D-30', 'M-46', 'PzH 2000', 'M-30'
    ]
    for term in artilharia:
        try:
            print(f"  > Moving *{term}* to Artillery (5)...")
            supabase.table('equipment').update({'category_id': 5}).ilike('name', f'%{term}%').execute()
        except Exception as e:
            print(f"    Error: {str(e)}")

    print("\n✅ Categories Corrections Applied!")

if __name__ == "__main__":
    main()
