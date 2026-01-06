import requests

PROJECT_REF = "baoboggeqhksaxkuudap"
# Personal Access Token para Management API
ACCESS_TOKEN = "sbp_bf907a9ca211f2204d9c53622208006dc5877cc1"

def run_sql(query):
    url = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/sql"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "query": query
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200 or response.status_code == 201:
            print("✓ SQL executado com sucesso")
            return response.json()
        else:
            print(f"✗ Erro SQL ({response.status_code}):")
            print(response.text)
            return None
    except Exception as e:
        print(f"✗ Erro na requisição: {str(e)}")
        return None

# SQL Completo do INTEGRACAO_SUPABASE.md
SQL_COMMANDS = """
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('STUDENT', 'INSTRUCTOR', 'ADMIN')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'Users can view own data') THEN
        CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
    END IF;
END $$;


-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL,
  slug TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'categories' AND policyname = 'Anyone can view categories') THEN
        CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);
    END IF;
END $$;


-- 3. Equipment Table
CREATE TABLE IF NOT EXISTS equipment (
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
);

ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'equipment' AND policyname = 'Anyone can view equipment') THEN
        CREATE POLICY "Anyone can view equipment" ON equipment FOR SELECT USING (true);
    END IF;
END $$;
"""

if __name__ == "__main__":
    print("🚀 Configurando Banco de Dados via Management API...")
    run_sql(SQL_COMMANDS)
