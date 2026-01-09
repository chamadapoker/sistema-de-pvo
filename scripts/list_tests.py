
from supabase import create_client, Client
import json

SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def list_tests():
    print("Listing all tests in DB...")
    try:
        res = supabase.table('tests').select('id, name, status, created_at, scheduled_at').execute()
        print(json.dumps(res.data, indent=2))
        
        if not res.data:
            print("⚠️ No tests found in the database!")
    except Exception as e:
        print(f"Error accessing tests: {e}")

if __name__ == "__main__":
    list_tests()
