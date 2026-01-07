
import os
import re

FILES = [
    r"C:\Users\Yoda\Downloads\DVD PVO 2010\PVO\Catsug.doc",
    r"C:\Users\Yoda\Downloads\DVD PVO 2010\PVO\Leiame.doc"
]

def analyze_doc(path):
    print(f"\n📄 Analisando: {os.path.basename(path)}")
    if not os.path.exists(path):
        print("Aquivo não encontrado.")
        return

    try:
        with open(path, 'rb') as f:
            content = f.read().decode('latin-1', errors='ignore')
            
        # Tentar achar texto legivel (sequencias > 20 chars)
        # Filtrar lixo
        text_blocks = re.findall(r'[A-Za-z0-9À-ÿ\s\-\.\,\:\(\)\/]{20,}', content)
        
        print(f"  Encontrados {len(text_blocks)} blocos de texto.")
        print("  --- Amostra (Início) ---")
        for b in text_blocks[:10]:
            print(f"  > {b.strip()[:80]}...")
            
    except Exception as e:
        print(f"Erro ao ler: {e}")

if __name__ == "__main__":
    for f in FILES:
        analyze_doc(f)
