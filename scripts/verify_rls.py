from supabase import create_client

# Configurações PÚBLICAS (iguais ao site)
URL = "https://baoboggeqhksaxkuudap.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NjY1NDAsImV4cCI6MjA4MzI0MjU0MH0.J_6R4PynHT2mq7sce4MkNPaMsXr7kAIdvj9CGcFUksM"

def check_public_access():
    print("🕵️ Testando acesso PÚBLICO (Site)...")
    try:
        sp = create_client(URL, ANON_KEY)
        res = sp.table('equipment').select("count", count='exact').limit(1).execute()
        
        print(f"📊 Conteúdo visível publicamente: {res.count}")
        
        if res.count == 0:
            print("⚠️ PROBLEMA DETECTADO: O banco tem dados, mas o público vê 0.")
            print("💡 Solução: Criar política RLS permitindo SELECT na tabela 'equipment'.")
        else:
            print("✅ Acesso público parece OK.")
            
    except Exception as e:
        print(f"❌ Erro ao testar: {str(e)}")

if __name__ == "__main__":
    check_public_access()
