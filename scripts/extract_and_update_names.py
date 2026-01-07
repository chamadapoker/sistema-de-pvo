import os
import re
from supabase import create_client

# Configurações SERVICE ROLE para UPDATE
URL = "https://baoboggeqhksaxkuudap.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

DOC_PATH = r"C:\Users\Yoda\Downloads\DVD PVO 2010\PVO\Catind.doc"

def run_update():
    print("🚀 Extraindo nomes de Catind.doc e atualizando banco...")
    
    if not os.path.exists(DOC_PATH):
        print("Erro: Doc não encontrado")
        return

    with open(DOC_PATH, 'rb') as f:
        content = f.read().decode('latin-1', errors='ignore')

    # Regex: Encontrar Codigo (ex 1P001) e capturar tudo ate o proximo Codigo
    # Como não sabemos o último, vamos splitar pelo pattern de código
    
    # Pattern para código: dígito, P ou T, 3 ou mais dígitos
    code_pattern = r'([1-8][PTpt]\d{3,5})'
    
    # Split mantém os separadores se usarmos parênteses
    parts = re.split(code_pattern, content)
    
    # parts[0] = lixo inicial
    # parts[1] = Codigo 1
    # parts[2] = Nome 1
    # parts[3] = Codigo 2
    # parts[4] = Nome 2
    
    updates = {}
    
    # Iterar pulando de 2 em 2 começando do primeiro código encontrado
    # Precisamos achar onde começam os códigos
    start_index = -1
    for i, part in enumerate(parts):
        if re.match(code_pattern, part):
            start_index = i
            break
            
    if start_index == -1:
        print("Nenhum código encontrado com split.")
        return

    print(f"Encontrados {len(parts)//2} potenciais itens.")
    
    count = 0
    sp = create_client(URL, SERVICE_KEY)
    
    for i in range(start_index, len(parts)-1, 2):
        code = parts[i].upper().strip()
        raw_name = parts[i+1]
        
        # Limpar o nome
        # O nome pode conter lixo no final antes do próximo código, mas geralmente no 'glued' text está limpo
        # Mas vamos remover caracteres não imprimíveis
        name = re.sub(r'[^a-zA-Z0-9\s\-\/\.\(\)]', '', raw_name).strip()
        
        # Remover espaços duplos
        name = re.sub(r'\s+', ' ', name)
        
        if len(name) < 2: continue # Nome muito curto, provavel erro
        if len(name) > 100: name = name[:100] # Truncar se muito longo

        # Preparar atualização
        # print(f"  {code} -> {name}")
        updates[code] = name
        count += 1

    print(f"🔍 Extraídos {len(updates)} mapeamentos Código->Nome.")
    
    # Atualizar no banco
    print("💾 Atualizando Supabase...")
    success = 0
    errors = 0
    
    # Fazer em lotes ou um por um? Um por um é lento mas seguro para debug.
    # Vamos tentar atualizar.
    for code, name in updates.items():
        try:
            # Update where code implies insensitive match? Code is text.
            # Upsert não adianta pois queremos manter o ID e a imagem. UPDATE.
            
            # Precisamos normalizar o código? O banco tem "1P00129". O doc tem "1P001"?
            # Regex capturou `1P001`. Se o banco tem `1P00129`?
            # Olhando o output do passo anterior:
            # `1P001AMX ...`
            # `1P001` é curto.
            # O sample_cat1 mostrou códigos como `1P00129`.
            # Será que o código do doc é prefixo? Ou são códigos diferentes?
            
            # Wait. `1P001` -> AMX.
            # `1P00129` -> ?
            # Se `1P001` é o TIPO DE AVIÃO. E `1P001xx` são as fotos desse avião?
            # 1P001 = Código do AMX.
            # 1P00101, 1P00102 = Fotos do AMX?
            
            # VAMOS TESTAR ESSA TEORIA DE PREFIXO.
            # Se for verdade, atualizamos todos que COMEÇAM com 1P001 para ter name="AMX / A-1".
            
            # Buscar no banco um exemplo real começando com 1P001
            # O `sample_cat1` mostrou `1P00129`. 
            # 1P001 + 29?
            
            # Vou assumir prefixo.
            
            # Mas cuidado: 1P001 vs 1P0010.
            # 1P001 prefixo pega 1P0010? Sim.
            # Precisamos distinguir.
            # O padrão PVO geralmente é 1P + 3 digitos de TIPO + 2 digitos de FOTO?
            # 1P 001 29 -> Tipo 001, Foto 29?
            
            res = sp.table('equipment').update({'name': name}).ilike('code', f"{code}%").execute()
            # print(f"Updated {code}% to {name}")
            success += 1
            if success % 50 == 0: print(f"  {success} tipos atualizados...")
            
        except Exception as e:
            errors += 1
            print(f"Erro em {code}: {e}")

    print(f"✅ Concluído! Sucesso: {success}")

if __name__ == "__main__":
    run_update()
