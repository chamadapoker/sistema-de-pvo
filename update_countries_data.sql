-- ATUALIZAÇÃO MANUAL DE DADOS PRINCIPAIS
-- Garante coluna de idiomas
ALTER TABLE countries ADD COLUMN IF NOT EXISTS languages text[];


UPDATE countries SET
    population = 341000000,
    military_budget_usd = 916000000000,
    active_military = 1328000,
    reserve_military = 799500,
    military_rank = 1,
    military_description = 'Superpotência global com capacidade de projeção de poder em múltiplos teatros simultâneos. Doutrina focada em superioridade aérea e dominância naval.',
    alliance = 'NATO',
    languages = '{English}'
WHERE name ILIKE '%United States%';

UPDATE countries SET
    population = 144000000,
    military_budget_usd = 109000000000,
    active_military = 1320000,
    reserve_military = 2000000,
    military_rank = 2,
    military_description = 'Focada em guerra terrestre massiva, artilharia superior e arsenal nuclear estratégico. Doutrina de defesa em profundidade e A2/AD.',
    alliance = 'CSTO',
    languages = '{Russian}'
WHERE name ILIKE '%Russia%';

UPDATE countries SET
    population = 1425000000,
    military_budget_usd = 296000000000,
    active_military = 2035000,
    reserve_military = 510000,
    military_rank = 3,
    military_description = 'Maior exército permanente do mundo. Modernização rápida focada em negar acesso (A2/AD) no Pacífico e expandir capacidades navais blue-water.',
    alliance = 'BRICS+',
    languages = '{Mandarin}'
WHERE name ILIKE '%China%';

UPDATE countries SET
    population = 1428000000,
    military_budget_usd = 74000000000,
    active_military = 1450000,
    reserve_military = 1155000,
    military_rank = 4,
    military_description = 'Força terrestre massiva focada em conter Paquistão e China. Investimento crescente em marinha e força aérea para projeção regional no Índico.',
    alliance = 'BRICS+',
    languages = '{Hindi,English}'
WHERE name ILIKE '%India%';

UPDATE countries SET
    population = 216000000,
    military_budget_usd = 24000000000,
    active_military = 360000,
    reserve_military = 1340000,
    military_rank = 12,
    military_description = 'Maior força da América Latina. Doutrina defensiva focada na proteção da Amazônia (Selva) e do Atlântico Sul (Amazônia Azul).',
    alliance = 'BRICS+',
    languages = '{Portuguese}'
WHERE name ILIKE '%Brazil%';

UPDATE countries SET
    population = 67000000,
    military_budget_usd = 68000000000,
    active_military = 185000,
    reserve_military = 37000,
    military_rank = 6,
    military_description = 'Força profissional e tecnológica. Capacidade de projeção global limitada mas letal via porta-aviões e forças especiais de elite (SAS).',
    alliance = 'NATO',
    languages = '{English}'
WHERE name ILIKE '%United Kingdom%';

UPDATE countries SET
    population = 68000000,
    military_budget_usd = 56000000000,
    active_military = 205000,
    reserve_military = 35000,
    military_rank = 9,
    military_description = 'Independência estratégica. Possui tríade nuclear própria e indústria de defesa robusta (Rafale, Leclerc). Focada em intervenções rápidas.',
    alliance = 'NATO',
    languages = '{French}'
WHERE name ILIKE '%France%';

UPDATE countries SET
    population = 84000000,
    military_budget_usd = 55000000000,
    active_military = 184000,
    reserve_military = 15000,
    military_rank = 19,
    military_description = 'Em processo de rearmamento (Zeitenwende). Focada em defesa coletiva da Europa Central e blindados de alta tecnologia (Leopard 2).',
    alliance = 'NATO',
    languages = '{German}'
WHERE name ILIKE '%Germany%';

UPDATE countries SET
    population = 51000000,
    military_budget_usd = 44000000000,
    active_military = 555000,
    reserve_military = 2750000,
    military_rank = 5,
    military_description = 'Força altamente pronta e tecnológica, preparada para guerra total contra o Norte. Artilharia massiva e conscrição universal.',
    alliance = 'Non-Aligned',
    languages = '{Korean}'
WHERE name ILIKE '%South Korea%';

UPDATE countries SET
    population = 26000000,
    military_budget_usd = 3500000000,
    active_military = 1200000,
    reserve_military = 600000,
    military_rank = 36,
    military_description = 'Doutrina Juche. Enorme quantidade de artilharia convencional apontada para Seul e foco assimétrico em mísseis balísticos e nucleares.',
    alliance = 'Non-Aligned',
    languages = '{Korean}'
WHERE name ILIKE '%North Korea%';

UPDATE countries SET
    population = 37000000,
    military_budget_usd = 40000000000,
    active_military = 900000,
    reserve_military = 1000000,
    military_rank = 18,
    military_description = 'Exército endurecido por combate em larga escala. Especialista em guerra de drones, artilharia de precisão e defesa móvel.',
    alliance = 'Non-Aligned',
    languages = '{Ukrainian}'
WHERE name ILIKE '%Ukraine%';

UPDATE countries SET
    population = 98000000,
    military_budget_usd = 24000000000,
    active_military = 170000,
    reserve_military = 465000,
    military_rank = 17,
    military_description = 'Defesa ativa e preempção. Depende de superioridade tecnológica (Iron Dome, F-35I) e inteligência para neutralizar ameaças vizinhas.',
    alliance = 'Non-Aligned',
    languages = '{Hebrew}'
WHERE name ILIKE '%Israel%';

UPDATE countries SET
    population = 89000000,
    military_budget_usd = 10000000000,
    active_military = 610000,
    reserve_military = 350000,
    military_rank = 14,
    military_description = 'Guerra assimétrica e por procuração (proxies). Foco em mísseis balísticos, drones kamikaze e enxames de lanchas rápidas no Golfo.',
    alliance = 'BRICS+',
    languages = '{Persian}'
WHERE name ILIKE '%Iran%';

UPDATE countries SET
    population = 85000000,
    military_budget_usd = 25000000000,
    active_military = 355000,
    reserve_military = 380000,
    military_rank = 8,
    military_description = 'Segunda maior força da NATO. Potência regional com indústria de drones (Bayraktar) líder mundial e marinha em expansão.',
    alliance = 'NATO',
    languages = '{Turkish}'
WHERE name ILIKE '%Turkey%';

UPDATE countries SET
    population = 59000000,
    military_budget_usd = 33000000000,
    active_military = 165000,
    reserve_military = 19000,
    military_rank = 10,
    military_description = 'Força naval expedicionária focada no Mediterrâneo (Mare Nostrum). Possui porta-aviões leves e forças especiais de alta qualidade.',
    alliance = 'NATO',
    languages = '{Italian}'
WHERE name ILIKE '%Italy%';

UPDATE countries SET
    population = 123000000,
    military_budget_usd = 53000000000,
    active_military = 247000,
    reserve_military = 56000,
    military_rank = 7,
    military_description = 'Força de Autodefesa. Foco em guerra antisubmarina e defesa antimíssil avançada (Aegis) para conter China e Coreia do Norte.',
    alliance = 'Non-Aligned',
    languages = '{Japanese}'
WHERE name ILIKE '%Japan%';

UPDATE countries SET
    population = 37000000,
    military_budget_usd = 31000000000,
    active_military = 202000,
    reserve_military = 35000,
    military_rank = 21,
    military_description = 'O novo escudo da Europa. Investimento massivo em blindados (K2, Abrams) e artilharia (HIMARS) para deter agressão russa.',
    alliance = 'NATO',
    languages = '{Polish}'
WHERE name ILIKE '%Poland%';

UPDATE countries SET
    population = 46000000,
    military_budget_usd = 3000000000,
    active_military = 75000,
    reserve_military = 31000,
    military_rank = 30,
    military_description = 'Em recuperação de décadas de desinvestimento. Focada em defesa territorial e controle do Atlântico Sul, com modernização recente (F-16).',
    alliance = 'Rio Treaty',
    languages = '{Spanish}'
WHERE name ILIKE '%Argentina%';

UPDATE countries SET
    population = 28000000,
    military_budget_usd = 2000000000,
    active_military = 125000,
    reserve_military = 8000000,
    military_rank = 50,
    military_description = 'Doutrina de ''Guerra Popular Prolongada''. Equipamento russo/chinês (Su-30, S-300) misturado com milícias irregulares.',
    alliance = 'Non-Aligned',
    languages = '{Spanish}'
WHERE name ILIKE '%Venezuela%';

UPDATE countries SET
    population = 19000000,
    military_budget_usd = 5500000000,
    active_military = 77000,
    reserve_military = 40000,
    military_rank = 40,
    military_description = 'Força mais profissional e bem equipada da América do Sul per capita. Tecnologia ocidental moderna (Leopard 2, F-16).',
    alliance = 'Rio Treaty',
    languages = '{Spanish}'
WHERE name ILIKE '%Chile%';
