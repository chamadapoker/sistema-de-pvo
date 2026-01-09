-- Adiciona coluna para rastrear a origem da descrição
ALTER TABLE equipment 
ADD COLUMN description_source VARCHAR(20) DEFAULT 'MANUAL' CHECK (description_source IN ('MANUAL', 'AI_GENERATED'));

-- (Opcional) Atualizar registros existentes se necessário, por enquanto assumimos MANUAL.
-- Se quisermos marcar os que foram gerados recentemente como AI, precisariamos de um criterio.
-- Por enquanto, deixamos como MANUAL e o sistema futuro usará AI_GENERATED.
