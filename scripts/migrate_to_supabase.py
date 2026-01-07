"""
Script de Migração - Sistema PVO Antigo para Supabase
Migra imagens e dados do sistema antigo (DVD PVO 2010) para o Supabase
"""

import os
import glob
from pathlib import Path
from supabase import create_client, Client

# Configurações do Supabase
SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
# Service Role Key (JWT) para bypass RLS e permissões de admin
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

# Caminhos
OLD_SYSTEM_PATH = r"C:\Users\Yoda\Downloads\DVD PVO 2010\PVO"
IMAGES_PATH = OLD_SYSTEM_PATH

# Inicializar cliente Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
failed_equipment_inserts = []
failed_category_inserts = []

def cleanup_database():
    print("🧹 [CLEANUP] Limpando tabela de equipamentos para evitar duplicatas...")
    # Buscando IDs para deletar
    limit = 1000
    while True:
        res = supabase.table('equipment').select('id').limit(limit).execute()
        if not res.data:
            break
        
        ids = [row['id'] for row in res.data]
        print(f"🗑️ Deletando lote de {len(ids)} registros...")
        try:
            supabase.table('equipment').delete().in_('id', ids).execute()
        except Exception as e:
            print(f"⚠️ Erro ao deletar: {e}")
            break
        
    print("✅ Banco limpo!")


# Mapeamento de categorias (Atualizado pelo instrutor)
# 1P = Aeronaves, 2P = Helicópteros, etc.
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

# Cache de códigos já existentes para não tentar inserir de novo
existing_codes = set()

def fetch_existing_codes():
    """Busca todos os códigos já cadastrados no banco para pular migração"""
    print("🔄 Buscando lista de equipamentos já migrados...")
    try:
        # Busca paginada se for muito grande, mas para < 10k deve funcionar num take só se aumentar o limite ou paginar
        # Supabase API max rows per request limit is usually 1000. Need to paginate.
        
        all_codes = []
        offset = 0
        limit = 1000
        while True:
            res = supabase.table('equipment').select('code').range(offset, offset + limit - 1).execute()
            batch = res.data
            if not batch:
                break
            
            for row in batch:
                all_codes.append(row['code'])
            
            offset += limit
            print(f"   ... carregados {len(all_codes)} registros existentes")
            
        global existing_codes
        existing_codes = set(all_codes)
        print(f"✅ Total encontrado no banco: {len(existing_codes)} equipamentos. Esses serão pulados.")
        
    except Exception as e:
        print(f"⚠ Erro ao buscar existentes: {e}")


def upload_image_to_supabase(local_path: str, storage_path: str) -> str:
    """
    Faz upload de uma imagem para o Supabase Storage.
    Se já existir, ignora erro e retorna URL.
    """
    try:
        # Tenta pegar URL pública primeiro para ver se arquivo já existe (opcional, mas o upload sobrescreve ou falha)
        # Vamos tentar o upload direto.
        
        with open(local_path, 'rb') as f:
            file_data = f.read()
        
        # Upload para o bucket
        try:
            supabase.storage.from_('equipment-images').upload(
                storage_path,
                file_data,
                file_options={"content-type": "image/jpeg"}
            )
        except Exception as upload_error:
            msg = str(upload_error).lower()
            if "duplicate" in msg or "already exists" in msg:
                pass # Normal, já existe
            else:
                # print(f"ℹ Aviso Upload: {str(upload_error)}")
                pass
        
        # Obter URL pública
        public_url = supabase.storage.from_('equipment-images').get_public_url(storage_path)
        return public_url
        
    except Exception as e:
        print(f"❌ Erro crítico processando imagem {local_path}: {str(e)}")
        return None


def migrate_categories():
    """Migra as categorias do dicionário local para a tabela categories"""
    print("\n📦 Verificando Categorias...")
    
    for cat_id, cat_data in CATEGORY_MAPPING.items():
        try:
            data = {
                "id": int(cat_id),
                "name": cat_data["name"],
                "slug": cat_data["name"].lower().replace(" ", "-"),
                "order": int(cat_id),
                "description": f"Categoria de equipamentos: {cat_data['name']}"
            }
            # Upsert garante que existe
            supabase.table('categories').upsert(data).execute()
        except Exception as e:
            print(f"  ⚠ Erro categoria {cat_id}: {str(e)}")


def migrate_images_from_folder(folder_number: str):
    """
    Migra todas as imagens de uma pasta de categoria (RESUMABLE)
    """
    folder_path = os.path.join(IMAGES_PATH, str(folder_number))
    
    if not os.path.exists(folder_path):
        print(f"⚠ Pasta {folder_number} não encontrada em {folder_path}")
        return

    print(f"\n📂 Analisando Pasta {folder_number} ({CATEGORY_MAPPING[str(folder_number)]['name']})...")
    
    try:
        files = os.listdir(folder_path)
    except FileNotFoundError:
         return
         
    # Filtrar imagens
    images = [f for f in files if f.lower().endswith(('.jpg', '.jpeg'))]
    print(f"  Total arquivos locais: {len(images)}")
    
    skipped_count = 0
    processed_count = 0
    
    for filename in images:
        code = os.path.splitext(filename)[0]
        
        # CHECK: Se já existe no banco, pula
        if code in existing_codes:
            skipped_count += 1
            continue
            
        # Se não existe, processa
        image_path = os.path.join(folder_path, filename)
        
        # Upload
        print(f"  📤 Enviando {code}...", end='\r')
        storage_path = f"category-{folder_number}/{filename}"
        url = upload_image_to_supabase(image_path, storage_path)
        
        if url:
            equipment_data = {
                "code": code,
                "name": f"Equipamento {code}",
                "category_id": int(folder_number),
                "image_path": url,
                "description": f"{CATEGORY_MAPPING[str(folder_number)]['name']} - {code}",
            }

            try:
                supabase.table('equipment').insert(equipment_data).execute()
                processed_count += 1
                # Adicionar ao cache local para não repeti-lo
                existing_codes.add(code)
            except Exception as e:
                print(f"    ❌ Erro DB {code}: {str(e)}")
                failed_equipment_inserts.append(equipment_data)
    
    print(f"✓ Pasta {folder_number}: {processed_count} novos enviados, {skipped_count} pulados (já existiam).")


def create_storage_bucket():
    """Cria o bucket de storage para as imagens"""
    try:
        supabase.storage.create_bucket('equipment-images', options={"public": True})
    except Exception:
        pass


def migrate_all():
    print("=" * 60)
    print("🚀 INICIANDO MIGRAÇÃO (MODO RETOMADA)")
    print("   O script irá pular itens que já estão no banco.")
    print("=" * 60)
    
    # 0. Carregar o que já foi feito
    fetch_existing_codes()
    
    # 1. Bucket
    create_storage_bucket()
    
    # 2. Categorias
    migrate_categories()
    
    # 3. Imagens
    sorted_cats = sorted(CATEGORY_MAPPING.keys(), key=lambda x: int(x))
    for folder_num in sorted_cats:
        migrate_images_from_folder(folder_num)
    
    print("\n" + "=" * 60)
    print("✅ FIM DA MIGRAÇÃO!")
    print("=" * 60)


if __name__ == "__main__":
    if not os.path.exists(OLD_SYSTEM_PATH):
        print(f"❌ Erro: Caminho não encontrado: {OLD_SYSTEM_PATH}")
        exit(1)
        
    migrate_all()

