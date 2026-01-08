-- ATUALIZAÇÃO DE FICHAS TÉCNICAS (BASEADO NO PVO)
-- Gerado por Antigravity AI

-- 1. ASPIDE
UPDATE equipment SET description = '## DADOS TÉCNICOS: ASPIDE
**Origem:** Itália
**Tipo:** Míssil Ar-Ar / Superfície-Ar (SAM)
**Alcance:** 15 a 25 km (dependendo da versão)
**Guiagem:** Radar Semi-Ativo (SARH)
**Velocidade:** Mach 4 (aprox. 5000 km/h)

**ANÁLISE PVO:**
Derivado do AIM-7 Sparrow, possui aletas triangulares características no meio e na cauda. Usado em sistemas antiaéreos como Spada e Skyguard. Alta velocidade e manobrabilidade, sendo uma ameaça séria em médio alcance para aeronaves.'
WHERE name ILIKE '%ASPIDE%';

-- 2. EXOCET MM40
UPDATE equipment SET description = '## DADOS TÉCNICOS: EXOCET MM40
**Origem:** França
**Tipo:** Míssil Antinavio (AShM)
**Alcance:** 70 km (Block 2) a 180 km (Block 3)
**Guiagem:** Inercial + Radar Ativo na fase terminal
**Velocidade:** Mach 0.9 (Subsônico alto)

**ANÁLISE PVO:**
Míssil rasante ao mar (sea-skimming), difícil de detectar por radar. Cilindrico com nariz ogival e aletas cruciformes no meio e cauda. O lançamento produz grande fumaça branca. Prioridade máxima para navios de superfície.'
WHERE name ILIKE '%EXOCET%';

-- 3. ROLAND
UPDATE equipment SET description = '## DADOS TÉCNICOS: ROLAND
**Origem:** França / Alemanha
**Tipo:** Sistema SAM de Curto Alcance (SHORAD)
**Alcance:** 6 a 8 km
**Guiagem:** Comando pro Linha de Visada (CLOS) radar ou óptico
**Velocidade:** Mach 1.6

**ANÁLISE PVO:**
Montado geralmente em blindados (Marder, AMX-30) ou caminhões. O míssil é observado visualmente saindo de tubos lançadores laterais à torre do radar. Ameaça letal para helicópteros e aviões em baixa altitude.'
WHERE name ILIKE '%ROLAND%';

-- 4. SA-6 GAINFUL (2K12 KUB)
UPDATE equipment SET description = '## DADOS TÉCNICOS: SA-6 GAINFUL
**Origem:** União Soviética (Rússia)
**Tipo:** SAM Móvel de Médio Alcance
**Alcance:** 24 km
**Guiagem:** Radar Semi-Ativo
**Velocidade:** Mach 2.8

**ANÁLISE PVO:**
Identificado por 3 mísseis montados em um chassi de lagartas. Os mísseis têm grandes entradas de ar laterais para os ramjets. O radar de controle de tiro (Straight Flush) opera separadamente. Letal e historicamente significativo.'
WHERE name ILIKE '%SA-6%' OR name ILIKE '%GAINFUL%' OR code ILIKE '%SA-6%';

-- 5. SA-8 GECKO (9K33 OSA)
UPDATE equipment SET description = '## DADOS TÉCNICOS: SA-8 GECKO
**Origem:** União Soviética (Rússia)
**Tipo:** SAM Tático Anfíbio
**Alcance:** 10 a 15 km
**Guiagem:** Comando por Radar (RF Command)
**Velocidade:** Mach 2.4

**ANÁLISE PVO:**
Veículo 6x6 único com radar e 6 mísseis (em caixas ou expostos) integrados (TELAR). Alta mobilidade, acompanha tropas blindadas. O radar de engajamento é grande e fica na frente dos lançadores.'
WHERE name ILIKE '%SA-8%' OR name ILIKE '%GECKO%' OR code ILIKE '%SA-8%';

-- 6. SA-7 GRAIL (STRELA-2)
UPDATE equipment SET description = '## DADOS TÉCNICOS: SA-7 GRAIL
**Origem:** União Soviética
**Tipo:** MANPADS (Portátil)
**Alcance:** 3.7 km
**Guiagem:** Infravermelho (Busca de Calor - Traseiro)
**Velocidade:** Mach 1.5

**ANÁLISE PVO:**
Tubo lançador simples com bateria térmica cilíndrica abaixo da boca. O seeker requer visão do exaustor do motor (tail-chase). Fácil de ser enganado por flares modernos, mas perigoso em emboscadas.'
WHERE name ILIKE '%SA-7%' OR name ILIKE '%GRAIL%';

-- 7. SA-14 GREMLIN (STRELA-3)
UPDATE equipment SET description = '## DADOS TÉCNICOS: SA-14 GREMLIN
**Origem:** União Soviética
**Tipo:** MANPADS
**Alcance:** 4.5 km
**Guiagem:** Infravermelho (Aspecto Limitado)
**Velocidade:** Mach 1.7

**ANÁLISE PVO:**
Evolução do SA-7, com seeker resfriado permitindo engajamentos frontais limitados e melhor resistência a contramedidas. O tubo é muito similar ao SA-7, mas a bateria é uma esfera (bola) abaixo do tubo.'
WHERE name ILIKE '%SA-14%' OR name ILIKE '%GREMLIN%';

-- 8. SA-16 GIMLET (IGLA-1) / SA-18 GROUSE (IGLA)
UPDATE equipment SET description = '## DADOS TÉCNICOS: SA-16/18 IGLA
**Origem:** Rússia
**Tipo:** MANPADS Avançado
**Alcance:** 5.2 km
**Guiagem:** Infravermelho de 2 Cores (IR/UV)
**Velocidade:** Mach 1.9

**ANÁLISE PVO:**
O tubo possui um cone protetor aerodinâmico distinto na ponta. Seeker muito resistente a flares. Capacidade "fire-and-forget" total de qualquer aspecto. Altamente disseminado e letal.'
WHERE name ILIKE '%SA-16%' OR name ILIKE '%IGLA%' OR name ILIKE '%SA-18%';

-- 9. MISTRAL
UPDATE equipment SET description = '## DADOS TÉCNICOS: MISTRAL
**Origem:** França
**Tipo:** VSHORAD (Curto Alcance)
**Alcance:** 6 km
**Guiagem:** Infravermelho Passivo
**Velocidade:** Mach 2.5

**ANÁLISE PVO:**
Geralmente montado em tripé (posto de tiro simples) ou em veículos (Atlas, Simbad). O míssil é mais robusto que os MANPADS típicos e muito rápido. Possui seeker piramidal distintivo.'
WHERE name ILIKE '%MISTRAL%';

-- 10. STINGER (FIM-92)
UPDATE equipment SET description = '## DADOS TÉCNICOS: FIM-92 STINGER
**Origem:** EUA
**Tipo:** MANPADS
**Alcance:** 4.8 km
**Guiagem:** Infravermelho/Ultravioleta (IR/UV)
**Velocidade:** Mach 2.2

**ANÁLISE PVO:**
Reconhecível pela antena IFF "caixa de pizza" dobrável grande. O tubo é grosso e curto. Seeker muito avançado com discriminação de alvo negativa (ignora sol e flares simples).'
WHERE name ILIKE '%STINGER%' OR name ILIKE '%FIM-92%';

-- 11. RBS 70
UPDATE equipment SET description = '## DADOS TÉCNICOS: RBS 70
**Origem:** Suécia
**Tipo:** MANPADS (Sistema Portátil de Tripé)
**Alcance:** 8 km (Mk 2)
**Guiagem:** Laser Beam Riding (Guiagem por Feixe Laser)
**Velocidade:** Mach 2.0

**ANÁLISE PVO:**
Imune a flares e interferência eletrônica (jamming) pois o receptor laser fica na traseira do míssil. Exige que o operador mantenha a mira no alvo até o impacto. O tubo é retangular e cilíndrico na ponta.'
WHERE name ILIKE '%RBS 70%' OR name ILIKE '%RBS-70%';

-- 12. TIGERCAT / SEACAT
UPDATE equipment SET description = '## DADOS TÉCNICOS: TIGERCAT
**Origem:** Reino Unido
**Tipo:** SAM de Curto Alcance Antigo
**Alcance:** 6 km
**Guiagem:** CLOS (Comando Visual/Radar)
**Velocidade:** Mach 0.9

**ANÁLISE PVO:**
Míssil curto e grosso com grandes aletas nas asas. Historicamente usado nas Malvinas. Lento e exige habilidade do operador. Hoje obsoleto, mas presente em alguns manuais.'
WHERE name ILIKE '%TIGERCAT%' OR name ILIKE '%SEACAT%';

-- 13. SA-3 GOA (S-125 NEVA/PECHORA)
UPDATE equipment SET description = '## DADOS TÉCNICOS: SA-3 GOA
**Origem:** União Soviética
**Tipo:** SAM de Médio/Curto Alcance fixo
**Alcance:** 25 km
**Guiagem:** Comando de Rádio (V-Beam)
**Velocidade:** Mach 3

**ANÁLISE PVO:**
Dois ou quatro mísseis em lançadores fixos. Os mísseis possuem boosters grossos na cauda e aletas retangulares grandes que se movem. Famoso por abater o F-117 Stealth na Sérvia. Ainda muito perigoso se modernizado.'
WHERE name ILIKE '%SA-3%' OR name ILIKE '%GOA%' OR code ILIKE '%S-125%';

-- 14. SA-2 GUIDELINE (S-75 DVINA)
UPDATE equipment SET description = '## DADOS TÉCNICOS: SA-2 GUIDELINE
**Origem:** União Soviética
**Tipo:** SAM de Alta Altitude
**Alcance:** 45 km
**Guiagem:** Comando de Rádio (Fan Song Radar)
**Velocidade:** Mach 3.5

**ANÁLISE PVO:**
O "poste telefônico voador". Míssil enorme de dois estágios, fácil de ver o lançamento. Projetado para bombardeiros, tem manobrabilidade limitada contra caças ágeis mas ogiva enorme.'
WHERE name ILIKE '%SA-2%' OR name ILIKE '%GUIDELINE%' OR code ILIKE '%S-75%';

-- 15. TOW (BGM-71)
UPDATE equipment SET description = '## DADOS TÉCNICOS: BGM-71 TOW
**Origem:** EUA
**Tipo:** Míssil Antitanque (ATGM)
**Alcance:** 3.75 km
**Guiagem:** Filoguiado (Wire-Guided SACLOS)
**Velocidade:** Subsônico (300 m/s)

**ANÁLISE PVO:**
Tubo lançado de tripé ou veículo (Humvee, Bradley). O operador mantém a cruz filar no alvo e o computador corrige o voo. Voo lento, permite evasão se o lançamento for detectado visualmente.'
WHERE name ILIKE '%TOW%' OR name ILIKE '%BGM-71%';

-- 16. MILAN
UPDATE equipment SET description = '## DADOS TÉCNICOS: MILAN
**Origem:** França / Alemanha
**Tipo:** ATGM Portátil
**Alcance:** 2 a 3 km
**Guiagem:** Filoguiado (SACLOS)
**Velocidade:** 200 m/s

**ANÁLISE PVO:**
Lançado de um tubo sobre um tripé baixo. O atirador fica deitado ou sentado. O míssil gira em voo. Muito comum na infantaria mecanizada europeia.'
WHERE name ILIKE '%MILAN%';

-- 17. HOT
UPDATE equipment SET description = '## DADOS TÉCNICOS: HOT
**Origem:** França / Alemanha
**Tipo:** ATGM Pesado
**Alcance:** 4 km
**Guiagem:** Filoguiado (SACLOS)
**Velocidade:** 250 m/s

**ANÁLISE PVO:**
Maior que o Milan, usado principalmente em veículos (Jaguar) e helicópteros (Gazelle, Bo-105). Tubos largos agrupados em 2 ou 4.'
WHERE name ILIKE '%HOT%';

-- 18. AT-3 SAGGER (9M14 MALYUTKA)
UPDATE equipment SET description = '## DADOS TÉCNICOS: AT-3 SAGGER
**Origem:** União Soviética
**Tipo:** ATGM Antigo
**Alcance:** 3 km
**Guiagem:** Manual (MCLOS) ou SACLOS (versões novas)
**Velocidade:** Muito Lento (115 m/s)

**ANÁLISE PVO:**
Míssil pequeno com asas dobráveis, parece "inofensivo". Voo extremamente lento, visível a olho nu. Pode ser evitado com manobras bruscas se detectado a tempo.'
WHERE name ILIKE '%SAGGER%' OR name ILIKE '%AT-3%';

-- 19. CROTALE
UPDATE equipment SET description = '## DADOS TÉCNICOS: CROTALE
**Origem:** França
**Tipo:** SAM Móvel
**Alcance:** 11 km (NG)
**Guiagem:** Comando Radioelétrico
**Velocidade:** Mach 2.3

**ANÁLISE PVO:**
Montado em veículo 4x4 ou 6x6, geralmente com 4 mísseis em "containers" selados ao redor de um radar de rastreio. Reação muito rápida (tempo curto de disparo).'
WHERE name ILIKE '%CROTALE%';

-- 20. SEA DART
UPDATE equipment SET description = '## DADOS TÉCNICOS: SEA DART
**Origem:** Reino Unido
**Tipo:** SAM Naval de Área
**Alcance:** 75 km
**Guiagem:** Radar Semi-Ativo
**Velocidade:** Mach 3

**ANÁLISE PVO:**
Míssil grande propulsado por Ramjet (tem entradas de ar na frente). Lançador duplo no convés de destróieres Type 42. Defesa de frota principal, mas vulnerável a saturação.'
WHERE name ILIKE '%SEA DART%';
