import os
from supabase import create_client, Client

# Configurações do Supabase (Service Role)
SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Dados Reais de Fichas Técnicas (Descriptions)
REAL_EQUIPMENT_DATA = {
    'KC-390': "O Embraer C-390 Millennium é uma aeronave de transporte tático/logístico e reabastecimento em voo desenvolvido e fabricado pela Embraer. É a maior e mais complexa aeronave militar já construída no Brasil. Possui capacidade de transportar até 26 toneladas de carga, incluindo veículos blindados como o Guarani e o M113, além de tropas e feridos.",
    'Gripen': "O Saab JAS 39 Gripen é um caça multiuso leve, monomotor, fabricado pela empresa aeroespacial sueca Saab. A Força Aérea Brasileira opera a variante F-39E/F Gripen NG, que possui aviônicos avançados, radar AESA Raven ES-05 e capacidade de supercruise. É projetado para operar em pistas curtas e rodovias.",
    'Super Tucano': "O Embraer EMB-314 Super Tucano é uma aeronave turboélice de ataque leve e treinamento avançado, que incorpora os últimos avanços em aviônicos e sistemas de armamento. É amplamente utilizado para policiamento de fronteiras, contra-insurgência e treinamento de pilotos de caça.",
    'Guarani': "O VBTP-MR Guarani (Viatura Blindada de Transporte de Pessoal Médio sobre Rodas) é um veículo blindado de transporte de pessoal 6x6 desenvolvido pela Iveco em parceria com o Exército Brasileiro. Substituiu o EE-11 Urutu e possui proteção contra minas, capacidade anfíbia e pode ser equipado com torres de metralhadora ou canhão 30mm.",
    'Leopard 1': "O Leopard 1A5 BR é o principal tanque de batalha (MBT) do Exército Brasileiro. De origem alemã, possui um canhão de 105mm estriado L7A3, sistema de controle de tiro computadorizado e capacidade de combate noturno. É conhecido por sua mobilidade e poder de fogo, embora tenha blindagem leve para os padrões modernos.",
    'Astros': "O sistema ASTROS II (Artillery Saturation Rocket System) é um sistema de lançadores múltiplos de foguetes fabricado pela Avibras. É capaz de lançar foguetes de diferentes calibres (SS-30, SS-40, SS-60, SS-80) e o Míssil Tático de Cruzeiro (MTC-300), atingindo alvos a até 300km de distância.",
    'F-22': "O Lockheed Martin F-22 Raptor é um caça de superioridade aérea furtivo (stealth) de quinta geração, bimotor, operado exclusivamente pela Força Aérea dos Estados Unidos. Possui vetoração de empuxo, capacidade supercruise e aviônicos integrados que lhe conferem vantagem decisiva em combate aéreo.",
    'F-35': "O Lockheed Martin F-35 Lightning II é uma família de caças furtivos multifunção de quinta geração. Projetado para ataque ao solo e missões de superioridade aérea, possui capacidades avançadas de guerra eletrônica e fusão de sensores. É operado por diversos países da OTAN.",
    'Abrams': "O M1 Abrams é um tanque de batalha principal de terceira geração dos EUA. Notável pelo uso de uma poderosa turbina a gás, blindagem composta Chobham sofisticada e armazenamento de munição separado. A versão M1A2 SEPv3 é a mais moderna, com sistemas de proteção ativa Trophy e blindagem aprimorada.",
    'Su-57': "O Sukhoi Su-57 (Felon) é um caça furtivo de quinta geração da Rússia, projetado para superioridade aérea e ataque. Possui supermanobrabilidade, compartimentos internos de armas e radar avançado. É a resposta russa ao F-22 e F-35.",
    'T-90': "O T-90 é um tanque de batalha principal russo de terceira geração. É uma modernização do T-72B, incorporando características do T-80U. Possui o sistema de contramedidas Shtora-1 (os 'olhos vermelhos'), blindagem reativa Kontakt-5 e um canhão de 125mm capaz de disparar mísseis guiados.",
    'J-20': "O Chengdu J-20 (Mighty Dragon) é um caça furtivo de quinta geração desenvolvido pela China. É uma aeronave grande e pesada, projetada para superioridade aérea e ataque de longo alcance, possivelmente ameaçando ativos de suporte como aviões-tanque e AWACS inimigos.",
    'Type 99': "O Type 99A é o tanque de batalha principal mais moderno da China. Possui um canhão de 125mm, blindagem composta e reativa avançada, e um sistema de defesa ativo a laser único (JD-3) projetado para cegar os sistemas de mira e operadores inimigos."
}

def fix_categories():
    print("🚁 Corrigindo categorias de helicópteros (ID 2)...")
    
    keywords = [
        "Helicóptero", "Helicopter", "Ah-1", "Ah-64", 
        "Mi-24", "Mi-8", "Mi-17", "Mi-35", "Mi-28", 
        "Ka-50", "Ka-52", "UH-1", "UH-60", "CH-47", 
        "Eurocopter", "Black Hawk", "Apache"
    ]
    
    count = 0
    for kw in keywords:
        # Busca equipamentos
        res = supabase.table('equipment').select('id, name, category_id').ilike('name', f'%{kw}%').neq('category_id', 2).execute()
        
        if res.data:
            ids = [item['id'] for item in res.data]
            try:
                supabase.table('equipment').update({'category_id': 2}).in_('id', ids).execute()
                count += len(ids)
            except Exception as e:
                print(f"❌ Erro ao atualizar categoria {kw}: {e}")
                
    print(f"✅ Categorias corrigidas: {count} atualizados.")

def get_id_by_name(table, name_part):
    res = supabase.table(table).select('id').ilike('name', f'%{name_part}%').limit(1).execute()
    if res.data:
        return res.data[0]['id']
    return None

def update_equipment_specs():
    print("\n📝 Atualizando Fichas Técnicas com dados reais...")
    count = 0
    
    for name_part, description in REAL_EQUIPMENT_DATA.items():
        # Buscar ID
        e_id = get_id_by_name('equipment', name_part)
        
        if e_id:
            try:
                # Atualizar descrição
                # Poderíamos atualizar outros campos se existissem na tabela (speed, range etc)
                # Assumindo que a tabela tem 'description'
                supabase.table('equipment').update({
                    'description': description
                }).eq('id', e_id).execute()
                count += 1
                # print(f"   + Ficha atualizada: {name_part}")
            except Exception as e:
                print(f"   ❌ Erro ao atualizar ficha {name_part}: {e}")
    
    print(f"✅ {count} fichas técnicas atualizadas com dados reais.")

def populate_country_equipment():
    # ... (mesmo código anterior, mas agora os equipamentos já terão dados reais)
    print("\n🌍 Populando equipamentos REAIS por país...")
    
    countries_data = {
        'Brazil': [
            {'name': 'KC-390', 'qty': 6, 'year': 2019},
            {'name': 'Gripen', 'qty': 8, 'year': 2022}, 
            {'name': 'Tucano', 'qty': 99, 'year': 2003}, # Pega Super Tucano
            {'name': 'Guarani', 'qty': 600, 'year': 2012},
            {'name': 'Leopard', 'qty': 220, 'year': 1996},
            {'name': 'Astros', 'qty': 30, 'year': 1983}
        ],
        'United States': [
            {'name': 'F-22', 'qty': 183, 'year': 2005},
            {'name': 'F-35', 'qty': 450, 'year': 2015},
            {'name': 'Abrams', 'qty': 2500, 'year': 1980},
            {'name': 'Black Hawk', 'qty': 2000, 'year': 1979}
        ],
        'Russia': [
            {'name': 'Su-57', 'qty': 22, 'year': 2020},
            {'name': 'T-90', 'qty': 350, 'year': 1992},
            {'name': 'Ka-52', 'qty': 100, 'year': 2011}
        ],
        'China': [
            {'name': 'J-20', 'qty': 200, 'year': 2017},
            {'name': 'Type 99', 'qty': 1200, 'year': 2001}
        ]
    }
    
    success_count = 0
    for country_name, equip_list in countries_data.items():
        c_id = get_id_by_name('countries', country_name)
        if not c_id: continue
            
        for item in equip_list:
            e_id = get_id_by_name('equipment', item['name'])
            if e_id:
                try:
                    data = {
                        'country_id': c_id,
                        'equipment_id': e_id,
                        'quantity': item['qty'],
                        'status': 'ACTIVE',
                        'year_acquired': item['year']
                    }
                    try:
                        supabase.table('country_equipment').upsert(data, on_conflict='country_id,equipment_id').execute()
                        success_count += 1
                    except:
                         supabase.table('country_equipment').insert(data).execute()
                         success_count += 1
                except:
                    pass

    print(f"✅ {success_count} relacionamentos criados.")

if __name__ == "__main__":
    fix_categories()
    update_equipment_specs() # Novo passo
    populate_country_equipment()
