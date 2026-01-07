-- ============================================
-- PVO POKER - Sistema de Avaliações Agendadas
-- ============================================

-- 1. Tabela de Provas Agendadas
CREATE TABLE IF NOT EXISTS scheduled_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações Básicas
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Configuração da Prova
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  question_count INTEGER NOT NULL DEFAULT 20,
  time_per_question INTEGER NOT NULL DEFAULT 15,
  passing_score INTEGER DEFAULT 70,
  
  -- Agendamento
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  duration_minutes INTEGER,
  
  -- Controle de Acesso
  status VARCHAR(50) DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'ACTIVE', 'FINISHED', 'CANCELLED')),
  is_active BOOLEAN DEFAULT FALSE,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  
  -- Criação e Auditoria
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Tentativas de Prova
CREATE TABLE IF NOT EXISTS test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Referências
  test_id UUID NOT NULL REFERENCES scheduled_tests(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  
  -- Dados da Tentativa
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finished_at TIMESTAMP WITH TIME ZONE,
  
  -- Resultados
  score INTEGER,
  correct_answers INTEGER,
  total_questions INTEGER,
  time_taken INTEGER, -- segundos
  
  -- Detalhes (JSON com todas as respostas)
  answers JSONB DEFAULT '[]'::jsonb,
  
  -- Status
  status VARCHAR(50) DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'ABANDONED')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Garantir uma tentativa por aluno por prova
  UNIQUE(test_id, student_id)
);

-- 3. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_scheduled_tests_status ON scheduled_tests(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_tests_date ON scheduled_tests(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_scheduled_tests_created_by ON scheduled_tests(created_by);
CREATE INDEX IF NOT EXISTS idx_test_attempts_test_id ON test_attempts(test_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_student_id ON test_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_status ON test_attempts(status);

-- 4. Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_scheduled_tests_updated_at
BEFORE UPDATE ON scheduled_tests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 5. Row Level Security (RLS)

-- Habilitar RLS
ALTER TABLE scheduled_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;

-- Policies para scheduled_tests

-- Instrutor/Admin pode ver e gerenciar todas as provas
CREATE POLICY "Instructors can view all tests"
  ON scheduled_tests
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' IN ('INSTRUCTOR', 'ADMIN')
    OR created_by = auth.uid()
  );

CREATE POLICY "Instructors can create tests"
  ON scheduled_tests
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('INSTRUCTOR', 'ADMIN')
  );

CREATE POLICY "Instructors can update their tests"
  ON scheduled_tests
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' IN ('INSTRUCTOR', 'ADMIN')
    OR created_by = auth.uid()
  );

CREATE POLICY "Instructors can delete their tests"
  ON scheduled_tests
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' IN ('INSTRUCTOR', 'ADMIN')
    OR created_by = auth.uid()
  );

-- Alunos podem ver apenas provas ativas ou agendadas para eles
CREATE POLICY "Students can view scheduled tests"
  ON scheduled_tests
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'STUDENT'
    AND status IN ('SCHEDULED', 'ACTIVE')
  );

-- Policies para test_attempts

-- Alunos podem criar suas próprias tentativas
CREATE POLICY "Students can create their attempts"
  ON test_attempts
  FOR INSERT
  WITH CHECK (
    student_id = auth.uid()
  );

-- Alunos podem ver apenas suas tentativas
CREATE POLICY "Students can view their attempts"
  ON test_attempts
  FOR SELECT
  USING (
    student_id = auth.uid()
  );

-- Alunos podem atualizar apenas suas tentativas em andamento
CREATE POLICY "Students can update their in-progress attempts"
  ON test_attempts
  FOR UPDATE
  USING (
    student_id = auth.uid()
    AND status = 'IN_PROGRESS'
  );

-- Instrutor/Admin pode ver todas as tentativas
CREATE POLICY "Instructors can view all attempts"
  ON test_attempts
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' IN ('INSTRUCTOR', 'ADMIN')
  );

-- 6. Funções úteis

-- Função para liberar uma prova (tornar ativa)
CREATE OR REPLACE FUNCTION activate_test(test_uuid UUID)
RETURNS scheduled_tests AS $$
DECLARE
  updated_test scheduled_tests;
BEGIN
  UPDATE scheduled_tests
  SET 
    is_active = TRUE,
    status = 'ACTIVE',
    start_time = NOW()
  WHERE id = test_uuid
  RETURNING * INTO updated_test;
  
  RETURN updated_test;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para encerrar uma prova
CREATE OR REPLACE FUNCTION finish_test(test_uuid UUID)
RETURNS scheduled_tests AS $$
DECLARE
  updated_test scheduled_tests;
BEGIN
  -- Atualizar a prova
  UPDATE scheduled_tests
  SET 
    is_active = FALSE,
    status = 'FINISHED',
    end_time = NOW()
  WHERE id = test_uuid
  RETURNING * INTO updated_test;
  
  -- Marcar todas as tentativas em andamento como abandonadas
  UPDATE test_attempts
  SET 
    status = 'ABANDONED',
    finished_at = NOW()
  WHERE test_id = test_uuid
  AND status = 'IN_PROGRESS';
  
  RETURN updated_test;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter estatísticas de uma prova
CREATE OR REPLACE FUNCTION get_test_statistics(test_uuid UUID)
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total_attempts', COUNT(*),
    'completed', COUNT(*) FILTER (WHERE status = 'COMPLETED'),
    'in_progress', COUNT(*) FILTER (WHERE status = 'IN_PROGRESS'),
    'abandoned', COUNT(*) FILTER (WHERE status = 'ABANDONED'),
    'average_score', ROUND(AVG(score), 2) FILTER (WHERE status = 'COMPLETED'),
    'highest_score', MAX(score) FILTER (WHERE status = 'COMPLETED'),
    'lowest_score', MIN(score) FILTER (WHERE status = 'COMPLETED'),
    'average_time', ROUND(AVG(time_taken), 2) FILTER (WHERE status = 'COMPLETED')
  ) INTO stats
  FROM test_attempts
  WHERE test_id = test_uuid;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Dados de exemplo (apenas para desenvolvimento)
-- REMOVER EM PRODUÇÃO

-- INSERT INTO scheduled_tests (
--   title,
--   description,
--   category_id,
--   question_count,
--   time_per_question,
--   scheduled_date,
--   location,
--   created_by
-- ) VALUES (
--   'Avaliação Mensal - Aeronaves',
--   'Avaliação mensal sobre identificação de aeronaves militares',
--   1, -- Categoria Aeronaves
--   20,
--   15,
--   NOW() + INTERVAL '2 days',
--   'Sala de Treinamento 1',
--   (SELECT id FROM auth.users WHERE email = 'instrutor@pvo.mil.br' LIMIT 1)
-- );

-- Comentários
COMMENT ON TABLE scheduled_tests IS 'Provas agendadas criadas por instrutores';
COMMENT ON TABLE test_attempts IS 'Tentativas de realização de provas pelos alunos';
COMMENT ON COLUMN scheduled_tests.is_active IS 'Indica se a prova está liberada para realização';
COMMENT ON COLUMN test_attempts.answers IS 'JSON array com todas as respostas: [{question_id, answer, is_correct, time_spent}]';

SELECT 'Tabelas de avaliações agendadas criadas com sucesso!' AS result;
