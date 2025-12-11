#!/usr/bin/env python3
"""List available projects"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).parent / '.env'
load_dotenv(env_path)

from supabase_helpers import SupabaseRagStore, get_supabase_client

def list_projects():
    client = get_supabase_client()
    rag_store = SupabaseRagStore(client)
    
    projects = rag_store.list_projects()
    
    print(f"Found {len(projects)} projects:\n")
    
    for project in projects[:10]:  # Show first 10
        print(f"ID: {project.get('project_id')} - Name: {project.get('project_name', 'N/A')}")

if __name__ == "__main__":
    list_projects()