-- ============================================
-- SCRIPT DE VERIFICAÇÃO DE VOLUME
-- ============================================

-- 1. Contar o total de equipamentos no banco
SELECT COUNT(*) as total_equipamentos FROM equipment;

-- 2. Contar quantos já estão com o link da ficha gerado (thumbnail_path preenchido)
SELECT COUNT(*) as equipamentos_com_ficha FROM equipment 
WHERE thumbnail_path IS NOT NULL AND thumbnail_path != '';

-- 3. Contar quantos ainda estão sem link (deve ser 0 se o script anterior rodou)
SELECT COUNT(*) as equipamentos_sem_ficha FROM equipment 
WHERE thumbnail_path IS NULL OR thumbnail_path = '';

-- Se o total for ~12.600 e "equipamentos_sem_ficha" for 0, tudo está correto.
