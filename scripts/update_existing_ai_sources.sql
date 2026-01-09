-- Atualizar registros existentes que já contêm a assinatura da IA para a fonte correta
UPDATE equipment
SET description_source = 'AI_GENERATED'
WHERE description LIKE '%**ANÁLISE PVO:**%';

-- Garantir que os manuais fiquem como MANUAL (caso tenha ficado NULL em algum update anterior)
UPDATE equipment
SET description_source = 'MANUAL'
WHERE description_source IS NULL;
