
import os

ROOT_PATH = r"C:\Users\Yoda\Downloads\DVD PVO 2010"

def inventory():
    print("🕵️ INVENTÁRIO FORENSE DO SISTEMA LEGADO")
    print(f"Raiz: {ROOT_PATH}\n")
    
    extensions = {}
    unprocessed_files = []
    
    # Arquivos que já sabemos que processamos ou são lixo
    known_exts = ['.jpg', '.jpeg', '.bmp', '.gif', '.png', # Imagens
                  '.exe', '.dll', '.ocx', '.tlb', '.cab', # Binários
                  '.mdb', '.doc', '.docx', '.txt', '.htm', '.html', '.xml', # Dados/Docs
                  '.avi', '.wmz', '.ico', '.bat', '.lst', '.log', '.db'] # Midia/System
    
    for root, dirs, files in os.walk(ROOT_PATH):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            full_path = os.path.join(root, file)
            
            # Contagem estatística
            extensions[ext] = extensions.get(ext, 0) + 1
            
            # Verificar arquivos "exóticos" ou esquecidos
            if ext not in known_exts:
                unprocessed_files.append(full_path)
            
            # Verificar se é um arquivo de som (WAV, MP3) que esquecemos
            if ext in ['.wav', '.mp3', '.mid']:
                print(f"🎵 ARQUIVO DE SOM ENCONTRADO: {full_path}")
                
            # Verificar arquivos de texto/config não lidos
            if file.lower() in ['autorun.inf', 'autorun.txt', 'config.ini', 'setup.ini']:
                print(f"⚙ CONFIG ENCONTRADA: {full_path}")
                try:
                    with open(full_path, 'r', errors='ignore') as f:
                        print(f"   Conteúdo:\n{f.read()[:200]}...")
                except: pass

    print("\n📊 Resumo por Extensão:")
    for ext, count in sorted(extensions.items()):
        print(f"  {ext}: {count}")
        
    print("\n🚨 Arquivos com extensões não mapeadas (Potencialmente esquecidos):")
    if unprocessed_files:
        for f in unprocessed_files:
            print(f"  - {f}")
    else:
        print("  (Nenhum arquivo incomum encontrado)")

if __name__ == "__main__":
    inventory()
