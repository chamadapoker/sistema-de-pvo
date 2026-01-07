-- ==============================================================================
-- SCRIPT DE CORREÇÃO DE FICHAS TÉCNICAS (THUMBNAILS)
-- ==============================================================================
-- Este script assume que as fichas técnicas estão salvas no Storage
-- na pasta 'fichas' com o nome do código do equipamento (ex: 1P00101.jpg).
--
-- Se suas fichas forem .pdf ou .png, altere a extensão abaixo.
-- ==============================================================================

UPDATE equipment
SET thumbnail_path = 'https://baoboggeqhksaxkuudap.supabase.co/storage/v1/object/public/equipment-images/fichas/' || code || '.jpg'
WHERE thumbnail_path IS NULL OR thumbnail_path = '';

-- Verificação
SELECT 
    code, 
    thumbnail_path 
FROM equipment 
WHERE code IN ('1P00101', '6P00108') -- Exemplo do AMX e RBS 56
LIMIT 5;

SELECT '✅ Links das Fichas Técnicas gerados com sucesso!' as status;
