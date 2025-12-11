#!/usr/bin/env python3
"""
Simple Document Processing Script
================================

Process documents through the pipeline stages locally.

Usage:
    python process_documents.py --limit 10
    python process_documents.py --limit 100 --skip-embedding
"""

import os
import sys
import time
import logging
from typing import List, Dict
from supabase import create_client
import requests
from dotenv import load_dotenv
import argparse

# Load environment variables
load_dotenv()

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Worker endpoints
PARSER_URL = "https://fireflies-parser.megan-d14.workers.dev"
EMBEDDER_URL = "https://fireflies-embedder.megan-d14.workers.dev"
EXTRACTOR_URL = "https://fireflies-extractor.megan-d14.workers.dev"

# Initialize Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)


def get_pending_documents(stage: str, limit: int) -> List[Dict]:
    """Get documents in a specific stage"""
    response = supabase.table("fireflies_ingestion_jobs") \
        .select("fireflies_id,metadata_id") \
        .eq("stage", stage) \
        .limit(limit) \
        .execute()
    
    return response.data


def call_worker(url: str, endpoint: str, data: Dict) -> Dict:
    """Call a worker endpoint"""
    response = requests.post(f"{url}/{endpoint}", json=data)
    response.raise_for_status()
    return response.json()


def process_document_stages(fireflies_id: str, metadata_id: str, 
                          skip_embedding: bool = False, 
                          skip_extraction: bool = False):
    """Process a document through all stages"""
    
    # Get current stage
    job_data = supabase.table("fireflies_ingestion_jobs") \
        .select("stage") \
        .eq("fireflies_id", fireflies_id) \
        .single() \
        .execute()
    
    current_stage = job_data.data['stage']
    
    try:
        # Parse stage
        if current_stage == "raw_ingested":
            logger.info(f"Parsing {fireflies_id}")
            result = call_worker(PARSER_URL, "parse", {"metadataId": metadata_id})
            if not result.get('success'):
                raise Exception(f"Parser failed: {result}")
            current_stage = "segmented"
        
        # Embedding stage
        if current_stage == "segmented" and not skip_embedding:
            logger.info(f"Embedding {fireflies_id}")
            result = call_worker(EMBEDDER_URL, "embed", {"metadataId": metadata_id})
            if not result.get('success'):
                raise Exception(f"Embedder failed: {result}")
            current_stage = "embedded"
        
        # Extraction stage
        if current_stage == "embedded" and not skip_extraction:
            logger.info(f"Extracting {fireflies_id}")
            result = call_worker(EXTRACTOR_URL, "extract", {"metadataId": metadata_id})
            if not result.get('success'):
                raise Exception(f"Extractor failed: {result}")
            current_stage = "done"
        
        logger.info(f"✓ Completed {fireflies_id} - stage: {current_stage}")
        return True
        
    except Exception as e:
        logger.error(f"✗ Failed {fireflies_id}: {e}")
        
        # Update job with error
        supabase.table("fireflies_ingestion_jobs") \
            .update({
                "stage": "error",
                "error_message": str(e)
            }) \
            .eq("fireflies_id", fireflies_id) \
            .execute()
        
        return False


def main():
    parser = argparse.ArgumentParser(description='Process documents through pipeline')
    parser.add_argument('--limit', type=int, default=10, help='Number of documents to process')
    parser.add_argument('--skip-embedding', action='store_true', help='Skip embedding stage')
    parser.add_argument('--skip-extraction', action='store_true', help='Skip extraction stage')
    parser.add_argument('--start-stage', default='raw_ingested', 
                       choices=['raw_ingested', 'segmented', 'embedded'],
                       help='Stage to start from')
    
    args = parser.parse_args()
    
    logger.info(f"Starting document processing...")
    logger.info(f"Options: limit={args.limit}, start_stage={args.start_stage}")
    
    # Get documents to process
    documents = get_pending_documents(args.start_stage, args.limit)
    
    if not documents:
        logger.info("No documents to process")
        return
    
    logger.info(f"Found {len(documents)} documents to process")
    
    # Process statistics
    success = 0
    failed = 0
    start_time = time.time()
    
    # Process each document
    for i, doc in enumerate(documents):
        fireflies_id = doc['fireflies_id']
        metadata_id = doc['metadata_id']
        
        logger.info(f"\n[{i+1}/{len(documents)}] Processing {fireflies_id}")
        
        if process_document_stages(fireflies_id, metadata_id, 
                                  args.skip_embedding, 
                                  args.skip_extraction):
            success += 1
        else:
            failed += 1
        
        # Rate limiting
        time.sleep(1)  # 1 second between documents
    
    # Summary
    elapsed = time.time() - start_time
    logger.info("\n" + "="*50)
    logger.info(f"Processing complete in {elapsed:.1f} seconds")
    logger.info(f"Success: {success}/{len(documents)}")
    logger.info(f"Failed: {failed}/{len(documents)}")
    logger.info(f"Rate: {len(documents)/elapsed:.2f} docs/second")


if __name__ == "__main__":
    main()