import google.generativeai as genai
import os
import time

# CONFIGURAÇÃO
# Substitua pela sua chave se não estiver no env
API_KEY = "YOUR_API_KEY_HERE" 
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash-exp')

countries_to_update = [
    "Brasil", "Estados Unidos", "China", "Rússia", "Alemanha", 
    "Reino Unido", "França", "Itália", "Ucrânia", "Venezuela", 
    "Argentina", "Colômbia", "Irã", "Israel", "Coreia do Norte", 
    "Coreia do Sul", "Japão", "Índia", "Austrália", "Canadá",
    "Paraguai", "Peru", "Uruguai", "Chile", "Bolívia", "Equador",
    "Guiana", "Suriname", "Guiana Francesa"
]

print("-- ENRIQUECENDO DADOS DE PAÍSES VIA GEMINI AI --")

with open("update_countries_data.sql", "w", encoding="utf-8") as f:
    f.write("-- DADOS DE PAÍSES GERADOS POR IA\n")
    
    for country in countries_to_update:
        print(f"Processando: {country}...")
        
        prompt = f"""
        Forneça dados reais e atualizados (estimativa 2024/2025) para o país: {country}.
        
        Retorne APENAS um JSON com o seguinte formato, sem markdown blocks:
        {{
            "population": numeric_integer,
            "area_km2": numeric_integer,
            "active_military": numeric_integer,
            "reserve_military": numeric_integer,
            "military_budget_usd": numeric_integer,
            "description": "Texto resumido em português (3 linhas) sobre a geopolítica e foco militar do país.",
            "military_description": "Texto técnico sobre a doutrina militar, principais fornecedores de armas e status atual das forças armadas."
        }}
        """
        
        try:
            response = model.generate_content(prompt)
            # Remove crase se houver
            clean_text = response.text.replace("```json", "").replace("```", "").strip()
            
            import json
            data = json.loads(clean_text)
            
            sql = f"""
UPDATE countries SET 
    population = {data.get('population', 0)}, 
    area_km2 = {data.get('area_km2', 0)},
    active_military = {data.get('active_military', 0)},
    reserve_military = {data.get('reserve_military', 0)},
    military_budget_usd = {data.get('military_budget_usd', 0)},
    description = '{data.get('description', '').replace("'", "''")}',
    military_description = '{data.get('military_description', '').replace("'", "''")}'
WHERE name = '{country}';
"""
            f.write(sql)
            print("  -> Sucesso!")
        except Exception as e:
            print(f"  -> ERRO: {e}")
        
        time.sleep(2) # Rate limit friendly

print("\n-- ATUALIZAÇÃO CONCLUÍDA: execute 'update_countries_data.sql' no Supabase --")
