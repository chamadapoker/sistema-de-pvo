from supabase import create_client

URL = "https://baoboggeqhksaxkuudap.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NjY1NDAsImV4cCI6MjA4MzI0MjU0MH0.J_6R4PynHT2mq7sce4MkNPaMsXr7kAIdvj9CGcFUksM"

def check_query():
    print("🕵️ Testando Query Complexa (JOIN)...")
    try:
        sp = create_client(URL, ANON_KEY)
        # Tenta fazer o JOIN que o frontend faz
        res = sp.table('equipment').select('*, categories(*)').limit(1).execute() # python usa nome da tabela
        
        print("✅ Query com JOIN funcionou!")
        print(res.data)
        
    except Exception as e:
        print(f"❌ Erro na Query: {str(e)}")

if __name__ == "__main__":
    check_query()
