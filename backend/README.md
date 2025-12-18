# README Backend RAG Retrieval Architecture

This document describes the retrieval-augmented generation (RAG) strategy implemented for the AI Chief of Staff system, focusing on the retrieval layer and supporting code.

curl http://localhost:8000/health


## File Structure

```
alleato_agent_workflow/
├── alleato_agent_workflow.py  # Main entry point (re-exports all)
├── embeddings.py              # Embedding generation
├── guardrails.py              # Safety/PII handling
├── workflow.py                # Main workflow orchestration
├── agents/
│   ├── __init__.py
│   ├── classification.py      # Query routing
│   ├── project.py             # Project agent (10 tools)
│   ├── knowledge_base.py      # KB agent (3 tools)
│   └── strategist.py          # Strategy agent (9 tools)
└── tools/
    ├── __init__.py
    ├── mcp.py                 # MCP & web search configs
    ├── vector_search.py       # 5 semantic search tools
    └── retrieval.py           # 5 standard query tools

```

## Overview

The system uses a **multi-resolution, structured knowledge retrieval** approach that goes beyond simple chunk-based RAG. It combines:

1. **Semantic vector search** across multiple knowledge layers
2. **Structured knowledge tables** (decisions, risks, opportunities)
3. **Hierarchical meeting segmentation** (meeting → segment → chunk)
4. **Query classification** to route to specialized agents

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Query                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Classification Agent                          │
│         Routes to: project | policy | strategic                 │
└─────────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
     ┌──────────┐      ┌──────────┐      ┌──────────┐
     │ Project  │      │ Policy   │      │Strategist│
     │  Agent   │      │  Agent   │      │  Agent   │
     └──────────┘      └──────────┘      └──────────┘
            │                 │                 │
            └─────────────────┼─────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Vector Search Tools                         │
│  search_meetings | search_decisions | search_risks | ...        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Supabase + pgvector                        │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │meeting_segments │  │   decisions     │  │     risks       │ │
│  │(summary_embed)  │  │   (embedding)   │  │   (embedding)   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  opportunities  │  │document_chunks  │  │   documents     │ │
│  │   (embedding)   │  │   (embedding)   │  │   (embedding)   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Core Tables

| Table | Purpose | Embedding Column |
|-------|---------|------------------|
| `meeting_segments` | Semantic segments of meetings with title, summary, decisions, risks, tasks | `summary_embedding` |
| `decisions` | Extracted decisions with owner, impact, rationale | `embedding` |
| `risks` | Extracted risks with category, likelihood, impact, mitigation | `embedding` |
| `opportunities` | Extracted opportunities with type, owner, next steps | `embedding` |
| `document_chunks` | Raw transcript chunks for detailed retrieval | `embedding` |
| `documents` | Full document records | `embedding` |
| `document_metadata` | Meeting metadata (participants, date, summary) | - |

### Key Relationships

```
document_metadata (1) ──────< meeting_segments (N)
       │                            │
       │                            ├──────< decisions (N)
       │                            ├──────< risks (N)
       │                            └──────< tasks (N)
       │
       └──────< document_chunks (N)
```

---

## Vector Search Functions (Supabase RPC)

All functions use **cosine similarity** via pgvector's `<=>` operator.

### Basic Search Functions

| Function | Table | Returns |
|----------|-------|---------|
| `match_meeting_segments` | `meeting_segments` | id, title, summary, decisions, risks, tasks, similarity |
| `match_decisions` | `decisions` | id, description, rationale, owner, impact, status, similarity |
| `match_risks` | `risks` | id, description, category, likelihood, impact, mitigation, similarity |
| `match_opportunities` | `opportunities` | id, description, type, owner, next_step, similarity |
| `match_documents_full` | `documents` | id, title, content, source, metadata, similarity |

### Project-Filtered Search Functions

| Function | Purpose |
|----------|---------|
| `match_meeting_segments_by_project` | Search segments for specific project(s) |
| `match_decisions_by_project` | Search decisions for specific project(s) |
| `match_risks_by_project` | Search risks for specific project(s) |

### Combined Search

| Function | Purpose |
|----------|---------|
| `search_all_knowledge` | Search across ALL tables (decisions, risks, opportunities, segments) and return unified results |

### Function Signature Example

```sql
CREATE FUNCTION match_meeting_segments(
    query_embedding vector(1536),
    match_count int DEFAULT 10,
    match_threshold float DEFAULT 0.5
)
RETURNS TABLE (
    id uuid,
    metadata_id text,
    segment_index int,
    title text,
    summary text,
    decisions jsonb,
    risks jsonb,
    tasks jsonb,
    project_ids int[],
    created_at timestamptz,
    similarity float
)
```

---

## Retrieval Tools (Python)

Located in: `alleato_agent_workflow/alleato_agent_workflow.py`

### Embedding Generation

```python
async def get_query_embedding_async(query: str) -> List[float]:
    """Generate embedding for a search query using OpenAI."""
    client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = await client.embeddings.create(
        model="text-embedding-3-small",
        input=query
    )
    return response.data[0].embedding
```

## Document Processing Pipeline

The document processing pipeline consists of several scripts that handle different stages:

### 1. Backfill Embeddings for Meeting Segments

To generate embeddings for existing meeting segments:

```bash
cd backend
source venv/bin/activate
cd src/workers/scripts

# Run the backfill script
python backfill_segment_embeddings.py

# Options:
# --batch-size BATCH_SIZE    Number of segments to process per batch (default: 50)
# --limit LIMIT              Maximum number of segments to process (default: all)
# --dry-run                  Show what would be done without making changes
# --project-id PROJECT_ID    Only process segments for a specific project ID

# Example: Dry run to see what would be processed
python backfill_segment_embeddings.py --dry-run
```

### 2. Process Existing Documents

To process existing documents and create document chunks with embeddings:

```bash
cd backend/src/workers/scripts
python process_existing_documents.py
```

This script:
- Fetches all meeting documents from `document_metadata` table
- Creates overlapping chunks from the document content
- Generates embeddings for each chunk using OpenAI's text-embedding-3-small model
- Stores chunks with embeddings in the `document_chunks` table

### 3. Process New Documents

To process new documents through the full pipeline:

```bash
cd backend/src/workers/scripts
python process_documents.py --limit 10

# Options:
# --limit N              Process N documents
# --skip-embedding       Skip embedding generation stage
```

### 4. Update Chunk Embeddings

To update embeddings for existing document chunks:

```bash
cd backend/src/workers/scripts
python update_chunk_embeddings.py
```

### 5. Backfill Missing Embeddings for Structured Data

To generate embeddings for decisions, risks, and opportunities that are missing them:

```bash
cd backend/src/workers/scripts
python backfill_missing_embeddings.py
```

This script:
- Checks decisions, risks, and opportunities tables for missing embeddings
- Generates embeddings using OpenAI's text-embedding-3-small model
- Updates the records with the generated embeddings
- Provides a summary of remaining records without embeddings

### 6. Clean and Reingest Documents

To clean and reingest specific Fireflies documents:

```bash
cd backend/src/workers/scripts
python clean_and_reingest.py
```

### 7. Generate Project Summaries with GPT-5.1

To generate AI-powered project summaries from meeting documents:

```bash
cd backend
source venv/bin/activate
PYTHONPATH="src/services:src/workers" python scripts/generate_project_summaries_batch.py

# Options:
# --project-id ID        Process specific project only
# --update               Save summaries to database
# --max-documents N      Limit documents per project (default: 30)
# --dry-run              Preview without saving

# Examples:
# Generate summary for specific project (preview only)
PYTHONPATH="src/services:src/workers" python scripts/generate_project_summaries_batch.py --project-id 67

# Generate and save summaries for all projects
PYTHONPATH="src/services:src/workers" python scripts/generate_project_summaries_batch.py --update

# Preview summaries for all projects without saving
PYTHONPATH="src/services:src/workers" python scripts/generate_project_summaries_batch.py --dry-run
```

This script:

- Fetches all projects with associated meeting documents
- Aggregates meeting content (transcripts, summaries, action items, bullet points)
- Uses GPT-5.1 to generate comprehensive project summaries
- Provides executive-level insights: overview, stakeholders, status, issues, decisions, next steps
- Optionally updates project summary field in database

### 8. Extract Tasks from Meeting Documents with GPT-5.1

To extract actionable tasks from meeting documents:

```bash
cd backend
source venv/bin/activate
PYTHONPATH="src/services:src/workers" python scripts/extract_tasks_from_meetings.py

# Options:
# --project-id ID        Process specific project only
# --save                 Save tasks to JSON files
# --days-back N          Days to look back (default: 90)
# --max-documents N      Limit documents per project (default: 20)

# Examples:
# Extract tasks for specific project
PYTHONPATH="src/services:src/workers" python scripts/extract_tasks_from_meetings.py --project-id 67

# Extract and save tasks for all projects
PYTHONPATH="src/services:src/workers" python scripts/extract_tasks_from_meetings.py --save

# Extract tasks from last 30 days only
PYTHONPATH="src/services:src/workers" python scripts/extract_tasks_from_meetings.py --days-back 30 --save
```

This script:

- Analyzes meeting documents to extract actionable tasks
- Uses GPT-5.1 to parse action items, decisions, and commitments
- Extracts structured task data: title, assignee, due date, priority, status, context
- Outputs tasks as JSON with source attribution
- Can save to files for import into task management systems

### Vector Search Tools

| Tool | Purpose | Query |
|------|---------|---------|
| `search_meetings(query, limit, project_id)` | Semantic search on meeting segments |
| `search_decisions(query, limit, project_id)` | Semantic search on decisions |
| `search_risks(query, limit, project_id)` | Semantic search on risks |
| `search_opportunities(query, limit, project_id)` | Semantic search on opportunities |
| `search_all_knowledge(query, limit)` | Combined search across all tables |
| `get_recent_meetings(limit, project_id)` | Fetch most recent meetings chronologically |
| `get_tasks_and_decisions(status, project_id, limit)` | List tasks with optional filters |
| `get_project_insights(project_id, limit)` | Get strategic insights |
| `list_all_projects()` | List all projects with stats |
| `get_project_details(project_id)` | Get detailed project info |
| `company_rag_search` | Searches meeting transcripts using vector/keyword search |
| `structured_analytics_query` | Queries tasks, insights, and project metadata |
| `get_recent_meetings` | Gets recent meetings with summaries |
| `task_writer` | Creates tasks from strategic recommendations |
| `list_projects` | Lists all projects with activity summaries |


### Standard Retrieval Tools


```python
@function_tool
async def search_meetings(query: str, limit: int = 10, project_id: int = None) -> str:
    supabase = get_supabase_client()
    embedding = await get_query_embedding_async(query)

    result = supabase.rpc('match_meeting_segments', {
        'query_embedding': embedding,
        'match_count': limit,
        'match_threshold': 0.3
    }).execute()

    # Format and return results with similarity scores
```

```python
@function_tool
async def search_all_knowledge(query: str, limit: int = 20) -> str:
    supabase = get_supabase_client()
    embedding = await get_query_embedding_async(query)

    result = supabase.rpc('search_all_knowledge', {
        'query_embedding': embedding,
        'match_count': limit,
        'match_threshold': 0.35
    }).execute()

    # Group by source_table and format results
```

---

## Agent Configuration

### Classification Agent
Routes queries to the appropriate specialist:

```python
classification_agent = Agent(
    name="Classification agent",
    instructions="""Classify the user's intent into:
    - "project": specific meetings, tasks, decisions, project status
    - "policy": company policies, procedures, documentation
    - "strategic": high-level strategy, market analysis, cross-cutting insights
    """,
    model="gpt-4.1-mini",
    output_type=ClassificationAgentSchema
)
```

### Specialist Agents

| Agent | Purpose | Tools |
|-------|---------|-------|
| **Project** | Project-specific queries, tasks, decisions | All search tools + project tools |
| **Internal Knowledge Base** | Policies, procedures, documentation | All search tools |
| **Strategist** | High-level strategic analysis | All search tools + web search |

---

## Retrieval Flow

### 1. Query Processing

```
User Query → Classification Agent → Route to Specialist
```

### 2. Semantic Search

```python
# 1. Generate query embedding
embedding = await get_query_embedding_async(query)

# 2. Call appropriate RPC function
result = supabase.rpc('match_meeting_segments', {
    'query_embedding': embedding,
    'match_count': 10,
    'match_threshold': 0.3  # Minimum similarity
}).execute()

# 3. Results include similarity scores
for item in result.data:
    print(f"{item['title']}: {item['similarity']:.0%} match")
```

### 3. Result Synthesis

Agents receive formatted results and synthesize into executive-level responses with:
- Reasoning before conclusions
- Pattern identification across results
- Actionable recommendations

---

## Embedding Strategy

### Model
- **Model**: `text-embedding-3-small` (OpenAI)
- **Dimensions**: 1536
- **Similarity**: Cosine distance (`1 - (a <=> b)`)

### What Gets Embedded

| Content Type | Table | Column |
|--------------|-------|--------|
| Meeting segment summaries | `meeting_segments` | `summary_embedding` |
| Decision descriptions | `decisions` | `embedding` |
| Risk descriptions | `risks` | `embedding` |
| Opportunity descriptions | `opportunities` | `embedding` |
| Document chunks | `document_chunks` | `embedding` |
| Full documents | `documents` | `embedding` |

### Embedding Text Construction

For meeting segments:
```python
def create_embedding_text(segment):
    parts = []
    if segment.get('title'):
        parts.append(f"Topic: {segment['title']}")
    if segment.get('summary'):
        parts.append(segment['summary'])
    return "\n".join(parts)
```

---

## Similarity Thresholds

| Use Case | Threshold | Rationale |
|----------|-----------|-----------|
| General search | 0.3 | Broader recall |
| Combined search | 0.35 | Slightly stricter for blended results |
| Default functions | 0.5 | Conservative default |
| Project-filtered | 0.3 | Already filtered by project |

---

## Performance Optimizations

### HNSW Indexes

```sql
CREATE INDEX meeting_segments_summary_embedding_idx
ON meeting_segments
USING hnsw (summary_embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

CREATE INDEX decisions_embedding_idx
ON decisions
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

### Query Efficiency

1. **Threshold filtering**: Results below threshold excluded at database level
2. **Limit enforcement**: Results capped at `match_count`
3. **Project filtering**: Uses GIN index on `project_ids` array
4. **Cached client**: Supabase client cached via `@lru_cache`

---

## File Locations

| File | Purpose |
|------|---------|
| `alleato_agent_workflow/alleato_agent_workflow.py` | Agent definitions, tools, workflow |
| `supabase_helpers.py` | Database client, helper functions |
| `scripts/sql/create_vector_search_functions.sql` | RPC function definitions |
| `scripts/backfill_segment_embeddings.py` | Embedding backfill script |
| `ingestion/fireflies_pipeline.py` | Meeting ingestion with embedding |

---

## Usage Example

```python
from alleato_agent_workflow.alleato_agent_workflow import run_workflow

# Run a query through the full workflow
result = await run_workflow(
    input_data={"input_as_text": "What are the main risks across our infrastructure projects?"},
    conversation_history=[]
)

# Result includes:
# - Classification (strategic)
# - Agent response with synthesized insights
# - Tool calls made (search_risks, search_all_knowledge, etc.)
```

---

## Future Enhancements

1. **Two-stage retrieval**: Query summaries first, then drill into chunks
2. **Hybrid search**: Combine vector + keyword search
3. **Reranking**: Apply cross-encoder reranking to top results
4. **Temporal weighting**: Boost recent content
5. **User context**: Filter by user's projects/role



# Environment Variables Setup

## Overview

This project uses a **single, centralized `.env` file** located in the root directory to avoid confusion and ensure consistency across all Python scripts and services.

## File Locations

- **Primary**: `/alleato-procore/.env` (root directory)
- **Fallback**: `/alleato-procore/.env.local` (root directory)
- **DO NOT USE**: `python-backend/.env` (deprecated, removed)

## How It Works

All Python files use the centralized `env_loader.py` module to load environment variables:

```python
from env_loader import load_env

# Load from root .env file
load_env()
```

The `env_loader` module:
- Automatically finds the root `.env` file regardless of where the script is run from
- Ensures all scripts use the same environment configuration
- Provides helpful error messages if the `.env` file is missing
- Prevents duplicate loading with caching

## Usage in Python Scripts

### Basic Usage

```python
from env_loader import load_env
import os

# Load environment variables
load_env()

# Access variables
api_key = os.getenv("OPENAI_API_KEY")
supabase_url = os.getenv("SUPABASE_URL")
```

### Verify Required Variables

```python
from env_loader import load_env, verify_required_vars

load_env()

# Ensure critical variables are set
verify_required_vars("OPENAI_API_KEY", "SUPABASE_URL", "SUPABASE_SERVICE_KEY")
```

### Force Reload

```python
from env_loader import load_env

# Force reload even if already loaded
load_env(force_reload=True)
```

## Benefits of Centralized Approach

1. **Single Source of Truth**: One `.env` file to manage
2. **No Path Confusion**: Scripts work from any directory
3. **Easier Onboarding**: New developers only need to configure one file
4. **Consistent Behavior**: All services use the same configuration
5. **Simpler Debugging**: No more "which .env is being loaded?"

## Migration Notes

### Old Pattern (Deprecated)
```python
from dotenv import load_dotenv
from pathlib import Path

# ❌ DON'T DO THIS - different scripts used different paths
env_path = Path(__file__).parent / '.env'
env_path = Path(__file__).parent.parent / '.env'
env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(env_path)
```

### New Pattern (Recommended)
```python
from env_loader import load_env

# ✅ DO THIS - always loads from root
load_env()
```

## Files Updated

The following files have been updated to use the centralized loader:

- `python-backend/api.py`
- `python-backend/alleato_agent_workflow/alleato_agent_workflow.py`

## Remaining Scripts

Other scripts in `python-backend/scripts/` still use the old pattern but will be migrated gradually. They should continue to work as long as the root `.env` file exists.

## Troubleshooting

### Error: "No .env file found"

Make sure you have a `.env` file in the project root:
```bash
cp .env.local .env
```

### Warning: "OPENAI_API_KEY is not set"

This warning appeared before because scripts were looking for `.env` in the wrong location. With the centralized loader, this should be resolved.

### Server Not Picking Up Changes

If you update `.env` while the server is running:
1. The server with `--reload` will automatically restart when Python files change
2. For `.env` changes, you may need to manually restart the server:
   ```bash
   # Kill the server (Ctrl+C or kill PID)
   # Restart it
   cd python-backend
   source venv/bin/activate
   python -m uvicorn api:app --reload --port 8000
   ```

## Required Environment Variables

The following variables must be set in the root `.env` file:

### OpenAI
- `OPENAI_API_KEY` - OpenAI API key for agents and embeddings

### Supabase
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_KEY` - Supabase service role key
- `SUPABASE_ANON_KEY` - Supabase anonymous key

### Optional
- `LANGFUSE_PUBLIC_KEY` - LangFuse public key for tracing
- `LANGFUSE_SECRET_KEY` - LangFuse secret key
- `LANGFUSE_HOST` - LangFuse host URL

See `.env.local` or `.env` for the complete list of variables.
