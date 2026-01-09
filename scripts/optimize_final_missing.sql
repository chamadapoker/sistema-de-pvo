
-- OTIMIZAÇÃO FINAL - ÍNDICES FALTANTES
-- Resolve os últimos avisos de "Unindexed foreign keys"

-- 1. Indexar Foreign Key de Categoria em Scheduled Tests
CREATE INDEX IF NOT EXISTS idx_scheduled_tests_category_id ON public.scheduled_tests(category_id);

-- 2. Indexar Foreign Key de User/Student em Test Attempts
-- O linter indicou que existe uma FK 'test_attempts_user_id_fkey' sem índice.
-- Vamos criar índices tanto para user_id quanto student_id para garantir cobertura total, 
-- independente de qual colun o sistema esteja usando no momento (legado vs novo).
CREATE INDEX IF NOT EXISTS idx_test_attempts_user_id ON public.test_attempts(user_id);

-- 3. Indexar Foreign Key de Test em Test Questions (Opcional, mas boa prática se não existir)
CREATE INDEX IF NOT EXISTS idx_test_questions_test_id ON public.test_questions(test_id);

-- 4. Indexar Foreign Key de Equipment em Test Questions
CREATE INDEX IF NOT EXISTS idx_test_questions_equipment_id ON public.test_questions(equipment_id);
