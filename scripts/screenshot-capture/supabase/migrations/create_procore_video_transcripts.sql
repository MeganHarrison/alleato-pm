-- Create table for storing Procore training video transcripts and metadata
-- This table stores extracted transcripts, video URLs, and hosting information

CREATE TABLE IF NOT EXISTS procore_video_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source and identification
  url TEXT NOT NULL,
  title TEXT,
  wmediaid TEXT,
  wchannelid TEXT,

  -- Transcript content
  transcript_text TEXT,
  transcript_hash TEXT UNIQUE, -- SHA-256 hash for deduplication
  transcript_download_url TEXT,
  transcript_filename TEXT,

  -- Video metadata
  video_asset_urls TEXT[] DEFAULT '{}', -- Direct .mp4, .m3u8 URLs
  video_player_urls TEXT[] DEFAULT '{}', -- Embed/player endpoints
  video_host_domains TEXT[] DEFAULT '{}', -- Extracted hosting domains

  -- Screenshots
  screenshots TEXT[] DEFAULT '{}',

  -- Additional metadata (JSON)
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_video_transcripts_wmediaid ON procore_video_transcripts(wmediaid);
CREATE INDEX IF NOT EXISTS idx_video_transcripts_hash ON procore_video_transcripts(transcript_hash);
CREATE INDEX IF NOT EXISTS idx_video_transcripts_created ON procore_video_transcripts(created_at DESC);

-- Create full-text search index for transcript content
CREATE INDEX IF NOT EXISTS idx_video_transcripts_text_search
  ON procore_video_transcripts
  USING GIN (to_tsvector('english', COALESCE(transcript_text, '') || ' ' || COALESCE(title, '')));

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_video_transcripts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_video_transcripts_updated_at ON procore_video_transcripts;

CREATE TRIGGER trigger_update_video_transcripts_updated_at
  BEFORE UPDATE ON procore_video_transcripts
  FOR EACH ROW
  EXECUTE FUNCTION update_video_transcripts_updated_at();

-- Add helpful comments
COMMENT ON TABLE procore_video_transcripts IS 'Stores Procore training video transcripts and metadata extracted from support.procore.com';
COMMENT ON COLUMN procore_video_transcripts.transcript_hash IS 'SHA-256 hash of transcript_text for deduplication';
COMMENT ON COLUMN procore_video_transcripts.video_asset_urls IS 'Direct video file URLs (.mp4, .m3u8) discovered from network traffic';
COMMENT ON COLUMN procore_video_transcripts.video_host_domains IS 'Hosting domains extracted from asset URLs (e.g., wistia.net, cloudfront.net)';

-- RLS Policies (adjust based on your security requirements)
ALTER TABLE procore_video_transcripts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Allow authenticated users to read video transcripts"
  ON procore_video_transcripts
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow service role to insert/update/delete
CREATE POLICY "Allow service role full access to video transcripts"
  ON procore_video_transcripts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
