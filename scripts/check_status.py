import requests

PROJECT_REF = "baoboggeqhksaxkuudap"
ACCESS_TOKEN = "sbp_bf907a9ca211f2204d9c53622208006dc5877cc1"

def check_project_status():
    url = f"https://api.supabase.com/v1/projects/{PROJECT_REF}"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}"
    }
    
    print(f"Verificando status do projeto: {PROJECT_REF}")
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f"Status: {data.get('status')}")
            print(f"Name: {data.get('name')}")
            print(f"Region: {data.get('region')}")
        else:
            print(f"Erro: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Erro: {str(e)}")

if __name__ == "__main__":
    check_project_status()
