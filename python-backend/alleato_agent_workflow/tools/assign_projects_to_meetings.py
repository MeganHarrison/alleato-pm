#!/usr/bin/env python3
"""
Batch assign projects to meetings based on title/participants/content.

Usage:
    python assign_projects_to_meetings.py --limit 100 --min-confidence 0.7
    python assign_projects_to_meetings.py --all  # Process all unassigned
"""

import sys
import os
import argparse

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'python-backend'))

from supabase_helpers import get_supabase_client
from project_assignment import batch_assign_projects


def main():
    parser = argparse.ArgumentParser(description='Assign projects to unassigned meetings')
    parser.add_argument('--limit', type=int, default=100, help='Max meetings to process')
    parser.add_argument('--all', action='store_true', help='Process all unassigned meetings')
    parser.add_argument('--min-confidence', type=float, default=0.7, help='Minimum confidence (0.0-1.0)')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be assigned without making changes')

    args = parser.parse_args()

    print("🔍 Automatic Project Assignment")
    print("=" * 60)
    print()

    client = get_supabase_client()

    # Get count of unassigned meetings
    count_response = client.table("document_metadata")\
        .select("id", count="exact")\
        .is_("project_id", "null")\
        .execute()

    total_unassigned = count_response.count or 0
    print(f"📊 Found {total_unassigned} meetings without project assignment")
    print()

    if total_unassigned == 0:
        print("✅ All meetings already have project assignments!")
        return

    # Determine how many to process
    limit = total_unassigned if args.all else min(args.limit, total_unassigned)

    if args.dry_run:
        print(f"🔍 DRY RUN: Would process {limit} meetings")
        print(f"   Minimum confidence: {args.min_confidence}")
        print()
        # TODO: Could add dry-run logic here
        print("Run without --dry-run to actually assign projects")
        return

    print(f"Processing {limit} meetings...")
    print(f"Minimum confidence threshold: {args.min_confidence}")
    print()

    stats = batch_assign_projects(
        supabase_client=client,
        limit=limit,
        min_confidence=args.min_confidence
    )

    print()
    print("=" * 60)
    print("📊 ASSIGNMENT SUMMARY")
    print("=" * 60)
    print(f"Total processed:       {stats['total']}")
    print(f"✅ Assigned:           {stats['assigned']}")
    print(f"⊘ Low confidence skip: {stats['skipped_low_confidence']}")
    print(f"✗ Failed:              {stats['failed']}")
    print()

    if stats['methods']:
        print("Assignment methods used:")
        for method, count in sorted(stats['methods'].items(), key=lambda x: -x[1]):
            print(f"  - {method:25s}: {count:3d}")
        print()

    remaining = total_unassigned - stats['assigned']
    if remaining > 0:
        print(f"ℹ️  {remaining} meetings still unassigned")
        print("   Consider:")
        print("   - Lowering --min-confidence (currently {args.min_confidence})")
        print("   - Adding project keywords/email_domains to projects table")
        print("   - Manual review and assignment")
    else:
        print("🎉 All meetings now have project assignments!")


if __name__ == "__main__":
    main()
