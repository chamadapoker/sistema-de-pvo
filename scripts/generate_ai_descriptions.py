import google.generativeai as genai
import os
import time

# DEFINA SUA API KEY AQUI:
API_KEY = "YOUR_API_KEY_HERE" # Substitua pela sua chave ou use os.environ['GEMINI_API_KEY']

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash-exp')

# Lista de equipamentos para gerar ficha (adicione mais conforme necessário)
# DICA: Para 12.000 itens, você exportaria a lista do banco para um CSV e leria aqui.
equipamentos = [
    "AGM-114 HELLFIRE",
    "FIM-43 REDEYE",
    "BGM-71 TOW",
    "M47 DRAGON",
    "AIM-9 SIDEWINDER",
    "AIM-120 AMRAAM",
    "RIM-7 SEA SPARROW",
    "JAVELIN (FGM-148)",
    "PANTZYR S1",
    "TOR M1 (SA-15)",
    "BUK M2 (SA-17)",
    "S-300 PMU",
    "S-400 TRIUMF"
]

print("-- GERANDO SQL DE ATUALIZAÇÃO VIA IA... --")
print(f"Total de itens: {len(equipamentos)}\n")

with open("auto_generated_descriptions.sql", "w", encoding="utf-8") as f:
    f.write("-- ARQUIVO GERADO AUTOMATICAMENTE VIA GEMINI AI\n")
    
    for i, nome in enumerate(equipamentos):
        print(f"[{i+1}/{len(equipamentos)}] Processando: {nome}...")
        
        prompt = f"""
        Você é um especialista em equipamentos militares. Crie uma ficha técnica RESUMIDA e objetiva para o equipamento: "{nome}".
        
        Use EXATAMENTE este formato Markdown, sem markdown blocks (```):
        
        ## DADOS TÉCNICOS: {nome.upper()}
        **Origem:** [País]
        **Tipo:** [Tipo ex: Antitanque / Antiaéreo]
        **Alcance:** [X km / X metros]
        **Guiagem:** [Tipo de guiagem]
        **Velocidade:** [Mach X ou km/h]
        
        **ANÁLISE PVO:**
        [Breve descrição tática de 3 linhas focada em identificação e ameaça].
        """
        
        try:
            response = model.generate_content(prompt)
            texto_gerado = response.text.replace("'", "''") # Escape aspas simples para SQL
            
            sql = f"""
UPDATE equipment 
SET description = '{texto_gerado}',
    description_source = 'AI_GENERATED'
WHERE name ILIKE '%{nome}%' AND (description IS NULL OR description = '');
"""
            f.write(sql)
            print("  -> Sucesso!")
        except Exception as e:
            print(f"  -> ERRO: {e}")
        
        time.sleep(30) # Sleep regardless of success/failure to respect rate limits

print("\n\n-- PROCESSO CONCLUÍDO! EXECUTE 'auto_generated_descriptions.sql' NO SUPABASE --")
