# Alleato AI Script Runbook

This runbook centralizes every CLI entry point that powers Alleato's AI workflows—meeting intelligence, daily briefings, document ingestion, embeddings, RAG servers, and autonomous planning tools. Use it whenever you need to trigger or troubleshoot AI automation outside the product UI.

## Table of Contents
1. [How to Use This Runbook](#how-to-use-this-runbook)
2. [Meeting Intelligence & Insights](#meeting-intelligence--insights)
3. [Daily & Executive Reporting](#daily--executive-reporting)
4. [Document & Transcript Pipelines](#document--transcript-pipelines)
5. [Embedding & Vector Maintenance](#embedding--vector-maintenance)
6. [RAG Runtime & QA Utilities](#rag-runtime--qa-utilities)
7. [Crawling & External Knowledge Capture](#crawling--external-knowledge-capture)
8. [Autonomous Planning Utilities](#autonomous-planning-utilities)

---

## How to Use This Runbook

- **Environment**: `cd backend` then `source venv/bin/activate`. Most scripts expect `PYTHONPATH="src/services:src/workers"`.
- **Supabase credentials**: `.env` must expose `SUPABASE_URL` and a service or service-role key.
- **OpenAI access**: All extraction/summarization commands require `OPENAI_API_KEY`.
- **Safety**: Many scripts write to production tables. Use `--dry-run` or clone data before running destructive utilities.
- **Logging**: Every script prints progress to stdout; capture with `tee` if you need audit trails.

---

## Meeting Intelligence & Insights

### Extract Meeting Insights 

(`backend/scripts/extract_meeting_insights.py`)

- **What it does**: Uses GPT-5.1 to pull risks, decisions, opportunities, and tasks out of meeting transcripts (`document_metadata`) and writes the results to the existing domain tables.

- **Run from backend**:

  ```bash
  cd backend
  source venv/bin/activate
  PYTHONPATH="src/services:src/workers" \
    python scripts/extract_meeting_insights.py --project-id 12 --unprocessed --limit 5
  ```
- **Key flags**: `--meeting-id <uuid>`, `--project-id <id>`, `--unprocessed`, `--all-unprocessed`, `--dry-run`, `--verbose`, `--limit <n>`.
- **Notes**: Requires transcripts in `content` or `overview`. Use `--dry-run` first to verify extraction quality before persisting changes.

### Migrate Legacy Risks/Decisions/Opportunities 

(`backend/scripts/migrate_to_insights.py`)

- **What it does**: Consolidates records from `risks`, `decisions`, and `opportunities` into the unified `insights` table with metadata.

- **Command**:
  ```bash
  cd backend
  source venv/bin/activate
  PYTHONPATH="src/services:src/workers" python scripts/migrate_to_insights.py --dry-run
  ```
- **Notes**: Remove `--dry-run` only after verifying the preview output. Run migrations/001 first so the `insights` table exists.

---

## Daily & Executive Reporting

### Generate AI Daily Recap (`backend/scripts/generate_daily_recap.py`)
- **Purpose**: Builds the "Daily Project Pulse" briefing from the last N days of meetings using GPT-5.1, optionally emails/Teams the recap, and stores it in `daily_recaps`.
- **Sample command**:
  ```bash
  cd backend
  source venv/bin/activate
  PYTHONPATH="src/services:src/workers" \
    python scripts/generate_daily_recap.py --days 2 --output /tmp/recap.txt --send-email ceo@example.com --verbose
  ```
- **Flags**: `--date YYYY-MM-DD`, `--days N`, `--output FILE`, `--send-email user@`, `--send-teams`, `--no-save`, `--verbose`.
- **Dependencies**: `SENDGRID_API_KEY` for email, `TEAMS_WEBHOOK_URL` for Teams notifications.

### Generate Project Summary (`backend/scripts/generate_project_summary.py`)
- **Purpose**: Summarizes up to `--max-meetings` transcripts for a single project using GPT-5.1, optionally updating the `projects.summary` field.
- **Command**:
  ```bash
  cd backend
  source venv/bin/activate
  PYTHONPATH="src/services:src/workers" \
    python scripts/generate_project_summary.py --project-id 67 --max-meetings 15 --update
  ```
- **Notes**: Use `--update` to write back to Supabase; omit it to preview summaries locally.

### Capture RAG Success Proof (`backend/src/workers/scripts/capture_rag_success.py`)
- **Purpose**: Sends a sample ChatKit conversation through the live Python backend, opens the frontend with Playwright, and captures “RAG_CHAT_WORKING.png” proof shots.
- **Command**:
  ```bash
  cd backend
  source venv/bin/activate
  PYTHONPATH="src/services:src/workers" \
    python src/workers/scripts/capture_rag_success.py
  ```
- **Notes**: Requires Playwright browsers installed (`npx playwright install`) and both frontend (port 3000) plus backend (port 8000) running locally.

---

## Document & Transcript Pipelines

### Process Fireflies Ingestion Jobs (`backend/src/workers/scripts/process_documents.py`)
- **Purpose**: Advances Fireflies transcripts through parser → embedder → extractor Cloudflare Workers.
- **Command**:
  ```bash
  cd backend
  source venv/bin/activate
  python src/workers/scripts/process_documents.py --limit 20 --start-stage raw_ingested
  ```
- **Flags**: `--limit`, `--skip-embedding`, `--skip-extraction`, `--start-stage raw_ingested|segmented|embedded`.
- **Notes**: Requires the Cloudflare worker URLs in the script to be reachable; uses Supabase service credentials from `.env`.

### Clean & Re-ingest Fireflies Transcripts (`backend/src/workers/scripts/clean_and_reingest.py`)
- **Purpose**: Deletes stale ingestion jobs, clears document metadata/chunks, and reprocesses the markdown transcripts located in `../scripts/fireflies_transcripts_*`.
- **Command**:
  ```bash
  cd backend
  source venv/bin/activate
  PYTHONPATH="src/services:src/workers" \
    python src/workers/scripts/clean_and_reingest.py
  ```
- **Notes**: Script currently targets a hard-coded set of Fireflies IDs—update the list before rerunning on new transcripts.

### Process Existing Meeting Documents (`backend/src/workers/scripts/process_existing_documents.py`)
- **Purpose**: Chunks historic meeting content, generates embeddings, and writes `document_chunks` for any entry missing them.
- **Command**:
  ```bash
  cd backend
  source venv/bin/activate
  PYTHONPATH="src/services:src/workers" \
    python src/workers/scripts/process_existing_documents.py
  ```
- **Notes**: Skips documents that already have chunks. Requires `OPENAI_API_KEY` for fresh embeddings.

### Create Synthetic Test Data (`backend/src/workers/scripts/create_test_data.py`)
- **Purpose**: Seeds Supabase with demo meetings, chunks, tasks, and insights (project ID 5 by default) so RAG/chat flows have data in lower environments.
- **Command**:
  ```bash
  cd backend
  source venv/bin/activate
  PYTHONPATH="src/services:src/workers" \
    python src/workers/scripts/create_test_data.py
  ```
- **Notes**: Adjust project IDs or payloads inside the script if you need different fixtures.

---

## Embedding & Vector Maintenance

### Backfill Risk/Decision/Opportunity Embeddings (`backend/src/workers/scripts/backfill_missing_embeddings.py`)
- **Purpose**: Populates `embedding` columns in `risks`, `decisions`, and `opportunities` using `text-embedding-3-small`.
- **Command**:
  ```bash
  cd backend
  source venv/bin/activate
  PYTHONPATH="src/services:src/workers" \
    python src/workers/scripts/backfill_missing_embeddings.py
  ```
- **Notes**: Runs synchronously over every row lacking embeddings; expect several minutes on large datasets.

### Backfill Meeting Segment Embeddings (`backend/src/workers/scripts/backfill_segment_embeddings.py`)
- **Purpose**: Writes embeddings for `meeting_segments.summary_embedding` in batches.
- **Command**:
  ```bash
  cd backend
  source venv/bin/activate
  PYTHONPATH="src/services:src/workers" \
    python src/workers/scripts/backfill_segment_embeddings.py --batch-size 100 --limit 1000 --project-id 42
  ```
- **Flags**: `--batch-size`, `--limit`, `--dry-run`, `--project-id`.
- **Notes**: Uses 1536-dimension embeddings; monitor OpenAI quota if you run large batches.

### Update Document Chunk Embeddings (`backend/src/workers/scripts/update_chunk_embeddings.py`)
- **Purpose**: Re-embeds `document_chunks` rows missing embeddings (or re-embeds all chunks if none are null) and sanity checks vector search afterward.
- **Command**:
  ```bash
  cd backend
  source venv/bin/activate
  PYTHONPATH="src/services:src/workers" \
    python src/workers/scripts/update_chunk_embeddings.py
  ```

### Update Embedding Dimensions (`backend/src/workers/scripts/update_embedding_dimensions.py`)
- **Purpose**: Drops and recreates embedding columns to match the 1536-dimension `text-embedding-3-small` format.
- **Command**:
  ```bash
  cd backend
  source venv/bin/activate
  PYTHONPATH="src/services:src/workers" \
    python src/workers/scripts/update_embedding_dimensions.py
  ```
- **Notes**: **Destructive**—prompts for confirmation because it wipes existing embeddings. Re-run ingestion/backfill jobs afterwards.

### Execute Vector Search Fix (`backend/src/workers/scripts/execute_vector_fix.py`)
- **Purpose**: Runs `sql/fix_vector_search_final.sql` statement-by-statement to repair `match_document_chunks` RPCs, then smoke-tests vector search.
- **Command**:
  ```bash
  cd backend
  source venv/bin/activate
  PYTHONPATH="src/services:src/workers" \
    python src/workers/scripts/execute_vector_fix.py
  ```

### Diagnose Vector Search Overloads (`backend/src/workers/scripts/fix_vector_search_functions.py`)
- **Purpose**: Lists all overloaded `match_document_chunks` signatures and guides you through dropping/recreating them if conflicts exist.
- **Command**:
  ```bash
  cd backend
  source venv/bin/activate
  PYTHONPATH="src/services:src/workers" \
    python src/workers/scripts/fix_vector_search_functions.py
  ```
- **Notes**: Outputs the SQL you need to run manually if multiple overloads are detected.

---

## RAG Runtime & QA Utilities

### RAG FastAPI Server (`backend/src/workers/scripts/rag_api.py`)
- **Purpose**: Boots the FastAPI bridge that exposes `/rag-chatkit` endpoints backed by the multi-agent workflow and ChatKit memory store.
- **Command**:
  ```bash
  cd backend
  source venv/bin/activate
  PYTHONPATH="src/services:src/workers" \
    uvicorn src.workers.scripts.rag_api:app --host 0.0.0.0 --port 8001 --reload
  ```
- **Notes**: The script defaults to port 8001 when run directly; override via `uvicorn` flags if needed.

### List Projects in Supabase (`backend/src/workers/scripts/list_projects.py`)
- **Purpose**: Quick health check for the Supabase RAG store—prints a sample of projects available to the AI stack.
- **Command**:
  ```bash
  cd backend
  source venv/bin/activate
  PYTHONPATH="src/services:src/workers" \
    python src/workers/scripts/list_projects.py
  ```

---

## Crawling & External Knowledge Capture

### Crawl4AI RAG MCP Server (`scripts/ingestion/crawl4ai-rag/src/crawl4ai_mcp.py`)
- **Purpose**: Runs the MCP server that can crawl arbitrary sites with Crawl4AI, push chunks/code examples into Supabase, and expose RAG tools (`crawl_single_page`, `smart_crawl_url`, `perform_rag_query`, etc.) to MCP-compatible IDEs.
- **Recommended env**: Copy `.env.example`, set Supabase + OpenAI keys, and toggle the RAG strategy flags (contextual embeddings, hybrid search, reranking, agentic RAG).
- **Run via Docker**:
  ```bash
  cd scripts/ingestion/crawl4ai-rag
  docker build -t mcp/crawl4ai-rag --build-arg PORT=8051 .
  docker run --env-file .env -p 8051:8051 mcp/crawl4ai-rag
  ```
- **Run via uv**:
  ```bash
  cd scripts/ingestion/crawl4ai-rag
  uv run src/crawl4ai_mcp.py
  ```
- **Client config**: Point your MCP client at `http://localhost:8051/sse` (or `host.docker.internal` from another container).

---

## Autonomous Planning Utilities

### Project Manager Planning Agent (`scripts/multiagent_workflow/pm_planning.py`)
- **Purpose**: Feeds the brain dump in `scripts/multiagent_workflow/initiate_project.md` through the Codex MCP runtime so GPT-5 can produce an EXEC_PLAN.md plus REQUIREMENTS/TEST/AGENT_TASK artifacts aligned with `.agents/PLANS.md`.
- **Command**:
  ```bash
  cd scripts/multiagent_workflow
  OPENAI_API_KEY=sk-... python pm_planning.py
  ```
- **Notes**: Requires the Codex CLI (`npx -y codex mcp`) accessible on PATH. Edit `initiate_project.md` before launching; the script stops after planning (no implementation agents).

---

Keep this file updated whenever you add, rename, or retire an AI-focused script so operators always know how to run the automation safely.
