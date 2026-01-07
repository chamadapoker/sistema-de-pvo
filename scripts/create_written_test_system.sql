-- ============================================
-- SISTEMA COMPLETO DE PROVAS - PROVA ESCRITA
-- ============================================

-- 1. Atualizar tabela scheduled_tests para incluir tipo de prova
ALTER TABLE scheduled_tests 
ADD COLUMN IF NOT EXISTS test_type VARCHAR(50) DEFAULT 'WRITTEN' 
CHECK (test_type IN ('WRITTEN', 'MULTIPLE_CHOICE'));

-- 2. Tabela de Questões da Prova (Slides/Fotos selecionadas)
CREATE TABLE IF NOT EXISTS test_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES scheduled_tests(id) ON DELETE CASCADE,
  
  -- Questão (foto do equipamento)
  equipment_id UUID NOT NULL REFERENCES equipment(id),
  question_number INTEGER NOT NULL, -- Ordem da questão (1, 2, 3...)
  
  -- Para múltipla escolha (futuro - opcional)
  question_text TEXT,
  options JSONB, -- Array de opções [{id: 1, text: "F-16"}, ...]
  correct_answer_id INTEGER,
  
  -- Pontuação
  points DECIMAL(5,2) DEFAULT 1.0, -- Quanto vale esta questão
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Garantir ordem única por prova
  UNIQUE(test_id, question_number)
);

-- 3. Tabela de Respostas dos Alunos
CREATE TABLE IF NOT EXISTS student_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Referências
  attempt_id UUID NOT NULL REFERENCES test_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES test_questions(id) ON DELETE CASCADE,
  
  -- Resposta do aluno
  answer_text TEXT, -- Resposta digitada (prova escrita)
  selected_option_id INTEGER, -- Opção selecionada (múltipla escolha)
  
  -- Correção manual (prova escrita)
  is_correct BOOLEAN, -- NULL = não corrigida, TRUE/FALSE = corrigida
  points_earned DECIMAL(5,2), -- Pontos ganhos (para correção parcial)
  instructor_feedback TEXT, -- Feedback do instrutor
  corrected_by UUID, -- Quem corrigiu
  corrected_at TIMESTAMP WITH TIME ZONE,
  
  -- Tempo
  time_spent INTEGER, -- Segundos gastos nesta questão
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Garantir uma resposta por questão por tentativa
  UNIQUE(attempt_id, question_id)
);

-- 4. Índices
CREATE INDEX IF NOT EXISTS idx_test_questions_test_id ON test_questions(test_id);
CREATE INDEX IF NOT EXISTS idx_test_questions_equipment_id ON test_questions(equipment_id);
CREATE INDEX IF NOT EXISTS idx_student_answers_attempt_id ON student_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_student_answers_question_id ON student_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_student_answers_corrected ON student_answers(is_correct) WHERE is_correct IS NULL;

-- 5. Row Level Security

ALTER TABLE test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;

-- Policies para test_questions

-- Instrutor pode gerenciar questões
DROP POLICY IF EXISTS "Instructors can manage questions" ON test_questions;
CREATE POLICY "Instructors can manage questions"
  ON test_questions
  FOR ALL
  USING (
    auth.jwt() ->> 'role' IN ('INSTRUCTOR', 'ADMIN')
  );

-- Alunos podem ver questões de provas ativas
DROP POLICY IF EXISTS "Students can view active test questions" ON test_questions;
CREATE POLICY "Students can view active test questions"
  ON test_questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM scheduled_tests st
      WHERE st.id = test_id
      AND st.is_active = TRUE
    )
  );

-- Policies para student_answers

-- Alunos podem inserir suas respostas
DROP POLICY IF EXISTS "Students can submit answers" ON student_answers;
CREATE POLICY "Students can submit answers"
  ON student_answers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM test_attempts ta
      WHERE ta.id = attempt_id
      AND ta.student_id = auth.uid()
      AND ta.status = 'IN_PROGRESS'
    )
  );

-- Alunos podem atualizar suas respostas (antes de finalizar)
DROP POLICY IF EXISTS "Students can update their answers" ON student_answers;
CREATE POLICY "Students can update their answers"
  ON student_answers
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM test_attempts ta
      WHERE ta.id = attempt_id
      AND ta.student_id = auth.uid()
      AND ta.status = 'IN_PROGRESS'
    )
  );

-- Alunos podem ver suas próprias respostas
DROP POLICY IF EXISTS "Students can view their answers" ON student_answers;
CREATE POLICY "Students can view their answers"
  ON student_answers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM test_attempts ta
      WHERE ta.id = attempt_id
      AND ta.student_id = auth.uid()
    )
  );

-- Instrutores podem ver e corrigir todas as respostas
DROP POLICY IF EXISTS "Instructors can manage answers" ON student_answers;
CREATE POLICY "Instructors can manage answers"
  ON student_answers
  FOR ALL
  USING (
    auth.jwt() ->> 'role' IN ('INSTRUCTOR', 'ADMIN')
  );

-- 6. Função para calcular nota automaticamente (múltipla escolha)
CREATE OR REPLACE FUNCTION auto_grade_multiple_choice_attempt(attempt_uuid UUID)
RETURNS VOID AS $$
DECLARE
  total_points DECIMAL(5,2) := 0;
  earned_points DECIMAL(5,2) := 0;
  correct_count INTEGER := 0;
  total_count INTEGER := 0;
BEGIN
  -- Calcular pontos
  SELECT 
    COALESCE(SUM(tq.points), 0),
    COALESCE(SUM(CASE WHEN sa.selected_option_id = tq.correct_answer_id THEN tq.points ELSE 0 END), 0),
    COUNT(CASE WHEN sa.selected_option_id = tq.correct_answer_id THEN 1 END),
    COUNT(*)
  INTO total_points, earned_points, correct_count, total_count
  FROM student_answers sa
  JOIN test_questions tq ON sa.question_id = tq.id
  WHERE sa.attempt_id = attempt_uuid;
  
  -- Atualizar tentativa
  UPDATE test_attempts
  SET 
    score = CASE WHEN total_points > 0 THEN ROUND((earned_points / total_points) * 100) ELSE 0 END,
    correct_answers = correct_count,
    total_questions = total_count
  WHERE id = attempt_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Função para obter provas que precisam de correção
CREATE OR REPLACE FUNCTION get_tests_needing_correction()
RETURNS TABLE (
  test_id UUID,
  test_title TEXT,
  uncorrected_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    st.id as test_id,
    st.title as test_title,
    COUNT(*) FILTER (WHERE sa.is_correct IS NULL) as uncorrected_count
  FROM scheduled_tests st
  JOIN test_attempts ta ON ta.test_id = st.id
  JOIN student_answers sa ON sa.attempt_id = ta.id
  WHERE st.test_type = 'WRITTEN'
  AND st.status = 'FINISHED'
  AND ta.status = 'COMPLETED'
  GROUP BY st.id, st.title
  HAVING COUNT(*) FILTER (WHERE sa.is_correct IS NULL) > 0
  ORDER BY st.scheduled_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Função para calcular nota final de prova escrita (após correção)
CREATE OR REPLACE FUNCTION calculate_written_test_score(attempt_uuid UUID)
RETURNS VOID AS $$
DECLARE
  total_points DECIMAL(5,2) := 0;
  earned_points DECIMAL(5,2) := 0;
  correct_count INTEGER := 0;
  total_count INTEGER := 0;
BEGIN
  -- Calcular pontos baseado na correção manual
  SELECT 
    COALESCE(SUM(tq.points), 0),
    COALESCE(SUM(COALESCE(sa.points_earned, 0)), 0),
    COUNT(CASE WHEN sa.is_correct = TRUE THEN 1 END),
    COUNT(*)
  INTO total_points, earned_points, correct_count, total_count
  FROM student_answers sa
  JOIN test_questions tq ON sa.question_id = tq.id
  WHERE sa.attempt_id = attempt_uuid;
  
  -- Atualizar tentativa
  UPDATE test_attempts
  SET 
    score = CASE WHEN total_points > 0 THEN ROUND((earned_points / total_points) * 100) ELSE 0 END,
    correct_answers = correct_count,
    total_questions = total_count
  WHERE id = attempt_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentários
COMMENT ON TABLE test_questions IS 'Questões individuais de cada prova (slides/fotos selecionadas pelo instrutor)';
COMMENT ON TABLE student_answers IS 'Respostas dos alunos para cada questão';
COMMENT ON COLUMN scheduled_tests.test_type IS 'Tipo de prova: WRITTEN (digitação) ou MULTIPLE_CHOICE (automática)';
COMMENT ON COLUMN student_answers.is_correct IS 'NULL = não corrigida, TRUE/FALSE = corrigida pelo instrutor';
COMMENT ON COLUMN student_answers.points_earned IS 'Pontos dados pelo instrutor (permite correção parcial)';

SELECT '✅ Sistema de Provas Escritas criado com sucesso!' AS result;
