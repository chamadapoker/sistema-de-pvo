-- ============================================
-- ATUALIZAÇÃO DE INTELIGÊNCIA TÉCNICA (RBS 56 & EXOCET)
-- ============================================

-- 1. BILL / RBS 56 (Anti-Tanque Sueco)
UPDATE equipment
SET description = 
'## DADOS TÉCNICOS: RBS 56 BILL
**Origem:** Suécia (Bofors)
**Tipo:** Míssil Anti-Carro Guiado (ATGM)
**Alcance:** 150m a 2.200m
**Guiagem:** SACLOS (Semi-Active Command to Line of Sight) por fio
**Ogiva:** Carga Oca Dupla (Tandem) - Ataque Superior (Top Attack)
**Peso do Míssil:** 10.5 kg (Sistema completo: 36 kg)
**Penetração:** > 500mm RHA + ERA (Blindagem Reativa)

**ANÁLISE PVO:**
O RBS 56 BILL revolucionou o combate anti-tanque com seu perfil de voo "Overfly Top Attack". O míssil voa 0.75m acima da linha de visada e detona sua ogiva inclinada para baixo ao passar sobre a torre do alvo, atingindo a blindagem mais fina do tanque. É letal contra alvos em posição de tiro (hull-down).'
WHERE name LIKE '%RBS 56%' OR name LIKE '%BILL%';

-- 2. EXOCET MM40 (Míssil Anti-Navio Francês)
UPDATE equipment
SET description = 
'## DADOS TÉCNICOS: EXOCET MM40
**Origem:** França (MBDA)
**Tipo:** Míssil Anti-Navio de Superfície
**Alcance:** 70km (Block 2) a 200km (Block 3/3c)
**Velocidade:** Mach 0.93 (Subsônico alto)
**Guiagem:** Inercial + Radar Ativo na fase final (Sea Skimming)
**Ogiva:** 165 kg Semi-Perfurante Alto Explosiva
**Peso:** 870 kg

**ANÁLISE PVO:**
Um dos mísseis navais mais provados em combate da história. Voa rente à água (Sea Skimming) a menos de 2 metros de altura na fase final, dificultando a detecção por radares inimigos até os últimos segundos. Possui capacidades avançadas de manobra terminal para evasão de CIWS.'
WHERE name LIKE '%EXOCET%' OR name LIKE '%MM40%' OR name LIKE '%MM 40%';

-- 3. IGLA / SA-18 / SA-16 (MANPADS Russo)
UPDATE equipment
SET description = 
'## DADOS TÉCNICOS: 9K38 IGLA (SA-18 GROUSE)
**Origem:** Rússia / URSS
**Tipo:** MANPADS (Míssil Antiaéreo Portátil)
**Alcance:** 500m a 5.200m
**Altitude:** 10m a 3.500m
**Velocidade:** Mach 1.9
**Guiagem:** Infravermelho Passivo (Busca de Calor) Dual-Band
**Peso de Combate:** 17.9 kg (Míssil + Tubo)

**ANÁLISE PVO:**
Sucessor do SA-7 e SA-14, o IGLA possui seeker refrigerado a nitrogênio líquido, tornando-o muito mais resistente a Flares e interferências (IRCM). Possui espoleta de contato e de proximidade magnética, sendo letal contra caças, helicópteros e drones em baixa altitude.'
WHERE name LIKE '%IGLA%' OR name LIKE '%SA 18%' OR name LIKE '%SA-18%' OR name LIKE '%SA 16%';

SELECT '✅ Dados de Inteligência atualizados para RBS 56, Exocet e Igla!' as result;
