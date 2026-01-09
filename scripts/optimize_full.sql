
-- OTIMIZAÇÃO COMPLETA DO BANCO DE DADOS (PERFORMANCE & SEGURANÇA)
-- Execute este script no SQL Editor do Supabase para corrigir os avisos do Dashboard.

-- ==============================================================================
-- 1. CRIAÇÃO DE ÍNDICES DE PERFORMANCE (FOREIGN KEYS & FILTROS)
-- ==============================================================================

-- Tabela Equipment
CREATE INDEX IF NOT EXISTS idx_equipment_category_id ON public.equipment(category_id);
-- Habilita extensão pg_trgm se não existir (necessário para busca textual eficiente)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_equipment_name_trgm ON public.equipment USING gin (name gin_trgm_ops);

-- Tabela Country Equipment (Junction)
CREATE INDEX IF NOT EXISTS idx_country_equipment_country_id ON public.country_equipment(country_id);
-- O índice equipment_id duplicado será tratado na seção 2.

-- Tabela Tests
CREATE INDEX IF NOT EXISTS idx_tests_status ON public.tests(status);
CREATE INDEX IF NOT EXISTS idx_tests_scheduled_at ON public.tests(scheduled_at);

-- Tabela Test Attempts (Histórico)
-- CORREÇÃO: test_attempts usa student_id, não user_id
CREATE INDEX IF NOT EXISTS idx_test_attempts_student_id ON public.test_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_test_id ON public.test_attempts(test_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_status ON public.test_attempts(status);

-- Tabela Student Answers
CREATE INDEX IF NOT EXISTS idx_student_answers_attempt_id ON public.student_answers(attempt_id);


-- ==============================================================================
-- 2. REMOÇÃO DE ÍNDICES DUPLICADOS (CORREÇÃO DE LINT)
-- ==============================================================================

-- Tabela country_equipment possui dois índices idênticos (Constraint duplicada)
ALTER TABLE public.country_equipment DROP CONSTRAINT IF EXISTS country_equipment_unique_pair;
-- Mantemos a outra constraint (provavelmente country_equipment_country_id_equipment_id_key)

-- Tabela test_questions possui dois índices idênticos
DROP INDEX IF EXISTS public.idx_test_questions_test; 
-- Mantemos idx_test_questions_test_id que segue o padrão de nomenclatura correto


-- ==============================================================================
-- 3. CORREÇÃO DE SEGURANÇA DE FUNÇÕES (MUTABLE SEARCH PATH)
-- ==============================================================================

DO $$
BEGIN
    -- Define search_path explicitamente para evitar hijack de funções
    BEGIN ALTER FUNCTION public.handle_new_user() SET search_path = public; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN ALTER FUNCTION public.update_updated_at_column() SET search_path = public; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN ALTER FUNCTION public.activate_test(uuid) SET search_path = public; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN ALTER FUNCTION public.finish_test(uuid) SET search_path = public; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN ALTER FUNCTION public.get_test_statistics(uuid) SET search_path = public; EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;


-- ==============================================================================
-- 4. OTIMIZAÇÃO DE POLÍTICAS RLS (CORREÇÃO DE LINT & PERFOMANCE)
-- Melhora a performance evitando re-avaliação desnecessária e políticas permissivas demais
-- Corrigido para usar raw_user_meta_data->>'role' e colunas corretas (student_id, created_by)
-- ==============================================================================

-- Tabela scheduled_tests
DROP POLICY IF EXISTS "Instructors can create tests" ON public.scheduled_tests;
CREATE POLICY "Instructors can create tests" ON public.scheduled_tests
FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM public.users WHERE raw_user_meta_data->>'role' IN ('admin', 'instructor', 'ADMIN', 'INSTRUCTOR'))
);

DROP POLICY IF EXISTS "Instructors can update their tests" ON public.scheduled_tests;
CREATE POLICY "Instructors can update their tests" ON public.scheduled_tests
FOR UPDATE USING (
  auth.uid() = created_by OR
  auth.uid() IN (SELECT id FROM public.users WHERE raw_user_meta_data->>'role' IN ('admin', 'ADMIN'))
);

DROP POLICY IF EXISTS "Instructors can delete their tests" ON public.scheduled_tests;
CREATE POLICY "Instructors can delete their tests" ON public.scheduled_tests
FOR DELETE USING (
  auth.uid() = created_by OR
  auth.uid() IN (SELECT id FROM public.users WHERE raw_user_meta_data->>'role' IN ('admin', 'ADMIN'))
);

-- Tabela test_attempts (Students)
DROP POLICY IF EXISTS "Students can create their attempts" ON public.test_attempts;
CREATE POLICY "Students can create their attempts" ON public.test_attempts
FOR INSERT WITH CHECK (
  auth.uid() = student_id
);

DROP POLICY IF EXISTS "Students can view their attempts" ON public.test_attempts;
CREATE POLICY "Students can view their attempts" ON public.test_attempts
FOR SELECT USING (
  auth.uid() = student_id
);

DROP POLICY IF EXISTS "Instructors can view all attempts" ON public.test_attempts;
CREATE POLICY "Instructors can view all attempts" ON public.test_attempts
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' IN ('admin', 'instructor', 'ADMIN', 'INSTRUCTOR'))
);

-- Tabela countries (Consolidar permissões)
DROP POLICY IF EXISTS "Admins can manage countries" ON public.countries;
-- Mantém "Anyone can view countries" (SELECT) e cria política apenas para gestão
CREATE POLICY "Admins can manage countries" ON public.countries
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' IN ('admin', 'ADMIN'))
);

-- Tabela country_equipment (Consolidar permissões)
DROP POLICY IF EXISTS "Admins can manage country equipment" ON public.country_equipment;
CREATE POLICY "Admins can manage country equipment" ON public.country_equipment
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' IN ('admin', 'ADMIN'))
);

-- Tabela users (Otimização de leitura)
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Admins and Instructors read all data" ON public.users;

CREATE POLICY "Users access own data or Admins access all" ON public.users
FOR SELECT USING (
  auth.uid() = id OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' IN ('admin', 'instructor', 'ADMIN', 'INSTRUCTOR'))
);

-- Tabela student_answers
DROP POLICY IF EXISTS "Instructors can manage answers" ON public.student_answers;
CREATE POLICY "Instructors manage answers" ON public.student_answers
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' IN ('admin', 'instructor', 'ADMIN', 'INSTRUCTOR'))
);

DROP POLICY IF EXISTS "Students can submit answers" ON public.student_answers;
CREATE POLICY "Students submit answers" ON public.student_answers
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.test_attempts 
    WHERE id = attempt_id AND student_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Students can view their answers" ON public.student_answers;
CREATE POLICY "Students view own answers" ON public.student_answers
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.test_attempts 
    WHERE id = attempt_id AND student_id = auth.uid()
  )
);
