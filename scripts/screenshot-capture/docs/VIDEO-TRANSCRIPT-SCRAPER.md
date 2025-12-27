# Procore Video Transcript & Metadata Scraper

A comprehensive Playwright-based scraper for extracting training video transcripts and metadata from Procore's support documentation.

## Features

### ✅ What This Scraper Does

1. **Transcript Extraction**
   - Extracts full transcript text from DOM
   - Downloads transcript files (.vtt, .srt) if available
   - Generates SHA-256 hashes for deduplication

2. **Video Metadata Discovery**
   - Captures actual video asset URLs (.mp4, .m3u8, .ts) from network traffic
   - Identifies video player endpoints and embed URLs
   - Determines hosting platform (Wistia, CloudFront, S3, etc.) from real network requests
   - **No assumptions or guessing** - captures actual URLs from the browser

3. **Screenshot Capture**
   - Full page screenshots
   - Transcript section screenshots
   - Video player screenshots

4. **Supabase Integration**
   - Automatic storage in Supabase database
   - Deduplication using transcript hashes
   - Full-text search support
   - Metadata storage with JSONB fields

## Target Pages

This scraper is designed for Procore training video pages with the following URL pattern:

```
https://support.procore.com/references/videos/training-videos?wchannelid=XXXXXX&wmediaid=XXXXXX
```

Example:
```
https://support.procore.com/references/videos/training-videos?wchannelid=vtsli1z4on&wmediaid=9uu5aap1ox
```

## Installation

### 1. Install Dependencies

```bash
cd scripts/screenshot-capture
npm install
```

Dependencies installed:
- `playwright` - Browser automation
- `@supabase/supabase-js` - Database integration
- `openai` - AI analysis (optional)
- `dotenv` - Environment variables

### 2. Setup Environment Variables

Create or update `.env` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Run Database Migration

Execute the SQL migration to create the `procore_video_transcripts` table:

```bash
# Using Supabase CLI
supabase db push

# Or manually run the migration file:
# scripts/screenshot-capture/supabase/migrations/create_procore_video_transcripts.sql
```

## Usage

### Single Video Extraction

Extract a single video and store to Supabase:

```bash
npx playwright test scripts/capture-video-with-supabase.ts -g "Extract and Store Single Video"
```

### Batch Processing

Process multiple videos:

```bash
npx playwright test scripts/capture-video-with-supabase.ts -g "Batch Process Multiple Videos"
```

To add more videos, edit the `videoUrls` array in the test file.

### Local-Only Extraction (No Supabase)

Extract to JSON files only:

```bash
npx playwright test scripts/capture-video-transcripts.ts
```

## Output Structure

### Directory Layout

```
procore-video-data/
├── screenshots/
│   ├── [wmediaid]-full-page.png
│   ├── [wmediaid]-transcript.png
│   └── [wmediaid]-player.png
├── transcripts/
│   ├── [wmediaid].txt          # Plain text transcript
│   └── [wmediaid].vtt          # Downloaded VTT file (if available)
├── metadata/
│   └── [wmediaid].json         # Full extraction result
└── all-videos.json             # Consolidated results
```

### Database Schema

The `procore_video_transcripts` table stores:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `url` | TEXT | Original video page URL |
| `title` | TEXT | Page title |
| `wmediaid` | TEXT | Wistia media ID from URL |
| `wchannelid` | TEXT | Wistia channel ID from URL |
| `transcript_text` | TEXT | Full transcript content |
| `transcript_hash` | TEXT | SHA-256 hash (unique) |
| `transcript_download_url` | TEXT | Download file URL |
| `transcript_filename` | TEXT | Downloaded filename |
| `video_asset_urls` | TEXT[] | Direct video URLs |
| `video_player_urls` | TEXT[] | Player/embed URLs |
| `video_host_domains` | TEXT[] | Hosting domains |
| `screenshots` | TEXT[] | Screenshot file paths |
| `metadata` | JSONB | Additional metadata |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

## How It Works

### 1. URL Classification

```typescript
function classifyUrl(url: string): 'procore_training_video' | 'procore_doc' | 'unknown'
```

Determines content type based on URL pattern:
- Training videos: `/videos/` path + `wmediaid` parameter
- Regular docs: `/references/` path without video params

### 2. Transcript Extraction

**DOM Extraction Strategy:**

1. Find the `Transcript` heading element
2. Locate the containing section/article
3. Collect paragraph blocks (filtering UI noise)
4. Deduplicate and join with blank lines
5. Remove footer content

**Download Strategy:**

1. Locate `button[aria-label*="Download transcript"]`
2. Listen for network responses matching transcript files
3. Capture URL, mime type, and content
4. Save to `transcripts/` directory

### 3. Video Asset Discovery

**Network Traffic Analysis:**

The scraper captures **actual video URLs from network requests**, not assumptions:

```typescript
// Monitors all network requests during playback
page.on('request', (req) => {
  const url = req.url();

  // Detect video assets
  if (/\.m3u8|\.mp4|\.ts|manifest|playlist/i.test(url)) {
    assetUrls.add(url);
  }

  // Detect player calls
  if (/wistia|vimeo|brightcove|cloudfront|embed/i.test(url)) {
    playerUrls.add(url);
  }
});
```

**Process:**
1. Attach network request listeners
2. Click the play button to trigger video loading
3. Wait for requests to fire (5 seconds)
4. Extract hosting domains from asset URLs
5. Store all discovered URLs

**Example discovered hosting platforms:**
- `fast.wistia.net` → Wistia hosting
- `*.cloudfront.net` → CloudFront CDN
- `s3.amazonaws.com` → Direct S3 origin
- Custom CDN domains

### 4. Deduplication

Uses SHA-256 hashing:

```typescript
const transcriptHash = crypto
  .createHash('sha256')
  .update(transcriptText)
  .digest('hex');
```

Before inserting, checks database for existing hash to prevent duplicates.

## API Functions

### Supabase Integration (`lib/supabase-video-storage.ts`)

```typescript
// Insert or update video data
await upsertVideoTranscript(videoData);

// Get by media ID
const video = await getVideoTranscriptByMediaId('9uu5aap1ox');

// Get all videos
const videos = await getAllVideoTranscripts();

// Search transcripts
const results = await searchTranscripts('budget workflow');

// Get statistics
const stats = await getTranscriptStats();
// Returns: { total_videos, videos_with_transcripts, unique_hosts, ... }

// Delete video
await deleteVideoTranscript(id);
```

## Example Output

### Extraction Result

```json
{
  "source": "procore_support",
  "content_type": "video_transcript",
  "url": "https://support.procore.com/references/videos/...",
  "title": "Creating a Budget in Procore",
  "transcript_text": "Welcome to this tutorial on creating budgets...",
  "transcript_hash": "a3b5c7d9e1f2...",
  "transcript_download": {
    "url": "https://example.com/transcript.vtt",
    "filename": "transcript-9uu5aap1ox.vtt",
    "mime": "text/vtt",
    "bytes": 12845,
    "localPath": "./transcripts/transcript-9uu5aap1ox.vtt"
  },
  "video": {
    "wmediaid": "9uu5aap1ox",
    "wchannelid": "vtsli1z4on",
    "asset_urls": [
      "https://fast.wistia.net/embed/medias/9uu5aap1ox.m3u8",
      "https://embed-fastly.wistia.com/deliveries/abc123.mp4"
    ],
    "player_urls": [
      "https://fast.wistia.net/embed/iframe/9uu5aap1ox"
    ],
    "host_hints": [
      "fast.wistia.net",
      "embed-fastly.wistia.com"
    ]
  },
  "screenshots": [
    "./screenshots/9uu5aap1ox-full-page.png",
    "./screenshots/9uu5aap1ox-transcript.png"
  ],
  "extracted_at": "2025-12-15T22:30:00.000Z"
}
```

### Database Stats Output

```
📊 Database Stats:
   Total videos: 24
   With transcripts: 22
   With downloads: 18
   Hosting platforms: fast.wistia.net, embed-fastly.wistia.com
   Total transcript chars: 145,832
```

## Advanced Usage

### Custom Video URL List

Create a text file with one URL per line:

```bash
# urls.txt
https://support.procore.com/references/videos/training-videos?wchannelid=xxx&wmediaid=yyy
https://support.procore.com/references/videos/training-videos?wchannelid=xxx&wmediaid=zzz
```

Then modify the batch test to read from file:

```typescript
const urls = fs.readFileSync('urls.txt', 'utf-8')
  .split('\n')
  .filter(line => line.trim());
```

### AI-Powered Analysis

The extracted transcripts can be analyzed using OpenAI:

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{
    role: 'user',
    content: `Summarize this Procore tutorial: ${transcript_text}`
  }]
});
```

## Troubleshooting

### No Transcript Found

**Symptoms:** `transcript_text` is `null`

**Possible causes:**
- Page doesn't have a transcript section
- Transcript is behind authentication
- Different DOM structure than expected

**Solution:** Check the page manually and adjust selectors if needed.

### No Video Assets Discovered

**Symptoms:** `video_asset_urls` array is empty

**Possible causes:**
- Video hasn't started loading (autoplay blocked)
- Video is behind authentication
- Different player technology

**Solutions:**
1. Increase wait time: `await page.waitForTimeout(10000)`
2. Manually click play: Already implemented
3. Check browser console for blocked requests

### Transcript Download Fails

**Symptoms:** `transcript_download.url` is `null`

**Possible causes:**
- No download button on page
- Download triggers browser download (not network request)
- Different button label/aria-label

**Solution:** Check page manually for download button presence and attributes.

### Supabase Connection Error

**Symptoms:** `Error: Missing Supabase credentials`

**Solution:**
1. Verify `.env` file exists in project root
2. Check environment variable names match:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Restart the process after updating `.env`

## Performance Notes

### Network Traffic

- Each video page generates 20-50 network requests
- Video asset discovery adds ~5 seconds per page
- Respectful crawling: 3-second delay between requests

### Storage

- Average transcript: ~2-5 KB text
- Full page screenshot: ~100-500 KB
- Transcript file (.vtt): ~10-50 KB

### Rate Limiting

The scraper includes built-in delays:
- 2 seconds after page load
- 5 seconds for video asset discovery
- 3 seconds between batch requests

**Best practice:** Process 10-20 videos at a time, then review.

## Security & Legal

### Data Usage

- All data scraped is from **public** Procore support pages
- No authentication bypass attempted
- No copyright infringement intended
- For **educational and research purposes only**

### Recommendations

- Store video asset URLs but **do not redistribute video files**
- Use transcripts for analysis, not republishing
- Respect Procore's terms of service
- Add appropriate attribution when using extracted data

## Future Enhancements

Potential improvements:

1. **Automatic video discovery** - Crawl training video index pages
2. **Multi-language support** - Handle non-English transcripts
3. **Timestamp extraction** - Parse VTT timecodes
4. **Thumbnail extraction** - Capture video preview images
5. **Audio download** - Extract audio tracks for speech-to-text
6. **Change detection** - Monitor for transcript updates

## Support & Contribution

For issues or improvements, please:
1. Check existing scripts in `scripts/screenshot-capture/`
2. Review Playwright documentation
3. Test locally before batch processing
4. Document any schema changes

---

**Last Updated:** 2025-12-15
**Version:** 1.0.0
**Maintainer:** Alleato-Procore Project
