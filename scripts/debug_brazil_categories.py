
import requests
import json

PROJECT_REF = "baoboggeqhksaxkuudap"
ACCESS_TOKEN = "sbp_bf907a9ca211f2204d9c53622208006dc5877cc1"

def run_sql(query):
    url = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/sql"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "query": query
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"✗ Erro SQL ({response.status_code}):")
            print(response.text)
            return None
    except Exception as e:
        print(f"✗ Erro na requisição: {str(e)}")
        return None

def main():
    print("🔎 Checking Brazil's Aeronaves...")
    query = """
    SELECT e.name, c.name as category, e.image_path
    FROM country_equipment ce
    JOIN equipment e ON ce.equipment_id = e.id
    JOIN categories c ON e.category_id = c.id
    JOIN countries cnt ON ce.country_id = cnt.id
    WHERE cnt.name = 'Brazil' AND c.name = 'Aeronaves'
    ORDER BY e.name;
    """
    result = run_sql(query)
    if result:
        print(json.dumps(result, indent=2))
        
    print("\n🔎 Checking Brazil's Armored Vehicles (Veículos Blindados)...")
    query_blindados = """
    SELECT e.name, c.name as category
    FROM country_equipment ce
    JOIN equipment e ON ce.equipment_id = e.id
    JOIN categories c ON e.category_id = c.id
    JOIN countries cnt ON ce.country_id = cnt.id
    WHERE cnt.name = 'Brazil' AND c.name ILIKE '%Blindados%'
    ORDER BY e.name;
    """
    result_blindados = run_sql(query_blindados)
    if result_blindados:
        print(json.dumps(result_blindados, indent=2))

if __name__ == "__main__":
    main()
