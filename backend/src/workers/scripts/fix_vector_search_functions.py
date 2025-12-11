#!/usr/bin/env python3
"""
Diagnostic and fix script for vector search function overloading issue
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

def check_existing_functions(client: Client):
    """Check what match_document_chunks functions currently exist"""
    print("Checking existing match_document_chunks functions...")
    
    query = """
    SELECT 
        p.oid,
        p.proname as function_name,
        pg_get_function_arguments(p.oid) as arguments,
        pg_get_function_result(p.oid) as return_type
    FROM 
        pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE 
        n.nspname = 'public' 
        AND p.proname = 'match_document_chunks'
    ORDER BY p.oid;
    """
    
    result = client.rpc("execute_sql", {"query": query}).execute()
    
    if result.data:
        print(f"\nFound {len(result.data)} overloaded versions:")
        for i, func in enumerate(result.data, 1):
            print(f"\n{i}. OID: {func['oid']}")
            print(f"   Arguments: {func['arguments']}")
            print(f"   Returns: {func['return_type']}")
    else:
        print("No match_document_chunks functions found.")
    
    return result.data

def generate_drop_statements(functions):
    """Generate DROP statements for all function signatures"""
    print("\n\nGenerating DROP statements...")
    
    drop_statements = []
    
    # Add known signatures
    known_signatures = [
        "DROP FUNCTION IF EXISTS public.match_document_chunks(public.vector, integer, double precision);",
        "DROP FUNCTION IF EXISTS public.match_document_chunks(query_embedding public.vector, match_count integer, match_threshold double precision);",
        "DROP FUNCTION IF EXISTS public.match_document_chunks(integer, double precision, public.vector);",
        "DROP FUNCTION IF EXISTS public.match_document_chunks(match_count integer, match_threshold double precision, query_embedding public.vector);",
    ]
    
    drop_statements.extend(known_signatures)
    
    # Add CASCADE drop as final fallback
    drop_statements.append("DROP FUNCTION IF EXISTS public.match_document_chunks CASCADE;")
    
    print("\nDROP statements to execute:")
    for stmt in drop_statements:
        print(f"  {stmt}")
    
    return drop_statements

def test_vector_search(client: Client):
    """Test the vector search function"""
    print("\n\nTesting vector search function...")
    
    try:
        # Create a test embedding (zeros)
        test_embedding = [0.0] * 1536
        
        # Test with named parameters
        print("Testing with named parameters...")
        result = client.rpc("match_document_chunks", {
            "query_embedding": test_embedding,
            "match_count": 5,
            "match_threshold": 0.0
        }).execute()
        
        if result.data:
            print(f"✅ Function works! Found {len(result.data)} results")
            if len(result.data) > 0:
                print(f"   First result similarity: {result.data[0].get('similarity', 'N/A')}")
        else:
            print("✅ Function works! (No results returned, but no error)")
            
    except Exception as e:
        print(f"❌ Error testing function: {str(e)}")
        return False
    
    return True

def main():
    # Initialize Supabase client
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    
    if not url or not key:
        print("Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set")
        return
    
    client = create_client(url, key)
    
    print("=== Vector Search Function Diagnostic Tool ===\n")
    
    # Step 1: Check existing functions
    existing_functions = check_existing_functions(client)
    
    if len(existing_functions) > 1:
        print(f"\n⚠️  PROBLEM IDENTIFIED: {len(existing_functions)} overloaded functions found!")
        print("This is causing the 'Could not choose the best candidate function' error.")
        
        # Step 2: Generate fix
        drop_statements = generate_drop_statements(existing_functions)
        
        print("\n\n=== SOLUTION ===")
        print("Run the SQL script in /sql/fix_vector_search_overloading.sql")
        print("This will:")
        print("1. Drop all existing overloaded versions")
        print("2. Create a single function with named parameters")
        print("3. Set up proper permissions and indexes")
        print("4. Test the function")
        
    elif len(existing_functions) == 1:
        print("\n✅ Only one function exists. Testing if it works...")
        if test_vector_search(client):
            print("\n✅ Vector search is working correctly!")
        else:
            print("\n⚠️  Function exists but is not working. Run the fix script.")
    else:
        print("\n⚠️  No match_document_chunks function found. Run the fix script to create it.")

if __name__ == "__main__":
    main()