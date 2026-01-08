-- ATUALIZAÇÃO DE DADOS REAIS (POPULAÇÃO, ECONOMIA, MILITAR)
-- Dados estimados de fontes abertas (2024/2025)

-- BRASIL
UPDATE countries SET 
    population = 216400000, 
    area_km2 = 8515767,
    active_military = 360000,
    reserve_military = 1340000,
    military_budget_usd = 24700000000,
    description = 'Maior potência da América Latina, com enorme território e recursos estratégicos. Possui a maior base industrial de defesa do hemisfério sul.',
    military_description = 'Focado na negação de acesso (Amazonia Azul) e defesa de fronteiras. Opera o caça F-39 Gripen, submarinos Classe Riachuelo e o cargueiro KC-390. Doutrina defensiva e dissuasória.'
WHERE code = 'BRA';

-- ESTADOS UNIDOS
UPDATE countries SET 
    population = 333300000, 
    area_km2 = 9833520,
    active_military = 1390000,
    reserve_military = 800000,
    military_budget_usd = 877000000000,
    description = 'Superpotência global dominante com capacidade de projeção de poder inigualável em qualquer teatro de operações.',
    military_description = 'Tecnologia de ponta (Stealth, C4ISR). Espinha dorsal da OTAN. Opera milhares de aeronaves (F-35, F-22) e 11 superporta-aviões nucleares.'
WHERE code = 'USA';

-- CHINA
UPDATE countries SET 
    population = 1412000000, 
    area_km2 = 9596961,
    active_military = 2035000,
    reserve_military = 510000,
    military_budget_usd = 292000000000,
    description = 'Potência emergente desafiadora, com a maior marinha do mundo em número de cascos e rápida modernização tecnológica.',
    military_description = 'Foco em A2/AD (Anti-Acesso/Negação de Área) para controlar o Mar do Sul da China. Caças J-20 Stealth e mísseis hipersônicos DF-17.'
WHERE code = 'CHN';

-- RÚSSIA
UPDATE countries SET 
    population = 144200000, 
    area_km2 = 17098242,
    active_military = 1100000,
    reserve_military = 2000000,
    military_budget_usd = 86400000000,
    description = 'Maior país do mundo, superpotência nuclear e energética. Envolvida em conflito de alta intensidade na Ucrânia.',
    military_description = 'Doutrina baseada em artilharia massiva e defesa aérea (S-400/S-500). Possui o maior arsenal nuclear do planeta.'
WHERE code = 'RUS';

-- FRANÇA
UPDATE countries SET 
    population = 67970000, 
    area_km2 = 551695,
    active_military = 205000,
    reserve_military = 35000,
    military_budget_usd = 53600000000,
    description = 'Potência nuclear independente e líder europeia. Mantém territórios ultramarinos estratégicos globalmente.',
    military_description = 'Forças expedicionárias altamente capazes. Opera o caça Rafale e porta-aviões nuclear Charles de Gaulle.'
WHERE code = 'FRA';

-- AMÉRICA DO SUL (SOLICITADOS)

-- ARGENTINA
UPDATE countries SET 
    population = 46200000, 
    area_km2 = 2780400,
    active_military = 100000, -- Aprox
    military_budget_usd = 3000000000,
    description = 'Segunda maior economia da América do Sul. Passando por processo de reequipamento militar recente (compra de F-16).',
    military_description = 'Historicamente poderosa, hoje luta para recuperar capacidades perdidas. Recentemente adquiriu caças F-16 usados para restaurar capacidade supersônica.'
WHERE code = 'ARG';

-- COLÔMBIA
UPDATE countries SET 
    population = 51870000, 
    area_km2 = 1141748,
    active_military = 295000,
    military_budget_usd = 10000000000,
    description = 'Parceiro estratégico da OTAN e EUA na região. Forças Armadas extremamente experientes em combate irregular (COIN).',
    military_description = 'Foco em infantaria leve, helicópteros (Black Hawk) e ataque ao solo (Super Tucano). Opera caças Kfir.'
WHERE code = 'COL';

-- VENEZUELA
UPDATE countries SET 
    population = 28300000, 
    area_km2 = 916445,
    active_military = 120000,
    military_budget_usd = 500000000, -- Difícil estimar devido à crise
    description = 'Nação com vastas reservas de petróleo. Alinhada ao bloco anti-ocidental (Rússia/Irã).',
    military_description = 'Equipada majoritariamente com material russo (Sukhoi Su-30MK2, S-300VM) e chinês. Doutrina de "Guerra Popular Prolongada".'
WHERE code = 'VEN';

-- CHILE
UPDATE countries SET 
    population = 19600000, 
    area_km2 = 756102,
    active_military = 80000,
    military_budget_usd = 5500000000,
    description = 'Considerada a força militar mais profissional e moderna da América do Sul pound-for-pound.',
    military_description = 'Alta tecnologia e padronização OTAN. Opera F-16 Block 50, tanques Leopard 2A4 e fragatas Type 23.'
WHERE code = 'CHL';

-- PERU
UPDATE countries SET 
    population = 34000000, 
    area_km2 = 1285216,
    active_military = 115000,
    military_budget_usd = 2800000000,
    description = 'País andino com desafios geográficos complexos. Mantém equilíbrio estratégico com vizinhos.',
    military_description = 'Mix único de material soviético/russo (MiG-29, Su-25) e ocidental (Mirage 2000). Força de submarinos respeitável.'
WHERE code = 'PER';

-- PARAGUAI
UPDATE countries SET 
    population = 6780000, 
    area_km2 = 406752,
    active_military = 24000,
    military_budget_usd = 400000000,
    description = 'País encravado no coração do continente. Depende de rios para comércio e defesa.',
    military_description = 'Forças modestas focadas em segurança interna e patrulha fluvial. Equipamento leve e de gerações anteriores.'
WHERE code = 'PRY';

-- URUGUAI
UPDATE countries SET 
    population = 3400000, 
    area_km2 = 176215,
    active_military = 22000,
    military_budget_usd = 1200000000,
    description = 'Pequena nação com grande contribuição per capita para missões de paz da ONU ("Capacetes Azuis").',
    military_description = 'Foco quase total em peacekeeping. Material antigo, buscando renovação (ex: lanchas de patrulha e blindados leves).'
WHERE code = 'URY';

-- BOLÍVIA
UPDATE countries SET 
    population = 12200000, 
    area_km2 = 1098581,
    active_military = 50000,
    military_budget_usd = 600000000,
    description = 'País de alta altitude. Reivindicação histórica de acesso ao mar pauta sua geopolítica.',
    military_description = 'Foco em defesa de fronteiras e antinarcóticos. Aviação de caça praticamente inexistente (apenas treinadores K-8).'
WHERE code = 'BOL';

-- EQUADOR
UPDATE countries SET 
    population = 18000000, 
    area_km2 = 283561,
    active_military = 40000,
    military_budget_usd = 2500000000,
    description = 'Localização estratégica no Pacífico. Enfrenta desafios graves de segurança interna (cartéis).',
    military_description = 'Esforço recente voltado para segurança interna e COIN. Aviação supersônica desativada (Cheetahs estocados).'
WHERE code = 'ECU';

-- GUIANA
UPDATE countries SET 
    population = 800000, 
    area_km2 = 214969,
    active_military = 3000,
    military_budget_usd = 100000000,
    description = 'Pequena nação em boom econômico (petróleo), alvo de reivindicações territoriais da Venezuela (Essequibo).',
    military_description = 'Força de Defesa mínima, incapaz de deter agressão externa convencional sem apoio aliado (EUA/Reino Unido).'
WHERE code = 'GUY';

-- SURINAME
UPDATE countries SET 
    population = 618000, 
    area_km2 = 163820,
    active_military = 2000,
    military_budget_usd = 80000000,
    description = 'Ex-colônia holandesa. Política externa voltada para o Caribe e cooperação regional.',
    military_description = 'Forças simbólicas focadas em policiamento e patrulha costeira leve.'
WHERE code = 'SUR';
