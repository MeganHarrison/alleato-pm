"""
═══════════════════════════════════════════════════════════════════════════
VECTOR SEARCH TOOLS - Semantic Search via pgvector
═══════════════════════════════════════════════════════════════════════════

ROLE: Provides semantic similarity search across all knowledge tables using vector embeddings

CONTROLS:
- search_meetings() → Search meeting_segments table via match_meeting_segments RPC
- search_decisions() → Search decisions table via match_decisions RPC
- search_risks() → Search risks table via match_risks RPC
- search_opportunities() → Search opportunities table via match_opportunities RPC
- search_all_knowledge() → Unified search across all tables via search_all_knowledge RPC

QUERY PROCESS:
1. Generate query embedding via get_query_embedding_async()
2. Call Supabase RPC function with embedding + filters (project_id, match_count, threshold)
3. Format results with similarity scores and source citations
4. Return structured string with [Source N] references

RETURNS: Formatted strings with:
- Match similarity percentages
- Content snippets (truncated to 200-300 chars)
- Metadata (dates, owners, status, impact)
- Source citations section at bottom

USED BY:
- project_agent (searches project-specific data)
- strategist_agent (searches across all knowledge)
- Classification determines which search functions to call

DATABASE TABLES QUERIED:
- meeting_segments (via match_meeting_segments, match_meeting_segments_by_project)
- decisions (via match_decisions, match_decisions_by_project)
- risks (via match_risks, match_risks_by_project)
- opportunities (via match_opportunities)

═══════════════════════════════════════════════════════════════════════════
"""

import os
import json
from functools import lru_cache
from typing import Optional
from agents import function_tool
from supabase import create_client, Client

from ..embeddings import get_query_embedding_async


@lru_cache(maxsize=1)
def get_supabase_client() -> Client:
    """Get cached Supabase client."""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_SERVICE_KEY")
    if not url or not key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
    return create_client(url, key)


@function_tool
async def search_meetings(query: str, limit: int = 10, project_id: Optional[int] = None) -> str:
    """
    Search meeting transcripts using semantic similarity (vector search).

    Args:
        query: The search query text
        limit: Maximum number of results to return (default: 10)
        project_id: Optional project ID to filter results

    Returns:
        Formatted string with matching meeting segments, similarity scores, and source citations
    """
    try:
        supabase = get_supabase_client()
        embedding = await get_query_embedding_async(query)

        if not embedding:
            return "Error: Could not generate embedding for query"

        if project_id:
            result = supabase.rpc('match_meeting_segments_by_project', {
                'query_embedding': embedding,
                'filter_project_ids': [project_id],
                'match_count': limit,
                'match_threshold': 0.3
            }).execute()
        else:
            result = supabase.rpc('match_meeting_segments', {
                'query_embedding': embedding,
                'match_count': limit,
                'match_threshold': 0.3
            }).execute()

        if not result.data:
            return "No matching meeting segments found."

        output = []
        sources = []

        for idx, item in enumerate(result.data, 1):
            similarity_pct = f"{item.get('similarity', 0) * 100:.0f}%"
            meeting_title = item.get('title', 'Untitled Meeting')
            meeting_date = item.get('date', item.get('created_at', 'Unknown date'))
            segment_id = item.get('id', f'segment-{idx}')

            # Build source reference
            source_ref = f"[Source {idx}]"
            sources.append({
                "id": segment_id,
                "ref": source_ref,
                "type": "meeting_segment",
                "title": meeting_title,
                "date": str(meeting_date)[:10] if meeting_date else "Unknown",
                "relevance": similarity_pct
            })

            output.append(f"{source_ref} **{meeting_title}** ({similarity_pct} match)")
            output.append(f"  Date: {str(meeting_date)[:10] if meeting_date else 'Unknown'}")
            if item.get('summary'):
                output.append(f"  Summary: {item['summary'][:300]}...")
            if item.get('decisions'):
                decisions = item['decisions'] if isinstance(item['decisions'], list) else []
                if decisions:
                    output.append(f"  Decisions: {len(decisions)} recorded")
            if item.get('risks'):
                risks = item['risks'] if isinstance(item['risks'], list) else []
                if risks:
                    output.append(f"  Risks: {len(risks)} identified")
            output.append("")

        # Add sources section at the end
        output.append("\n---\n**Sources:**")
        for src in sources:
            output.append(f"- {src['ref']}: {src['title']} ({src['date']}) - {src['relevance']} relevance")

        return "\n".join(output)
    except Exception as e:
        return f"Error searching meetings: {str(e)}"


@function_tool
async def search_decisions(query: str, limit: int = 10, project_id: Optional[int] = None) -> str:
    """
    Search decisions using semantic similarity (vector search).

    Args:
        query: The search query text
        limit: Maximum number of results to return (default: 10)
        project_id: Optional project ID to filter results

    Returns:
        Formatted string with matching decisions, similarity scores, and source citations
    """
    try:
        supabase = get_supabase_client()
        embedding = await get_query_embedding_async(query)

        if not embedding:
            return "Error: Could not generate embedding for query"

        if project_id:
            result = supabase.rpc('match_decisions_by_project', {
                'query_embedding': embedding,
                'filter_project_ids': [project_id],
                'match_count': limit,
                'match_threshold': 0.3
            }).execute()
        else:
            result = supabase.rpc('match_decisions', {
                'query_embedding': embedding,
                'match_count': limit,
                'match_threshold': 0.3
            }).execute()

        if not result.data:
            return "No matching decisions found."

        output = []
        sources = []

        for idx, item in enumerate(result.data, 1):
            similarity_pct = f"{item.get('similarity', 0) * 100:.0f}%"
            decision_id = item.get('id', f'decision-{idx}')
            description = item.get('description', 'N/A')
            decision_date = item.get('created_at', 'Unknown')

            # Build source reference
            source_ref = f"[Source {idx}]"
            sources.append({
                "id": decision_id,
                "ref": source_ref,
                "type": "decision",
                "description": description[:100] + "..." if len(description) > 100 else description,
                "date": str(decision_date)[:10] if decision_date else "Unknown",
                "relevance": similarity_pct
            })

            output.append(f"{source_ref} **Decision** ({similarity_pct} match)")
            output.append(f"  Description: {description}")
            if item.get('rationale'):
                output.append(f"  Rationale: {item['rationale']}")
            if item.get('owner_name'):
                output.append(f"  Owner: {item['owner_name']}")
            if item.get('impact'):
                output.append(f"  Impact: {item['impact']}")
            if item.get('status'):
                output.append(f"  Status: {item['status']}")
            if decision_date:
                output.append(f"  Date: {str(decision_date)[:10]}")
            output.append("")

        # Add sources section at the end
        output.append("\n---\n**Sources:**")
        for src in sources:
            output.append(f"- {src['ref']}: Decision - \"{src['description']}\" ({src['date']}) - {src['relevance']} relevance")

        return "\n".join(output)
    except Exception as e:
        return f"Error searching decisions: {str(e)}"


@function_tool
async def search_risks(query: str, limit: int = 10, project_id: Optional[int] = None) -> str:
    """
    Search risks using semantic similarity (vector search).

    Args:
        query: The search query text
        limit: Maximum number of results to return (default: 10)
        project_id: Optional project ID to filter results

    Returns:
        Formatted string with matching risks, similarity scores, and source citations
    """
    try:
        supabase = get_supabase_client()
        embedding = await get_query_embedding_async(query)

        if not embedding:
            return "Error: Could not generate embedding for query"

        if project_id:
            result = supabase.rpc('match_risks_by_project', {
                'query_embedding': embedding,
                'filter_project_ids': [project_id],
                'match_count': limit,
                'match_threshold': 0.3
            }).execute()
        else:
            result = supabase.rpc('match_risks', {
                'query_embedding': embedding,
                'match_count': limit,
                'match_threshold': 0.3
            }).execute()

        if not result.data:
            return "No matching risks found."

        output = []
        sources = []

        for idx, item in enumerate(result.data, 1):
            similarity_pct = f"{item.get('similarity', 0) * 100:.0f}%"
            risk_id = item.get('id', f'risk-{idx}')
            description = item.get('description', 'N/A')
            risk_date = item.get('identified_date', item.get('created_at', 'Unknown'))

            # Build source reference
            source_ref = f"[Source {idx}]"
            sources.append({
                "id": risk_id,
                "ref": source_ref,
                "type": "risk",
                "description": description[:100] + "..." if len(description) > 100 else description,
                "date": str(risk_date)[:10] if risk_date else "Unknown",
                "relevance": similarity_pct
            })

            output.append(f"{source_ref} **Risk** ({similarity_pct} match)")
            output.append(f"  Description: {description}")
            if item.get('category'):
                output.append(f"  Category: {item['category']}")
            if item.get('likelihood'):
                output.append(f"  Likelihood: {item['likelihood']}")
            if item.get('impact'):
                output.append(f"  Impact: {item['impact']}")
            if item.get('owner_name'):
                output.append(f"  Owner: {item['owner_name']}")
            if item.get('mitigation_plan'):
                output.append(f"  Mitigation: {item['mitigation_plan']}")
            if item.get('status'):
                output.append(f"  Status: {item['status']}")
            if risk_date:
                output.append(f"  Identified: {str(risk_date)[:10]}")
            output.append("")

        # Add sources section at the end
        output.append("\n---\n**Sources:**")
        for src in sources:
            output.append(f"- {src['ref']}: Risk - \"{src['description']}\" ({src['date']}) - {src['relevance']} relevance")

        return "\n".join(output)
    except Exception as e:
        return f"Error searching risks: {str(e)}"


@function_tool
async def search_opportunities(query: str, limit: int = 10, project_id: Optional[int] = None) -> str:
    """
    Search opportunities using semantic similarity (vector search).

    Args:
        query: The search query text
        limit: Maximum number of results to return (default: 10)
        project_id: Optional project ID to filter results

    Returns:
        Formatted string with matching opportunities, similarity scores, and source citations
    """
    try:
        supabase = get_supabase_client()
        embedding = await get_query_embedding_async(query)

        if not embedding:
            return "Error: Could not generate embedding for query"

        result = supabase.rpc('match_opportunities', {
            'query_embedding': embedding,
            'match_count': limit,
            'match_threshold': 0.3
        }).execute()

        if not result.data:
            return "No matching opportunities found."

        output = []
        sources = []

        for idx, item in enumerate(result.data, 1):
            similarity_pct = f"{item.get('similarity', 0) * 100:.0f}%"
            opp_id = item.get('id', f'opportunity-{idx}')
            description = item.get('description', 'N/A')
            opp_date = item.get('identified_date', item.get('created_at', 'Unknown'))

            # Build source reference
            source_ref = f"[Source {idx}]"
            sources.append({
                "id": opp_id,
                "ref": source_ref,
                "type": "opportunity",
                "description": description[:100] + "..." if len(description) > 100 else description,
                "date": str(opp_date)[:10] if opp_date else "Unknown",
                "relevance": similarity_pct
            })

            output.append(f"{source_ref} **Opportunity** ({similarity_pct} match)")
            output.append(f"  Description: {description}")
            if item.get('type'):
                output.append(f"  Type: {item['type']}")
            if item.get('owner_name'):
                output.append(f"  Owner: {item['owner_name']}")
            if item.get('next_step'):
                output.append(f"  Next Step: {item['next_step']}")
            if item.get('status'):
                output.append(f"  Status: {item['status']}")
            if opp_date:
                output.append(f"  Identified: {str(opp_date)[:10]}")
            output.append("")

        # Add sources section at the end
        output.append("\n---\n**Sources:**")
        for src in sources:
            output.append(f"- {src['ref']}: Opportunity - \"{src['description']}\" ({src['date']}) - {src['relevance']} relevance")

        return "\n".join(output)
    except Exception as e:
        return f"Error searching opportunities: {str(e)}"


@function_tool
async def search_all_knowledge(query: str, limit: int = 20) -> str:
    """
    Search across all knowledge tables (decisions, risks, opportunities, meeting segments).
    Returns blended results grouped by source type with citations.

    Args:
        query: The search query text
        limit: Maximum number of results to return (default: 20)

    Returns:
        Formatted string with matching items grouped by source table with source citations
    """
    try:
        supabase = get_supabase_client()
        embedding = await get_query_embedding_async(query)

        if not embedding:
            return "Error: Could not generate embedding for query"

        result = supabase.rpc('search_all_knowledge', {
            'query_embedding': embedding,
            'match_count': limit,
            'match_threshold': 0.35
        }).execute()

        if not result.data:
            return "No matching knowledge found."

        # Group results by source table
        grouped = {}
        all_sources = []
        source_idx = 0

        for item in result.data:
            source = item.get('source_table', 'unknown')
            if source not in grouped:
                grouped[source] = []
            source_idx += 1
            item['_source_idx'] = source_idx
            grouped[source].append(item)

            # Build source entry
            content = item.get('content', 'N/A')
            all_sources.append({
                "idx": source_idx,
                "type": source,
                "content": content[:80] + "..." if len(content) > 80 else content,
                "relevance": f"{item.get('similarity', 0) * 100:.0f}%",
                "id": item.get('id', f'{source}-{source_idx}')
            })

        output = []
        source_labels = {
            'decisions': 'Decisions',
            'risks': 'Risks',
            'opportunities': 'Opportunities',
            'meeting_segments': 'Meeting Segments'
        }

        for source, items in grouped.items():
            label = source_labels.get(source, source.title())
            output.append(f"\n## {label} ({len(items)} matches)\n")

            for item in items:
                source_ref = f"[Source {item['_source_idx']}]"
                similarity_pct = f"{item.get('similarity', 0) * 100:.0f}%"
                content = item.get('content', 'N/A')
                if len(content) > 200:
                    content = content[:200] + "..."
                output.append(f"{source_ref} ({similarity_pct}) {content}")

                metadata = item.get('metadata', {})
                if metadata:
                    meta_parts = []
                    if metadata.get('owner'):
                        meta_parts.append(f"Owner: {metadata['owner']}")
                    if metadata.get('status'):
                        meta_parts.append(f"Status: {metadata['status']}")
                    if metadata.get('impact'):
                        meta_parts.append(f"Impact: {metadata['impact']}")
                    if metadata.get('date'):
                        meta_parts.append(f"Date: {str(metadata['date'])[:10]}")
                    if meta_parts:
                        output.append(f"  [{', '.join(meta_parts)}]")
            output.append("")

        # Add consolidated sources section
        output.append("\n---\n**Sources:**")
        for src in all_sources:
            type_label = source_labels.get(src['type'], src['type'].title())
            output.append(f"- [Source {src['idx']}]: {type_label} - \"{src['content']}\" - {src['relevance']} relevance")

        return "\n".join(output)
    except Exception as e:
        return f"Error searching knowledge: {str(e)}"
