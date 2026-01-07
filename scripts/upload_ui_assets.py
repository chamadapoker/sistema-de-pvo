
import os
from supabase import create_client

# Configurações
SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"
BITMAPS_PATH = r"C:\Users\Yoda\Downloads\DVD PVO 2010\PVO\Bitmaps"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_ui_assets():
    print("🎨 Migrando ativos de UI (Botões, Backgrounds)...")
    
    # Lista de interesse baseada no 'check_layout' e 'list_dir'
    ui_files = [
        "back1but.gif", "buttgo1.bmp", "exit.bmp", "help1.gif", 
        "pickmain.bmp", "seltool.bmp", "pvo1.bmp", "back1cat.bmp",
        "COMPDWN.BMP", "Complit.bmp", "PLAY.BMP", "REC.BMP", 
        "res800.bmp", "res640.bmp" # Backgrounds
    ]
    
    # Tentar subir tudo que parece imagem pequena de UI
    all_files = os.listdir(BITMAPS_PATH)
    
    count = 0
    for f in all_files:
        ext = os.path.splitext(f)[1].lower()
        if ext in ['.bmp', '.gif', '.jpg', '.png']:
            local_path = os.path.join(BITMAPS_PATH, f)
            with open(local_path, 'rb') as file_data:
                data = file_data.read()
            
            storage_path = f"assets/ui/{f}"
            try:
                # Content type guess
                mime = "image/bmp" if ext == '.bmp' else "image/gif" if ext == '.gif' else "image/jpeg"
                
                supabase.storage.from_('equipment-images').upload(
                    storage_path, 
                    data, 
                    file_options={"content-type": mime, "upsert": "true"}
                )
                count += 1
                if count % 10 == 0:
                    print(f"  Enviados {count} arquivos...", end='\r')
            except: pass
            
    print(f"\n✅ Total de {count} assets de UI enviados para 'assets/ui/'.")

if __name__ == "__main__":
    upload_ui_assets()
