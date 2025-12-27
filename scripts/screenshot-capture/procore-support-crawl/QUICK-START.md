# Quick Start Guide - Procore Support Documentation Crawl

**Ready to crawl?** Follow these simple steps.

---

## ⚡ Quick Start (3 Steps)

### Step 1: Navigate to Directory
```bash
cd scripts/screenshot-capture
```

### Step 2: Install Dependencies (if needed)
```bash
npm install
```

### Step 3: Run the Crawl
```bash
node scripts/crawl-support-comprehensive.js
```

That's it! The crawler will:
- 🌐 Open a browser window
- 📸 Visit and capture support documentation pages
- 💾 Save screenshots, DOM, and metadata
- 📊 Generate comprehensive reports including sitemap.md

---

## 📁 What Gets Created

After the crawl completes, you'll have:

```
procore-support-crawl/
├── pages/                              # Individual page captures
│   ├── [page-name]/
│   │   ├── screenshot.png              # Full-page screenshot
│   │   ├── dom.html                    # Complete HTML
│   │   └── metadata.json               # Structured data
│   └── [50-100+ more pages...]
│
└── reports/                            # Generated reports
    ├── sitemap.md                      # ⭐ MAIN DELIVERABLE
    ├── detailed-report.json            # Complete JSON data
    ├── link-graph.json                 # Page relationships
    └── crawl-summary.json              # Statistics
```

---

## 🎯 Main Deliverable

**The sitemap.md file is your primary deliverable.**

It contains:
- ✅ Complete table of contents with all pages
- ✅ Detailed statistics and category breakdown
- ✅ Individual page listings with full details
- ✅ Content structure and navigation hierarchy
- ✅ Links to all screenshots
- ✅ Quick reference index

**Location:** `reports/sitemap.md`

---

## ⏱️ How Long Will It Take?

- **50 pages:** 30-45 minutes
- **100 pages:** 60-120 minutes
- **Maximum (100+ pages):** 2-3 hours

The crawler has a safety limit of 100 pages by default. You can modify this in the script if needed.

---

## 👀 What You'll See

While running, the console will show:
```
🚀 Starting Procore Support Documentation Crawl...
📍 Starting URL: https://support.procore.com/products/online

📸 Capturing: products/online
   URL: https://support.procore.com/products/online
   ✅ Captured: 45 links, 12 clickables, 3 expandables

🎯 Looking for expandable sections on: products/online
   🔍 Found expandable: "Getting Started"
   📋 Found 5 revealed items

📊 Progress: 1/100 pages captured, 45 in queue

📸 Capturing: products/online/project-management
   ...
```

---

## ✅ How to Know It's Done

The crawler finishes when you see:

```
✅ Crawl complete!
📁 Output directory: ./procore-support-crawl
📊 Total pages captured: 87
🔗 Total links discovered: 1,243

📊 Generating comprehensive reports...
✅ Sitemap generated: procore-support-crawl/reports/sitemap.md
✅ Reports generated in: procore-support-crawl/reports
```

---

## 🔍 Next Steps After Crawl

1. **View the sitemap:**
   ```bash
   open procore-support-crawl/reports/sitemap.md
   ```

2. **Check statistics:**
   ```bash
   cat procore-support-crawl/reports/crawl-summary.json
   ```

3. **Browse screenshots:**
   ```bash
   open procore-support-crawl/pages/
   ```

4. **Start analysis:**
   - Review [IMPLEMENTATION-TASKS.md](IMPLEMENTATION-TASKS.md) for next steps
   - Use sitemap.md to navigate captured documentation
   - Extract features from detailed-report.json

---

## 🛠️ Troubleshooting

### Browser doesn't open
**Issue:** Script runs but no browser appears
**Solution:** Check that Playwright is installed:
```bash
npm install
npx playwright install
```

### Out of disk space
**Issue:** Error about disk space during crawl
**Solution:** Free up at least 500MB, or reduce MAX_PAGES in the script

### Pages not loading
**Issue:** Some pages fail to capture
**Solution:** Increase WAIT_TIME in the script (line 7) from 2000 to 3000+

### Crawl seems stuck
**Issue:** No progress for several minutes
**Solution:** Check the browser window - might be waiting for user interaction

---

## ⚙️ Configuration

Edit `scripts/crawl-support-comprehensive.js` to adjust:

```javascript
// Line 7: Wait time between pages (milliseconds)
const WAIT_TIME = 2000;  // Increase if pages load slowly

// Line 419: Maximum pages to crawl
const maxPages = 100;  // Increase for more comprehensive crawl
```

---

## 📞 Questions?

- **Where's the main output?** → `reports/sitemap.md`
- **How do I find specific features?** → Search sitemap.md
- **Can I stop and resume?** → Yes, already-visited URLs are tracked
- **How do I re-crawl?** → Delete `pages/*` and `reports/*` then re-run

---

## 📚 Full Documentation

For complete details, see:
- [README.md](README.md) - Comprehensive documentation
- [IMPLEMENTATION-TASKS.md](IMPLEMENTATION-TASKS.md) - Task breakdown
- [CRAWL-SUMMARY.md](CRAWL-SUMMARY.md) - Results summary (after crawl)

---

**Ready?** Run the command:

```bash
cd scripts/screenshot-capture && node scripts/crawl-support-comprehensive.js
```
