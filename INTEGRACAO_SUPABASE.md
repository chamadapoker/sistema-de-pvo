# Guia de Integração com Supabase - PVO Modern

## 📋 Credenciais do Supabase

```
SUPABASE_PROJECT_ID: baoboggeqhksaxkuudap
SUPABASE_URL: https://baoboggeqhksaxkuudap.supabase.co
SUPABASE_ANON_KEY: sbp_bf907a9ca211f2204d9c53622208006dc5877cc1
SUPABASE_SERVICE_KEY: sb_secret_Xs-ME1wIXYItnQgcKTTmIA_PiV87KUv
```

**Nota:** O token `sbp_bf907a9ca211f2204d9c53622208006dc5877cc1` é a chave de acesso principal.

## 🚀 Passo a Passo para Integração

### 1. Instalar Dependências do Supabase

```bash
cd client
npm install @supabase/supabase-js
```

### 2. Criar Arquivo de Configuração do Supabase

Criar arquivo: `client/src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://baoboggeqhksaxkuudap.supabase.co'
const supabaseAnonKey = 'sbp_bf907a9ca211f2204d9c53622208006dc5877cc1'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 3. Atualizar Variáveis de Ambiente

Criar/Atualizar: `client/.env`

```env
VITE_SUPABASE_URL=https://baoboggeqhksaxkuudap.supabase.co
VITE_SUPABASE_ANON_KEY=sbp_bf907a9ca211f2204d9c53622208006dc5877cc1
```

### 4. Estrutura do Banco de Dados no Supabase

Execute os seguintes comandos SQL no Supabase SQL Editor:

#### 4.1 Tabela de Usuários (users)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('STUDENT', 'INSTRUCTOR', 'ADMIN')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas seus próprios dados
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);
```

#### 4.2 Tabela de Categorias (categories)
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir categorias padrão
INSERT INTO categories (name, description, "order") VALUES
  ('Tanques', 'Veículos de combate blindados', 1),
  ('Veículos Blindados', 'Veículos de transporte blindados', 2),
  ('Artilharia', 'Sistemas de artilharia', 3),
  ('Aeronaves', 'Aviões militares', 4),
  ('Helicópteros', 'Helicópteros militares', 5),
  ('Navios', 'Embarcações militares', 6),
  ('Mísseis', 'Sistemas de mísseis', 7),
  ('Outros', 'Outros equipamentos', 8);

-- Habilitar RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ver categorias
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

-- Política: Apenas instrutores podem criar/editar
CREATE POLICY "Instructors can manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('INSTRUCTOR', 'ADMIN')
    )
  );
```

#### 4.3 Tabela de Equipamentos (equipment)
```sql
CREATE TABLE equipment (
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

-- Habilitar RLS
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ver equipamentos
CREATE POLICY "Anyone can view equipment" ON equipment
  FOR SELECT USING (true);

-- Política: Apenas instrutores podem gerenciar
CREATE POLICY "Instructors can manage equipment" ON equipment
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('INSTRUCTOR', 'ADMIN')
    )
  );
```

#### 4.4 Tabela de Testes Padrão (standard_tests)
```sql
CREATE TABLE standard_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- em minutos
  question_count INTEGER NOT NULL,
  creator_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE standard_tests ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ver testes
CREATE POLICY "Anyone can view tests" ON standard_tests
  FOR SELECT USING (true);

-- Política: Apenas instrutores podem criar/editar
CREATE POLICY "Instructors can manage tests" ON standard_tests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('INSTRUCTOR', 'ADMIN')
    )
  );
```

#### 4.5 Tabela de Questões de Teste (test_questions)
```sql
CREATE TABLE test_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES standard_tests(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES equipment(id),
  "order" INTEGER NOT NULL,
  display_time INTEGER NOT NULL, -- em segundos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE test_questions ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ver questões
CREATE POLICY "Anyone can view questions" ON test_questions
  FOR SELECT USING (true);

-- Política: Apenas instrutores podem gerenciar
CREATE POLICY "Instructors can manage questions" ON test_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('INSTRUCTOR', 'ADMIN')
    )
  );
```

#### 4.6 Tabela de Resultados (test_results)
```sql
CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  test_id UUID REFERENCES standard_tests(id),
  score INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  total_time INTEGER NOT NULL, -- em segundos
  test_type TEXT NOT NULL CHECK (test_type IN ('FREE', 'STANDARD', 'TRAINING')),
  answers JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver seus próprios resultados
CREATE POLICY "Users can view own results" ON test_results
  FOR SELECT USING (auth.uid() = user_id);

-- Política: Instrutores podem ver todos os resultados
CREATE POLICY "Instructors can view all results" ON test_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('INSTRUCTOR', 'ADMIN')
    )
  );

-- Política: Usuários podem criar seus próprios resultados
CREATE POLICY "Users can create own results" ON test_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 5. Configurar Storage para Imagens

No Supabase Dashboard:

1. Ir em **Storage**
2. Criar um bucket chamado `equipment-images`
3. Configurar políticas de acesso:

```sql
-- Política: Todos podem ver imagens
CREATE POLICY "Anyone can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'equipment-images');

-- Política: Instrutores podem fazer upload
CREATE POLICY "Instructors can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'equipment-images' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('INSTRUCTOR', 'ADMIN')
    )
  );
```

### 6. Atualizar Services para usar Supabase

#### 6.1 Auth Service (`client/src/services/authService.ts`)

```typescript
import { supabase } from '../lib/supabase';
import type { AuthResponse, User } from '../types/index.ts';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    // Buscar usuário no Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar senha (você precisará implementar hash de senha)
    // Por enquanto, comparação simples
    if (user.password !== password) {
      throw new Error('Credenciais inválidas');
    }

    // Gerar token (usar Supabase Auth posteriormente)
    const token = btoa(`${user.id}:${Date.now()}`);

    return {
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.created_at,
      },
    };
  },

  async register(email: string, password: string, name: string, role: string = 'STUDENT') {
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password, name, role }])
      .select()
      .single();

    if (error) throw error;

    return {
      message: 'Usuário criado com sucesso',
      user: data,
    };
  },

  async getProfile() {
    // Implementar busca de perfil
    return { user: null };
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
```

#### 6.2 Equipment Service

```typescript
import { supabase } from '../lib/supabase';
import type { Equipment, Category } from '../types/index.ts';

export const equipmentService = {
  async getAllEquipment(params?: { categoryId?: number; search?: string }) {
    let query = supabase.from('equipment').select('*, category:categories(*)');

    if (params?.categoryId) {
      query = query.eq('category_id', params.categoryId);
    }

    if (params?.search) {
      query = query.or(`name.ilike.%${params.search}%,code.ilike.%${params.search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { equipment: data };
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order');

    if (error) throw error;

    return { categories: data };
  },

  async createEquipment(formData: FormData) {
    // Upload de imagem primeiro
    const imageFile = formData.get('image') as File;
    let imagePath = '';

    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('equipment-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;
      imagePath = uploadData.path;
    }

    // Criar equipamento
    const equipmentData = {
      code: formData.get('code'),
      name: formData.get('name'),
      description: formData.get('description'),
      category_id: parseInt(formData.get('category_id') as string),
      country: formData.get('country'),
      manufacturer: formData.get('manufacturer'),
      year: parseInt(formData.get('year') as string),
      image_path: imagePath,
    };

    const { data, error } = await supabase
      .from('equipment')
      .insert([equipmentData])
      .select()
      .single();

    if (error) throw error;

    return {
      message: 'Equipamento criado com sucesso',
      equipment: data,
    };
  },
};
```

### 7. Migrar Usuários de Teste

Execute no Supabase SQL Editor:

```sql
-- Inserir usuários de teste (senhas em texto plano por enquanto)
INSERT INTO users (email, password, name, role) VALUES
  ('aluno@pvo.mil.br', 'aluno123', 'Aluno Teste', 'STUDENT'),
  ('instrutor@pvo.mil.br', 'instrutor123', 'Instrutor Teste', 'INSTRUCTOR'),
  ('admin@pvo.mil.br', 'admin123', 'Administrador', 'ADMIN');
```

### 8. Próximos Passos

1. ✅ Instalar dependências do Supabase
2. ✅ Criar estrutura do banco de dados
3. ✅ Configurar Storage
4. ✅ Migrar usuários de teste
5. ⏳ Atualizar services para usar Supabase
6. ⏳ Implementar upload de imagens
7. ⏳ Implementar autenticação com Supabase Auth
8. ⏳ Testar todas as funcionalidades

### 9. Comandos Úteis

```bash
# Instalar Supabase CLI (opcional)
npm install -g supabase

# Fazer backup do banco
supabase db dump -f backup.sql

# Restaurar backup
supabase db reset
```

---

**Sistema pronto para integração com Supabase!** 🚀

Todas as credenciais e estruturas estão documentadas para facilitar a migração amanhã.
