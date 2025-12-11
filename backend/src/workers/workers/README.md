# Fireflies Pipeline Workers

Split Cloudflare Workers architecture for the meeting ingestion pipeline.

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│   INGEST    │────▶│    PARSER    │────▶│   EMBEDDER   │────▶│  EXTRACTOR  │
│             │     │              │     │              │     │             │
│ - Webhooks  │     │ - Segment    │     │ - Chunk      │     │ - Decisions │
│ - Storage   │     │ - Summary    │     │ - Embed      │     │ - Risks     │
│ - Metadata  │     │ - LLM        │     │ - Store      │     │ - Tasks     │
└─────────────┘     └──────────────┘     └──────────────┘     └─────────────┘
      │                    │                    │                    │
      ▼                    ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SUPABASE                                        │
│  document_metadata │ meeting_segments │ documents │ decisions/risks/tasks   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Workers

### 1. Ingest Worker (`/ingest`)
Handles initial ingestion from Fireflies or manual upload.

**Endpoints:**
- `POST /webhook/fireflies` - Receive Fireflies webhook
- `POST /webhook/storage` - Receive Supabase storage webhook
- `POST /ingest` - Manual ingestion `{markdown, filename?, projectId?, clientId?}`
- `GET /status/:firefliesId` - Check ingestion status
- `GET /health` - Health check

**Output:** Creates `document_metadata` record, stores raw markdown

### 2. Parser Worker (`/parser`)
Segments meetings into semantic chunks and generates summaries.

**Endpoints:**
- `POST /parse` - Parse meeting `{metadataId}` or `{firefliesId}`
- `POST /parse-pending` - Parse all meetings in `raw_ingested` stage
- `GET /health` - Health check

**Output:** Creates `meeting_segments` records, updates meeting summary

### 3. Embedder Worker (`/embedder`)
Chunks content and generates embeddings.

**Endpoints:**
- `POST /embed` - Embed meeting `{metadataId}` or `{firefliesId}`
- `POST /embed-pending` - Embed all meetings in `segmented` stage
- `GET /health` - Health check

**Output:** Creates `documents` records with embeddings

### 4. Extractor Worker (`/extractor`)
Extracts structured data (decisions, risks, tasks, opportunities).

**Endpoints:**
- `POST /extract` - Extract from meeting `{metadataId}` or `{firefliesId}`
- `POST /extract-pending` - Extract from all meetings in `embedded` stage
- `GET /health` - Health check

**Output:** Creates `decisions`, `risks`, `tasks`, `opportunities` records

## Pipeline Stages

Each meeting goes through these stages (tracked in `fireflies_ingestion_jobs`):

1. `pending` - Initial state
2. `raw_ingested` - Ingest complete, ready for parsing
3. `segmented` - Parser complete, ready for embedding
4. `chunked` - Chunking complete (intermediate)
5. `embedded` - Embedder complete, ready for extraction
6. `structured_extracted` - Extraction complete (intermediate)
7. `done` - Pipeline complete
8. `error` - Error occurred (check `error_message`)

## Development

```bash
# Install dependencies
npm install

# Run individual workers locally
npm run dev:ingest
npm run dev:parser
npm run dev:embedder
npm run dev:extractor

# Deploy all workers
npm run deploy:all
```

## Setting Secrets

Each worker needs these secrets (set via `wrangler secret put`):

```bash
# For each worker directory:
cd ingest && wrangler secret put SUPABASE_URL
cd ingest && wrangler secret put SUPABASE_SERVICE_KEY
cd ingest && wrangler secret put OPENAI_API_KEY
cd ingest && wrangler secret put FIREFLIES_API_KEY  # ingest only
```

## Manual Pipeline Execution

Run the full pipeline manually for a meeting:

```bash
# 1. Ingest
curl -X POST https://fireflies-ingest.YOUR_SUBDOMAIN.workers.dev/ingest \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Meeting Title\n...", "filename": "meeting.md"}'

# Response: {"success": true, "firefliesId": "abc123", "metadataId": "uuid-here"}

# 2. Parse (using firefliesId from step 1)
curl -X POST https://fireflies-parser.YOUR_SUBDOMAIN.workers.dev/parse \
  -H "Content-Type: application/json" \
  -d '{"firefliesId": "abc123"}'

# 3. Embed
curl -X POST https://fireflies-embedder.YOUR_SUBDOMAIN.workers.dev/embed \
  -H "Content-Type: application/json" \
  -d '{"firefliesId": "abc123"}'

# 4. Extract
curl -X POST https://fireflies-extractor.YOUR_SUBDOMAIN.workers.dev/extract \
  -H "Content-Type: application/json" \
  -d '{"firefliesId": "abc123"}'
```

## Batch Processing

Process all pending items at each stage:

```bash
# Parse all raw_ingested meetings
curl -X POST https://fireflies-parser.YOUR_SUBDOMAIN.workers.dev/parse-pending

# Embed all segmented meetings
curl -X POST https://fireflies-embedder.YOUR_SUBDOMAIN.workers.dev/embed-pending

# Extract from all embedded meetings
curl -X POST https://fireflies-extractor.YOUR_SUBDOMAIN.workers.dev/extract-pending
```

## Database Tables

See `sql/001_rag_schema.sql` for the complete schema including:

- `document_metadata` - Meeting-level info
- `meeting_segments` - Semantic segments
- `documents` - Chunks with embeddings
- `decisions` - Extracted decisions
- `risks` - Extracted risks
- `tasks` - Action items
- `opportunities` - Strategic opportunities
- `fireflies_ingestion_jobs` - Pipeline orchestration

## Debugging

1. Check job status:
```bash
curl https://fireflies-ingest.YOUR_SUBDOMAIN.workers.dev/status/FIREFLIES_ID
```

2. Check Cloudflare logs:
```bash
wrangler tail --cwd ingest
wrangler tail --cwd parser
wrangler tail --cwd embedder
wrangler tail --cwd extractor
```

3. Query Supabase directly:
```sql
-- Check job status
SELECT * FROM fireflies_ingestion_jobs WHERE fireflies_id = 'xxx';

-- Check metadata
SELECT * FROM document_metadata WHERE fireflies_id = 'xxx';

-- Check segments
SELECT * FROM meeting_segments WHERE metadata_id = 'uuid';

-- Check chunks
SELECT id, file_id, metadata->>'doc_type' as doc_type
FROM documents WHERE file_id = 'uuid';
```
