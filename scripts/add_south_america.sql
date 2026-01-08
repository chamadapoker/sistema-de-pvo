-- ADICIONAR PAÍSES DA AMÉRICA DO SUL FALTANTES
INSERT INTO countries (name, code, code_2, region, capital, continent, flag_url, alliance, military_rank)
VALUES 
('Paraguai', 'PRY', 'PY', 'South America', 'Asunción', 'South America', 'https://flagcdn.com/w320/py.png', 'Non-Aligned', 80),
('Peru', 'PER', 'PE', 'South America', 'Lima', 'South America', 'https://flagcdn.com/w320/pe.png', 'Major Non-NATO Ally', 45),
('Uruguai', 'URY', 'UY', 'South America', 'Montevideo', 'South America', 'https://flagcdn.com/w320/uy.png', 'Major Non-NATO Ally', 85),
('Chile', 'CHL', 'CL', 'South America', 'Santiago', 'South America', 'https://flagcdn.com/w320/cl.png', 'Non-Aligned', 50),
('Bolívia', 'BOL', 'BO', 'South America', 'Sucre', 'South America', 'https://flagcdn.com/w320/bo.png', 'Non-Aligned', 75),
('Equador', 'ECU', 'EC', 'South America', 'Quito', 'South America', 'https://flagcdn.com/w320/ec.png', 'Non-Aligned', 65),
('Guiana', 'GUY', 'GY', 'South America', 'Georgetown', 'South America', 'https://flagcdn.com/w320/gy.png', 'Commonwealth', 130),
('Suriname', 'SUR', 'SR', 'South America', 'Paramaribo', 'South America', 'https://flagcdn.com/w320/sr.png', 'CARICOM', 135)
ON CONFLICT (code) DO NOTHING;

-- NOTA: Guiana Francesa não é um país independente (é parte da França), 
-- mas podemos adicioná-la se o user quiser especificamente, porém geralmente não tem código ISO 3 independente na maioria dos datasets militares.
-- Usaremos o código GUF se necessário, mas tratado como território.
INSERT INTO countries (name, code, code_2, region, capital, continent, flag_url, alliance, military_rank)
VALUES ('Guiana Francesa', 'GUF', 'GF', 'South America', 'Cayenne', 'South America', 'https://flagcdn.com/w320/gf.png', 'NATO (France)', 999)
ON CONFLICT (code) DO NOTHING;
