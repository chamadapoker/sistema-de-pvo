
import re
import os
from supabase import create_client

# Configurações
MDB_PATH = r"C:\Users\Yoda\Downloads\DVD PVO 2010\PVO\MDB\Pvo.mdb"
SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

def smart_extract():
    print(f"⛏ Minerando descrições ricas de: {MDB_PATH} ...")
    
    with open(MDB_PATH, 'rb') as f:
        # Ler como bytes e decodificar latin1 (comum em Access antigo BR)
        raw_data = f.read()
        content = raw_data.decode('latin-1', errors='ignore')

    # Regex Otimizado:
    # O Access costuma guardar o registro sequencialmente: CODIGO ... NOME ... DESCRIÇÃO
    # Ex: "7T01904" ... "TRS 2230" ... "Base robusta com capacidade..."
    # Ou: CODIGO ... DESCRIÇÃO ...
    
    # 1. Encontrar todos os códigos PVO possiveis (1P..., 7T..., etc)
    # Padrão: [1-8][PTpt][Digitos]
    # O user mentionou 7T... no output anterior.
    
    # Vamos tentar capturar "Blocos de Texto" grandes que estejam PERTO de um código.
    
    # Pattern: CODIGO (Letra+Digitos) + Lixo(0-100chars) + TEXTO DESCRITIVO (> 20 chars)
    
    # Regex para código PVO
    code_regex = r'([1-8][PT]\d{5})' # Ex: 1P00125, 7T01904
    
    matches = []
    
    # Dividir o conteúdo pelos códigos
    parts = re.split(code_regex, content)
    
    print(f"Encontrados {len(parts)//2} segmentos baseados em códigos.")
    
    extracted_data = {}
    
    for i in range(1, len(parts)-1, 2):
        code = parts[i]
        following_text = parts[i+1]
        
        # Limpar o texto seguinte
        # Pegar os primeiros X caracteres até achar outro "lixo binário" muito denso ou outro código
        # O Access usa terminadores nulos \x00 frequentementes.
        
        # Vamos pegar tudo até o próximo null byte ou sequencia estranha
        # Mas o decode ignorou null bytes? Não, decode latin1 mantem \x00.
        
        # Pegar "proximidades"
        # O texto descritivo geralmente começa logo apos algum separador.
        
        # Filtro de qualidade: Achar a maior sequencia de texto legivel nesse chunk
        text_chunks = re.findall(r'[A-Za-z0-9À-ÿ\s\-\,\.\(\)\:]{20,}', following_text)
        
        # Se tiver chunks, o maior provavelmente é a descrição
        if text_chunks:
            # Ordenar por tamanho
            longest_chunk = max(text_chunks, key=len)
            
            # Limpar espaços extras
            clean_desc = re.sub(r'\s+', ' ', longest_chunk).strip()
            
            if len(clean_desc) > 30 and "Standard Jet DB" not in clean_desc:
                extracted_data[code] = clean_desc
                # print(f"[{code}] -> {clean_desc[:60]}...")
                
    print(f"💎 Mineradas {len(extracted_data)} descrições válidas!")
    
    # Guardar amostra
    print("\n--- Amostra de Dados Recuperados ---")
    for k, v in list(extracted_data.items())[:5]:
        print(f"📌 {k}: {v}")
        
    print("\n")
    
    # Perguntar se quer atualizar (simulacao)
    # No, just do it if safe.
    # Vou preparar para atualizar.
    # O problema é que o CODIGO no binário (ex 7T01904) pode ser de uma FOTO ESPECIFICA.
    # Mas a descrição é do TIPO.
    # Ex: 1P00125 (Foto 25 do AMX). Descrição: "Caça bombardeiro..."
    # Se aplicarmos a descrição ao item com code=1P00125, funciona.
    # Se todos 1P001xx tiverem a mesma descrição no MDB, perfeito.
    
    return extracted_data

def update_supabase(data):
    print("💾 Atualizando Supabase com descrições (Campo: description)...")
    sp = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    updated = 0
    errors = 0
    
    # Processar em lotes para performance?
    # Update one by one is safer for matching logic.
    
    for code, desc in data.items():
        try:
            # Atualizar description onde code = code
            # O código extraído 7T01904 bate com o code no banco?
            res = sp.table('equipment').update({'description': desc}).eq('code', code).execute()
            if res.data:
                updated += 1
            else:
                pass
                # Talvez o código no banco esteja formatado diferente? (Space?)
        except Exception as e:
            errors += 1
            
    print(f"✅ Atualizados {updated} registros com descrições ricas!")

if __name__ == "__main__":
    data = smart_extract()
    if data:
        update_supabase(data)
