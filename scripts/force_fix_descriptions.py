import os
from supabase import create_client, Client

SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def force_fix_helicopter_descriptions():
    print("🚁 [1/3] Limpando descrições 'Veículos Blindados' em Helicópteros (Cat 2)...")
    
    res = supabase.table('equipment').select('id').eq('category_id', 2).ilike('description', '%Veículos Blindados%').execute()
    
    if res.data:
        ids = [item['id'] for item in res.data]
        print(f"   Encontrados {len(ids)} helicópteros com descrição suja.")
        
        batch_size = 100
        for i in range(0, len(ids), batch_size):
            batch_ids = ids[i:i+batch_size]
            try:
                supabase.table('equipment').update({
                    'description': "Aeronave de asa rotativa (Helicóptero). Vetor aéreo de transporte ou ataque."
                }).in_('id', batch_ids).execute()
            except Exception as e:
                print(f"❌ Erro batch {i}: {e}")
        print("✅ Descrições limpas.")
    else:
        print("   Nenhum encontrado - limpo.")

def check_misplaced_helicopters():
    print("🔍 [2/3] Movendo helicópteros perdidos em outras categorias para Cat 2...")
    terms = ['MI-', 'KA-', 'AH-', 'UH-', 'CH-', 'Helicopter', 'Helicóptero', 'Eurocopter', 'Super Frelon', 'Alouette', 'Puma', 'Gazelle', 'Lynx', 'Seiking', 'Sea King']
    
    total_moved = 0
    for term in terms:
        res = supabase.table('equipment').select('id, name').ilike('name', f'%{term}%').neq('category_id', 2).execute()
        if res.data:
            ids = [x['id'] for x in res.data]
            # print(f"   Movendo {len(ids)} itens '{term}'...")
            try:
                supabase.table('equipment').update({'category_id': 2}).in_('id', ids).execute()
                total_moved += len(ids)
            except: pass
            
    print(f"✅ {total_moved} helicópteros movidos para a categoria correta.")

def apply_rich_descriptions_aggressively():
    print("\n📝 [3/3] Aplicando Fichas Técnicas em Massa...")
    
    SPECS = {
        'MI-1': "O Mil Mi-1 (Hare) foi um helicóptero utilitário leve soviético. Primeiro helicóptero soviético de produção em série (1950). Motor radial, rotor principal de 3 pás.",
        'MI-4': "O Mil Mi-4 (Hound) é um helicóptero de transporte médio com motor a pistão. Introduzido em 1953, possui portas traseiras para carga e pode ser armado.",
        'MI-2': "O Mil Mi-2 (Hoplite) é um helicóptero utilitário leve de turbina, produzido exclusivamente na Polônia pela PZL-Świdnik. Muito usado para treinamento e transporte leve.",
        'MI-8': "O Mil Mi-8 (Hip) é um helicóptero bimotor de transporte tático. Um dos helicópteros mais produzidos da história. Robusto, operado em mais de 50 países.",
        'MI-17': "O Mil Mi-17 (Hip-H) é a versão de exportação/aprimorada do Mi-8, com motores mais potentes e rotor de cauda no lado esquerdo.",
        'MI-24': "O Mil Mi-24 (Hind) é um 'tanque voador' - helicóptero de ataque pesado com capacidade de transporte de tropas. Blindado contra fogo de chão, armado com foguetes e canhão.",
        'MI-26': "O Mil Mi-26 (Halo) é o maior e mais potente helicóptero já produzido em série no mundo. Capaz de transportar 20 toneladas de carga ou 90 tropas.",
        'KA-25': "O Kamov Ka-25 (Hormone) é um helicóptero naval soviético com rotores coaxiais (sem rotor de cauda). Usado para guerra antissubmarino.",
        'KA-27': "O Kamov Ka-27 (Helix) é o sucessor do Ka-25, também com rotores coaxiais, padrão na marinha russa para operações em destroieres e porta-aviões.",
        'AH-1': "O Bell AH-1 Cobra foi o primeiro helicóptero de ataque dedicado do mundo. Estreito, ágil, armado com TOWs e foguetes.",
        'UH-1': "O Bell UH-1 Iroquois (Huey) é o ícone da Guerra do Vietnã. Helicóptero utilitário versátil para transporte, evacuação médica e ataque leve.",
        'CH-47': "O Boeing CH-47 Chinook é um helicóptero de transporte pesado com rotores em tandem. Capaz de levantar cargas externas pesadas e operar em alta altitude.",
        'UH-60': "O Sikorsky UH-60 Black Hawk é o helicóptero utilitário padrão do Exército dos EUA, substituindo o Huey. Alta sobrevivência e versatilidade.",
        'Lynx': "O Westland Lynx é um helicóptero utilitário britânico multitarefa. A versão naval é famosa por sua capacidade antissubmarino e antinavio (mísseis Sea Skua).",
        'Puma': "O Aérospatiale SA 330 Puma é um helicóptero de transporte médio francês, bimotor. Amplamente utilizado para transporte de tropas e logística.",
        'Gazelle': "O Aérospatiale Gazelle é um helicóptero leve francês de reconhecimento e ataque. Famoso por usar o rotor de cauda Fenestron.",
        'Alouette': "O Alouette III é um helicóptero utilitário leve francês, conhecido por sua excelente performance em grandes altitudes.",
        'T-72': "MBT Soviético - Canhão 125mm liso, Autocarregador. Baixo perfil. Principal tanque do Pacto de Varsóvia.",
        'M-101': "Obuseiro 105mm M101 - Padrão da artilharia ocidental pós-WWII. Robusto e confiável.",
        'D-30': "Obuseiro 122mm D-30 - Soviético, montagem tripé para giro 360 graus. Excelente mobilidade.",
        'M-46': "Canhão 130mm M-46 - Soviético, conhecido pelo alcance excepcional (27km) e precisão.",
        'GRAD': "BM-21 Grad - Sistema de Lançamento Múltiplo de Foguetes 122mm. Saturação de área devastadora."
    }
    
    total_updated = 0
    for key, desc in SPECS.items():
        res = supabase.table('equipment').select('id').ilike('name', f'%{key}%').execute()
        if res.data:
            ids = [x['id'] for x in res.data]
            try:
                batch_size = 50
                for i in range(0, len(ids), batch_size):
                    batch = ids[i:i+batch_size]
                    supabase.table('equipment').update({'description': desc}).in_('id', batch).execute()
                total_updated += len(ids)
            except: pass
            
    print(f"✅ {total_updated} fichas aplicadas.")

if __name__ == "__main__":
    force_fix_helicopter_descriptions()
    check_misplaced_helicopters()
    apply_rich_descriptions_aggressively()
