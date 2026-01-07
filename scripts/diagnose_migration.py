
import os
import glob
from supabase import create_client, Client

# Configurações do Supabase (Mesmas do migrate_to_supabase.py)
SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

# Caminhos
OLD_SYSTEM_PATH = r"C:\Users\Yoda\Downloads\DVD PVO 2010\PVO"
IMAGES_PATH = OLD_SYSTEM_PATH

# Mapeamento
CATEGORY_MAPPING = {
    "1": {"id": 1, "name": "Aeronaves"},
    "2": {"id": 2, "name": "Helicópteros"},
    "3": {"id": 3, "name": "Veículos Blindados"},
    "4": {"id": 4, "name": "Navios"},
    "5": {"id": 5, "name": "Artilharia"},
    "6": {"id": 6, "name": "Mísseis"},
    "7": {"id": 7, "name": "Radares"},
    "8": {"id": 8, "name": "Insígnias (Cocar)"}, 
}

def diagnose():
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print("🔎 Diagnosticando estado da migração...\n")
    print(f"{'CatID':<6} | {'Nome':<20} | {'Arquivos Locais':<15} | {'No Banco':<10} | {'Status'}")
    print("-" * 80)

    last_photo_overall = None
    
    for cat_id in sorted(CATEGORY_MAPPING.keys()):
        # 1. Contar arquivos locais
        folder_path = os.path.join(IMAGES_PATH, str(cat_id))
        local_count = 0
        if os.path.exists(folder_path):
            files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg'))]
            local_count = len(files)
        else:
            print(f"⚠ Pasta não encontrada: {folder_path}")
            
        # 2. Contar no banco
        # Usar select com head=true e count=exact para ser rapido, mas o supabase-py as vezes precisa de select('*', count='exact')
        res = supabase.table('equipment').select('code', count='exact').eq('category_id', int(cat_id)).execute()
        db_count = res.count if res.count is not None else len(res.data)
        
        status = "✅ Completo" if db_count >= local_count and local_count > 0 else "⏳ Pendente"
        if db_count > local_count:
            status = "⚠ Mais no banco (?)"
        if local_count == 0:
            status = "⚠ Vazio localmente"
            
        print(f"{cat_id:<6} | {CATEGORY_MAPPING[cat_id]['name']:<20} | {local_count:<15} | {db_count:<10} | {status}")

        # Pegar o último inserido dessa categoria para mostrar pro usuario
        if db_count > 0:
             # Ordenar por created_at desc
             res_last = supabase.table('equipment').select('code, created_at, name').eq('category_id', int(cat_id)).order('created_at', desc=True).limit(1).execute()
             if res_last.data:
                 last_photo_overall = res_last.data[0]
                 print(f"       ↳ Último: {last_photo_overall['code']} ({last_photo_overall['name']}) em {last_photo_overall['created_at']}")

    print("\n")
    if last_photo_overall:
        print(f"📸 ÚLTIMA FOTO TOTAL ENVIADA: {last_photo_overall['code']} - {last_photo_overall['name']}")
    else:
        print("Nenhuma foto encontrada no banco.")

if __name__ == "__main__":
    diagnose()
