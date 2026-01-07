import os
from supabase import create_client

SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

def create_supabase_auth_users():
    print("🔐 Criando usuários no Supabase Auth...")
    sp = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    test_users = [
        {
            'email': 'aluno@pvo.mil.br',
            'password': 'aluno123',
            'name': 'Aluno Teste',
            'role': 'STUDENT'
        },
        {
            'email': 'instrutor@pvo.mil.br',
            'password': 'instrutor123',
            'name': 'Instrutor Teste',
            'role': 'INSTRUCTOR'
        },
        {
            'email': 'admin@pvo.mil.br',
            'password': 'admin123',
            'name': 'Admin Teste',
            'role': 'ADMIN'
        }
    ]
    
    for user_data in test_users:
        try:
            # Create user in Supabase Auth
            result = sp.auth.admin.create_user({
                'email': user_data['email'],
                'password': user_data['password'],
                'email_confirm': True,  # Auto-confirm email
                'user_metadata': {
                    'name': user_data['name'],
                    'role': user_data['role']
                }
            })
            
            print(f"✅ {user_data['email']} criado com sucesso")
            print(f"   🔑 Senha: {user_data['password']}")
            print(f"   👤 Nome: {user_data['name']}")
            print(f"   🎭 Role: {user_data['role']}")
                
        except Exception as e:
            error_msg = str(e)
            if 'already exists' in error_msg.lower() or 'duplicate' in error_msg.lower():
                print(f"✅ {user_data['email']} já existe")
                print(f"   🔑 Senha: {user_data['password']}")
            else:
                print(f"❌ Erro ao processar {user_data['email']}: {e}")
    
    print("\n✅ Processo concluído!")
    print("\n📋 Credenciais de Teste:")
    print("-" * 70)
    for user_data in test_users:
        print(f"{user_data['role']:12} | {user_data['email']:25} | {user_data['password']}")
    print("-" * 70)

if __name__ == "__main__":
    create_supabase_auth_users()
