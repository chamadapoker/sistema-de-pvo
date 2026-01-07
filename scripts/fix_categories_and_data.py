from supabase import create_client

URL = "https://baoboggeqhksaxkuudap.supabase.co"
# Usando Service Role para ter permissão de Update/Delete irrestrito
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

def fix_data():
    sp = create_client(URL, SERVICE_KEY)
    print("🔧 Iniciando correção e organização dos dados...")

    # 1. Atualizar NOMES das Categorias
    print("\n📦 Atualizando definições de Categorias...")
    categories = [
        {"id": 1, "name": "Aeronaves", "slug": "aeronaves"},
        {"id": 2, "name": "Helicópteros", "slug": "helicopteros"},
        {"id": 3, "name": "Veículos Blindados", "slug": "veiculos-blindados"},
        {"id": 4, "name": "Navios", "slug": "navios"},
        {"id": 5, "name": "Artilharia", "slug": "artilharia"},
        {"id": 6, "name": "Mísseis", "slug": "misseis"},
        {"id": 7, "name": "Radares", "slug": "radares"},
        {"id": 8, "name": "Insígnias (Cocar)", "slug": "insignias"},
    ]
    
    for cat in categories:
        data = {
            "name": cat['name'],
            "slug": cat['slug'],
            "description": f"Categoria: {cat['name']}"
        }
        sp.table('categories').update(data).eq('id', cat['id']).execute()
        print(f"  ✓ Categoria {cat['id']} atualizada para '{cat['name']}'")

    # 2. Mover Equipamentos para as Categorias Certas (Baseado no Código)
    print("\n🔄 Realocando equipamentos baseados no prefixo do código...")
    # 1... -> 1, 2... -> 2, etc. (Independente se é P, T, ou qualquer coisa)
    for i in range(1, 9):
        prefix = f"{i}%" # Pega tudo que começa com o número
        print(f"  Processando prefixo '{prefix}' -> Categoria {i}...")
        
        # Update where code ILIKE '{i}%'
        try:
            r = sp.table('equipment').update({'category_id': i}).ilike('code', prefix).execute()
            print(f"  ✓ Ajustados equipamentos para Categoria {i}")
        except Exception as e:
            print(f"  ⚠ Erro ao atualizar cat {i}: {e}")

    # 3. Remover Duplicatas
    # (Estratégia: Buscar todos os códigos, identificar duplicados e deletar os IDs excedentes)
    print("\n🧹 Verificando duplicatas (isso pode demorar um pouco)...")
    
    # Paginação para não estourar memória
    page = 0
    limit = 1000
    seen_codes = set()
    duplicates_to_delete = []
    
    while True:
        print(f"  Lendo página {page}...")
        res = sp.table('equipment').select('id, code').range(page*limit, (page+1)*limit -1).execute()
        if not res.data:
            break
            
        for row in res.data:
            code = row['code']
            if code in seen_codes:
                duplicates_to_delete.append(row['id'])
            else:
                seen_codes.add(code)
        
        page += 1
        
    print(f"  Encontradas {len(duplicates_to_delete)} duplicatas para deletar.")
    
    if duplicates_to_delete:
        # Deletar em lotes de 100
        batch_size = 100
        for i in range(0, len(duplicates_to_delete), batch_size):
            batch = duplicates_to_delete[i:i+batch_size]
            sp.table('equipment').delete().in_('id', batch).execute()
            print(f"    🗑️ Deletadas {len(batch)} duplicatas...")
            
    print("\n✅ Correção Concluída!")

if __name__ == "__main__":
    fix_data()
