#!/usr/bin/env python3
"""
Quick fix for document_metadata status based on ingestion job status
"""
import os
import sys
from pathlib import Path

# Add parent directories to Python path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))  # src

# Load environment variables from root
from services.env_loader import load_env
load_env()

from services.supabase_helpers import get_supabase_client


def quick_status_fix():
    """Quick fix based on ingestion job status."""
    print("=== Quick Document Status Fix ===\n")
    
    client = get_supabase_client()
    
    # Strategy: Use ingestion job status as source of truth
    print("1. Getting all ingestion jobs...")
    jobs = client.table('fireflies_ingestion_jobs').select('metadata_id, stage').execute()
    
    # Group by stage
    jobs_by_stage = {}
    for job in jobs.data:
        if job.get('metadata_id'):
            stage = job['stage']
            if stage not in jobs_by_stage:
                jobs_by_stage[stage] = []
            jobs_by_stage[stage].append(job['metadata_id'])
    
    print(f"\nJob distribution:")
    for stage, ids in jobs_by_stage.items():
        print(f"  {stage}: {len(ids)} jobs")
    
    # Update document status based on job stage
    updates = [
        ('done', 'complete'),
        ('embedded', 'embedded'),
        ('segmented', 'segmented'),
        ('raw_ingested', 'raw_ingested'),
    ]
    
    total_updated = 0
    for job_stage, doc_status in updates:
        if job_stage in jobs_by_stage:
            metadata_ids = jobs_by_stage[job_stage]
            print(f"\n2. Updating documents with job stage '{job_stage}' to status '{doc_status}'...")
            
            # Update in batches
            batch_size = 100
            batch_updated = 0
            
            for i in range(0, len(metadata_ids), batch_size):
                batch = metadata_ids[i:i+batch_size]
                result = client.table('document_metadata').update({'status': doc_status}).in_('id', batch).neq('status', doc_status).execute()
                batch_updated += len(result.data)
            
            print(f"   Updated {batch_updated} documents")
            total_updated += batch_updated
    
    # Handle documents without ingestion jobs (set to NULL or raw_ingested)
    print("\n3. Checking documents without ingestion jobs...")
    all_job_metadata_ids = []
    for ids in jobs_by_stage.values():
        all_job_metadata_ids.extend(ids)
    
    # Get documents without jobs
    all_docs = client.table('document_metadata').select('id').execute()
    docs_without_jobs = [doc['id'] for doc in all_docs.data if doc['id'] not in all_job_metadata_ids]
    
    if docs_without_jobs:
        print(f"   Found {len(docs_without_jobs)} documents without ingestion jobs")
        # These are likely old or manually added - leave them as is
    
    print(f"\n=== Summary ===")
    print(f"Total documents updated: {total_updated}")
    
    # Final status check
    print("\n=== Final Status Distribution ===")
    result = client.table('document_metadata').select('status').execute()
    status_counts = {}
    for doc in result.data:
        status = doc.get('status') or 'NULL'
        status_counts[status] = status_counts.get(status, 0) + 1
    
    print(f"Total documents: {len(result.data)}")
    for status, count in sorted(status_counts.items()):
        percentage = (count / len(result.data)) * 100
        print(f"  {status}: {count} ({percentage:.1f}%)")


if __name__ == "__main__":
    quick_status_fix()