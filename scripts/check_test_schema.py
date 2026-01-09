
from supabase import create_client, Client
import json

SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def check_table():
    print("Checking 'test_questions' table...")
    try:
        # Try to insert a dummy row or select to see schema (or just use introspection if we could, but straight query is easier)
        # Invalid query to force error with column hints or just select 1 row
        res = supabase.table('test_questions').select('*').limit(1).execute()
        print("Table exists. Data sample:")
        print(json.dumps(res.data, indent=2))
    except Exception as e:
        print(f"Error accessing test_questions: {e}")
        
    print("\nChecking 'tests' table...")
    try:
        res = supabase.table('tests').select('*').limit(1).execute()
        print("Table exists. Data sample:")
        print(json.dumps(res.data, indent=2))
    except Exception as e:
        print(f"Error accessing tests: {e}")

if __name__ == "__main__":
    check_table()
