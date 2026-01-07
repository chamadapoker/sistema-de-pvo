-- ============================================
-- SISTEMA DE PAÍSES - PVO POKER
-- Estudo de equipamentos militares por país operador
-- ============================================

-- 1. Tabela de Países
CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  name VARCHAR(255) NOT NULL UNIQUE,
  code VARCHAR(3) NOT NULL UNIQUE, -- ISO 3166-1 alpha-3 (BRA, USA, RUS, etc)
  code_2 VARCHAR(2) NOT NULL, -- ISO 3166-1 alpha-2 (BR, US, RU)
  
  -- Geografia
  region VARCHAR(100), -- South America, Europe, Asia, etc
  capital VARCHAR(255),
  continent VARCHAR(50),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Dados Demográficos
  population BIGINT,
  area_km2 BIGINT,
  languages TEXT[], -- Array de idiomas
  currency_code VARCHAR(3),
  currency_name VARCHAR(100),
  
  -- Dados Militares
  military_budget_usd BIGINT, -- Orçamento militar anual
  active_military INTEGER, -- Militares ativos
  reserve_military INTEGER, -- Reservistas
  military_rank INTEGER, -- Ranking militar global (1-140)
  
  -- Visual
  flag_url TEXT, -- URL da bandeira
  coat_of_arms_url TEXT, -- URL do brasão
  
  -- Informações
  description TEXT, -- Descrição do país
  military_description TEXT, -- Descrição das forças armadas
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Equipamentos por País (Operadores)
CREATE TABLE IF NOT EXISTS country_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  
  -- Detalhes operacionais
  quantity INTEGER, -- Quantidade em operação
  status VARCHAR(50), -- "ACTIVE", "RESERVE", "RETIRED", "ORDERED"
  year_acquired INTEGER, -- Ano de aquisição
  variant VARCHAR(255), -- Variante específica (ex: "F-16C Block 50")
  notes TEXT, -- Notas adicionais
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(country_id, equipment_id)
);

-- 3. Índices
CREATE INDEX IF NOT EXISTS idx_countries_code ON countries(code);
CREATE INDEX IF NOT EXISTS idx_countries_region ON countries(region);
CREATE INDEX IF NOT EXISTS idx_countries_military_rank ON countries(military_rank);
CREATE INDEX IF NOT EXISTS idx_country_equipment_country ON country_equipment(country_id);
CREATE INDEX IF NOT EXISTS idx_country_equipment_equipment ON country_equipment(equipment_id);
CREATE INDEX IF NOT EXISTS idx_country_equipment_status ON country_equipment(status);

-- 4. Trigger para updated_at
CREATE OR REPLACE FUNCTION update_countries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_countries_updated_at ON countries;
CREATE TRIGGER update_countries_updated_at
    BEFORE UPDATE ON countries
    FOR EACH ROW
    EXECUTE FUNCTION update_countries_updated_at();

-- 5. Row Level Security
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_equipment ENABLE ROW LEVEL SECURITY;

-- Todos podem ler
DROP POLICY IF EXISTS "Anyone can view countries" ON countries;
CREATE POLICY "Anyone can view countries"
  ON countries FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can view country equipment" ON country_equipment;
CREATE POLICY "Anyone can view country equipment"
  ON country_equipment FOR SELECT
  USING (true);

-- Apenas admins podem modificar
DROP POLICY IF EXISTS "Admins can manage countries" ON countries;
CREATE POLICY "Admins can manage countries"
  ON countries FOR ALL
  USING (auth.jwt() ->> 'role' = 'ADMIN');

DROP POLICY IF EXISTS "Admins can manage country equipment" ON country_equipment;
CREATE POLICY "Admins can manage country equipment"
  ON country_equipment FOR ALL
  USING (auth.jwt() ->> 'role' = 'ADMIN');

-- 6. Funções Úteis

-- Obter países com mais equipamentos
CREATE OR REPLACE FUNCTION get_top_military_countries(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  country_id UUID,
  country_name TEXT,
  country_code TEXT,
  flag_url TEXT,
  total_equipment BIGINT,
  military_budget_usd BIGINT,
  active_military INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.code,
    c.flag_url,
    COUNT(ce.id) as total_equipment,
    c.military_budget_usd,
    c.active_military
  FROM countries c
  LEFT JOIN country_equipment ce ON ce.country_id = c.id
  GROUP BY c.id
  ORDER BY total_equipment DESC, c.military_budget_usd DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Obter equipamentos de um país
CREATE OR REPLACE FUNCTION get_country_equipment_details(country_uuid UUID)
RETURNS TABLE (
  equipment_id UUID,
  equipment_name TEXT,
  equipment_code TEXT,
  equipment_category TEXT,
  quantity INTEGER,
  status TEXT,
  year_acquired INTEGER,
  variant TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.name,
    e.code,
    cat.name as category,
    ce.quantity,
    ce.status,
    ce.year_acquired,
    ce.variant
  FROM country_equipment ce
  JOIN equipment e ON e.id = ce.equipment_id
  LEFT JOIN categories cat ON cat.id = e.category_id
  WHERE ce.country_id = country_uuid
  ORDER BY cat.name, e.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Obter países que operam um equipamento específico
CREATE OR REPLACE FUNCTION get_equipment_operators(equipment_uuid UUID)
RETURNS TABLE (
  country_id UUID,
  country_name TEXT,
  country_code TEXT,
  flag_url TEXT,
  quantity INTEGER,
  status TEXT,
  variant TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.code,
    c.flag_url,
    ce.quantity,
    ce.status,
    ce.variant
  FROM country_equipment ce
  JOIN countries c ON c.id = ce.country_id
  WHERE ce.equipment_id = equipment_uuid
  ORDER BY ce.quantity DESC NULLS LAST, c.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Popular com dados iniciais (Top 50 países militares)
INSERT INTO countries (name, code, code_2, region, capital, continent, flag_url, military_budget_usd, active_military, military_rank) VALUES
('United States', 'USA', 'US', 'North America', 'Washington D.C.', 'North America', 'https://flagcdn.com/w320/us.png', 877000000000, 1400000, 1),
('Russia', 'RUS', 'RU', 'Eastern Europe', 'Moscow', 'Europe', 'https://flagcdn.com/w320/ru.png', 86400000000, 1150000, 2),
('China', 'CHN', 'CN', 'East Asia', 'Beijing', 'Asia', 'https://flagcdn.com/w320/cn.png', 292000000000, 2000000, 3),
('India', 'IND', 'IN', 'South Asia', 'New Delhi', 'Asia', 'https://flagcdn.com/w320/in.png', 81400000000, 1450000, 4),
('United Kingdom', 'GBR', 'GB', 'Western Europe', 'London', 'Europe', 'https://flagcdn.com/w320/gb.png', 68400000000, 194000, 5),
('South Korea', 'KOR', 'KR', 'East Asia', 'Seoul', 'Asia', 'https://flagcdn.com/w320/kr.png', 48000000000, 600000, 6),
('Pakistan', 'PAK', 'PK', 'South Asia', 'Islamabad', 'Asia', 'https://flagcdn.com/w320/pk.png', 11300000000, 654000, 7),
('Japan', 'JPN', 'JP', 'East Asia', 'Tokyo', 'Asia', 'https://flagcdn.com/w320/jp.png', 49100000000, 247000, 8),
('France', 'FRA', 'FR', 'Western Europe', 'Paris', 'Europe', 'https://flagcdn.com/w320/fr.png', 58900000000, 204000, 9),
('Italy', 'ITA', 'IT', 'Southern Europe', 'Rome', 'Europe', 'https://flagcdn.com/w320/it.png', 35500000000, 170000, 10),
('Turkey', 'TUR', 'TR', 'Western Asia', 'Ankara', 'Asia', 'https://flagcdn.com/w320/tr.png', 10600000000, 425000, 11),
('Brazil', 'BRA', 'BR', 'South America', 'Brasília', 'South America', 'https://flagcdn.com/w320/br.png', 19700000000, 360000, 12),
('Indonesia', 'IDN', 'ID', 'Southeast Asia', 'Jakarta', 'Asia', 'https://flagcdn.com/w320/id.png', 9100000000, 400000, 13),
('Egypt', 'EGY', 'EG', 'North Africa', 'Cairo', 'Africa', 'https://flagcdn.com/w320/eg.png', 11200000000, 440000, 14),
('Iran', 'IRN', 'IR', 'Western Asia', 'Tehran', 'Asia', 'https://flagcdn.com/w320/ir.png', 25000000000, 610000, 15),
('Germany', 'DEU', 'DE', 'Western Europe', 'Berlin', 'Europe', 'https://flagcdn.com/w320/de.png', 55600000000, 184000, 16),
('Saudi Arabia', 'SAU', 'SA', 'Western Asia', 'Riyadh', 'Asia', 'https://flagcdn.com/w320/sa.png', 75000000000, 257000, 17),
('Israel', 'ISR', 'IL', 'Western Asia', 'Jerusalem', 'Asia', 'https://flagcdn.com/w320/il.png', 23400000000, 170000, 18),
('Australia', 'AUS', 'AU', 'Oceania', 'Canberra', 'Oceania', 'https://flagcdn.com/w320/au.png', 32300000000, 60000, 19),
('Spain', 'ESP', 'ES', 'Southern Europe', 'Madrid', 'Europe', 'https://flagcdn.com/w320/es.png', 20300000000, 121000, 20),
('Ukraine', 'UKR', 'UA', 'Eastern Europe', 'Kyiv', 'Europe', 'https://flagcdn.com/w320/ua.png', 11800000000, 900000, 21),
('Canada', 'CAN', 'CA', 'North America', 'Ottawa', 'North America', 'https://flagcdn.com/w320/ca.png', 26500000000, 68000, 22),
('Poland', 'POL', 'PL', 'Eastern Europe', 'Warsaw', 'Europe', 'https://flagcdn.com/w320/pl.png', 16600000000, 202000, 23),
('North Korea', 'PRK', 'KP', 'East Asia', 'Pyongyang', 'Asia', 'https://flagcdn.com/w320/kp.png', 10000000000, 1280000, 24),
('Netherlands', 'NLD', 'NL', 'Western Europe', 'Amsterdam', 'Europe', 'https://flagcdn.com/w320/nl.png', 13700000000, 36000, 25),
('Sweden', 'SWE', 'SE', 'Northern Europe', 'Stockholm', 'Europe', 'https://flagcdn.com/w320/se.png', 7500000000, 24000, 26),
('Greece', 'GRC', 'GR', 'Southern Europe', 'Athens', 'Europe', 'https://flagcdn.com/w320/gr.png', 7700000000, 142000, 27),
('Argentina', 'ARG', 'AR', 'South America', 'Buenos Aires', 'South America', 'https://flagcdn.com/w320/ar.png', 3100000000, 74000, 28),
('Chile', 'CHL', 'CL', 'South America', 'Santiago', 'South America', 'https://flagcdn.com/w320/cl.png', 5900000000, 77000, 29),
('Mexico', 'MEX', 'MX', 'North America', 'Mexico City', 'North America', 'https://flagcdn.com/w320/mx.png', 6000000000, 277000, 30),
('Colombia', 'COL', 'CO', 'South America', 'Bogotá', 'South America', 'https://flagcdn.com/w320/co.png', 10500000000, 293000, 44),
('Venezuela', 'VEN', 'VE', 'South America', 'Caracas', 'South America', 'https://flagcdn.com/w320/ve.png', 3000000000, 123000, 57),
('Peru', 'PER', 'PE', 'South America', 'Lima', 'South America', 'https://flagcdn.com/w320/pe.png', 2800000000, 95000, 50),
('Ecuador', 'ECU', 'EC', 'South America', 'Quito', 'South America', 'https://flagcdn.com/w320/ec.png', 2500000000, 40000, 70),
('Uruguay', 'URY', 'UY', 'South America', 'Montevideo', 'South America', 'https://flagcdn.com/w320/uy.png', 1200000000, 21000, 95)
ON CONFLICT (code) DO NOTHING;

-- Comentários
COMMENT ON TABLE countries IS 'Países do mundo com dados geográficos e militares';
COMMENT ON TABLE country_equipment IS 'Relacionamento entre países e equipamentos que operam';
COMMENT ON FUNCTION get_top_military_countries IS 'Retorna países com maior poder militar e quantidade de equipamentos';
COMMENT ON FUNCTION get_country_equipment_details IS 'Retorna equipamentos operados por um país específico';
COMMENT ON FUNCTION get_equipment_operators IS 'Retorna países que operam um equipamento específico';

SELECT '✅ Sistema de Países criado com sucesso! 30+ países iniciais populados!' AS result;
