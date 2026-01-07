-- ============================================
-- ATUALIZAÇÃO EM MASSA - LOTE 1 (SISTEMAS ANTIAÉREOS E ANTICARRO PRINCIPAIS)
-- ============================================

-- 1. MISTRAL (França)
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: MISTRAL
**Origem:** França (MBDA)
**Tipo:** MANPADS / VSHORAD
**Alcance:** 500m a 6.000m
**Altitude:** Até 3.000m
**Velocidade:** Mach 2.5 (Supersônico)
**Guiagem:** Infravermelho Passivo (Matriz Focal)
**Ogiva:** 3kg Alto Explosiva com esferas de tungstênio (Laser Proximity)

**ANÁLISE PVO:**
Diferente da maioria dos MANPADS, o Mistral é geralmente disparado de um tripé ou reparo veicular devido ao seu peso (míssil + tubo ~20kg). Possui altíssima manobrabilidade (30G) e velocidade superior aos concorrentes da mesma geração (Stinger/Igla).'
WHERE name LIKE '%MISTRAL%';

-- 2. RBS 70 (Suécia)
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: RBS 70
**Origem:** Suécia (Saab Bofors)
**Tipo:** MANPADS (Bolt-on) / VSHORAD
**Alcance:** 8km (Mk 2) a 9km (Bolide)
**Altitude:** 5.000m
**Velocidade:** Mach 2.0
**Guiagem:** Laser Beam Riding (O míssil "cavalga" um feixe de laser)
**Resistência:** Imune a Flares e interferência eletrônica (Jamming)

**ANÁLISE PVO:**
Único em sua categoria por usar guiagem a laser em vez de infravermelho. Isso o torna impossível de enganar com Flares. O operador precisa manter o alvo na mira até o impacto. Possui ogiva de carga oca, sendo eficaz também contra veículos blindados leves.'
WHERE name LIKE '%RBS 70%' OR name LIKE '%RBS-70%';

-- 3. MILAN (França/Alemanha)
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: MILAN
**Origem:** Consórcio Euromissile (França/Alemanha)
**Tipo:** Míssil Antitanque (Infantaria)
**Alcance:** 200m a 2.000m (3.000m no Milan ER)
**Guiagem:** SACLOS via Fio
**Penetração:** > 600mm (Milan 2) / > 1000mm (Milan 3 Tandem)
**Cadência:** 3 a 4 disparos por minuto

**ANÁLISE PVO:**
O padrão ouro dos mísseis anticarro ocidentais por décadas. Opera com tubo descartável e posto de tiro reutilizável (MIRA para visão noturna). O míssil gira em voo e é reconhecido pelo seu traçador infravermelho na cauda.'
WHERE name LIKE '%MILAN%';

-- 4. HOT (França/Alemanha)
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: HOT
**Origem:** Consórcio Euromissile
**Tipo:** Míssil Antitanque Pesado (Veicular/Helicóptero)
**Alcance:** 75m a 4.000m
**Guiagem:** SACLOS via Fio
**Velocidade:** 240 m/s
**Penetração:** 1.300mm (HOT 3 Tandem)
**Plataformas:** Helicópteros Gazelle, Tiger, veículos blindados

**ANÁLISE PVO:**
Irmão maior do Milan, projetado para ser disparado de veículos e helicópteros. Possui ogiva poderosa capaz de destruir qualquer MBT moderno não equipado com sistemas de defesa ativa.'
WHERE name LIKE '%HOT%' AND description IS NULL; -- Evitar conflito com palavras comuns se houver

-- 5. AT-3 SAGGER (9M14 Malyutka)
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: AT-3 SAGGER (Malyutka)
**Origem:** URSS / Rússia
**Tipo:** Míssil Antitanque (1ª Geração)
**Alcance:** 500m a 3.000m
**Guiagem:** MCLOS (Manual - Joystick) nas versões iniciais; SACLOS nas modernas.
**Velocidade:** Lenta (115 m/s) - Tempo de voo longo.
**Operadores:** Amplamente difundido globalmente.

**ANÁLISE PVO:**
Famoso pela Guerra do Yom Kippur (1973). Nas versões manuais (MCLOS), exige muito treinamento do operador, que pilota o míssil com um joystick. É facilmente identificável pelo voo lento e errático e fumaça visível.'
WHERE name LIKE '%SAGGER%' OR name LIKE '%AT-3%' OR name LIKE '%MALYUTKA%';

-- 6. SA-7 GRAIL (9K32 Strela-2)
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: SA-7 GRAIL (Strela-2)
**Origem:** URSS
**Tipo:** MANPADS (1ª Geração)
**Alcance:** 3.700m
**Altitude Prática:** 1.500m
**Guiagem:** IR (Busca de Calor) - Apenas aspecto traseiro (Tail Chase)
**Limitação:** Baixa resistência a flares e sol.

**ANÁLISE PVO:**
O "AK-47" dos mísseis antiaéreos. Só consegue engajar jatos se disparado por trás (perseguindo o motor). Helicópteros podem ser engajados de frente se não tiverem supressores de calor.'
WHERE name LIKE '%SA-7%' OR name LIKE '%STRELA-2%' OR name LIKE '%GRAIL%' OR name LIKE '%SA 7%';

-- 7. FIM-92 STINGER
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: FIM-92 STINGER
**Origem:** EUA (Raytheon)
**Tipo:** MANPADS
**Alcance:** 4.800m
**Altitude:** 3.800m
**Velocidade:** Mach 2.5
**Guiagem:** IR/UV (Dual Band) - Rosette Scan
**Letalidade:** Ogiva de fragmentação anular (Hit-to-Kill)

**ANÁLISE PVO:**
Tornou-se famoso no Afeganistão. Seu sensor de banda dupla (Infravermelho e Ultravioleta) o torna extremamente difícil de enganar com Flares comuns, pois ele distingue o alvo real da isca pela assinatura UV ("sombra" contra o céu).'
WHERE name LIKE '%STINGER%' OR name LIKE '%FIM-92%';

-- 8. ROLAND
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: ROLAND
**Origem:** França/Alemanha
**Tipo:** SAM Móvel de Curto Alcance (SHORAD)
**Alcance:** 6.300m (Roland 2) a 8.000m (Roland 3)
**Altitude:** 5.500m
**Guiagem:** SACLOS (Radar ou Óptico) - Radio Command
**Plataforma:** Marder, AMX-30, Caminhões 6x6

**ANÁLISE PVO:**
Sistema de defesa de ponto altamente móvel. Opera em modo "clear weather" (óptico) ou "all weather" (radar), onde o radar de rastreio guia o míssil automaticamente até o alvo.'
WHERE name LIKE '%ROLAND%';

-- 9. CROTALE
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: CROTALE / CROTALE NG
**Origem:** França (Thales)
**Tipo:** SAM Móvel de Curto Alcance
**Alcance:** 11km (NG - VT1) a 15km (Mk3)
**Velocidade:** Mach 3.5
**Guiagem:** Radar de Comando e Eletro-Óptico
**Reação:** Tempo de reação muito curto (4-6 segundos)

**ANÁLISE PVO:**
Projetado para interceptar alvos a baixa altitude e alta velocidade, incluindo mísseis cruise e aeronaves táticas. O míssil VT-1 é extremamente rápido, dando pouco tempo de evasão ao alvo.'
WHERE name LIKE '%CROTALE%';

-- 10. MIM-72 CHAPARRAL
UPDATE equipment SET description = 
'## DADOS TÉCNICOS: MIM-72 CHAPARRAL
**Origem:** EUA
**Tipo:** SAM Móvel (Baseado no Sidewinder)
**Alcance:** 9.000m
**Guiagem:** Infravermelho (Passivo)
**Plataforma:** Veículo M113 modificado (M730)

**ANÁLISE PVO:**
Basicamente mísseis ar-ar Sidewinder (AIM-9) adaptados para lançamento terrestre. Não possui radar de guiagem próprio (apenas aquisição), dependendo do sensor IR do míssil para o engajamento final. A fumaça do disparo é característica (muito visível).'
WHERE name LIKE '%CHAPARRAL%';

SELECT '✅ Lote 1 (10 principais sistemas) atualizado com sucesso!' as result;
