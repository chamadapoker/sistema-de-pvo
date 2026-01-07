
import os
from supabase import create_client

SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

def check_names():
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Lista de fichas
    fichas_path = r"C:\Users\Yoda\Downloads\DVD PVO 2010\PVO\fichas gif"
    fichas = [os.path.splitext(f)[0] for f in os.listdir(fichas_path) if f.lower().endswith('.gif')]
    
    print(f"Total fichas: {len(fichas)}")
    
    matches = 0
    for name in fichas:
        # Tenta achar contains
        res = supabase.table('equipment').select('name, code').ilike('name', f"%{name}%").limit(1).execute()
        
        status = "❌"
        found = ""
        if res.data:
            matches += 1
            status = "✅"
            found = f"-> {res.data[0]['name']} ({res.data[0]['code']})"
            
        print(f"{name:<20} {status} {found}")

    print(f"\nTotal Matched: {matches}/{len(fichas)}")

if __name__ == "__main__":
    check_names()
