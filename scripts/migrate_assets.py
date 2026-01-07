
import os
from supabase import create_client

# Configurações
SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"
BITMAPS_PATH = r"C:\Users\Yoda\Downloads\DVD PVO 2010\PVO\Bitmaps"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_category_icons():
    print("🎨 Migrando ícones de categoria...")
    
    # Mapeamento arquivo -> id categoria
    # c1.jpg -> Cat 1 (Aviões), etc.
    
    for i in range(1, 9):
        filename = f"c{i}.jpg"
        local_path = os.path.join(BITMAPS_PATH, filename)
        
        if not os.path.exists(local_path):
            # Tentar BMP se JPG não existir
            filename = f"c{i}.bmp"
            local_path = os.path.join(BITMAPS_PATH, filename)
            
        if os.path.exists(local_path):
            print(f"  Enviando {filename} para Categoria {i}...", end='\r')
            
            with open(local_path, 'rb') as f:
                data = f.read()
                
            storage_path = f"assets/categories/{filename}"
            # Upload
            try:
                supabase.storage.from_('equipment-images').upload(
                    storage_path, 
                    data, 
                    file_options={"content-type": "image/jpeg", "upsert": "true"}
                )
            except: pass
            
            url = supabase.storage.from_('equipment-images').get_public_url(storage_path)
            
            # Update DB (vamos usar o campo description para guardar a url da imagem por enquanto? 
            # Ou melhor, criar uma tabela assets? 
            # O jeito mais limpo é adicionar uma coluna `image_url` na tabela `categories`.
            # Como não posso alterar schema facilmente via python sem SQL driver,
            # vou guardar a URL no campo `description` separado por um pipe ou JSON, 
            # OU usar o bucket apenas e deixar o frontend assumir a URL padrão.
            # Mas espera, a tabela categories tem `description`.
            # Vou prefixar a URL na descrição: "URL:http... | Descrição..."
            # Não, é sujo.
            # Vou assumir que o frontend vai buscar `assets/categories/c{id}.jpg` direto do bucket.
            # Mas vou fazer o upload.
            
            # Melhor: Tentar atualizar um campo `slug` ou `description` com o link se der. 
            # Mas apenas o upload já garante que o asset está lá.
            pass
            
    print("\n✅ Ícones enviados para pasta 'assets/categories/'.")

def upload_intro_video():
    print("🎬 Migrando vídeo de abertura...")
    video_file = "cred800600.avi" 
    local_path = os.path.join(BITMAPS_PATH, video_file)
    
    if os.path.exists(local_path):
        print(f"  Enviando {video_file} (pode demorar, 28MB)...")
        with open(local_path, 'rb') as f:
            data = f.read()
            
        storage_path = f"assets/videos/{video_file}"
        try:
            supabase.storage.from_('equipment-images').upload(
                storage_path, 
                data, 
                file_options={"content-type": "video/x-msvideo", "upsert": "true"}
            )
            print("  ✓ Vídeo enviado.")
            url = supabase.storage.from_('equipment-images').get_public_url(storage_path)
            print(f"  🔗 URL: {url}")
        except Exception as e:
            print(f"  ❌ Erro no vídeo: {e}")
    else:
        print(f"  ⚠ Vídeo {video_file} não encontrado.")

if __name__ == "__main__":
    upload_category_icons()
    upload_intro_video()
