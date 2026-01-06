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

# Mapeamento de categorias
CATEGORY_MAPPING = {
    "1": {"id": 1, "name": "Tanques"},
    "2": {"id": 2, "name": "Veículos Blindados"},
    "3": {"id": 3, "name": "Artilharia"},
    "4": {"id": 4, "name": "Aeronaves"},
    "5": {"id": 5, "name": "Helicópteros"},
    "6": {"id": 6, "name": "Navios"},
    "7": {"id": 7, "name": "Mísseis"},
    "8": {"id": 8, "name": "Outros"},
}


def upload_image_to_supabase(local_path: str, storage_path: str) -> str:
    """
    Faz upload de uma imagem para o Supabase Storage
    
    Args:
        local_path: Caminho local da imagem
        storage_path: Caminho no storage do Supabase
    
    Returns:
        URL pública da imagem
    """
    try:
        with open(local_path, 'rb') as f:
            file_data = f.read()
        
        # Upload para o bucket
        result = supabase.storage.from_('equipment-images').upload(
            storage_path,
            file_data,
            file_options={"content-type": "image/jpeg"}
        )
        
        # Obter URL pública
        public_url = supabase.storage.from_('equipment-images').get_public_url(storage_path)
        
        print(f"✓ Upload: {storage_path}")
        return public_url
    
    except Exception as e:
        print(f"✗ Erro no upload de {storage_path}: {str(e)}")
        return None


def migrate_categories():
    """Migra as categorias do dicionário local para a tabela categories"""
    print("\n📦 Migrando Categorias...")
    
    for cat_id, cat_data in CATEGORY_MAPPING.items():
        try:
            # Dados para inserção
            data = {
                "id": int(cat_id),
                "name": cat_data["name"],
                "slug": cat_data["name"].lower().replace(" ", "-"), # Generate slug
                "order": int(cat_id), # Use cat_id as order
                "description": f"Categoria de equipamentos: {cat_data['name']}"
            }
            
            # Tentar upsert (inserir ou atualizar)
            supabase.table('categories').upsert(data).execute()
            print(f"  ✓ Categoria {cat_id} ({cat_data['name']}) migrada")
            
        except Exception as e:
            print(f"  ⚠ Erro ao migrar categoria {cat_id}: {str(e)}")
            failed_category_inserts.append(data)


def migrate_images_from_folder(folder_number: str):
    """
    Migra todas as imagens de uma pasta de categoria
    
    Args:
        folder_number: Número da pasta (1-8)
    """
    # Use IMAGES_PATH as BASE_PATH
    folder_path = os.path.join(IMAGES_PATH, str(folder_number))
    
    if not os.path.exists(folder_path):
        print(f"⚠ Pasta {folder_number} não encontrada em {folder_path}")
        return

    print(f"\n📂 Processando Pasta {folder_number} ({CATEGORY_MAPPING[str(folder_number)]['name']})...")
    
    # Listar arquivos jpg (case insensitive)
    images = []
    for f in os.listdir(folder_path):
        if f.lower().endswith(('.jpg', '.jpeg')):
            images.append(os.path.join(folder_path, f))
    
    print(f"  Encontradas {len(images)} imagens")
    
    for image_path in images:
        filename = os.path.basename(image_path)
        code = os.path.splitext(filename)[0] # Código é o nome do arquivo sem extensão
        
        # Upload da imagem
        storage_path = f"category-{folder_number}/{filename}"
        url = upload_image_to_supabase(image_path, storage_path) # Renamed from upload_image
        
        if url:
            # Inserir registro no banco
            equipment_data = {
                "code": code,
                "name": f"Equipamento {code}",
                "category_id": int(folder_number),
                "image_path": url,
                "description": f"Equipamento militar - Categoria {CATEGORY_MAPPING[str(folder_number)]['name']}",
            }

            try:
                supabase.table('equipment').insert(equipment_data).execute()
                # print(f"    ✓ Registro inserido no banco: {code}") # Verbose demais
            except Exception as e:
                # print(f"    ⚠ Erro DB: {str(e)}") # Opcional
                failed_equipment_inserts.append(equipment_data)
    
    print(f"✓ Pasta {folder_number}: {len(images)} imagens processadas")


def create_storage_bucket():
    """Cria o bucket de storage para as imagens"""
    try:
        supabase.storage.create_bucket(
            'equipment-images',
            options={"public": True}
        )
        print("✓ Bucket 'equipment-images' criado")
    except Exception as e:
        # Ignorar erro se bucket já existe
        if "already exists" not in str(e).lower():
            print(f"ℹ Aviso sobre bucket: {str(e)}")


def migrate_all():
    """Executa a migração completa"""
    print("=" * 60)
    print("🚀 INICIANDO MIGRAÇÃO - PVO ANTIGO → SUPABASE")
    print("=" * 60)
    
    # 1. Criar bucket de storage
    print("\n📦 Passo 1: Configurando Storage...")
    create_storage_bucket()
    
    # 2. Migrar categorias
    print("\n🗂 Passo 2: Migrando Categorias...")
    migrate_categories()
    
    # 3. Migrar imagens de cada categoria
    print("\n📸 Passo 3: Migrando Imagens e Equipamentos...")
    for folder_num in CATEGORY_MAPPING.keys():
        migrate_images_from_folder(folder_num)
    
    print("\n" + "=" * 60)
    print("✅ MIGRAÇÃO CONCLUÍDA!")
    print("=" * 60)
    print("\n📊 Próximos passos:")
    print("  1. Verificar imagens no Supabase Storage")
    print("  2. Atualizar nomes dos equipamentos no banco")
    print("  3. Adicionar descrições detalhadas")
    print("  4. Testar no frontend")


if __name__ == "__main__":
    # Verificar se o caminho existe
    if not os.path.exists(OLD_SYSTEM_PATH):
        print(f"❌ Erro: Caminho não encontrado: {OLD_SYSTEM_PATH}")
        print("   Verifique se o DVD PVO 2010 está acessível")
        exit(1)
        
    # Executar migração diretamerte
    migrate_all()
