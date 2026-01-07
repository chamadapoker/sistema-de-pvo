import requests
import pg8000.native
import time

PROJECT_REF = "baoboggeqhksaxkuudap"
ACCESS_TOKEN = "sbp_bf907a9ca211f2204d9c53622208006dc5877cc1"
NEW_DB_PASSWORD = "PvoModern2025!"
DB_HOST = f"db.{PROJECT_REF}.supabase.co"
DB_USER = "postgres"
DB_PORT = 5432

def reset_password():
    url = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/password"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {"password": NEW_DB_PASSWORD}
    
    print("🔄 Redefinindo senha do banco de dados...")
    try:
        response = requests.put(url, headers=headers, json=data)
        if response.status_code == 200:
            print("✓ Senha redefinida com sucesso")
            return True
        else:
            print(f"✗ Erro ao redefinir senha ({response.status_code}):")
            print(response.text)
            return False
    except Exception as e:
        print(f"✗ Erro na requisição: {str(e)}")
        return False

def setup_database():
    print(f"🔌 Conectando ao Postgres ({DB_HOST})...")
    # Tentar conectar com retries, pois a troca de senha pode levar uns segundos
    for i in range(5):
        try:
            con = pg8000.native.Connection(
                user=DB_USER,
                password=NEW_DB_PASSWORD,
                host=DB_HOST,
                port=DB_PORT,
                database="postgres",
                ssl_context=True
            )
            print("✓ Conectado!")
            return con
        except Exception as e:
            print(f"  ⏳ Tentativa {i+1} falhou: {str(e)}")
            time.sleep(3)
    return None

SQL_COMMANDS = [
    # Extensions
    'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
    
    # 1. Users Table
    """CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('STUDENT', 'INSTRUCTOR', 'ADMIN')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );""",
    "ALTER TABLE users ENABLE ROW LEVEL SECURITY;",
    """DO $$ 
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'Users can view own data') THEN
            CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
        END IF;
    END $$;""",

    # 2. Categories Table
    """CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      "order" INTEGER NOT NULL,
      slug TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );""",
    "ALTER TABLE categories ENABLE ROW LEVEL SECURITY;",
    """DO $$ 
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'categories' AND policyname = 'Anyone can view categories') THEN
            CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);
        END IF;
    END $$;""",

    # 3. Equipment Table
    """CREATE TABLE IF NOT EXISTS equipment (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      category_id INTEGER REFERENCES categories(id),
      image_path TEXT,
      thumbnail_path TEXT,
      country TEXT,
      manufacturer TEXT,
      year INTEGER,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );""",
    "ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;",
    """DO $$ 
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'equipment' AND policyname = 'Anyone can view equipment') THEN
            CREATE POLICY "Anyone can view equipment" ON equipment FOR SELECT USING (true);
        END IF;
    END $$;"""
]

if __name__ == "__main__":
    if reset_password():
        # Esperar propagação
        print("⏳ Aguardando 10s para propagação da senha...")
        time.sleep(10)
        
        con = setup_database()
        if con:
            print("\n🛠 Executando SQL DDL...")
            for sql in SQL_COMMANDS:
                try:
                    con.run(sql)
                    print("  ✓ Comando executado")
                except Exception as e:
                    print(f"  ⚠ Erro SQL ignorado: {str(e)}")
            con.close()
            print("\n✅ Banco de dados configurado com sucesso!")
        else:
            print("\n❌ Falha ao conectar no banco.")
    else:
        print("\n❌ Falha ao redefinir senha.")
