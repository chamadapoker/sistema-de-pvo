-- ============================================
-- SCRIPT DE CORREÇÃO DE CATEGORIAS (BASEADO NO CÓDIGO)
-- ============================================

-- 1. Explicação:
-- Este script analisa o campo 'code' de cada equipamento (ex: 6P00108)
-- Extrai o primeiro caractere ('6')
-- E atualiza o campo 'category_id' com esse valor
-- Isso garante que a categoria do banco corresponda ao código oficial da imagem.

-- 2. Visualizar discrepâncias antes da correção (Opcional, apenas para verificação)
/*
SELECT id, name, code, category_id, SUBSTRING(code FROM 1 FOR 1)::INTEGER as correct_category
FROM equipment
WHERE category_id != CAST(SUBSTRING(code FROM 1 FOR 1) AS INTEGER)
AND code ~ '^[1-8]';
*/

-- 3. Executar Correção
UPDATE equipment
SET category_id = CAST(SUBSTRING(code FROM 1 FOR 1) AS INTEGER)
WHERE 
    -- Garante que o código começa com um número válido de categoria (1 a 8)
    code ~ '^[1-8]' 
    -- E apenas onde a categoria atual está incorreta
    AND category_id != CAST(SUBSTRING(code FROM 1 FOR 1) AS INTEGER);

-- 4. Verificar Resultados
SELECT 
    COUNT(*) as corrected_count 
FROM equipment 
WHERE code ~ '^[1-8]' 
AND category_id = CAST(SUBSTRING(code FROM 1 FOR 1) AS INTEGER);

-- 5. Confirmação
SELECT '✅ Categorias corrigidas com sucesso baseado no código dos equipamentos!' as result;
