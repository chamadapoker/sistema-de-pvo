
-- Otimização de Performance e Segurança do Banco de Dados

-- 1. Criação de Índices para Consultas Frequentes (Foreign Keys e Filtros)

-- Tabela Equipment
CREATE INDEX IF NOT EXISTS idx_equipment_category_id ON public.equipment(category_id);
-- Índice para busca textual (opcional, mas bom para filtros rápidos)
CREATE INDEX IF NOT EXISTS idx_equipment_name_trgm ON public.equipment USING gin (name gin_trgm_ops);

-- Tabela Country Equipment (Junction)
CREATE INDEX IF NOT EXISTS idx_country_equipment_country_id ON public.country_equipment(country_id);
CREATE INDEX IF NOT EXISTS idx_country_equipment_equipment_id ON public.country_equipment(equipment_id);

-- Tabela Tests
CREATE INDEX IF NOT EXISTS idx_tests_status ON public.tests(status);
CREATE INDEX IF NOT EXISTS idx_tests_scheduled_at ON public.tests(scheduled_at);

-- Tabela Test Attempts (Histórico)
CREATE INDEX IF NOT EXISTS idx_test_attempts_user_id ON public.test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_test_id ON public.test_attempts(test_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_status ON public.test_attempts(status);

-- Tabela Test Answers
CREATE INDEX IF NOT EXISTS idx_test_answers_attempt_id ON public.test_answers(attempt_id);

-- 2. Correção de Segurança de Funções (Mutable Search Path)
-- Isso remove os avisos de segurança do Dashboard

DO $$
BEGIN
    -- Tenta alterar as funções se elas existirem
    BEGIN
        ALTER FUNCTION public.handle_new_user() SET search_path = public;
    EXCEPTION WHEN OTHERS THEN NULL; END;
    
    BEGIN
        ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
    EXCEPTION WHEN OTHERS THEN NULL; END;

    BEGIN
        ALTER FUNCTION public.activate_test(uuid) SET search_path = public;
    EXCEPTION WHEN OTHERS THEN NULL; END;

    BEGIN
        ALTER FUNCTION public.finish_test(uuid) SET search_path = public;
    EXCEPTION WHEN OTHERS THEN NULL; END;

    BEGIN
        ALTER FUNCTION public.get_test_statistics(uuid) SET search_path = public;
    EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;
