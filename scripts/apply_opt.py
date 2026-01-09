
import os
import psycopg2
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', 'client', '.env'))

DB_URL = os.getenv("VITE_SUPABASE_DB_URL") or os.getenv("DATABASE_URL")

# Fallback se não estiver no .env do client, tentar hardcoded ou perguntar (mas aqui vou tentar ler do .env root se existir)
if not DB_URL:
    # Tenta ler do .env local se existir
    load_dotenv()
    DB_URL = os.getenv("DATABASE_URL")

if not DB_URL:
    print("❌ Erro: DATABASE_URL não encontrada. Verifique o arquivo .env")
    exit(1)

def apply_optimizations():
    print("🚀 Iniciando Otimização do Banco de Dados...")
    
    script_path = os.path.join(os.path.dirname(__file__), 'optimize_db.sql')
    
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        # Habilitar extensão pg_trgm se necessário para o índice de texto
        print("   - Verificando extensões...")
        cur.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm;")
        
        with open(script_path, 'r', encoding='utf-8') as f:
            sql_script = f.read()
            
        print("   - Aplicando Índices e Correções de Segurança...")
        cur.execute(sql_script)
        
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Sucesso! Banco de dados otimizado e blindado.")
        
    except Exception as e:
        print(f"❌ Erro ao aplicar otimizações: {e}")

if __name__ == "__main__":
    apply_optimizations()
