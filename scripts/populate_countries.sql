-- ADICIONA PAÍSES FALTANTES (G20 + POTÊNCIAS MILITARES)
-- Execute este script no SQL Editor do Supabase

INSERT INTO countries (name, code, code_2, region, capital, continent, flag_url, alliance, military_rank)
VALUES 
('Rússia', 'RUS', 'RU', 'Eastern Europe', 'Moscow', 'Europe', 'https://flagcdn.com/w320/ru.png', 'CSTO', 2),
('Alemanha', 'DEU', 'DE', 'Western Europe', 'Berlin', 'Europe', 'https://flagcdn.com/w320/de.png', 'NATO', 7),
('Reino Unido', 'GBR', 'GB', 'Northern Europe', 'London', 'Europe', 'https://flagcdn.com/w320/gb.png', 'NATO', 5),
('França', 'FRA', 'FR', 'Western Europe', 'Paris', 'Europe', 'https://flagcdn.com/w320/fr.png', 'NATO', 9),
('Itália', 'ITA', 'IT', 'Southern Europe', 'Rome', 'Europe', 'https://flagcdn.com/w320/it.png', 'NATO', 10),
('Ucrânia', 'UKR', 'UA', 'Eastern Europe', 'Kyiv', 'Europe', 'https://flagcdn.com/w320/ua.png', 'NATO Partner', 15),
('Venezuela', 'VEN', 'VE', 'South America', 'Caracas', 'South America', 'https://flagcdn.com/w320/ve.png', 'Non-Aligned', 45),
('Argentina', 'ARG', 'AR', 'South America', 'Buenos Aires', 'South America', 'https://flagcdn.com/w320/ar.png', 'Non-Aligned', 40),
('Colômbia', 'COL', 'CO', 'South America', 'Bogotá', 'South America', 'https://flagcdn.com/w320/co.png', 'Major Non-NATO Ally', 42),
('Irã', 'IRN', 'IR', 'Middle East', 'Tehran', 'Asia', 'https://flagcdn.com/w320/ir.png', 'Resistance Axis', 14),
('Israel', 'ISR', 'IL', 'Middle East', 'Jerusalem', 'Asia', 'https://flagcdn.com/w320/il.png', 'Major Non-NATO Ally', 18),
('Coreia do Norte', 'PRK', 'KP', 'East Asia', 'Pyongyang', 'Asia', 'https://flagcdn.com/w320/kp.png', 'Non-Aligned', 30),
('Coreia do Sul', 'KOR', 'KR', 'East Asia', 'Seoul', 'Asia', 'https://flagcdn.com/w320/kr.png', 'Major Non-NATO Ally', 6),
('Japão', 'JPN', 'JP', 'East Asia', 'Tokyo', 'Asia', 'https://flagcdn.com/w320/jp.png', 'Major Non-NATO Ally', 8),
('Índia', 'IND', 'IN', 'South Asia', 'New Delhi', 'Asia', 'https://flagcdn.com/w320/in.png', 'BRICS', 4),
('Austrália', 'AUS', 'AU', 'Oceania', 'Canberra', 'Oceania', 'https://flagcdn.com/w320/au.png', 'AUKUS', 13),
('Canadá', 'CAN', 'CA', 'North America', 'Ottawa', 'North America', 'https://flagcdn.com/w320/ca.png', 'NATO', 27)
ON CONFLICT (code) DO NOTHING;

-- UPDATE EXISTING TO MATCH NEW STYLE
UPDATE countries SET alliance = 'BRICS', military_rank = 12 WHERE code = 'BRA';
UPDATE countries SET alliance = 'NATO', military_rank = 1 WHERE code = 'USA';
UPDATE countries SET alliance = 'Shanghai Pact', military_rank = 3 WHERE code = 'CHN';
