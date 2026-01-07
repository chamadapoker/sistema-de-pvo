-- ============================================
-- ATUALIZAÇÃO DE INTELIGÊNCIA TÉCNICA (TOW / MAPATS)
-- ============================================

UPDATE equipment
SET description = 
'## DADOS TÉCNICOS: TOW (BGM-71) / MAPATS
**Origem:** EUA (Hughes/Raytheon) / Israel (IMI)
**Tipo:** Míssil Antitanque de Superfície
**Guiagem:** TOW: SACLOS via Fio (Wire-guided) | MAPATS: Laser Beam Riding
**Alcance Máximo:** TOW: 3.750m | MAPATS: 5.000m
**Velocidade:** TOW: Mach 0.58 (Subsônico) | MAPATS: Mach 0.91 (Transônico)
**Dimensões:** Comp: 1.17m (TOW) / 1.45m (MAPATS) | Diâmetro: 152mm
**Ogiva:** Carga Oca (HEAT) - Versões modernas possuem ogiva Tandem contra ERA

**OPERADORES NA REGIÃO:**
**TOW:** Argentina, Colômbia.
**MAPATS:** Chile, Venezuela.

**ANÁLISE PVO:**
Embora visualmente semelhantes no tubo lançador, são sistemas distintos. O TOW requer que o atirador mantenha a mira no alvo e o míssil é guiado por fios desenrolados em voo. O MAPATS (Hutra) elimina os fios, usando um feixe laser que o míssil "cavalga" até o alvo, permitindo maior velocidade e imunidade a cortes de fio em terreno de selva ou água.'
WHERE name LIKE '%TOW%' OR name LIKE '%MAPATS%' OR name LIKE '%BGM-71%';

SELECT '✅ Ficha Técnica do TOW/MAPATS gerada e aplicada com sucesso!' as result;
