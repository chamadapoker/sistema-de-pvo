import os
from supabase import create_client, Client

# Configurações do Supabase (Service Role)
SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Descrições ricas (Fichas Técnicas)
DESCRIPTIONS = {
    'T-72': "O T-72 é um tanque de batalha principal soviético/russo que entrou em produção em 1971. É um dos tanques mais amplamente produzidos após a Segunda Guerra Mundial. Possui canhão de 125mm com carregador automático, perfil baixo e blindagem composta.",
    'T-62': "O T-62 é um tanque de batalha principal soviético introduzido em 1961. Foi o primeiro tanque a usar um canhão de alma lisa de 115mm, permitindo disparar munição APFSDS com maior velocidade.",
    'M-8': "O M8 Greyhound foi um veículo blindado leve 6x6 produzido pela Ford durante a Segunda Guerra Mundial. Usado para reconhecimento e patrulha, era rápido e silencioso, armado com um canhão de 37mm.",
    'SK 105': "O SK-105 Kürassier é um tanque leve austríaco armado com um canhão de 105mm em uma torre oscilante. Projetado para combate antitanque em terreno montanhoso.",
    'Type 23': "A fragata Type 23 (classe Duke) é uma classe de fragatas da Marinha Real Britânica projetada para guerra antissubmarina e antiaérea.",
    'D-30': "O D-30 é um howitzer (obuseiro) soviético de 122mm introduzido nos anos 60. É caracterizado por seu sistema de montagem em três pernas que permite 360 graus de tração.",
    'M-101': "O M101 é um obuseiro leve de 105mm americano, padrão na Segunda Guerra Mundial e amplamente exportado.",
    'M-46': "O canhão de campanha M-46 de 130mm soviético é conhecido por seu longo alcance e alta velocidade de boca, tendo sido uma das peças de artilharia mais eficazes da Guerra Fria.",
    'Leopard 1': "O Leopard 1 é um tanque de batalha principal projetado e produzido na Alemanha Ocidental, que entrou em serviço em 1965. Armado com canhão 105mm.",
    'F-5': "O Northrop F-5 é uma família de caças leves supersônicos. O F-5E Tiger II é amplamente usado, incluindo pela FAB (modernizado como F-5M), conhecido pela agilidade e baixo custo.",
    'Mirage 2000': "O Dassault Mirage 2000 é um caça multitarefa francês, monomotor, de asa delta. É veloz e possui excelente capacidade de interceptação.",
    'M60': "O M60 Patton é um tanque de batalha principal americano de segunda geração. Foi o tanque padrão dos EUA durante a Guerra Fria, com canhão de 105mm.",
    'Tucano': "O Embraer EMB-312 Tucano é uma aeronave turboélice de treinamento básico e de ataque leve. Revolucionou o treinamento de pilotos com seu arranjo de assentos em tandem escalonado e desempenho similar a jatos.",
    'A-29': "O Embraer A-29 Super Tucano é uma aeronave de ataque leve e treinamento avançado, ideal para contra-insurgência e policiamento aéreo.",
    'Cascavel': "O EE-9 Cascavel é um blindado 6x6 brasileiro armado com canhão de 90mm. Foi um grande sucesso de exportação da Engesa, usado em diversos conflitos no Oriente Médio.",
    'Urutu': "O EE-11 Urutu é um transporte blindado de pessoal anfíbio 6x6 brasileiro, famoso por sua robustez e simplicidade.",
    'Astros': "O sistema ASTROS II é um lançador múltiplo de foguetes de saturação de área, capaz de lançar diferentes calibres a longas distâncias.",
    'Abrams': "O M1 Abrams é o principal tanque de batalha dos EUA, famoso por sua blindagem pesada e turbina a gás.",
    'Bradley': "O M2 Bradley é um veículo de combate de infantaria (IFV) americano, armado com canhão 25mm e mísseis TOW.",
    'M113': "O M113 é um transporte blindado de pessoal sobre lagartas, o veículo blindado mais amplamente utilizado na história, servindo em mais de 50 países.",
    'T-90': "O T-90 é um MBT russo moderno, evolução do T-72 com tecnologias do T-80, incluindo sistema de defesa ativa Shtora.",
    'Su-27': "O Sukhoi Su-27 (Flanker) é um caça de superioridade aérea soviético de grande manobrabilidade e alcance.",
    'MiG-29': "O Mikoyan MiG-29 (Fulcrum) é um caça de superioridade aérea leve, desenvolvido para enfrentar o F-16 e o F-15."
}

def get_equipment_ids_by_name(name_part):
    # Retorna todos os IDs que dão match no nome
    res = supabase.table('equipment').select('id, name, description').ilike('name', f'%{name_part}%').execute()
    return res.data if res.data else []

def get_country_id(name):
    res = supabase.table('countries').select('id').ilike('name', f'%{name}%').limit(1).execute()
    return res.data[0]['id'] if res.data else None

def populate_multiple_angles():
    print("\n🌍 Vinculando Múltiplas Vistas (Fotos) por País...")
    print("   Isso garantirá que diferentes ângulos do mesmo equipamento apareçam.")

    # Mapeamento do que procurar para cada país
    country_map = {
        'Brazil': ['Leopard 1', 'M60', 'M113', 'Urutu', 'Cascavel', 'Astros', 'F-5', 'Tucano', 'AMX', 'M-101', 'M-114', 'Guarani'],
        'United States': ['Abrams', 'Bradley', 'M113', 'M109', 'Patriot', 'F-15', 'F-16', 'F-18', 'A-10', 'Apache', 'Black Hawk', 'Chinook'],
        'Russia': ['T-72', 'T-62', 'T-80', 'T-90', 'BMP-1', 'BMP-2', 'BTR-60', 'BTR-80', 'MiG-29', 'Su-27', 'Su-25', 'Mi-24', 'Mi-8', 'D-30', 'M-46'],
        'China': ['Type 59', 'Type 69', 'Type 80', 'Type 96', 'Type 85', 'J-7', 'J-8', 'H-6'],
        'Germany': ['Leopard 1', 'Leopard 2', 'Marder', 'Gepard', 'Tornado'],
        'France': ['Leclerc', 'AMX-30', 'AMX-10', 'Mirage 2000', 'Rafale', 'Caesar'],
        'United Kingdom': ['Challenger', 'Warrior', 'Scimitar', 'Type 23', 'Type 45', 'Harrier', 'Tornado']
    }

    total_links = 0
    total_specs_updated = 0

    for country, equip_list in country_map.items():
        c_id = get_country_id(country)
        if not c_id: continue
        
        print(f"   🇧🇷 Processando {country}...")
        
        for equip_name in equip_list:
            # Buscar TODAS as variações desse equipamento (fotos diferentes)
            items = get_equipment_ids_by_name(equip_name)
            
            if not items:
                continue

            print(f"      - {equip_name}: encontrado {len(items)} variações.")

            # Descobrir a descrição correta
            desc_text = None
            for k, v in DESCRIPTIONS.items():
                if k.lower() in equip_name.lower():
                    desc_text = v
                    break
            
            # Para CADA variação (cada ângulo/foto):
            for item in items:
                e_id = item['id']
                
                # 1. Atualizar Ficha Técnica (se tivermos e se a atual for pobre)
                # Atualizamos SEMPRE para garantir que todos fiquem iguais
                if desc_text:
                    try:
                        supabase.table('equipment').update({'description': desc_text}).eq('id', e_id).execute()
                        total_specs_updated += 1
                    except: pass
                
                # 2. Vincular ao País
                try:
                    data = {
                        'country_id': c_id,
                        'equipment_id': e_id,
                        'quantity': 10, # Valor ilustrativo
                        'status': 'ACTIVE',
                        'year_acquired': 1990
                    }
                    supabase.table('country_equipment').upsert(data, on_conflict='country_id,equipment_id').execute()
                    total_links += 1
                except: pass

    print(f"\n✅ SUCESSO! {total_links} imagens vinculadas e {total_specs_updated} fichas atualizadas.")

if __name__ == "__main__":
    populate_multiple_angles()
