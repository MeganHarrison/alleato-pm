#!/bin/bash
# Run from the workers directory
# Usage: ./setup-secrets.sh

echo "Enter your secrets (they won't be displayed):"

read -sp "SUPABASE_URL: " SUPABASE_URL
echo
read -sp "SUPABASE_SERVICE_KEY: " SUPABASE_SERVICE_KEY
echo
read -sp "OPENAI_API_KEY: " OPENAI_API_KEY
echo
read -sp "FIREFLIES_API_KEY: " FIREFLIES_API_KEY
echo

echo "Pushing secrets to all workers..."

for worker in ingest parser embedder extractor; do
  echo "→ $worker"
  echo "$SUPABASE_URL" | wrangler secret put SUPABASE_URL --cwd $worker
  echo "$SUPABASE_SERVICE_KEY" | wrangler secret put SUPABASE_SERVICE_KEY --cwd $worker
  echo "$OPENAI_API_KEY" | wrangler secret put OPENAI_API_KEY --cwd $worker
done

echo "→ ingest (FIREFLIES_API_KEY)"
echo "$FIREFLIES_API_KEY" | wrangler secret put FIREFLIES_API_KEY --cwd ingest

echo "Done!"
