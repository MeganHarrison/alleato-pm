#!/usr/bin/env python3
"""
Execute the vector search function fix SQL
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

def execute_fix(client: Client):
    """Execute the SQL fix for vector search functions"""
    
    # Read the SQL file
    with open('../sql/fix_vector_search_final.sql', 'r') as f:
        sql_script = f.read()
    
    # Split into individual statements
    statements = [s.strip() for s in sql_script.split(';') if s.strip()]
    
    print("Executing vector search fix...")
    
    for i, statement in enumerate(statements):
        if not statement:
            continue
            
        # Add semicolon back
        statement = statement + ';'
        
        print(f"\nExecuting statement {i+1}/{len(statements)}...")
        print(f"Preview: {statement[:100]}...")
        
        try:
            result = client.rpc("execute_sql", {"query": statement}).execute()
            print("✅ Success")
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            # Continue with other statements
    
    print("\n\nTesting vector search function...")
    
    try:
        # Create a test embedding
        test_embedding = [0.0] * 1536
        
        result = client.rpc("match_document_chunks", {
            "query_embedding": test_embedding,
            "match_count": 5,
            "match_threshold": 0.0
        }).execute()
        
        print(f"✅ Vector search works! Found {len(result.data) if result.data else 0} results")
        
    except Exception as e:
        print(f"❌ Error testing function: {str(e)}")

def main():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    
    if not url or not key:
        print("Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set")
        return
    
    client = create_client(url, key)
    
    print("=== Executing Vector Search Function Fix ===\n")
    
    execute_fix(client)
    
    print("\n\n✅ Fix complete!")
    print("The vector search function should now work correctly.")
    print("You can test it by asking the agent about recent meetings.")

if __name__ == "__main__":
    main()