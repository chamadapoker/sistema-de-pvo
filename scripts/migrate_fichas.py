
import os
from supabase import create_client

# Configurações do Supabase
SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

# Caminhos
FICHAS_PATH = r"C:\Users\Yoda\Downloads\DVD PVO 2010\PVO\fichas gif"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def migrate_fichas():
    print("🚀 Iniciando migração de Fichas Técnicas (GIFs)...")
    
    if not os.path.exists(FICHAS_PATH):
        print("Pasta de fichas não encontrada.")
        return

    files = [f for f in os.listdir(FICHAS_PATH) if f.lower().endswith('.gif')]
    print(f"Encontrados {len(files)} arquivos.")
    
    success_count = 0
    
    for filename in files:
        name_key = os.path.splitext(filename)[0].strip()
        
        # 1. Upload
        print(f"Processando {filename}...", end='\r')
        storage_path = f"fichas/{filename}"
        
        try:
             with open(os.path.join(FICHAS_PATH, filename), 'rb') as f:
                file_data = f.read()
                
             supabase.storage.from_('equipment-images').upload(
                storage_path,
                file_data,
                file_options={"content-type": "image/gif", "upsert": "true"}
             )
        except Exception as e:
            # Ignorar erro de duplicidade se ocorrer
            pass
            
        public_url = supabase.storage.from_('equipment-images').get_public_url(storage_path)
        
        # 2. Linkar no Banco
        # Tenta match exato primeiro
        res = supabase.table('equipment').select('id, name').ilike('name', name_key).execute()
        
        if not res.data:
            # Tenta match parcial (contains)
            res = supabase.table('equipment').select('id, name').ilike('name', f"%{name_key}%").execute()
            
        if res.data:
            # Atualiza todos os matches
            ids = [row['id'] for row in res.data]
            match_names = [row['name'] for row in res.data]
            
            # Usando 'thumbnail_path' para guardar ficha técnica
            supabase.table('equipment').update({'thumbnail_path': public_url}).in_('id', ids).execute()
            
            # print(f"  ✅ {filename} -> {len(ids)} equipamentos: {match_names[:3]}...")
            success_count += 1
        else:
            print(f"  ⚠ {filename} - Sem match no banco (Nome chave: '{name_key}')           ")

    print(f"\n\nConcluído! {success_count}/{len(files)} fichas vinculadas.")

if __name__ == "__main__":
    migrate_fichas()
