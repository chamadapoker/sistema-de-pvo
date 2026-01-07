-- ============================================
-- ATUALIZAÇÃO EM MASSA - LOTE 2 (MÍSSEIS NAVAIS, BRITÂNICOS E OUTROS MANPADS)
-- ============================================

-- 11. SEA WOLF / SEAWOLF
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: SEA WOLF (GWS-25/26)
**Origem:** Reino Unido (MBDA/BAE)
**Tipo:** Míssil Naval de Defesa de Ponto (Anti-Míssil)
**Alcance:** 6km (Convencional) a 10km (VL - Lançamento Vertical)
**Velocidade:** Mach 3.0
**Guiagem:** CLOS (Radar ou TV Automatizado)
**Capacidade:** Interceptação automática de mísseis sea-skimming e ameaças supersônicas em mergulho.

**ANÁLISE PVO:**
Sistema automático de defesa aproximada. Famoso por sua rápida resposta na Guerra das Malvinas. A versão VL (Vertical Launch) eliminou a necessidade de apontar o lançador, aumentando a cadência contra ataques de saturação.'
WHERE name LIKE '%SEAWOLF%' OR name LIKE '%SEA WOLF%' OR name LIKE '%SEA-WOLF%';

-- 12. SEA DART
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: SEA DART (GWS-30)
**Origem:** Reino Unido (BAE Dynamics)
**Tipo:** Míssil Naval de Defesa de Área (Longo Alcance)
**Alcance:** 75km (Mod 0) a 150km (Versões Finais)
**Velocidade:** Mach 2.5
**Motor:** Ramjet (Estatorreator)
**Guiagem:** Radar Semi-Ativo

**ANÁLISE PVO:**
Míssil histórico da Royal Navy (Type 42). Abateu diversas aeronaves argentinas em 1982. Seu motor Ramjet lhe dá alcance e velocidade sustentada, mas exige boosters para acelerar até a velocidade de ignição.'
WHERE name LIKE '%SEA DART%' OR name LIKE '%SEADART%';

-- 13. SEA SKUA
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: SEA SKUA
**Origem:** Reino Unido (BAE/MBDA)
**Tipo:** Míssil Anti-Navio Leve (Lançamento Aéreo - Helicóptero)
**Alcance:** 25km
**Peso:** 145 kg
**Guiagem:** Radar Semi-Ativo
**Alvos:** Corvetas, Lanchas Rápidas e Fragatas leves

**ANÁLISE PVO:**
Projetado para ser levado por helicópteros Lynx. Foi decisivo na Guerra do Golfo (1991) para neutralizar a marinha iraquiana. Diferente do Exocet, ele precisa que o helicóptero ilumine o alvo com seu radar até o impacto.'
WHERE name LIKE '%SEA SKUA%' OR name LIKE '%SEASKUA%';

-- 14. BLOWPIPE
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: BLOWPIPE
**Origem:** Reino Unido (Thales Air Defence)
**Tipo:** MANPADS (1ª Geração - Guiado Manualmente)
**Alcance:** 3.500m
**Guiagem:** MCLOS (Comando Manual para Linha de Visada)
**Histórico:** Guerra das Malvinas (Usado por ambos os lados)

**ANÁLISE PVO:**
Notório por ser difícil de usar. O operador precisa pilotar o míssil com um joystick na unidade de lançamento até atingir a aeronave. Em combate real, sua eficácia foi muito baixa comparada aos mísseis IR (Stinger/Igla).'
WHERE name LIKE '%BLOWPIPE%';

-- 15. ERYX
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: ERYX
**Origem:** França (MBDA)
**Tipo:** Míssil Antitanque de Curto Alcance (Urbano)
**Alcance:** 50m a 600m
**Guiagem:** SACLOS (Wire-guided)
**Penetração:** 900mm (Ogiva Tandem)
**Destaque:** Soft Launch (Pode ser disparado de dentro de prédios)

**ANÁLISE PVO:**
Um "mini-TOW" portátil. Sua principal vantagem é o motor de lançamento suave, que permite ao soldado disparar de janelas ou locais confinados sem ser ferido pelo backblast (jato traseiro).'
WHERE name LIKE '%ERYX%';

-- 16. OTOMAT / TESEO
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: OTOMAT / TESEO
**Origem:** Itália (OTO Melara) / França (Matra)
**Tipo:** Míssil Anti-Navio de Longo Alcance
**Alcance:** 180km (Mk2)
**Velocidade:** Mach 0.9
**Guiagem:** Radar Ativo + Data Link (Mid-course)
**Ogiva:** 210 kg Semi-Perfurante

**ANÁLISE PVO:**
Um dos mísseis anti-navio mais poderosos do ocidente. Possui capacidade de atualização de alvo em voo via Data Link, permitindo atacar alvos além do horizonte (OTHT) com precisão.'
WHERE name LIKE '%OTOMAT%' OR name LIKE '%TESEO%';

-- 17. SA-3 GOA (S-125 Neva/Pechora)
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: SA-3 GOA (S-125)
**Origem:** URSS / Rússia
**Tipo:** SAM Fixo de Curto/Médio Alcance
**Alcance:** 35km
**Altitude:** 18.000m
**Guiagem:** Radio Command (Radar Low Blow)
**Histórico:** Derrubou o F-117 Nighthawk (Stealth) na Sérvia (1999)

**ANÁLISE PVO:**
Embora antigo, provou ser letal quando operado com táticas inteligentes. Seu míssil de dois estágios é capaz de manobras agressivas. Amplamente modernizado (Pechora-2M) com eletrônica digital.'
WHERE name LIKE '%SA-3%' OR name LIKE '%SA 3%' OR name LIKE '%S-125%' OR name LIKE '%GOA%';

-- 18. SA-6 GAINFUL (2K12 Kub)
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: SA-6 GAINFUL (2K12 Kub)
**Origem:** URSS
**Tipo:** SAM Móvel de Médio Alcance
**Alcance:** 24km
**Guiagem:** Radar Semi-Ativo
**Plataforma:** Blindado Lagarta

**ANÁLISE PVO:**
O terror de Israel em 1973. Foi o sistema que forçou o desenvolvimento de contramedidas eletrônicas modernas. Combina mobilidade off-road com mísseis Ramjet de alta velocidade para proteger colunas blindadas.'
WHERE name LIKE '%SA-6%' OR name LIKE '%SA 6%' OR name LIKE '%2K12%' OR name LIKE '%KUB%';

-- 19. SA-19 GRISON (2K22 Tunguska)
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: SA-19 GRISON (Tunguska)
**Origem:** URSS / Rússia
**Tipo:** SPAAGM (Canhão + Míssil Antiaéreo Móvel)
**Armamento:** 8x Mísseis 9M311 + 2x Canhões 30mm
**Alcance (Míssil):** 8km a 10km
**Guiagem:** SACLOS (Radio Command Optico/Radar)
**Missão:** Proteção de blindados contra helicópteros de ataque (Apache/Cobra)

**ANÁLISE PVO:**
Sistema híbrido formidável. Se o inimigo está longe, usa mísseis; se está perto (<3km), usa os canhões automáticos de cadência absurda. Predecessor do Pantsir.'
WHERE name LIKE '%SA-19%' OR name LIKE '%SA 19%' OR name LIKE '%TUNGUSKA%';

-- 20. MIM-23 HAWK
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: MIM-23 HAWK
**Origem:** EUA (Raytheon)
**Tipo:** SAM Móvel de Médio Alcance
**Alcance:** 45km a 50km (I-HAWK)
**Altitude:** 20.000m
**Guiagem:** Radar Semi-Ativo Condínuo (CW)

**ANÁLISE PVO:**
O "cavalo de batalha" da defesa aérea ocidental durante a Guerra Fria. Seu radar de iluminação contínua (CWAR) permite engajar alvos voando muito baixo, discriminando-os do eco de solo (clutter).'
WHERE name LIKE '%HAWK%' AND name NOT LIKE '%BLACK%' AND name NOT LIKE '%SEA%';

SELECT '✅ Lote 2 (Navais e Históricos) atualizado com sucesso!' as result;
