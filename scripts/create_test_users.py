import os
from supabase import create_client
import hashlib

SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

def hash_password(password: str) -> str:
    """Simple hash for demo - in production use proper bcrypt"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_test_users():
    print("🔐 Criando usuários de teste no Supabase...")
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
            # Check if user exists
            existing = sp.table('users').select('*').eq('email', user_data['email']).execute()
            
            if existing.data:
                print(f"✅ {user_data['email']} já existe")
                # Update password if needed
                sp.table('users').update({
                    'password': hash_password(user_data['password']),
                    'name': user_data['name'],
                    'role': user_data['role']
                }).eq('email', user_data['email']).execute()
                print(f"   📝 Senha atualizada para: {user_data['password']}")
            else:
                # Create new user
                result = sp.table('users').insert({
                    'email': user_data['email'],
                    'password': hash_password(user_data['password']),
                    'name': user_data['name'],
                    'role': user_data['role']
                }).execute()
                print(f"✅ {user_data['email']} criado com sucesso")
                print(f"   🔑 Senha: {user_data['password']}")
                
        except Exception as e:
            print(f"❌ Erro ao processar {user_data['email']}: {e}")
    
    print("\n✅ Processo concluído!")
    print("\n📋 Credenciais de Teste:")
    print("-" * 50)
    for user_data in test_users:
        print(f"{user_data['role']:12} | {user_data['email']:25} | {user_data['password']}")

if __name__ == "__main__":
    create_test_users()
