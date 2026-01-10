import os
import google.generativeai as genai
from supabase import create_client, Client
import json
import time
from dotenv import load_dotenv

import argparse

# ... existing imports ...

import argparse

# ... existing imports ...

# Argument Parsing
parser = argparse.ArgumentParser(description='Enrich Country Data')
parser.add_argument('--key', type=str, help='Gemini API Key')
args = parser.parse_args()

# --- CONFIGURATION ---
# 1. SUPABASE
SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

# 2. GEMINI AI
# Hardcoded to bypass environment file issues
GEMINI_KEY = args.key or "AIzaSyAvLzdJBiABynnkAW1-Mz5OeF-BPZhnt9Q"

if not GEMINI_KEY:
    print("⚠️  AVISO: GEMINI_API_KEY não encontrada.")
    try:
         GEMINI_KEY = input("Gemini API Key: ").strip()
    except EOFError:
         exit(1)

# --- SETUP ---
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
genai.configure(api_key=GEMINI_KEY)
model = genai.GenerativeModel('gemini-2.0-flash-exp')

OUTPUT_FILE = "update_countries_data.sql"

def get_countries():
    print("📡 Buscando países no Supabase...")
    response = supabase.table('countries').select("*").execute()
    return response.data

def generate_country_data(country_name, retries=3):
    prompt = f"""
    Atue como um analista de inteligência da CIA/Jane's Defence.
    Preciso de dados militares e demográficos REAIS e ATUALIZADOS (2024/2025) para o país: {country_name}.

    Responda APENAS um objeto JSON com os seguintes campos (sem markdown block, apenas o JSON puro):
    {{
        "population": (inteiro, estimativa 2024),
        "military_budget_usd": (inteiro, orçamento anual em dolares),
        "active_military": (inteiro, apenas força ativa),
        "reserve_military": (inteiro, força reserva),
        "military_rank": (inteiro, posição aproximada no Global Firepower Index 2024),
        "military_description": (string, resumo de 150 caracteres max sobre a doutrina militar. Ex: "Focada em defesa territorial e operações de paz sob égide da ONU."),
        "alliance": (string, Escolha a principal: "NATO", "CSTO", "BRICS+", "Rio Treaty", "Arab League", "ASEAN", "EU", or "Non-Aligned")
    }}
    """
    
    for attempt in range(retries):
        try:
            response = model.generate_content(prompt)
            text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(text)
        except Exception as e:
            if "429" in str(e):
                wait_time = 65 # Wait just over a minute to be safe for free tier
                print(f" ⏳ Rate limit hit for {country_name}. Waiting {wait_time}s...")
                time.sleep(wait_time)
                continue
            else:
                print(f"❌ Erro na IA para {country_name}: {e}")
                return None
    return None

def main():
    countries = get_countries()
    print(f"✅ {len(countries)} países encontrados.")
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("-- ATUALIZAÇÃO DE DADOS DE PAÍSES (VIA GEMINI AI)\n")
        f.write("-- Data: " + time.strftime("%Y-%m-%d") + "\n\n")

        for i, country in enumerate(countries):
            name = country['name']
            print(f"[{i+1}/{len(countries)}] Processando: {name}...", end="", flush=True)
            
            # Skip if data looks populated (optional, forcing update for now to ensure quality)
            # if country['population'] and country['military_budget_usd']:
            #     print(" [Dados já existem - Pulando]")
            #     continue

            data = generate_country_data(name)
            
            if data:
                sql = f"""
UPDATE countries SET
    population = {data.get('population', 'NULL')},
    military_budget_usd = {data.get('military_budget_usd', 'NULL')},
    active_military = {data.get('active_military', 'NULL')},
    reserve_military = {data.get('reserve_military', 'NULL')},
    military_rank = {data.get('military_rank', 'NULL')},
    military_description = '{data.get('military_description', '').replace("'", "''")}',
    alliance = '{data.get('alliance', 'Non-Aligned')}'
WHERE id = {country['id']};
"""
                f.write(sql)
                print(" ✅ Sucesso.")
            else:
                print(" ⚠️ Falha na geração.")
            
            time.sleep(2) # Respect rate limits

    print(f"\n\n🏁 Concluído! Script SQL gerado: {OUTPUT_FILE}")
    print("Execute este script no SQL Editor do Supabase.")

if __name__ == "__main__":
    main()
