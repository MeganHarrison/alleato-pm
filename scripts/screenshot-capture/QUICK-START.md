# Quick Start: Procore Video Transcript Scraper

## TL;DR

This scraper extracts transcripts and video metadata from Procore training videos **without guessing**. It captures the **actual video hosting platform** by monitoring network traffic.

## Example Video URL

```
https://support.procore.com/references/videos/training-videos?wchannelid=vtsli1z4on&wmediaid=9uu5aap1ox
```

## Run a Test (30 seconds)

```bash
cd scripts/screenshot-capture
node test-video-scraper.mjs
```

This will:
1. Open a browser to the example video page
2. Extract the transcript text from the DOM
3. Capture video asset URLs from network traffic
4. Identify the hosting platform (e.g., Wistia, CloudFront, S3)
5. Save everything to `procore-video-data-test/`

## What You Get

### Files Created

```
procore-video-data-test/
├── 9uu5aap1ox.json              # Complete metadata
├── transcripts/
│   └── 9uu5aap1ox.txt           # Plain text transcript
└── screenshots/
    └── 9uu5aap1ox-full-page.png # Full page screenshot
```

### Sample JSON Output

```json
{
  "url": "https://support.procore.com/...",
  "title": "Creating a Budget in Procore",
  "wmediaid": "9uu5aap1ox",
  "transcript_text": "Welcome to this tutorial...",
  "transcript_hash": "a3b5c7d9...",
  "video_asset_urls": [
    "https://fast.wistia.net/embed/medias/9uu5aap1ox.m3u8"
  ],
  "video_host_domains": [
    "fast.wistia.net"
  ]
}
```

## How It Discovers the Video Host

**Network Traffic Monitoring** (no guessing):

```javascript
page.on('request', (req) => {
  const url = req.url();

  // Captures actual .mp4, .m3u8, .ts URLs
  if (/\.m3u8|\.mp4|\.ts/.test(url)) {
    assetUrls.add(url);
  }
});
```

The scraper:
1. Listens to ALL network requests
2. Filters for video-related URLs
3. Extracts the hostname (e.g., `fast.wistia.net`)
4. Returns the **real hosting platform** - no assumptions!

## Production Usage

### With Supabase Storage

```bash
# 1. Setup database (run once)
# Execute: scripts/screenshot-capture/supabase/migrations/create_procore_video_transcripts.sql

# 2. Configure environment
# Add to .env:
NEXT_PUBLIC_SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key

# 3. Run with database integration
npx playwright test scripts/capture-video-with-supabase.ts
```

### Batch Processing

Edit `scripts/capture-video-with-supabase.ts` and add URLs:

```typescript
const videoUrls = [
  'https://support.procore.com/references/videos/training-videos?wchannelid=xxx&wmediaid=yyy',
  'https://support.procore.com/references/videos/training-videos?wchannelid=xxx&wmediaid=zzz',
  // Add more...
];
```

## Key Features

### ✅ Transcript Extraction
- Extracts visible transcript text from DOM
- Downloads transcript files (.vtt, .srt) if available
- SHA-256 hashing for deduplication

### ✅ Real Video Discovery
- Monitors network traffic during page load
- Captures actual video URLs (.mp4, .m3u8, .ts)
- Identifies player endpoints (embed iframes)
- Determines hosting platform from real requests

### ✅ No Assumptions
Unlike simple scrapers, this tool:
- **Doesn't guess** "it's probably on S3"
- **Doesn't assume** "it must be Wistia"
- **Captures reality** by monitoring the browser's network layer

### ✅ Storage Options
- Local files (JSON, txt, png)
- Supabase database with full-text search
- Automatic deduplication

## Troubleshooting

### "No transcript label found"
→ The page doesn't have a visible "Transcript" section. Not all videos have transcripts.

### "No video assets discovered"
→ Video didn't start loading. Possible causes:
- Autoplay blocked
- Network slow
- Different player technology

Try increasing wait time in `test-video-scraper.mjs`:
```javascript
await page.waitForTimeout(10000); // Increase from 5000
```

### Browser doesn't open
→ Playwright might not be installed:
```bash
npx playwright install chromium
```

## Files Overview

| File | Purpose |
|------|---------|
| `test-video-scraper.mjs` | Quick standalone test script |
| `scripts/capture-video-transcripts.ts` | Full TypeScript implementation |
| `scripts/capture-video-with-supabase.ts` | With database integration |
| `lib/supabase-video-storage.ts` | Database helper functions |
| `supabase/migrations/create_procore_video_transcripts.sql` | Database schema |
| `VIDEO-TRANSCRIPT-SCRAPER.md` | Complete documentation |
| `QUICK-START.md` | This file |

## Next Steps

1. **Test the scraper**: Run `node test-video-scraper.mjs`
2. **Review output**: Check `procore-video-data-test/`
3. **Read full docs**: See `VIDEO-TRANSCRIPT-SCRAPER.md`
4. **Setup database**: Run the SQL migration
5. **Batch process**: Edit video URL list and run with Supabase

## Architecture Decision

**Why network monitoring instead of DOM scraping for video URLs?**

DOM scraping would only give you:
- `<iframe src="https://fast.wistia.net/embed/iframe/9uu5aap1ox">`

Network monitoring gives you the **actual video files**:
- `https://fast.wistia.net/embed/medias/9uu5aap1ox.m3u8` (HLS manifest)
- `https://embed-fastly.wistia.com/deliveries/abc123.mp4` (Direct MP4)
- Hosting domain: `fast.wistia.net` → **It's Wistia, not guesswork**

This is the **correct approach** for discovering video infrastructure.

---

**Ready to start?**

```bash
cd scripts/screenshot-capture
node test-video-scraper.mjs
```
