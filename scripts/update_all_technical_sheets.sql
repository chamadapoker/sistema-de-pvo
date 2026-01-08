-- ATUALIZAÇÃO COMPLETA DE FICHAS TÉCNICAS (TODOS OS EQUIPAMENTOS)
-- Gerado por Antigravity AI
-- Execute este script no SQL Editor do Supabase para aplicar as fichas técnicas.

-- ==========================================
-- PARTE 1: MÍSSEIS ANTIAÉREOS (SAM & MANPADS)
-- ==========================================

UPDATE equipment SET description = '## DADOS TÉCNICOS: ASPIDE
**Origem:** Itália
**Tipo:** Míssil Ar-Ar / Superfície-Ar (SAM)
**Alcance:** 15 a 25 km
**Guiagem:** Radar Semi-Ativo (SARH)
**Velocidade:** Mach 4

**ANÁLISE PVO:**
Derivado do AIM-7 Sparrow, possui aletas triangulares características no meio e na cauda. Usado em sistemas Spada, Skyguard e Albatros. Alta velocidade e letal em médio alcance.'
WHERE name ILIKE '%ASPIDE%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: BLOODHOUND MK2
**Origem:** Reino Unido
**Tipo:** SAM de Longo Alcance
**Alcance:** 85 km
**Guiagem:** Radar Semi-Ativo (Type 86)
**Velocidade:** Mach 2.7

**ANÁLISE PVO:**
Míssil enorme com dois grandes boosters Ramjet (Thor) montados acima e abaixo do corpo principal. Projetado para defesa de área contra bombardeiros em alta altitude. Aparência inconfundível.'
WHERE name ILIKE '%BLOODHOUND%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: BLOWPIPE
**Origem:** Reino Unido
**Tipo:** MANPADS
**Alcance:** 3.5 km
**Guiagem:** CLOS (Radio-Comando Manual)
**Velocidade:** Mach 1.5

**ANÁLISE PVO:**
Tubo lançador com uma seção traseira bojudada (container maior que o tubo). O operador guia o míssil joystick (thumbstick). Baixa eficácia em combate real, mas precursor do Javelin/Starstreak.'
WHERE name ILIKE '%BLOWPIPE%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: MIM-72 CHAPARRAL
**Origem:** EUA
**Tipo:** SAM de Curto Alcance Móvel
**Alcance:** 9 km
**Guiagem:** Infravermelho (Sidewinder modificado)
**Velocidade:** Mach 2.5

**ANÁLISE PVO:**
Baseado no chassi do M113 (M548/M730). Torreta traseira com 4 mísseis Sidewinder (AIM-9D) expostos. O operador fica sentado dentro da torreta envidraçada entre os mísseis.'
WHERE name ILIKE '%CHAPARRAL%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: CROTALE
**Origem:** França
**Tipo:** SAM Móvel SHORAD
**Alcance:** 11 km
**Guiagem:** Comando Radioelétrico
**Velocidade:** Mach 2.3

**ANÁLISE PVO:**
Sistema em veículo 4x4 ou 6x6. Torreta com radar central e 2 ou 4 containers de mísseis de cada lado. Reação extremamente rápida (6 segundos). Versão naval e terrestre muito difundidas.'
WHERE name ILIKE '%CROTALE%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: MIM-23 HAWK
**Origem:** EUA
**Tipo:** SAM de Médio Alcance
**Alcance:** 45 - 50 km
**Guiagem:** Radar Semi-Ativo
**Velocidade:** Mach 2.4

**ANÁLISE PVO:**
Míssil icônico, rebocado em lançadores triplos (3 mísseis por lançador). Possui aletas trapezoidais longas que vão do meio até a cauda. Muito comum no ocidente.'
WHERE name ILIKE '%HAWK%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: MISTRAL
**Origem:** França
**Tipo:** VSHORAD (Curto Alcance)
**Alcance:** 6 km
**Guiagem:** Infravermelho Passivo
**Velocidade:** Mach 2.5

**ANÁLISE PVO:**
Disparado de tripé (posto de tiro simples) ou veículos (Atlas, Simbad). Míssil robusto com seeker piramidal. Operador senta "na" estrutura do lançador em montagens manuais.'
WHERE name ILIKE '%MISTRAL%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: RAPIER
**Origem:** Reino Unido
**Tipo:** SAM de Curto Alcance
**Alcance:** 6.8 km (8.2 km no FSC)
**Guiagem:** SACLOS Óptico/Radar (Blindfire)
**Velocidade:** Mach 2.5

**ANÁLISE PVO:**
Lançador com 4 mísseis pequenos montados em um "toca-fitas" giratório rebocado. Mísseis muito finos e rápidos. Usa impacto direto (hit-to-kill) em muitas versões.'
WHERE name ILIKE '%RAPIER%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: RBS 70
**Origem:** Suécia
**Tipo:** MANPADS (Sistema de Tripé)
**Alcance:** 8 km
**Guiagem:** Laser Beam Riding
**Velocidade:** Mach 2 (supersônico)

**ANÁLISE PVO:**
Imune a flares. O operador mantém o feixe laser no alvo. Míssil sai do tubo e abre aletas no meio e cauda. O tubo tem uma boca característica com formato "boca de sino" ou proteção quadrada.'
WHERE name ILIKE '%RBS 70%' OR name ILIKE '%RBS-70%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: FIM-43 REDEYE
**Origem:** EUA
**Tipo:** MANPADS (1ª Geração)
**Alcance:** 4.5 km
**Guiagem:** Infravermelho (Tail Chase)
**Velocidade:** Mach 1.7

**ANÁLISE PVO:**
O "pai" do Stinger. Tubo simples, seeker apenas para perseguição (requer ver o motor do alvo). Facilmente enganado, mas perigoso se não detectado.'
WHERE name ILIKE '%REDEYE%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: ROLAND
**Origem:** França / Alemanha
**Tipo:** SAM Móvel
**Alcance:** 6.3 km (Roland 2) a 8 km (Roland 3)
**Guiagem:** SACLOS (Radar ou Óptico)
**Velocidade:** Mach 1.6

**ANÁLISE PVO:**
Montado em blindado (Marder/AMX-30). Dois braços lançadores que recarregam automaticamente de um magazine interno. Míssil amarelado/branco característico.'
WHERE name ILIKE '%ROLAND%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: FIM-92 STINGER
**Origem:** EUA
**Tipo:** MANPADS
**Alcance:** 4.8 km
**Guiagem:** IR/UV (Dual Band)
**Velocidade:** Mach 2.2

**ANÁLISE PVO:**
Antena IFF "caixa de pizza" quadrada e dobrável é o maior identificador. Tubo curto e grosso. Capacidade de engajamento frontal e rejeição de flares avançada.'
WHERE name ILIKE '%STINGER%' OR name ILIKE '%FIM-92%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: SA-2 GUIDELINE (S-75)
**Origem:** URSS
**Tipo:** SAM de Alta Altitude
**Alcance:** 45 km
**Guiagem:** Rádio Comando
**Velocidade:** Mach 3.5

**ANÁLISE PVO:**
Míssil gigante de 2 estágios. Booster sólido na base com aletas grandes. Responsável pelo abate de U-2 e B-52. "Poste telefônico voador".'
WHERE name ILIKE '%SA-2%' OR name ILIKE '%GUIDELINE%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: SA-3 GOA (S-125)
**Origem:** URSS
**Tipo:** SAM Fixo de Curto/Médio Alcance
**Alcance:** 25 km
**Guiagem:** Rádio Comando
**Velocidade:** Mach 3

**ANÁLISE PVO:**
Lançador quádruplo ou duplo fixo no solo. Míssil com aletas retangulares grandes na parte traseira do booster. Eficaz contra alvos baixos.'
WHERE name ILIKE '%SA-3%' OR name ILIKE '%GOA%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: SA-6 GAINFUL (2K12 KUB)
**Origem:** URSS
**Tipo:** SAM Móvel
**Alcance:** 24 km
**Guiagem:** Radar Semi-Ativo
**Velocidade:** Mach 2.8

**ANÁLISE PVO:**
Veículo lagarta com 3 mísseis prontos. Mísseis têm entradas de ar para ramjet no meio do corpo, parecendo "braços". Muito perigoso e móvel.'
WHERE name ILIKE '%SA-6%' OR name ILIKE '%GAINFUL%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: SA-7 GRAIL (STRELA-2)
**Origem:** URSS
**Tipo:** MANPADS
**Alcance:** 3.7 km
**Guiagem:** Infravermelho
**Velocidade:** Mach 1.5

**ANÁLISE PVO:**
Bateria térmica cilíndrica simples "lata de refrigerante" abaixo da frente do tubo. Apenas engajamento traseiro (tail-chase).'
WHERE name ILIKE '%SA-7%' OR name ILIKE '%GRAIL%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: SA-9 GASKIN (STRELA-1)
**Origem:** URSS
**Tipo:** SAM Móvel BRDM-2
**Alcance:** 4.2 km
**Guiagem:** Infravermelho (Fotocontraste)
**Velocidade:** Mach 1.5

**ANÁLISE PVO:**
Veículo 4x4 (BRDM-2) com 4 mísseis em caixas/canisters no teto. As caixas são levantadas para disparo. Míssil é uma versão ampliada do SA-7.'
WHERE name ILIKE '%SA-9%' OR name ILIKE '%GASKIN%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: SA-13 GOPHER (STRELA-10)
**Origem:** URSS
**Tipo:** SAM Móvel MT-LB
**Alcance:** 5 km
**Guiagem:** Infravermelho / Fotocontraste
**Velocidade:** Mach 2

**ANÁLISE PVO:**
Sucessor do SA-9, montado em blindado de lagartas (MT-LB). 4 mísseis em caixas retangulares maiores. Possui radar de telemetria entre os mísseis.'
WHERE name ILIKE '%SA-13%' OR name ILIKE '%GOPHER%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: SA-14 GREMLIN (STRELA-3)
**Origem:** URSS
**Tipo:** MANPADS
**Alcance:** 4.5 km
**Guiagem:** Infravermelho (Resfriado)
**Velocidade:** Mach 1.7

**ANÁLISE PVO:**
Bateria é uma esfera (bola) de gás comprimido sob o tubo, diferente do cilindro do SA-7. Permite engajamento frontal limitado.'
WHERE name ILIKE '%SA-14%' OR name ILIKE '%GREMLIN%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: SA-15 GAUNTLET (TOR-M1)
**Origem:** Rússia
**Tipo:** SAM Móvel Vertical
**Alcance:** 12 km
**Guiagem:** Rádio Comando
**Velocidade:** Mach 2.8

**ANÁLISE PVO:**
Veículo com radar de busca rotativo e radar de engajamento frontal (phased array). Mísseis lançados verticalmente "a frio" de dentro da torre (VLS).'
WHERE name ILIKE '%SA-15%' OR name ILIKE '%TOR%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: SA-16/18 (IGLA)
**Origem:** Rússia
**Tipo:** MANPADS Moderno
**Alcance:** 5.2 km
**Guiagem:** IR/UV
**Velocidade:** Mach 1.9

**ANÁLISE PVO:**
Tubo cônico na ponta ("aerospike" no míssil, tubo alarga na frente). O mais letal MANPADS soviético/russo. Resistente a contramedidas.'
WHERE name ILIKE '%SA-16%' OR name ILIKE '%IGLA%' OR name ILIKE '%SA-18%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: SA-19 GRISON (2K22 TUNGUSKA)
**Origem:** Rússia
**Tipo:** SPAAGM (Canhão + Míssil)
**Alcance:** 8-10 km (Míssil) / 4 km (Canhão)
**Guiagem:** SACLOS Óptico/Radar
**Velocidade:** Mach 2.5

**ANÁLISE PVO:**
Sistema Híbrido: 2 canhões de 30mm e 8 mísseis (4 de cada lado). Radar de busca no topo e radar de tiro na frente. Protege colunas blindadas.'
WHERE name ILIKE '%SA-19%' OR name ILIKE '%TUNGUSKA%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: SEA DART
**Origem:** Reino Unido
**Tipo:** SAM Naval
**Alcance:** 75 km
**Guiagem:** Radar Semi-Ativo
**Velocidade:** Mach 3

**ANÁLISE PVO:**
Lançador duplo. Míssil com frente aberta (entrada de ar ramjet). Usado nos destróieres Type 42 e Invincible.'
WHERE name ILIKE '%SEA DART%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: SEA WOLF
**Origem:** Reino Unido
**Tipo:** SAM Naval Antimíssil (CIWS)
**Alcance:** 6-10 km
**Guiagem:** CLOS / Radar
**Velocidade:** Mach 3

**ANÁLISE PVO:**
Lançador sêxtuplo (6 tubos) rechonchudo. Projetado para abater mísseis antinavio e aeronaves em mergulho. Muito ágil.'
WHERE name ILIKE '%SEA WOLF%' OR name ILIKE '%SEAWOLF%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: SEA CAT / TIGERCAT
**Origem:** Reino Unido
**Tipo:** SAM Naval/Terrestre
**Alcance:** 5-6 km
**Guiagem:** CLOS (Visual/Radar)
**Velocidade:** Mach 0.9 (Subsônico)

**ANÁLISE PVO:**
Míssil curto e grosso, subsônico. Visualmente parece um "barril voador" com asas grandes. Obsoleto.'
WHERE name ILIKE '%SEA CAT%' OR name ILIKE '%SEACAT%' OR name ILIKE '%TIGERCAT%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: SA-N-4 (OSA-M)
**Origem:** URSS
**Tipo:** SAM Naval
**Alcance:** 15 km
**Guiagem:** Comando
**Velocidade:** Mach 2.5

**ANÁLISE PVO:**
Versão naval do SA-8 Gecko. Lançador duplo retrátil (pop-up) que fica escondido num silo redondo no convés ("binóculos").'
WHERE name ILIKE '%SA-N-4%' OR name ILIKE '%OSA-M%';

-- ==========================================
-- PARTE 2: MÍSSEIS ANTITANQUE (ATGM)
-- ==========================================

UPDATE equipment SET description = '## DADOS TÉCNICOS: COBRA 2000
**Origem:** Alemanha
**Tipo:** ATGM
**Alcance:** 2 km
**Guiagem:** MCLOS (Manual - Fio)
**Velocidade:** 85 m/s

**ANÁLISE PVO:**
Míssil antigo de primeira geração. O operador controla o voo com um joystick. Necessita muita prática.'
WHERE name ILIKE '%COBRA 2000%' OR name ILIKE '%COBRA%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: ERYX
**Origem:** França
**Tipo:** ATGM Curto Alcance
**Alcance:** 600m
**Guiagem:** SACLOS (Fio)
**Velocidade:** 240 m/s

**ANÁLISE PVO:**
Míssil pesado de infantaria para curto alcance. Pode ser disparado de ombro ou tripé mini. Motor de "lançamento suave" permite disparo de locais fechados.'
WHERE name ILIKE '%ERYX%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: HOT
**Origem:** França/Alemanha
**Tipo:** ATGM Longo Alcance
**Alcance:** 4000m
**Guiagem:** SACLOS (Fio)
**Velocidade:** 250 m/s

**ANÁLISE PVO:**
Grande míssil, geralmente veicular ou em helicópteros. Tubos largos.'
WHERE name ILIKE '%HOT%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: MAMBA
**Origem:** Alemanha
**Tipo:** ATGM
**Alcance:** 2 km
**Guiagem:** MCLOS (Fio)
**Velocidade:** 140 m/s

**ANÁLISE PVO:**
Desenvolvimento do Cobra. Ainda guiagem manual, requer habilidade. Lançado do solo.'
WHERE name ILIKE '%MAMBA%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: MATHOGO
**Origem:** Argentina
**Tipo:** ATGM
**Alcance:** 2 - 3 km
**Guiagem:** MCLOS / SACLOS
**Velocidade:** Lento

**ANÁLISE PVO:**
Míssil antitanque argentino. Similar aos modelos de primeira geração europeus. Pouco comum.'
WHERE name ILIKE '%MATHOGO%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: MILAN
**Origem:** França/Alemanha
**Tipo:** ATGM Médio
**Alcance:** 2000m (Base) a 3000m (ER)
**Guiagem:** SACLOS (Fio)
**Velocidade:** 200 m/s

**ANÁLISE PVO:**
Lançador de infantaria mais comum da OTAN. Tripé baixo, tubo sobre a mira. MIRA térmica "MIRA" grande pode ser acoplada em cima.'
WHERE name ILIKE '%MILAN%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: RBS 56 BILL
**Origem:** Suécia
**Tipo:** ATGM Top-Attack
**Alcance:** 2.2 km
**Guiagem:** SACLOS (Fio)
**Velocidade:** 250 m/s

**ANÁLISE PVO:**
Voa 1 metro acima da linha de visada. A ogiva detona para baixo (Top Attack) perfurando o teto do tanque. Tubo lançador tem uma "testa" grande (óptica na frente).'
WHERE name ILIKE '%RBS 56%' OR name ILIKE '%BILL%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: AT-1 SNAPPER (3M6 SHMEL)
**Origem:** URSS
**Tipo:** ATGM
**Alcance:** 2.3 km
**Guiagem:** MCLOS (Fio)
**Velocidade:** 100 m/s

**ANÁLISE PVO:**
O "avô" dos mísseis russos. Asas grandes, parece um aviãozinho. Lançado de veículos como o GAZ-69 (jipe) com 4 trilhos traseiros.'
WHERE name ILIKE '%SNAPPER%' OR name ILIKE '%AT-1%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: AT-3 SAGGER (9M14 Malyutka)
**Origem:** URSS
**Tipo:** ATGM
**Alcance:** 3 km
**Guiagem:** MCLOS (Manual)
**Velocidade:** 115 m/s

**ANÁLISE PVO:**
Míssil minúsculo, o operador usa um joystick e um periscópio. Voo lento e errático. Famoso na Guerra do Yom Kippur.'
WHERE name ILIKE '%SAGGER%' OR name ILIKE '%AT-3%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: BGM-71 TOW
**Origem:** EUA
**Tipo:** ATGM Pesado
**Alcance:** 3.75 km
**Guiagem:** SACLOS (Fio)
**Velocidade:** 300 m/s

**ANÁLISE PVO:**
Grande tubo, tripé pesado ou veicular. Operador olha pela mira óptica e mantém a cruz no alvo.'
WHERE name ILIKE '%TOW%' OR name ILIKE '%BGM-71%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: TOW MAPATS
**Origem:** Israel (IAI)
**Tipo:** ATGM Laser
**Alcance:** 5 km
**Guiagem:** Laser Beam Riding
**Velocidade:** 315 m/s

**ANÁLISE PVO:**
Versão israelense do TOW, porém guiado a laser (sem fios). Pode voar sobre água. Visualmente muito parecido com o TOW americano.'
WHERE name ILIKE '%MAPATS%';

-- ==========================================
-- PARTE 3: MÍSSEIS ANTINAVIO (AShM)
-- ==========================================

UPDATE equipment SET description = '## DADOS TÉCNICOS: EXOCET MM38 / MM40
**Origem:** França
**Tipo:** Míssil Antinavio
**Alcance:** 40km (MM38) / 70km+ (MM40)
**Guiagem:** Radar Ativo (Sea Skimming)
**Velocidade:** Mach 0.9

**ANÁLISE PVO:**
MM38 tem asas grandes e caixa lançadora quadrada ("caixote"). MM40 tem tubo cilíndrico e asas menores. Voo rasante indetectável até o último momento.'
WHERE name ILIKE '%EXOCET%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: HARPON (SS-11)
**Origem:** França
**Tipo:** ATGM / AShM Leve
**Alcance:** 3 km
**Guiagem:** MCLOS (Fio)
**Velocidade:** 190 m/s

**ANÁLISE PVO:**
Originalmente antitanque, usado como antinavio leve em barcos patrulha. Guiagem manual antiga.'
WHERE name ILIKE '%HARPON%' OR name ILIKE '%SS-11%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: OTOMAT
**Origem:** Itália/França
**Tipo:** AShM Longo Alcance
**Alcance:** 180 km+
**Guiagem:** Radar Ativo + Datalink
**Velocidade:** Mach 0.9

**ANÁLISE PVO:**
Possui boosters laterais ao corpo do míssil (não atrás). Pode atacar em alta inclinação no final (pop-up). Muito potente.'
WHERE name ILIKE '%OTOMAT%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: SEA SKUA
**Origem:** Reino Unido
**Tipo:** AShM Leve (Helicóptero)
**Alcance:** 25 km
**Guiagem:** Radar Semi-Ativo
**Velocidade:** Mach 0.8

**ANÁLISE PVO:**
Míssil pequeno levado por helicópteros Lynx. Usado com sucesso nas Malvinas e no Golfo. Nariz pontudo preto (radar).'
WHERE name ILIKE '%SEA SKUA%' OR name ILIKE '%SKUA%';

UPDATE equipment SET description = '## DADOS TÉCNICOS: SS-N-2 STYX (P-15 Termit)
**Origem:** URSS
**Tipo:** AShM Pesado
**Alcance:** 80 km
**Guiagem:** Radar Ativo / IR
**Velocidade:** Mach 0.9

**ANÁLISE PVO:**
Míssil enorme, parece um avião pequeno. Lançado de grandes hangares em barcos lança-mísseis (Osa/Komar). Carga explosiva devastadora.'
WHERE name ILIKE '%SS-N-2%' OR name ILIKE '%STYX%';
