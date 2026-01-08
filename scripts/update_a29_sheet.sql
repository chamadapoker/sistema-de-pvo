-- ATUALIZAÇÃO FICHA TÉCNICA: A29 SUPER TUCANO
-- Execute este script no SQL Editor do Supabase

UPDATE equipment 
SET description = '## DADOS TÉCNICOS: A-29 SUPER TUCANO
**Origem:** Brasil (Embraer)
**Tipo:** Aeronave de Ataque Leve / COIN / Treinamento
**Alcance:** 1.330 km (Raio de Combate)
**Armamento:** 2x .50 internas + 5 pontos duros (Bombas, Foguetes, Mísseis Piranha/Sidewinder)
**Velocidade:** 590 km/h

**ANÁLISE PVO:**
Turboélice de asa baixa com cockpit em bolha para excelente visibilidade. Nariz longo característico. Diferencial principal: capacidade de operar em pistas improvisadas e interceptar aeronaves de baixa performance (Lei do Abate). Assinatura térmica menor que jatos, dificultando engajamento por MANPADS antigos.'
WHERE name ILIKE '%A29%' OR name ILIKE '%A-29%' OR name ILIKE '%SUPER TUCANO%';
