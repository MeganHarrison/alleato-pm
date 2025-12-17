-- 006_fireflies_ingestion_jobs.sql
-- Recreate the Fireflies ingestion job tracking table that our pipeline,
-- admin endpoints, and maintenance scripts expect.

BEGIN;

-- Drop any stray definition so rerunning the migration is safe in dev
DROP TABLE IF EXISTS public.fireflies_ingestion_jobs CASCADE;
DROP TYPE IF EXISTS public.fireflies_ingestion_stage;

CREATE TYPE public.fireflies_ingestion_stage AS ENUM (
  'pending',
  'raw_ingested',
  'segmented',
  'chunked',
  'embedded',
  'done',
  'error'
);

CREATE TABLE public.fireflies_ingestion_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fireflies_id text NOT NULL UNIQUE,
  metadata_id uuid REFERENCES public.document_metadata(id) ON DELETE SET NULL,
  stage public.fireflies_ingestion_stage NOT NULL DEFAULT 'pending',
  attempt_count integer NOT NULL DEFAULT 0,
  last_attempt_at timestamptz,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX fireflies_ingestion_jobs_stage_idx
  ON public.fireflies_ingestion_jobs(stage);

CREATE INDEX fireflies_ingestion_jobs_metadata_idx
  ON public.fireflies_ingestion_jobs(metadata_id);

CREATE TRIGGER fireflies_ingestion_jobs_updated_at
  BEFORE UPDATE ON public.fireflies_ingestion_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.fireflies_ingestion_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fireflies_ingestion_jobs_read"
  ON public.fireflies_ingestion_jobs
  FOR SELECT
  USING (true);

CREATE POLICY "fireflies_ingestion_jobs_write"
  ON public.fireflies_ingestion_jobs
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

COMMIT;
