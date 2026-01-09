
-- CORREÇÃO DE RECURSIVIDADE INFINITA NA TABELA USERS
-- O erro ocorre porque a policy da tabela users consulta a própria tabela users para verificar o role.
-- Solução: Usar auth.jwt() para checar o role, evitando a subquery na própria tabela.

-- 1. Tabela users (Correção de Recursividade)
DROP POLICY IF EXISTS "Users access own data or Admins access all" ON public.users;
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Admins and Instructors read all data" ON public.users;

CREATE POLICY "Users access own data or Admins access all" ON public.users
FOR SELECT USING (
  -- O próprio usuário pode ver seus dados
  auth.uid() = id 
  OR 
  -- Admins/Instrutores podem ver tudo (Checando via JWT metadata, sem query na tabela users)
  (auth.jwt() -> 'user_metadata' ->> 'role')::text ILIKE ANY (ARRAY['admin', 'instructor'])
);

-- 2. Tabela countries (Garantir acesso sem depender da query recursiva)
DROP POLICY IF EXISTS "Admins can manage countries" ON public.countries;
CREATE POLICY "Admins can manage countries" ON public.countries
FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'role')::text ILIKE 'admin'
);

-- 3. Tabela scheduled_tests (Otimização extra para evitar queries desnecessárias)
DROP POLICY IF EXISTS "Instructors can create tests" ON public.scheduled_tests;
CREATE POLICY "Instructors can create tests" ON public.scheduled_tests
FOR INSERT WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role')::text ILIKE ANY (ARRAY['admin', 'instructor'])
);
