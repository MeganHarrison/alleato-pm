#!/usr/bin/env python3
"""
Backfill missing embeddings for decisions, risks, and opportunities tables
"""
import os
import sys
from pathlib import Path

# Add parent directories to Python path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))  # src

# Load environment variables from root
from services.env_loader import load_env
load_env()

from openai import OpenAI
from services.supabase_helpers import get_supabase_client


def create_embedding(text: str, client: OpenAI) -> list[float]:
    """Create embedding for text using OpenAI."""
    try:
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Error creating embedding: {e}")
        return None


def backfill_embeddings():
    """Backfill missing embeddings for all tables."""
    print("=== Backfilling Missing Embeddings ===")
    
    # Initialize clients
    supabase = get_supabase_client()
    openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    # Process decisions
    print("\n1. Processing DECISIONS...")
    decisions = supabase.table('decisions').select('*').is_('embedding', 'null').execute()
    print(f"   Found {len(decisions.data)} decisions without embeddings")
    
    for decision in decisions.data:
        # Create embedding text from description and rationale
        text = f"{decision.get('description', '')} {decision.get('rationale', '')}".strip()
        if text:
            print(f"   - Creating embedding for decision {decision['id'][:8]}...")
            embedding = create_embedding(text, openai_client)
            if embedding:
                supabase.table('decisions').update({'embedding': embedding}).eq('id', decision['id']).execute()
                print(f"     ✓ Updated embedding for decision {decision['id'][:8]}")
            else:
                print(f"     ✗ Failed to create embedding for decision {decision['id'][:8]}")
    
    # Process risks
    print("\n2. Processing RISKS...")
    risks = supabase.table('risks').select('*').is_('embedding', 'null').execute()
    print(f"   Found {len(risks.data)} risks without embeddings")
    
    for risk in risks.data:
        # Create embedding text from description
        text = risk.get('description', '').strip()
        if text:
            print(f"   - Creating embedding for risk {risk['id'][:8]}...")
            embedding = create_embedding(text, openai_client)
            if embedding:
                supabase.table('risks').update({'embedding': embedding}).eq('id', risk['id']).execute()
                print(f"     ✓ Updated embedding for risk {risk['id'][:8]}")
            else:
                print(f"     ✗ Failed to create embedding for risk {risk['id'][:8]}")
    
    # Process opportunities
    print("\n3. Processing OPPORTUNITIES...")
    opportunities = supabase.table('opportunities').select('*').is_('embedding', 'null').execute()
    print(f"   Found {len(opportunities.data)} opportunities without embeddings")
    
    for opp in opportunities.data:
        # Create embedding text from description
        text = opp.get('description', '').strip()
        if text:
            print(f"   - Creating embedding for opportunity {opp['id'][:8]}...")
            embedding = create_embedding(text, openai_client)
            if embedding:
                supabase.table('opportunities').update({'embedding': embedding}).eq('id', opp['id']).execute()
                print(f"     ✓ Updated embedding for opportunity {opp['id'][:8]}")
            else:
                print(f"     ✗ Failed to create embedding for opportunity {opp['id'][:8]}")
    
    # Final summary
    print("\n=== Backfill Complete ===")
    
    # Re-check counts
    decisions_without = supabase.table('decisions').select('id', count='exact').is_('embedding', 'null').execute()
    risks_without = supabase.table('risks').select('id', count='exact').is_('embedding', 'null').execute()
    opps_without = supabase.table('opportunities').select('id', count='exact').is_('embedding', 'null').execute()
    
    print(f"Remaining without embeddings:")
    print(f"  - Decisions: {decisions_without.count}")
    print(f"  - Risks: {risks_without.count}")
    print(f"  - Opportunities: {opps_without.count}")


if __name__ == "__main__":
    backfill_embeddings()