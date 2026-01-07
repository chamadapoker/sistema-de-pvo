
import os
from supabase import create_client, Client

# Configurações do Supabase
SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

IMAGES_PATH = r"C:\Users\Yoda\Downloads\DVD PVO 2010\PVO"

CATEGORY_MAPPING = {
    "1": "Aeronaves",
    "2": "Helicópteros",
    "3": "Veículos Blindados",
    "4": "Navios",
    "5": "Artilharia",
    "6": "Mísseis",
    "7": "Radares",
    "8": "Insígnias (Cocar)"
}

def verify():
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print("\n📊 RELATÓRIO FINAL DE MIGRAÇÃO")
    print(f"{'Cat':<4} | {'Nome':<20} | {'Local':<8} | {'Banco':<8} | {'Status'}")
    print("-" * 70)
    
    total_local = 0
    total_db = 0
    
    for cat_id, cat_name in CATEGORY_MAPPING.items():
        # Contagem Local
        folder_path = os.path.join(IMAGES_PATH, cat_id)
        local_count = 0
        if os.path.exists(folder_path):
            local_count = len([f for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg'))])
        
        # Contagem Banco
        res = supabase.table('equipment').select('id', count='exact').eq('category_id', int(cat_id)).execute()
        db_count = res.count
        
        status = "✅ OK" if db_count >= local_count else "❌ FALTAM"
        if db_count > local_count: status = "✅ OK (+)" # Mais no banco é OK (pode ter lixo antigo ou teste)
        
        print(f"{cat_id:<4} | {cat_name:<20} | {local_count:<8} | {db_count:<8} | {status}")
        
        total_local += local_count
        total_db += db_count
        
    print("-" * 70)
    print(f"TOTAL | {'TODOS':<20} | {total_local:<8} | {total_db:<8} |")
    print("\n")

if __name__ == "__main__":
    verify()
