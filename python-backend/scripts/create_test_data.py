#!/usr/bin/env python3
"""Create test meeting data in Supabase"""
import os
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime, timedelta
import uuid

# Load environment variables
env_path = Path(__file__).parent / '.env'
load_dotenv(env_path)

from supabase_helpers import SupabaseRagStore, get_supabase_client, DocumentChunk

def create_test_data():
    print("Creating test meeting data...")
    
    client = get_supabase_client()
    rag_store = SupabaseRagStore(client)
    
    # Create test document metadata
    doc_id = str(uuid.uuid4())
    metadata = {
        "id": doc_id,
        "project_id": 5,  # Using existing project
        "fireflies_id": f"TEST-{datetime.now().strftime('%Y%m%d')}",
        "title": "Weekly Team Sync - ASRS Project Update",
        "source_type": "fireflies",
        "captured_at": datetime.now().isoformat(),
        "content_hash": f"hash_{doc_id}",
        # metadata field removed - doesn't exist in schema
    }
    
    # Insert document metadata
    rag_store.upsert_document_metadata(metadata)
    print(f"Created document: {doc_id}")
    
    # Create test chunks
    chunks = []
    
    # Meeting chunk 1
    chunks.append(DocumentChunk(
        document_id=doc_id,
        chunk_index=0,
        chunk_id=f"{doc_id}_0",
        text="[00:00] **John Smith**: Good morning everyone. Let's start with the ASRS project update. We've made significant progress on the warehouse automation system this week.",
        metadata={
            "project_id": 5,
            "title": metadata["title"],
            "date": datetime.now().strftime("%Y-%m-%d"),
            "participants": ["John Smith", "Jane Doe", "Bob Johnson"],
            "chunk_type": "transcript"
        }
    ))
    
    # Meeting chunk 2
    chunks.append(DocumentChunk(
        document_id=doc_id,
        chunk_index=1,
        chunk_id=f"{doc_id}_1",
        text="[05:30] **Jane Doe**: The conveyor integration is complete. We're seeing a 40% improvement in throughput. However, we encountered some issues with the barcode scanners that need addressing.",
        metadata={
            "project_id": 5,
            "title": metadata["title"],
            "date": datetime.now().strftime("%Y-%m-%d"),
            "participants": ["John Smith", "Jane Doe", "Bob Johnson"],
            "chunk_type": "transcript"
        }
    ))
    
    # Meeting chunk 3
    chunks.append(DocumentChunk(
        document_id=doc_id,
        chunk_index=2,
        chunk_id=f"{doc_id}_2",
        text="[10:15] **Bob Johnson**: I'll take ownership of the scanner issue. We need to coordinate with the vendor for a firmware update. This is a critical blocker for next week's deployment.",
        metadata={
            "project_id": 5,
            "title": metadata["title"],
            "date": datetime.now().strftime("%Y-%m-%d"),
            "participants": ["John Smith", "Jane Doe", "Bob Johnson"],
            "chunk_type": "transcript"
        }
    ))
    
    # Meeting chunk 4 - Summary
    chunks.append(DocumentChunk(
        document_id=doc_id,
        chunk_index=3,
        chunk_id=f"{doc_id}_3",
        text="Meeting Summary: ASRS project is progressing well with conveyor integration complete. Key blocker identified with barcode scanners. Bob Johnson to coordinate vendor fix. Target deployment date remains on schedule pending scanner resolution.",
        metadata={
            "project_id": 5,
            "title": metadata["title"],
            "date": datetime.now().strftime("%Y-%m-%d"),
            "participants": ["John Smith", "Jane Doe", "Bob Johnson"],
            "chunk_type": "summary"
        }
    ))
    
    # Insert chunks
    rag_store.upsert_chunks(chunks)
    print(f"Created {len(chunks)} chunks")
    
    # Create test tasks
    tasks = [
        {
            "id": str(uuid.uuid4()),
            "project_id": 5,
            "description": "Coordinate with scanner vendor for firmware update",
            "owner": "Bob Johnson",
            "status": "pending",
            "due_date": (datetime.now() + timedelta(days=3)).isoformat(),
            "meeting_title": metadata["title"],
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "project_id": 5,
            "description": "Complete conveyor integration testing",
            "owner": "Jane Doe",
            "status": "completed",
            "meeting_title": metadata["title"],
            "created_at": datetime.now().isoformat()
        }
    ]
    
    rag_store.upsert_tasks(tasks)
    print(f"Created {len(tasks)} tasks")
    
    # Create test insight
    insight = {
        "id": str(uuid.uuid4()),
        "project_id": 5,
        "insight_type": "risk",
        "insight": "Scanner compatibility issues pose deployment risk",
        "evidence": "Bob Johnson identified scanner firmware incompatibility as critical blocker",
        "captured_at": datetime.now().isoformat()
    }
    
    rag_store.insert_insight(insight)
    print("Created 1 insight")
    
    # Create additional meetings for "last 5 meetings" query
    for i in range(1, 5):
        doc_id = str(uuid.uuid4())
        meeting_date = datetime.now() - timedelta(days=i*7)
        
        # Create document
        metadata = {
            "id": doc_id,
            "project_id": 5,
            "fireflies_id": f"TEST-{meeting_date.strftime('%Y%m%d')}",
            "title": f"Weekly Team Sync - Week {i}",
            "source_type": "fireflies",
            "captured_at": meeting_date.isoformat(),
            "content_hash": f"hash_{doc_id}",
        }
        rag_store.upsert_document_metadata(metadata)
        
        # Create a chunk for each meeting
        chunk = DocumentChunk(
            document_id=doc_id,
            chunk_index=0,
            chunk_id=f"{doc_id}_0",
            text=f"Meeting {i}: Discussed project progress. Key topics included timeline updates, resource allocation, and technical challenges.",
            metadata={
                "project_id": 5,
                "title": metadata["title"],
                "date": meeting_date.strftime("%Y-%m-%d"),
                "participants": ["John Smith", "Jane Doe"],
                "chunk_type": "transcript"
            }
        )
        rag_store.upsert_chunks([chunk])
    
    print("\nTest data creation complete!")
    
    # Verify the data
    print("\nVerifying data...")
    chunks = rag_store.fetch_recent_chunks(limit=5)
    print(f"✓ Found {len(chunks)} recent chunks")
    
    tasks = rag_store.list_tasks(limit=5)
    print(f"✓ Found {len(tasks)} tasks")
    
    insights = rag_store.list_insights(limit=5)
    print(f"✓ Found {len(insights)} insights")

if __name__ == "__main__":
    create_test_data()