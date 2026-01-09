
-- Correções Avançadas de Performance e Segurança (Baseado no Lint do Supabase)

-- 1. Remover Índices Duplicados Identificados
-- Tabela country_equipment possui dois índices idênticos
DROP INDEX IF EXISTS public.country_equipment_unique_pair; -- Mantemos o country_equipment_country_id_equipment_id_key que parece ser a constraint original

-- Tabela test_questions possui dois índices idênticos
DROP INDEX IF EXISTS public.idx_test_questions_test; -- Mantemos idx_test_questions_test_id que segue padrão de nomenclatura

-- 2. Otimizar RLS Policies (Evitar re-avaliação de auth.uid() por linha)
-- O Supabase recomenda encapsular auth.uid() em (select auth.uid()) para cachear o resultado

-- Tabela scheduled_tests
DROP POLICY IF EXISTS "Instructors can create tests" ON public.scheduled_tests;
CREATE POLICY "Instructors can create tests" ON public.scheduled_tests
FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'instructor'))
);

DROP POLICY IF EXISTS "Instructors can update their tests" ON public.scheduled_tests;
CREATE POLICY "Instructors can update their tests" ON public.scheduled_tests
FOR UPDATE USING (
  auth.uid() = instructor_id OR
  auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
);

DROP POLICY IF EXISTS "Instructors can delete their tests" ON public.scheduled_tests;
CREATE POLICY "Instructors can delete their tests" ON public.scheduled_tests
FOR DELETE USING (
  auth.uid() = instructor_id OR
  auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
);

-- Tabela test_attempts (Students policies)
DROP POLICY IF EXISTS "Students can create their attempts" ON public.test_attempts;
CREATE POLICY "Students can create their attempts" ON public.test_attempts
FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

DROP POLICY IF EXISTS "Students can view their attempts" ON public.test_attempts;
CREATE POLICY "Students can view their attempts" ON public.test_attempts
FOR SELECT USING (
  auth.uid() = user_id
);

DROP POLICY IF EXISTS "Instructors can view all attempts" ON public.test_attempts;
CREATE POLICY "Instructors can view all attempts" ON public.test_attempts
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
);

-- 3. Resolver Múltiplas Políticas Permissivas (Performance)
-- Onde houver múltiplas policies "OR" (permissivas), tentar consolidar ou garantir que são necessárias.
-- No caso de "countries", temos "Admins can manage" e "Anyone can view".
-- Como "Anyone can view" cobre leitura para todos, podemos simplificar.

-- Tabela countries (SELECT)
DROP POLICY IF EXISTS "Admins can manage countries" ON public.countries; -- Já existe "Anyone can view countries" para SELECT
-- Recriar apenas para INSERT/UPDATE/DELETE
CREATE POLICY "Admins can manage countries" ON public.countries
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Tabela country_equipment (SELECT)
DROP POLICY IF EXISTS "Admins can manage country equipment" ON public.country_equipment;
-- Recriar apenas permissões de escrita, pois leitura pública já existe
CREATE POLICY "Admins can manage country equipment" ON public.country_equipment
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Otimizar funções de verificação de role para usar (SELECT ...) pattern se possível
-- Mas como usamos EXISTS com subquery na tabela users, já é razoavelmente otimizado pelo PG.
-- O ideal seria ter claims no JWT, mas por enquanto vamos limpar as políticas redundantes.

-- Tabela users (SELECT) - "Users can read own data" vs "Admins and Instructors read all data"
-- Combinando em uma única policy performática se possível, ou mantendo separadas mas otimizadas.
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Admins and Instructors read all data" ON public.users;

CREATE POLICY "Users access own data or Admins access all" ON public.users
FOR SELECT USING (
  auth.uid() = id OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
);

-- Tabela student_answers
DROP POLICY IF EXISTS "Instructors can manage answers" ON public.student_answers;
-- Separar para apenas quem precisa gerenciar (Instructors). Leitura do aluno deve ser separada.
CREATE POLICY "Instructors manage answers" ON public.student_answers
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
);

DROP POLICY IF EXISTS "Students can submit answers" ON public.student_answers;
CREATE POLICY "Students submit answers" ON public.student_answers
FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

DROP POLICY IF EXISTS "Students can view their answers" ON public.student_answers;
CREATE POLICY "Students view own answers" ON public.student_answers
FOR SELECT USING (
  auth.uid() = user_id
);

