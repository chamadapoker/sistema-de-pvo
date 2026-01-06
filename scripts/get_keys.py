import requests

PROJECT_REF = "baoboggeqhksaxkuudap"
# O token sbp_ é um Personal Access Token
ACCESS_TOKEN = "sbp_bf907a9ca211f2204d9c53622208006dc5877cc1"

def get_api_keys():
    url = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/api-keys"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}"
    }
    
    print(f"Buscando chaves para o projeto: {PROJECT_REF}")
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            keys = response.json()
            print("\n✅ Chaves encontradas:")
            for key in keys:
                print(f"{key['name']}: {key['api_key']}")
            return keys
        else:
            print(f"❌ Erro ao buscar chaves: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"❌ Erro na requisição: {str(e)}")
        return None

if __name__ == "__main__":
    get_api_keys()
