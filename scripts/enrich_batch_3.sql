-- ============================================
-- ATUALIZAÇÃO EM MASSA - LOTE 3 (OUTROS SISTEMAS E CLÁSSICOS)
-- ============================================

-- 21. ASPIDE
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: ASPIDE
**Origem:** Itália (Alenia/MBDA)
**Tipo:** SAM de Médio Alcance / Ar-Ar
**Alcance:** 25km (Superfície-Ar)
**Velocidade:** Mach 4.0
**Guiagem:** Radar Semi-Ativo (Monopulse)
**Base:** Derivado do AIM-7 Sparrow, mas com eletrônica superior.

**ANÁLISE PVO:**
Equipa as fragatas classe Niterói e as baterias antiaéreas do Exército/Marinha. Possui altíssima velocidade e resistência a contramedidas eletrônicas (ECM) superior ao Sparrow original.'
WHERE name LIKE '%ASPIDE%';

-- 22. RAPIER
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: RAPIER / RAPIER FSC
**Origem:** Reino Unido (MBDA)
**Tipo:** SAM Móvel de Curto Alcance (SHORAD)
**Alcance:** 8.200m
**Altitude:** 3.000m
**Velocidade:** Mach 2.5
**Guiagem:** SACLOS (Óptico ou Radar Blindfire)
**Letalidade:** Impacto direto (Hit-to-Kill)

**ANÁLISE PVO:**
Famoso sistema britânico. Diferente de outros mísseis que usam espoleta de proximidade, o Rapier foi projetado para atingir o alvo fisicamente, garantindo a destruição. O radar Blindfire permite operação sob qualquer tempo.'
WHERE name LIKE '%RAPIER%';

-- 23. COBRA 2000 (Bolkow BO 810)
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: COBRA 2000
**Origem:** Alemanha (MBB)
**Tipo:** Míssil Antitanque (1ª Geração)
**Alcance:** 400m a 2.000m
**Guiagem:** MCLOS (Manual - Por Fio)
**Penetração:** 500mm

**ANÁLISE PVO:**
Um dos primeiros mísseis anticarro amplamente exportados do pós-guerra. Exige que o operador controle o voo manualmente via joystick. É lento e vulnerável, mas sua ogiva ainda é perigosa contra blindados leves.'
WHERE name LIKE '%COBRA%' AND name LIKE '%2000%';

-- 24. SA-2 GUIDELINE (S-75 Dvina)
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: SA-2 GUIDELINE (S-75)
**Origem:** URSS
**Tipo:** SAM Fixo de Alta Altitude (HIMAD)
**Alcance:** 45km
**Altitude:** 25.000m
**Guiagem:** Radio Command (Radar Fan Song)
**Histórico:** O míssil que abateu o U-2 de Gary Powers (1960).

**ANÁLISE PVO:**
Um dinossauro da Guerra Fria, mas ainda perigoso. Projetado para abater bombardeiros pesados em grande altitude. É ineficaz contra alvos baixos e manobráveis, e seu perfil de lançamento fixa ("poste telefônico voando") é facilmente detectável.'
WHERE name LIKE '%SA-2%' OR name LIKE '%SA 2%' OR name LIKE '%S-75%' OR name LIKE '%GUIDELINE%';

-- 25. SA-9 GASKIN (9K31 Strela-1)
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: SA-9 GASKIN (Strela-1)
**Origem:** URSS
**Tipo:** SAM Móvel de Curto Alcance
**Alcance:** 4.200m
**Guiagem:** Infravermelho (Fotocontraste inicialmente, depois IR)
**Plataforma:** BRDM-2 (Anfíbio 4x4)

**ANÁLISE PVO:**
Sistema simples montado sobre um blindado de reconhecimento. Diferente do Igla/Stinger, seus primeiros sensores buscavam o contraste do avião contra o céu, permitindo engajamentos de frente antes da tecnologia IR moderna.'
WHERE name LIKE '%SA-9%' OR name LIKE '%SA 9%' OR name LIKE '%STRELA-1%';

-- 26. SA-13 GOPHER (9K35 Strela-10)
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: SA-13 GOPHER (Strela-10)
**Origem:** URSS / Rússia
**Tipo:** SAM Móvel de Curto Alcance
**Alcance:** 5.000m
**Altitude:** 3.500m
**Guiagem:** Infravermelho / Fotocontraste (Dual Mode)
**Plataforma:** MT-LB (Lagarta)

**ANÁLISE PVO:**
Sucessor do SA-9, muito mais capaz. Usa um chassi lagarta para acompanhar tanques. O sensor multispectral é resistente a flares simples e pode engajar alvos sem pós-combustor de frente.'
WHERE name LIKE '%SA-13%' OR name LIKE '%SA 13%' OR name LIKE '%STRELA-10%';

-- 27. BLOODHOUND MK2
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: RISTOL BLOODHOUND MK2
**Origem:** Reino Unido
**Tipo:** SAM Fixo de Longo Alcance
**Alcance:** > 85km
**Velocidade:** Mach 2.7
**Propulsão:** Ramjet (Thor)
**Guiagem:** Radar Semi-Ativo (CW)

**ANÁLISE PVO:**
Um sistema massivo usado pela RAF para defesa de bases de bombardeiros V. Seus motores Ramjet garantem que ele mantenha velocidade máxima até o impacto, diferente de foguetes que perdem energia após a queima.'
WHERE name LIKE '%BLOODHOUND%';

-- 28. MAMBA
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: MAMBA (Vigilant sucessor)
**Origem:** Alemanha (MBB)
**Tipo:** Míssil Antitanque (1ª/2ª Geração)
**Alcance:** 2.000m
**Guiagem:** MCLOS (Manual)
**Destaque:** Sistema de salto no lançamento

**ANÁLISE PVO:**
Desenvolvimento posterior ao Cobra. O "salto" inicial ajuda a evitar obstáculos no solo logo após o disparo. Ainda depende muito da habilidade do operador.'
WHERE name LIKE '%MAMBA%';

-- 29. MATHOGO
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: MATHOGO
**Origem:** Argentina (CITEFA)
**Tipo:** Míssil Antitanque
**Alcance:** 2.000m - 3.000m
**Guiagem:** SACLOS (Wire-guided)
**Histórico:** Desenvolvido localmente pela Argentina.

**ANÁLISE PVO:**
Um esforço notável da indústria argentina. Similar em conceito ao Cobra/Mamba, mas com melhorias. É uma ameaça relevante no cenário sul-americano.'
WHERE name LIKE '%MATHOGO%';

-- 30. SS-N-2 STYX (P-15 Termit)
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: SS-N-2 STYX (P-15 Termit)
**Origem:** URSS
**Tipo:** Míssil Anti-Navio (Heavy)
**Alcance:** 40km a 80km
**Ogiva:** 454 kg (Pesada - Carga Oca)
**Guiagem:** Radar Ativo (Banda L)
**Tamanho:** Enorme (família "bomba voadora")

**ANÁLISE PVO:**
O primeiro míssil a afundar um navio de guerra em combate (O destroyer israelense Eilat em 1967). É grande, lento e voa alto comparado aos mísseis modernos, sendo alvo fácil para CIWS hoje, mas sua ogiva de meia tonelada parte qualquer navio ao meio se acertar.'
WHERE name LIKE '%SS-N-2%' OR name LIKE '%STYX%' OR name LIKE '%P-15%';

SELECT '✅ Lote 3 (Clássicos e Outros) atualizado com sucesso!' as result;
