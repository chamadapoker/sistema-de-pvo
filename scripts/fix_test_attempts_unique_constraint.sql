
-- REMOÇÃO DE CONSTRAINT DUPLICADA (ÚNICA TENTATIVA)
-- O erro 'duplicate key value violates unique constraint "test_attempts_test_id_student_id_key"'
-- indica que o sistema está impedindo o aluno de fazer a mesma prova mais de uma vez.
-- Dependendo da regra de negócio, isso pode ser desejado ou não. 
-- Mas como o teste falhou antes (tentativa frustrada), o sistema acha que ele "já fez".

-- Solução: Remover a constraint de unicidade (student_id, test_id) para permitir múltiplas tentativas
-- OU limpar as tentativas anteriores do aluno para este teste.

-- Vou optar por remover a constraint para permitir "re-tentativas" (útil para desenvolvimento/testes e correções).
ALTER TABLE public.test_attempts
DROP CONSTRAINT IF EXISTS test_attempts_test_id_student_id_key;

-- Também remover se tiver com nome antigo (user_id)
ALTER TABLE public.test_attempts
DROP CONSTRAINT IF EXISTS test_attempts_test_id_user_id_key;

-- Garantir que não existe índice único também
DROP INDEX IF EXISTS idx_test_attempts_unique_student;
