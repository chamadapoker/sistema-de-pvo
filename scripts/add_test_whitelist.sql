-- ============================================
-- EXTENSÃO: Sistema de Segunda Chamada
-- Permitir que provas sejam direcionadas a alunos específicos
-- ============================================

-- 1. Tabela de Alunos Permitidos por Prova
CREATE TABLE IF NOT EXISTS test_allowed_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES scheduled_tests(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  
  -- Informações adicionais
  reason VARCHAR(255), -- Ex: "Segunda Chamada - Faltou na prova original"
  added_by UUID NOT NULL, -- Quem adicionou esse aluno
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Garantir que um aluno não seja adicionado duas vezes
  UNIQUE(test_id, student_id)
);

-- 2. Índices
CREATE INDEX IF NOT EXISTS idx_test_allowed_students_test_id ON test_allowed_students(test_id);
CREATE INDEX IF NOT EXISTS idx_test_allowed_students_student_id ON test_allowed_students(student_id);

-- 3. Row Level Security

ALTER TABLE test_allowed_students ENABLE ROW LEVEL SECURITY;

-- Limpar policies antigas se existirem
DROP POLICY IF EXISTS "Instructors can view allowed students" ON test_allowed_students;
DROP POLICY IF EXISTS "Instructors can add allowed students" ON test_allowed_students;
DROP POLICY IF EXISTS "Instructors can remove allowed students" ON test_allowed_students;

-- Instrutor/Admin pode ver tudo
CREATE POLICY "Instructors can view allowed students"
  ON test_allowed_students
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' IN ('INSTRUCTOR', 'ADMIN')
  );

-- Instrutor/Admin pode adicionar alunos
CREATE POLICY "Instructors can add allowed students"
  ON test_allowed_students
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('INSTRUCTOR', 'ADMIN')
  );

-- Instrutor/Admin pode remover alunos
CREATE POLICY "Instructors can remove allowed students"
  ON test_allowed_students
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' IN ('INSTRUCTOR', 'ADMIN')
  );

-- 4. Função para verificar se um aluno pode fazer uma prova
CREATE OR REPLACE FUNCTION can_student_take_test(test_uuid UUID, student_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  has_whitelist BOOLEAN;
  is_allowed BOOLEAN;
BEGIN
  -- Verificar se a prova tem whitelist
  SELECT EXISTS (
    SELECT 1 FROM test_allowed_students WHERE test_id = test_uuid
  ) INTO has_whitelist;
  
  -- Se não tem whitelist, todos podem fazer
  IF NOT has_whitelist THEN
    RETURN TRUE;
  END IF;
  
  -- Se tem whitelist, verificar se o aluno está na lista
  SELECT EXISTS (
    SELECT 1 FROM test_allowed_students 
    WHERE test_id = test_uuid AND student_id = student_uuid
  ) INTO is_allowed;
  
  RETURN is_allowed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Função para adicionar alunos que não fizeram uma prova anterior
CREATE OR REPLACE FUNCTION add_missing_students_to_test(
  old_test_uuid UUID,
  new_test_uuid UUID,
  reason_text VARCHAR DEFAULT 'Segunda Chamada'
)
RETURNS INTEGER AS $$
DECLARE
  added_count INTEGER := 0;
  instructor_uuid UUID;
BEGIN
  -- Pegar o ID do instrutor atual
  instructor_uuid := auth.uid();
  
  -- Inserir alunos que não fizeram a prova original
  INSERT INTO test_allowed_students (test_id, student_id, reason, added_by)
  SELECT 
    new_test_uuid,
    u.id,
    reason_text,
    instructor_uuid
  FROM auth.users u
  WHERE u.raw_user_meta_data->>'role' = 'STUDENT'
  AND NOT EXISTS (
    SELECT 1 FROM test_attempts ta
    WHERE ta.test_id = old_test_uuid
    AND ta.student_id = u.id
  )
  ON CONFLICT (test_id, student_id) DO NOTHING;
  
  GET DIAGNOSTICS added_count = ROW_COUNT;
  
  RETURN added_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Função para obter lista de alunos que não fizeram uma prova
CREATE OR REPLACE FUNCTION get_students_who_missed_test(test_uuid UUID)
RETURNS TABLE (
  student_id UUID,
  student_name TEXT,
  student_email TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id as student_id,
    u.raw_user_meta_data->>'name' as student_name,
    u.email as student_email
  FROM auth.users u
  WHERE u.raw_user_meta_data->>'role' = 'STUDENT'
  AND NOT EXISTS (
    SELECT 1 FROM test_attempts ta
    WHERE ta.test_id = test_uuid
    AND ta.student_id = u.id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Atualizar a policy de visualização de provas para alunos
-- Primeiro, remover a policy antiga
DROP POLICY IF EXISTS "Students can view scheduled tests" ON scheduled_tests;
DROP POLICY IF EXISTS "Students can view their scheduled tests" ON scheduled_tests;

-- Criar nova policy que considera a whitelist
CREATE POLICY "Students can view their scheduled tests"
  ON scheduled_tests
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'STUDENT'
    AND status IN ('SCHEDULED', 'ACTIVE')
    AND (
      -- Prova não tem whitelist (todos podem fazer)
      NOT EXISTS (SELECT 1 FROM test_allowed_students WHERE test_id = id)
      OR
      -- Prova tem whitelist e o aluno está nela
      EXISTS (
        SELECT 1 FROM test_allowed_students 
        WHERE test_id = id AND student_id = auth.uid()
      )
    )
  );

-- Comentários
COMMENT ON TABLE test_allowed_students IS 'Lista de alunos permitidos para provas específicas (whitelist). Se vazia, todos podem fazer.';
COMMENT ON FUNCTION can_student_take_test IS 'Verifica se um aluno específico pode fazer uma prova';
COMMENT ON FUNCTION add_missing_students_to_test IS 'Adiciona automaticamente alunos que faltaram em uma prova anterior';
COMMENT ON FUNCTION get_students_who_missed_test IS 'Retorna lista de alunos que não fizeram uma prova';

SELECT '✅ Sistema de Segunda Chamada configurado com sucesso!' AS result;
