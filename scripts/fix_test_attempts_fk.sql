
-- CORREÇÃO DE CONSTRAINT DE FOREIGN KEY
-- O erro ocorre porque a tabela test_attempts está referenciando a tabela errada (public.tests em vez de scheduled_tests)
-- ou tentando impor integridade entre tabelas diferentes.

-- Solução Imediata: Remover a constraint rígida para permitir que test_attempts receba IDs tanto de 'tests' (Baterias) quanto de 'scheduled_tests' (Provas).
-- A integridade será garantida via aplicação e lógica de negócio.

ALTER TABLE public.test_attempts
DROP CONSTRAINT IF EXISTS test_attempts_test_id_fkey;

-- Se existir outra constraint com nome diferente apontando para tests:
ALTER TABLE public.test_attempts
DROP CONSTRAINT IF EXISTS fk_test_attempts_test;

-- Opcional: Se quisermos manter integridade estrita no futuro, precisaremos de colunas separadas (test_id vs scheduled_test_id)
-- ou garantir que todos os IDs residam na mesma tabela mestre. 
-- Por enquanto, remover a trava resolve o erro "insert violates foreign key constraint".
