
-- CORREÇÃO CRÍTICA DE PERMISSÕES PARA PAÍSES
-- Restaura o acesso público (autenticado) para visualização de países

-- 1. Garantir que a política de leitura para "countries" existe
DROP POLICY IF EXISTS "Anyone can view countries" ON public.countries;
CREATE POLICY "Anyone can view countries"
ON public.countries
FOR SELECT
USING (true);

-- 2. Garantir que a política de leitura para "country_equipment" existe
DROP POLICY IF EXISTS "Anyone can view country equipment" ON public.country_equipment;
CREATE POLICY "Anyone can view country equipment"
ON public.country_equipment
FOR SELECT
USING (true);

-- Apenas para confirmar:
GRANT SELECT ON public.countries TO authenticated;
GRANT SELECT ON public.country_equipment TO authenticated;
GRANT SELECT ON public.countries TO anon;
GRANT SELECT ON public.country_equipment TO anon;
