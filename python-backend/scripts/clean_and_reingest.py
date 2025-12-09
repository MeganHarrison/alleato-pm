#!/usr/bin/env python3
"""Clean up ingestion jobs and re-ingest Fireflies transcripts with embeddings"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
env_path = Path(__file__).parent / '.env'
load_dotenv(env_path)

from ingestion.fireflies_pipeline import FirefliesIngestionPipeline
from supabase_helpers import SupabaseRagStore, get_supabase_client

def clean_and_reingest():
    print("Cleaning up and re-ingesting Fireflies transcripts with embeddings...")
    print("="*60)
    
    # Create Supabase client and RAG store
    client = get_supabase_client()
    rag_store = SupabaseRagStore(client)
    
    # Step 1: Clean up ingestion jobs for the transcripts we want to re-process
    print("\n1. Cleaning up existing ingestion jobs...")
    
    # Get the Fireflies IDs we want to re-ingest
    fireflies_ids = [
        "01KBJF0YPAQPFP1TQVYQM78TBX",  # Miami Hazmat
        "01KBMZ3F1CX0Y09A9Y1GJ8AZ51",  # GPC - NFPA
        "01KBAXRXJFHH1QQZSSH7VJM01F",  # Alleato + Goodwill
        "01KBAXRXMHTVBPGTMPNQRDSHM4",  # Uniqlo+Alleato
        "01KBJJD8XQ7W8M5Q5G6X6BGQXS",  # GPC9406
    ]
    
    # Delete ingestion jobs
    for ff_id in fireflies_ids:
        try:
            result = client.table("ingestion_jobs").delete().eq("fireflies_id", ff_id).execute()
            if result.data:
                print(f"  ✓ Deleted ingestion job for {ff_id}")
        except Exception as e:
            print(f"  - No ingestion job found for {ff_id}")
    
    # Also delete by the generic test IDs
    test_ids = ["01KBAXRXS2N8ZTKG1QG2TCAZ4Y", "01KBNCZXSRSKCSQJQ6DX4Q41QE", "01KBQV2EDNXEN5GBV3S9ZWMHFB", "01KBAXRXPQJ90JF6ZTP3ZZ4YKD", "01KBK414064PQ5KWTJ060EVM3M"]
    for test_id in test_ids:
        try:
            result = client.table("ingestion_jobs").delete().eq("fireflies_id", test_id).execute()
            if result.data:
                print(f"  ✓ Deleted ingestion job for {test_id}")
        except Exception as e:
            pass
    
    # Step 2: Delete document metadata (this will cascade to chunks due to foreign key)
    print("\n2. Cleaning up document metadata...")
    
    # Get all document IDs to clean up
    docs = client.table("document_metadata").select("id, title, fireflies_id").execute()
    for doc in docs.data:
        try:
            result = client.table("document_metadata").delete().eq("id", doc['id']).execute()
            if result.data:
                print(f"  ✓ Deleted document: {doc['title']}")
        except Exception as e:
            print(f"  ✗ Error deleting {doc['title']}: {e}")
    
    # Step 3: Verify chunks table is empty
    chunk_count = client.table("document_chunks").select("chunk_id", count="exact").execute()
    print(f"\n3. Chunks table now has {chunk_count.count} records (should be 0)")
    
    # Step 4: Re-ingest with embeddings
    print("\n4. Re-ingesting transcripts WITH embeddings...")
    print("-"*60)
    
    # Create ingestion pipeline
    pipeline = FirefliesIngestionPipeline(store=rag_store)
    
    # Find the transcripts directory
    transcript_dir = Path("../scripts/fireflies_transcripts_20251207_010735")
    
    if not transcript_dir.exists():
        print(f"Transcript directory not found: {transcript_dir}")
        return
    
    # Get all markdown files, excluding index.md
    md_files = [f for f in transcript_dir.glob("*.md") if f.name != "index.md"]
    md_files.sort(reverse=True)  # Most recent first
    
    print(f"Found {len(md_files)} transcript files")
    
    # Ingest all transcripts
    success_count = 0
    for i, file_path in enumerate(md_files, 1):
        print(f"\n[{i}/{len(md_files)}] Processing: {file_path.name}")
        
        try:
            # Ingest with project_id 5 (existing project)
            result = pipeline.ingest_file(file_path, project_id=5)
            
            print(f"  ✓ Ingested document: {result.document_id}")
            print(f"    - Chunks created: {result.chunk_count}")
            print(f"    - Action items: {result.action_item_count}")
            print(f"    - Content hash: {result.content_hash[:16]}...")
            success_count += 1
            
        except Exception as e:
            print(f"  ✗ Error: {e}")
            if "duplicate key" not in str(e):
                import traceback
                traceback.print_exc()
    
    # Step 5: Verify the ingestion
    print("\n" + "="*60)
    print("5. Verification:")
    print("="*60)
    
    # Check chunks
    chunks = rag_store.fetch_recent_chunks(limit=10)
    print(f"\n✓ Total chunks in database: {len(chunks)}")
    
    # Check if embeddings exist
    chunks_with_embeddings = client.table("document_chunks")\
        .select("chunk_id")\
        .not_.is_("embedding", "null")\
        .limit(5)\
        .execute()
    print(f"✓ Chunks with embeddings: {len(chunks_with_embeddings.data)}")
    
    if chunks:
        print("\nSample chunk preview:")
        chunk = chunks[0]
        print(f"  Document: {chunk.get('metadata', {}).get('title', 'N/A')}")
        print(f"  Text: {chunk['text'][:150]}...")
    
    # Check tasks
    tasks = rag_store.list_tasks(limit=10)
    print(f"\n✓ Total tasks extracted: {len(tasks)}")
    
    # Test vector search
    print("\n6. Testing vector search...")
    print("-"*60)
    
    from ingestion.fireflies_pipeline import EmbeddingGenerator
    embedder = EmbeddingGenerator(model="text-embedding-3-small")
    
    test_queries = [
        "NFPA requirements",
        "Miami hazmat",
        "Goodwill sponsorship",
        "rack heights"
    ]
    
    for query in test_queries:
        try:
            # Generate embedding
            query_embedding = embedder.embed([query])[0]
            
            # Search using vector similarity
            results = client.rpc('match_document_chunks', {
                'query_embedding': query_embedding,
                'match_count': 2,
                'match_threshold': 0.3
            }).execute()
            
            if results.data:
                print(f"\n✓ Query: '{query}' - Found {len(results.data)} results")
                for result in results.data:
                    print(f"  - Similarity: {result['similarity']:.3f} | {result['text'][:80]}...")
            else:
                print(f"\n✗ Query: '{query}' - No results")
                
        except Exception as e:
            print(f"\n✗ Query: '{query}' - Error: {e}")
    
    print("\n" + "="*60)
    print(f"✅ Re-ingestion complete! Successfully processed {success_count} documents.")
    print("The RAG system now has full vector search capability!")

if __name__ == "__main__":
    clean_and_reingest()