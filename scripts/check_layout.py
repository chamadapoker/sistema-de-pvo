
import os
from supabase import create_client

# Configurações
SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

def check_images():
    print("🔎 Verificando imagens do layout antigo...")
    path = r"C:\Users\Yoda\Downloads\DVD PVO 2010\Leiame_arquivos"
    
    if not os.path.exists(path):
        print("Pasta não encontrada.")
        return

    files = os.listdir(path)
    print(f"Encontrados {len(files)} arquivos.")
    for f in files:
         print(f"  - {f}")

if __name__ == "__main__":
    check_images()
