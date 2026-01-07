-- CORREÇÃO DE CATEGORIAS
-- Garante que helicópteros estejam na categoria correta (ID 2)
UPDATE equipment 
SET category_id = 2 
WHERE (
    name ILIKE '%Helicóptero%' OR 
    name ILIKE '%Helicopter%' OR 
    name ILIKE '%Ah-%' OR -- Ah-64, Ah-1 (Attack Helicopter)
    name ILIKE '%Mi-24%' OR 
    name ILIKE '%Mi-8%' OR 
    name ILIKE '%Mi-17%' OR 
    name ILIKE '%Mi-35%' OR 
    name ILIKE '%Mi-28%' OR 
    name ILIKE '%Ka-52%' OR 
    name ILIKE '%UH-%' OR -- UH-60 (Utility Helicopter)
    name ILIKE '%CH-%' OR -- CH-47 (Cargo Helicopter)
    name ILIKE '%SH-%' OR 
    name ILIKE '%MH-%'
) AND category_id != 2;

-- Garante que Caças estejam na categoria correta (ID 1 - Aeronaves) de forma genérica se não forem helicópteros
-- (Assumindo ID 1 como Aeronaves de Asa Fixa baseado em scripts anteriores)
-- Ajuste fino pode ser necessário

-- ATUALIZAÇÃO DE DADOS DE PAÍSES (DADOS REAIS 2024/2025)

-- 1. BRASIL 🇧🇷
DO $$
DECLARE
    brazil_id UUID;
    usa_id UUID;
    russia_id UUID;
    china_id UUID;
    equip_id UUID;
BEGIN
    SELECT id INTO brazil_id FROM countries WHERE name = 'Brazil' LIMIT 1;
    SELECT id INTO usa_id FROM countries WHERE name = 'United States' LIMIT 1;
    SELECT id INTO russia_id FROM countries WHERE name = 'Russia' LIMIT 1;
    SELECT id INTO china_id FROM countries WHERE name = 'China' LIMIT 1;

    -- BRASIL: KC-390
    SELECT id INTO equip_id FROM equipment WHERE name ILIKE '%KC-390%' LIMIT 1;
    IF equip_id IS NOT NULL THEN
        INSERT INTO country_equipment (country_id, equipment_id, quantity, status, year_acquired)
        VALUES (brazil_id, equip_id, 6, 'ACTIVE', 2019)
        ON CONFLICT DO NOTHING;
    END IF;

    -- BRASIL: F-39 Gripen
    SELECT id INTO equip_id FROM equipment WHERE name ILIKE '%Gripen%' LIMIT 1;
    IF equip_id IS NOT NULL THEN
        INSERT INTO country_equipment (country_id, equipment_id, quantity, status, year_acquired)
        VALUES (brazil_id, equip_id, 8, 'ACTIVE', 2022) -- Entregas em andamento
        ON CONFLICT DO NOTHING;
    END IF;

    -- BRASIL: A-29 Super Tucano
    SELECT id INTO equip_id FROM equipment WHERE name ILIKE '%Super Tucano%' LIMIT 1;
    IF equip_id IS NOT NULL THEN
        INSERT INTO country_equipment (country_id, equipment_id, quantity, status, year_acquired, variant)
        VALUES (brazil_id, equip_id, 99, 'ACTIVE', 2003, 'A-29A/B')
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- BRASIL: Guarani (VBTP-MR)
    SELECT id INTO equip_id FROM equipment WHERE name ILIKE '%Guarani%' LIMIT 1;
    IF equip_id IS NOT NULL THEN
        INSERT INTO country_equipment (country_id, equipment_id, quantity, status, year_acquired)
        VALUES (brazil_id, equip_id, 500, 'ACTIVE', 2012)
        ON CONFLICT DO NOTHING;
    END IF;

    -- BRASIL: Leopard 1A5
    SELECT id INTO equip_id FROM equipment WHERE name ILIKE '%Leopard 1%' LIMIT 1;
    IF equip_id IS NOT NULL THEN
        INSERT INTO country_equipment (country_id, equipment_id, quantity, status, year_acquired, variant)
        VALUES (brazil_id, equip_id, 220, 'ACTIVE', 1996, '1A5 BR')
        ON CONFLICT DO NOTHING;
    END IF;

    -- EUA 🇺🇸: F-22 Raptor
    SELECT id INTO equip_id FROM equipment WHERE name ILIKE '%F-22%' LIMIT 1;
    IF equip_id IS NOT NULL THEN
        INSERT INTO country_equipment (country_id, equipment_id, quantity, status, year_acquired)
        VALUES (usa_id, equip_id, 183, 'ACTIVE', 2005)
        ON CONFLICT DO NOTHING;
    END IF;

    -- EUA: F-35 Lightning II
    SELECT id INTO equip_id FROM equipment WHERE name ILIKE '%F-35%' LIMIT 1;
    IF equip_id IS NOT NULL THEN
        INSERT INTO country_equipment (country_id, equipment_id, quantity, status, year_acquired)
        VALUES (usa_id, equip_id, 450, 'ACTIVE', 2015)
        ON CONFLICT DO NOTHING;
    END IF;

     -- EUA: M1 Abrams
    SELECT id INTO equip_id FROM equipment WHERE name ILIKE '%Abrams%' LIMIT 1;
    IF equip_id IS NOT NULL THEN
        INSERT INTO country_equipment (country_id, equipment_id, quantity, status, year_acquired, variant)
        VALUES (usa_id, equip_id, 2500, 'ACTIVE', 1980, 'M1A2 SEPv3')
        ON CONFLICT DO NOTHING;
    END IF;

    -- RUSSIA 🇷🇺: Su-57
    SELECT id INTO equip_id FROM equipment WHERE name ILIKE '%Su-57%' LIMIT 1;
    IF equip_id IS NOT NULL THEN
        INSERT INTO country_equipment (country_id, equipment_id, quantity, status, year_acquired)
        VALUES (russia_id, equip_id, 22, 'ACTIVE', 2020)
        ON CONFLICT DO NOTHING;
    END IF;

    -- RUSSIA: T-90
    SELECT id INTO equip_id FROM equipment WHERE name ILIKE '%T-90%' LIMIT 1;
    IF equip_id IS NOT NULL THEN
        INSERT INTO country_equipment (country_id, equipment_id, quantity, status, year_acquired, variant)
        VALUES (russia_id, equip_id, 350, 'ACTIVE', 1992, 'T-90M')
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- CHINA 🇨🇳: J-20
    SELECT id INTO equip_id FROM equipment WHERE name ILIKE '%J-20%' LIMIT 1;
    IF equip_id IS NOT NULL THEN
        INSERT INTO country_equipment (country_id, equipment_id, quantity, status, year_acquired)
        VALUES (china_id, equip_id, 200, 'ACTIVE', 2017)
        ON CONFLICT DO NOTHING;
    END IF;

END $$;
