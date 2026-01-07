
import string
import os

FILES = [
    r"C:\Users\Yoda\Downloads\DVD PVO 2010\PVO\MDB\Pvo.mdb",
    r"C:\Users\Yoda\Downloads\DVD PVO 2010\Setup\PVO\PP.mdb"
]

def extract_strings(filename, min_len=4):
    print(f"📂 Analisando binário: {os.path.basename(filename)} ({os.path.getsize(filename)} bytes)")
    
    with open(filename, 'rb') as f:
        data = f.read()
    
    # Filtrar sequencias de caracteres imprimiveis
    result = ""
    current_str = ""
    
    printable = set(string.printable.encode('ascii'))
    
    found_strings = []
    
    # Simple state machine for efficiency in python
    # Metodo 'strings' simplificado
    try:
        # Decode latin1 to handle accents roughly, then filter
        decoded = data.decode('latin-1', errors='ignore')
        
        # Regex is faster
        import re
        # Find sequences of 4+ printable characters
        # Incluindo letras, numeros, pontuacao basica
        pattern = re.compile(r'[A-Za-z0-9\s_\-\.\/\(\)]{4,}')
        matches = pattern.findall(decoded)
        
        print(f"  Encontradas {len(matches)} strings candidatas.")
        
        # Filtrar as interessantes (tabelas, campos populares)
        keywords = ['Table', 'Create', 'Select', 'Insert', 'Equipamento', 'Aeronave', 'Cat', 'Code', 'Name', 'Usuario']
        
        interesting = []
        for s in matches:
            if len(s) > 50: continue # Ignorar blocos de texto muito grandes (provavelmente lixo)
            s = s.strip()
            if len(s) < 4: continue
            
            # Heuristica: Se parece com nome de tabela ou campo
            # Access guarda metadata como "MSSysObjects", "Table1", etc.
            interesting.append(s)
            
        # Mostrar as primeiras 20 e ultimas 20
        print("  --- Amostra (Início) ---")
        for s in interesting[:20]:
            print(f"  {s}")
            
        print("  --- Amostra (Fim) ---")
        for s in interesting[-20:]:
            print(f"  {s}")
            
        # Tentar achar nomes conhecidos (validação cruzada)
        known = ['AMX', 'Tucano', 'F-5', 'Mirage']
        hits = [k for k in known if any(k in s for s in interesting)]
        if hits:
            print(f"  ✅ Encontrados dados reais: {hits}")
            
    except Exception as e:
        print(f"Erro: {e}")
    print("\n")

if __name__ == "__main__":
    for f in FILES:
        if os.path.exists(f):
            extract_strings(f)
        else:
            print(f"Arquivo não encontrado: {f}")
