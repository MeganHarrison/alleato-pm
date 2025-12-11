#!/usr/bin/env python3
"""
Backfill script for meeting_segments.summary_embedding

This script generates embeddings for meeting segments that are missing them.
It uses OpenAI's text-embedding-3-small model (1536 dimensions) to create
embeddings from the segment summary text.

Usage:
    python scripts/backfill_segment_embeddings.py [--batch-size 50] [--limit 1000] [--dry-run]

Options:
    --batch-size    Number of segments to process per batch (default: 50)
    --limit         Maximum number of segments to process (default: all)
    --dry-run       Show what would be done without making changes
    --project-id    Only process segments for a specific project
"""

import argparse
import os
import sys
import time
from pathlib import Path
from typing import List, Dict, Any, Optional

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent / '.env')

from openai import OpenAI
from supabase import create_client, Client


def get_supabase_client() -> Client:
    """Get Supabase client."""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_SERVICE_KEY")
    if not url or not key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
    return create_client(url, key)


def get_openai_client() -> OpenAI:
    """Get OpenAI client."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is required")
    return OpenAI(api_key=api_key)


def fetch_segments_without_embeddings(
    supabase: Client,
    limit: int = 100,
    offset: int = 0,
    project_id: Optional[int] = None
) -> List[Dict[str, Any]]:
    """Fetch meeting segments that are missing embeddings."""
    query = supabase.table('meeting_segments').select(
        'id, title, summary, project_ids'
    ).is_('summary_embedding', 'null')

    # Filter by project if specified
    if project_id is not None:
        query = query.contains('project_ids', [project_id])

    # Only get segments that have a summary to embed
    query = query.not_.is_('summary', 'null')
    query = query.neq('summary', '')

    result = query.range(offset, offset + limit - 1).execute()
    return result.data or []


def count_segments_without_embeddings(
    supabase: Client,
    project_id: Optional[int] = None
) -> int:
    """Count total segments missing embeddings."""
    query = supabase.table('meeting_segments').select(
        'id', count='exact'
    ).is_('summary_embedding', 'null').not_.is_('summary', 'null').neq('summary', '')

    if project_id is not None:
        query = query.contains('project_ids', [project_id])

    result = query.limit(0).execute()
    return result.count or 0


def generate_embeddings(
    openai_client: OpenAI,
    texts: List[str],
    model: str = "text-embedding-3-small"
) -> List[List[float]]:
    """Generate embeddings for a list of texts."""
    if not texts:
        return []

    # Filter out empty texts and track indices
    valid_texts = []
    valid_indices = []
    for i, text in enumerate(texts):
        if text and text.strip():
            valid_texts.append(text.strip())
            valid_indices.append(i)

    if not valid_texts:
        return [[] for _ in texts]

    response = openai_client.embeddings.create(
        model=model,
        input=valid_texts
    )

    # Build result list with embeddings in correct positions
    result = [[] for _ in texts]
    for i, embedding_data in enumerate(response.data):
        original_index = valid_indices[i]
        result[original_index] = embedding_data.embedding

    return result


def update_segment_embedding(
    supabase: Client,
    segment_id: str,
    embedding: List[float]
) -> bool:
    """Update a single segment's embedding."""
    try:
        supabase.table('meeting_segments').update({
            'summary_embedding': embedding
        }).eq('id', segment_id).execute()
        return True
    except Exception as e:
        print(f"  Error updating segment {segment_id}: {e}")
        return False


def batch_update_embeddings(
    supabase: Client,
    updates: List[Dict[str, Any]]
) -> int:
    """Update multiple segments' embeddings. Returns count of successful updates."""
    success_count = 0
    for update in updates:
        if update_segment_embedding(supabase, update['id'], update['embedding']):
            success_count += 1
    return success_count


def create_embedding_text(segment: Dict[str, Any]) -> str:
    """Create the text to embed from a segment's data."""
    parts = []

    # Add title if available
    if segment.get('title'):
        parts.append(f"Topic: {segment['title']}")

    # Add summary (main content)
    if segment.get('summary'):
        parts.append(segment['summary'])

    return "\n".join(parts)


def backfill_embeddings(
    batch_size: int = 50,
    limit: Optional[int] = None,
    dry_run: bool = False,
    project_id: Optional[int] = None
) -> Dict[str, int]:
    """
    Main backfill function.

    Returns:
        Dict with 'processed', 'success', 'failed', 'skipped' counts
    """
    supabase = get_supabase_client()
    openai_client = get_openai_client()

    # Get total count
    total_missing = count_segments_without_embeddings(supabase, project_id)

    if limit:
        total_to_process = min(limit, total_missing)
    else:
        total_to_process = total_missing

    print(f"\n{'='*60}")
    print(f"Meeting Segments Embedding Backfill")
    print(f"{'='*60}")
    print(f"Total segments missing embeddings: {total_missing}")
    print(f"Segments to process this run: {total_to_process}")
    print(f"Batch size: {batch_size}")
    print(f"Model: text-embedding-3-small (1536 dimensions)")
    if project_id:
        print(f"Filtering by project_id: {project_id}")
    if dry_run:
        print(f"MODE: DRY RUN (no changes will be made)")
    print(f"{'='*60}\n")

    if total_to_process == 0:
        print("No segments need embedding backfill!")
        return {'processed': 0, 'success': 0, 'failed': 0, 'skipped': 0}

    stats = {'processed': 0, 'success': 0, 'failed': 0, 'skipped': 0}
    offset = 0
    batch_num = 0

    while stats['processed'] < total_to_process:
        batch_num += 1
        current_batch_size = min(batch_size, total_to_process - stats['processed'])

        print(f"Batch {batch_num}: Fetching {current_batch_size} segments...")
        segments = fetch_segments_without_embeddings(
            supabase,
            limit=current_batch_size,
            offset=0,  # Always 0 since we're updating as we go
            project_id=project_id
        )

        if not segments:
            print("  No more segments to process.")
            break

        # Prepare texts for embedding
        texts = [create_embedding_text(seg) for seg in segments]

        # Skip segments with no embeddable text
        valid_segments = []
        for i, (seg, text) in enumerate(zip(segments, texts)):
            if text.strip():
                valid_segments.append((seg, text))
            else:
                stats['skipped'] += 1
                print(f"  Skipping segment {seg['id']} - no text to embed")

        if not valid_segments:
            stats['processed'] += len(segments)
            continue

        valid_texts = [text for _, text in valid_segments]

        if dry_run:
            print(f"  [DRY RUN] Would generate {len(valid_texts)} embeddings")
            for seg, text in valid_segments[:3]:  # Show first 3
                preview = text[:100] + "..." if len(text) > 100 else text
                print(f"    - {seg['id']}: {preview}")
            if len(valid_segments) > 3:
                print(f"    ... and {len(valid_segments) - 3} more")
            stats['processed'] += len(segments)
            stats['success'] += len(valid_segments)
            continue

        # Generate embeddings
        print(f"  Generating {len(valid_texts)} embeddings...")
        start_time = time.time()

        try:
            embeddings = generate_embeddings(openai_client, valid_texts)
            elapsed = time.time() - start_time
            print(f"  Embeddings generated in {elapsed:.2f}s")
        except Exception as e:
            print(f"  ERROR generating embeddings: {e}")
            stats['failed'] += len(valid_segments)
            stats['processed'] += len(segments)
            continue

        # Update database
        print(f"  Updating database...")
        updates = []
        for (seg, _), embedding in zip(valid_segments, embeddings):
            if embedding:
                updates.append({
                    'id': seg['id'],
                    'embedding': embedding
                })
            else:
                stats['failed'] += 1

        success_count = batch_update_embeddings(supabase, updates)
        stats['success'] += success_count
        stats['failed'] += len(updates) - success_count
        stats['processed'] += len(segments)

        print(f"  Batch {batch_num} complete: {success_count}/{len(updates)} updated successfully")
        print(f"  Progress: {stats['processed']}/{total_to_process} ({100*stats['processed']/total_to_process:.1f}%)")

        # Small delay to avoid rate limits
        if stats['processed'] < total_to_process:
            time.sleep(0.5)

    print(f"\n{'='*60}")
    print(f"Backfill Complete")
    print(f"{'='*60}")
    print(f"Processed: {stats['processed']}")
    print(f"Success:   {stats['success']}")
    print(f"Failed:    {stats['failed']}")
    print(f"Skipped:   {stats['skipped']}")
    print(f"{'='*60}\n")

    return stats


def main():
    parser = argparse.ArgumentParser(
        description="Backfill meeting_segments.summary_embedding with OpenAI embeddings"
    )
    parser.add_argument(
        '--batch-size',
        type=int,
        default=50,
        help='Number of segments to process per batch (default: 50)'
    )
    parser.add_argument(
        '--limit',
        type=int,
        default=None,
        help='Maximum number of segments to process (default: all)'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Show what would be done without making changes'
    )
    parser.add_argument(
        '--project-id',
        type=int,
        default=None,
        help='Only process segments for a specific project ID'
    )

    args = parser.parse_args()

    try:
        stats = backfill_embeddings(
            batch_size=args.batch_size,
            limit=args.limit,
            dry_run=args.dry_run,
            project_id=args.project_id
        )

        # Exit with error code if there were failures
        if stats['failed'] > 0:
            sys.exit(1)

    except KeyboardInterrupt:
        print("\n\nInterrupted by user")
        sys.exit(130)
    except Exception as e:
        print(f"\nFATAL ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
