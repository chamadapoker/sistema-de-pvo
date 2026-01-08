import os
from supabase import create_client
import sys

# URL from the python script I saw
SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
# Key from the python script (Service Role)
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

def check_supabase():
    print(f"Testing connection to: {SUPABASE_URL}")
    try:
        sp = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Try to list users (requires admin/service_role rights)
        print("Attempting to list users...")
        users = sp.auth.admin.list_users()
        
        print("✅ Connection Successful!")
        print(f"✅ Found {len(users)} users in authentication system.")
        
        # Try a table query
        print("Attempting to query 'equipment' table...")
        courses = sp.table('equipment').select('*').limit(1).execute()
        print("✅ Table query successful!")
        
    except Exception as e:
        print(f"❌ Connection Failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    check_supabase()
