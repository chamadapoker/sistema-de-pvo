from supabase import create_client
import collections

# Configurações PÚBLICAS
URL = "https://baoboggeqhksaxkuudap.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NjY1NDAsImV4cCI6MjA4MzI0MjU0MH0.J_6R4PynHT2mq7sce4MkNPaMsXr7kAIdvj9CGcFUksM"

def diagnose_categories():
    print("🕵️ Diagnosticando Distribuição de Categorias...")
    sp = create_client(URL, ANON_KEY)
    
    # Busca todos os equipamentos (apenas id e category_id para ser leve)
    # Como são 4000+, vamos paginar ou pegar um count agrupado se possível.
    # Supabase não tem group by fácil na API pública, vamos pegar raw.
    
    # Vamos pegar as categorias primeiro para ver os IDs reais
    cats = sp.table('categories').select('*').execute()
    print("\n📋 Categorias no Banco:")
    cat_map = {}
    for c in cats.data:
        print(f"ID: {c['id']} - Nome: {c['name']}")
        cat_map[c['id']] = c['name']

    print("\n📊 Contagem de Equipamentos por Categoria:")
    # Pegar range grande
    count_per_id = collections.defaultdict(int)
    
    # Loop simples para pegar tudo (limit 5000)
    eqs = sp.table('equipment').select('category_id').limit(5000).execute()
    
    for e in eqs.data:
        cid = e.get('category_id')
        count_per_id[cid] += 1
        
    for cid, count in count_per_id.items():
        name = cat_map.get(cid, "DESCONHECIDO")
        print(f"Category ID {cid} ({name}): {count} equipamentos")

if __name__ == "__main__":
    diagnose_categories()
