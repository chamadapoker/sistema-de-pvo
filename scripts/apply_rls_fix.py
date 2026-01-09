
import os
from supabase import create_client, Client

SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ"

def run_sql_script(script_path):
    print(f"Running SQL script: {script_path}")
    
    with open(script_path, 'r', encoding='utf-8') as f:
        sql = f.read()

    # Split assertions or multiple statements if needed, 
    # but the management API (via postgrest/postgres) usually handles blocks if sent via rpc or special endpoint.
    # However, the python client `rpc` is best for functions. 
    # For raw SQL, we sadly don't have a direct `client.query(sql)` in the standard client without extensions or server-side functions.
    # WE MUST HAVE A Postgres Function `exec_sql(sql_query text)` to run raw SQL.
    # Checking if we have one... previous contexts suggest we might have created one or used `db execute`.
    
    # Alternative: The user has `supabase db execute` or similar tools? 
    # The setup_database.py used `requests.post(.../v1/query)` which is the Management API? 
    # No, it likely used a helper.
    
    # PROVEN METHOD:
    # Use the `v1/query` endpoint for the PROJECT if we have the SERVICE KEY matching the management role?
    # Actually, previous scripts used `supabase.rpc('exec_sql', ...)` or just failed.
    # Let's try to assume `exec_sql` exists or use the `requests` approach to the REST API if we can.
    
    # Wait, the best way for the Agent is to use the `setup_database.py` style if it worked, or assume there is an `exec_sql` RPC function.
    # Let's try to CALL the RPC `exec_sql`. If it doesn't exist, we must create it via the REST API or fail.
    
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    try:
        response = supabase.rpc('exec_sql', {'sql_query': sql}).execute()
        print("✅ SQL Executed successfully via RPC.")
        print(response)
    except Exception as e:
        print(f"⚠️ RPC 'exec_sql' failed: {e}")
        print("Attempting to create generic exec_sql function first...")
        
        # This part is tricky without direct SQL access. 
        # But wait, previous turns showed `execute_fix_categories.py` doing direct updates.
        # It didn't run RAW SQL.
        
        print("❌ Cannot run raw SQL directly without a helper function. Please ask the user to run the SQL in their Supabase Dashboard.")

if __name__ == "__main__":
    run_sql_script("c:/Users/Yoda/Downloads/DVD PVO 2010/PVO-Modern/scripts/fix_test_rls_policies.sql")
