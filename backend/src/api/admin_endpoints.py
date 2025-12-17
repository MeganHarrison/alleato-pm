"""
Admin API endpoints for document pipeline management
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import logging
import asyncio
import subprocess
from datetime import datetime
from pathlib import Path
import sys

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from services.supabase_helpers import SupabaseRagStore
from services.env_loader import load_env

load_env()

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin", tags=["Admin"])

class EmbeddingGenerationRequest(BaseModel):
    stage: str = "raw_ingested"
    limit: Optional[int] = 10
    skip_extraction: bool = False
    skip_embedding: bool = False

class EmbeddingGenerationResponse(BaseModel):
    status: str
    message: str
    task_id: Optional[str] = None
    details: Optional[Dict[str, Any]] = None

def get_rag_store() -> SupabaseRagStore:
    return SupabaseRagStore()

# Store for tracking background tasks
_background_tasks = {}

@router.post("/documents/generate-embeddings", response_model=EmbeddingGenerationResponse)
async def trigger_generate_embeddings(
    request: EmbeddingGenerationRequest,
    background_tasks: BackgroundTasks,
    store: SupabaseRagStore = Depends(get_rag_store)
):
    """
    Trigger embedding generation for documents in the pipeline.
    
    This endpoint starts the document processing pipeline to generate embeddings
    for documents at the specified stage.
    """
    try:
        # Generate a task ID
        task_id = f"embed_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Check if there are documents to process
        supabase = store._client
        result = (
            supabase
            .table('fireflies_ingestion_jobs')
            .select('id', count='exact')
            .eq('stage', request.stage)
            .execute()
        )
        document_count = result.count or 0
        
        if document_count == 0:
            return EmbeddingGenerationResponse(
                status="no_documents",
                message=f"No documents found in stage '{request.stage}'",
                details={"stage": request.stage, "count": 0}
            )
        
        # Define the background task
        async def run_embedding_pipeline():
            try:
                logger.info(f"Starting embedding generation task {task_id}")
                
                # Prepare command arguments
                cmd = [
                    sys.executable,
                    "src/workers/scripts/process_documents.py",
                    "--start-stage", request.stage,
                    "--limit", str(request.limit)
                ]
                
                if request.skip_extraction:
                    cmd.append("--skip-extraction")
                if request.skip_embedding:
                    cmd.append("--skip-embedding")
                
                # Run the process
                process = await asyncio.create_subprocess_exec(
                    *cmd,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                    cwd=Path(__file__).parent.parent.parent  # backend directory
                )
                
                stdout, stderr = await process.communicate()
                
                # Store result
                _background_tasks[task_id] = {
                    "status": "completed" if process.returncode == 0 else "failed",
                    "stdout": stdout.decode() if stdout else "",
                    "stderr": stderr.decode() if stderr else "",
                    "return_code": process.returncode,
                    "completed_at": datetime.now().isoformat()
                }
                
                logger.info(f"Task {task_id} completed with return code {process.returncode}")
                
            except Exception as e:
                logger.error(f"Task {task_id} failed with error: {e}")
                _background_tasks[task_id] = {
                    "status": "error",
                    "error": str(e),
                    "completed_at": datetime.now().isoformat()
                }
        
        # Add to background tasks
        background_tasks.add_task(run_embedding_pipeline)
        
        # Store initial task status
        _background_tasks[task_id] = {
            "status": "running",
            "started_at": datetime.now().isoformat(),
            "parameters": request.dict()
        }
        
        return EmbeddingGenerationResponse(
            status="started",
            message=f"Embedding generation started for {document_count} documents",
            task_id=task_id,
            details={
                "stage": request.stage,
                "document_count": document_count,
                "limit": request.limit
            }
        )
        
    except Exception as e:
        logger.error(f"Error triggering embedding generation: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to trigger embedding generation: {str(e)}"
        )

@router.get("/documents/embedding-status/{task_id}")
async def get_embedding_status(task_id: str):
    """Check the status of an embedding generation task."""
    if task_id not in _background_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return _background_tasks[task_id]

@router.get("/documents/pipeline-stats")
async def get_pipeline_statistics(
    store: SupabaseRagStore = Depends(get_rag_store)
):
    """Get statistics about documents in different pipeline stages."""
    try:
        supabase = store._client
        
        # Get counts for each stage
        stages = ['raw_ingested', 'segmented', 'embedded', 'done', 'error']
        stats = {}
        
        for stage in stages:
            result = (
                supabase
                .table('fireflies_ingestion_jobs')
                .select('id', count='exact')
                .eq('stage', stage)
                .execute()
            )
            stats[stage] = result.count or 0
        
        # Get recent documents
        recent_docs = supabase.table('fireflies_ingestion_jobs').select('fireflies_id, stage, created_at').order('created_at', desc=True).limit(10).execute()
        
        return {
            "stage_counts": stats,
            "total_documents": sum(stats.values()),
            "recent_documents": recent_docs.data,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting pipeline statistics: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get pipeline statistics: {str(e)}"
        )
