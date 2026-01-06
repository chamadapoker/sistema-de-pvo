-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Usuários (Users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- Será hash (bcrypt)
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('STUDENT', 'INSTRUCTOR', 'ADMIN')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ativar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver seus próprios dados
CREATE POLICY "Users can view own data" ON users 
  FOR SELECT USING (auth.uid() = id);

-- 2. Tabela de Categorias (Categories)
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL,
  slug TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ativar RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer um pode ver categorias
CREATE POLICY "Anyone can view categories" ON categories 
  FOR SELECT USING (true);

-- 3. Tabela de Equipamentos (Equipment)
CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES categories(id),
  image_path TEXT, -- URL da imagem no Storage
  thumbnail_path TEXT,
  country TEXT,
  manufacturer TEXT,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ativar RLS
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer um pode ver equipamentos
CREATE POLICY "Anyone can view equipment" ON equipment 
  FOR SELECT USING (true);


-- 4. Inserir Categorias Iniciais (Padrão do Sistema PVO)
INSERT INTO categories (id, name, "order", slug, description) VALUES
(1, 'Aviões', 1, 'avioes', 'Aeronaves de asa fixa'),
(2, 'Helicópteros', 2, 'helicopteros', 'Aeronaves de asa rotativa'),
(3, 'Blindados', 3, 'blindados', 'Veículos blindados'),
(4, 'Embarcações', 4, 'embarcacoes', 'Navios e barcos militares'),
(5, 'Submarinos', 5, 'submarinos', 'Embarcações submersíveis'),
(6, 'Mísseis', 6, 'misseis', 'Mísseis e foguetes'),
(7, 'Armas Leves', 7, 'armas-leves', 'Armamento individual e coletivo'),
(8, 'Outros', 8, 'outros', 'Outros equipamentos')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Ajustar a sequência do ID das categorias para evitar conflitos futuros
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
