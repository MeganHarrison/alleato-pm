# Procore Screenshot Capture for Competitive Analysis

Automated screenshot capture of Procore's construction management platform for UI/UX analysis and potential rebuild evaluation. **Now with Supabase storage and AI analysis!**

## 🎯 Purpose

Systematically capture Procore's UI to:
- Analyze page layouts and information architecture
- Document component patterns and design system
- Create Figma reference boards for custom rebuild
- Identify essential vs. bloat features
- **Store everything in Supabase for querying and AI analysis**

## 📋 Prerequisites

- Node.js 18+
- A Procore account (for authenticated capture)
- Figma account (for import)
- **Supabase project (for data storage)**
- **OpenAI API key (for AI analysis - optional)**

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm run setup

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 3. Run database migrations
# Copy supabase/migrations/001_create_tables.sql to Supabase SQL Editor and run

# 4. Create storage bucket in Supabase Dashboard
# Bucket name: procore-screenshots

# 5. Capture public documentation (no auth required)
npm run capture:public

# 6. Set up Procore authentication
npm run auth
# → Browser opens → Log into Procore → Close browser when done

# 7. Capture app pages WITH Supabase storage
npm run capture:supabase

# 8. Query your data
npm run db:modules     # List all Procore modules
npm run db:progress    # Show capture progress
npm run db:estimate    # Show rebuild estimate

# 9. Run AI analysis (requires OpenAI key)
npm run ai:analyze     # Analyze screenshots with GPT-4 Vision
npm run ai:report      # Generate rebuild report
```

## 🗄️ Supabase Integration

### Database Schema

The migration creates these tables:

| Table | Purpose |
|-------|---------|
| `procore_capture_sessions` | Track each capture run |
| `procore_screenshots` | Screenshot metadata + AI analysis |
| `procore_components` | Detected UI components |
| `procore_modules` | Procore feature catalog with rebuild estimates |
| `procore_features` | Individual features for planning |

### Storage

Screenshots are uploaded to Supabase Storage bucket `procore-screenshots` with this structure:
```
procore-screenshots/
├── project_management/
│   ├── daily-log/
│   │   ├── fullpage.png
│   │   └── viewport.png
│   └── ...
├── financials/
│   └── ...
└── ...
```

### Querying Data

```bash
# From CLI
npm run db:modules      # See all Procore modules with rebuild estimates
npm run db:progress     # Check which modules have been captured
npm run db:estimate     # Get total rebuild effort estimate
npm run db:screenshots  # List recent captures
npm run db:components   # Component detection stats

# Or directly in Supabase
SELECT * FROM procore_rebuild_estimate;
SELECT * FROM procore_capture_summary;
```

## 🤖 AI Analysis

With an OpenAI API key, you can analyze screenshots to extract:
- UI component inventory
- Color palettes
- UX observations
- Improvement suggestions
- Rebuild complexity estimates

```bash
# Analyze up to 10 unanalyzed screenshots
OPENAI_API_KEY=sk-xxx npm run ai:analyze

# Analyze more
OPENAI_API_KEY=sk-xxx npx ts-node scripts/analyze-screenshots.ts analyze 50

# Generate rebuild report from all analyzed screenshots
OPENAI_API_KEY=sk-xxx npm run ai:report
```

## 📁 Output Structure

```
procore-screenshot-capture/
├── procore-screenshots/           # Public doc screenshots
│   ├── projectManagement/
│   ├── qualitySafety/
│   ├── projectFinancials/
│   └── ...
│
├── procore-app-screenshots/       # Authenticated app screenshots
│   ├── fullpage/                  # Full scrollable page
│   ├── viewport/                  # What user sees on load
│   ├── components/                # Individual UI components
│   └── modals/                    # Dialog/modal captures
│
└── figma-ready/                   # Organized for Figma import
    ├── 01-Portfolio/
    ├── 02-Project-Home/
    ├── 03-Core-Tools/
    ├── 04-Quality-Safety/
    ├── 05-Design-Coordination/
    ├── 06-Financials/
    ├── 07-Bidding/
    ├── 08-Components/
    ├── 09-Modals/
    ├── import-manifest.csv
    └── summary.json
```

## 🎨 Importing to Figma

### Method 1: Direct Drag & Drop
1. Open Figma, create a new file
2. Create frames for each category (Portfolio, Core Tools, Financials, etc.)
3. Drag folders from `figma-ready/` directly into Figma frames

### Method 2: Using Figma Plugins
Recommended plugins for bulk import:
- **Insert Big Image** - Handles large full-page screenshots
- **Content Reel** - Batch import from folders
- **Image Palette** - Extract color schemes from screenshots

### Method 3: Create a Reference Board
```
Figma Structure:
├── 📁 Procore Analysis
│   ├── 🖼 Portfolio & Company Level
│   ├── 🖼 Project Dashboard
│   ├── 🖼 Daily Operations (Daily Log, Photos, etc.)
│   ├── 🖼 Document Management
│   ├── 🖼 Financial Tools
│   ├── 🖼 Quality & Safety
│   └── 🖼 Component Library (extracted patterns)
```

## 🔍 Key Procore Modules to Analyze

### Must-Have for Construction PM
- **Daily Log** - Time tracking, weather, notes
- **Directory** - Contacts, companies, roles
- **Documents** - File management, folders, permissions
- **Drawings** - Plan management, markups, revisions
- **RFIs** - Request for information workflow
- **Submittals** - Document approval workflow
- **Budget** - Cost tracking, forecasting
- **Change Orders** - Change management
- **Punch List** - Deficiency tracking

### Nice-to-Have (Often Overengineered)
- Meetings (most use Google Calendar)
- Emails (most use Gmail/Outlook)
- Bidding (specialized tools exist)
- 3D Models (Autodesk dominates)

### Probably Don't Need
- Workforce planning (complex, rarely used)
- Equipment tracking (most use spreadsheets)
- Insurance certificates (Compliance tools better)

## 🔧 Customization

### Capture Specific Pages Only
Edit `capture-authenticated.ts` and modify `PROCORE_APP_SECTIONS`:

```typescript
const PROCORE_APP_SECTIONS = {
  projectLevel: [
    // Add only what you need
    { name: 'daily-log', path: '/projects/{PROJECT_ID}/project/daily_log' },
    { name: 'budget', path: '/projects/{PROJECT_ID}/project/budget' },
  ],
};
```

### Capture Additional Modals
Uncomment the modal capture in the test:
```typescript
await captureModals(page, section.name);
```

### Change Viewport Size
Modify the context options:
```typescript
context = await browser.newContext({
  storageState: AUTH_FILE,
  viewport: { width: 2560, height: 1440 }, // 2K resolution
});
```

## 📊 Rebuild Feasibility Assessment

Based on Procore's architecture, here's a complexity estimate:

| Module | Complexity | Build Time | Priority |
|--------|------------|------------|----------|
| Directory | Low | 2 weeks | High |
| Documents | Medium | 4 weeks | High |
| Daily Log | Low | 2 weeks | High |
| Photos | Low | 1 week | Medium |
| Drawings | High | 8 weeks | High |
| RFIs | Medium | 3 weeks | High |
| Submittals | Medium | 3 weeks | High |
| Budget | High | 6 weeks | Medium |
| Change Orders | High | 6 weeks | Medium |
| Punch List | Low | 2 weeks | High |
| Schedule | Very High | 12 weeks | Low |

### Recommended MVP Scope
1. Directory (people, companies)
2. Documents (basic file management)
3. Daily Log (time, weather, notes)
4. Photos (simple gallery)
5. RFIs (request workflow)
6. Punch List (deficiency tracking)

**Estimated MVP Timeline**: 12-16 weeks with 2 developers

## 🤖 AI Integration Opportunities

Areas where AI can add value Procore doesn't have:

1. **Daily Log Generation** - Voice-to-text field notes
2. **Document Classification** - Auto-categorize uploads
3. **RFI Drafting** - Generate RFI text from photos/notes
4. **Photo Analysis** - Progress detection, safety hazards
5. **Budget Predictions** - Cost overrun forecasting
6. **Smart Search** - Natural language document search
7. **Automated Reports** - Generate weekly summaries

## ⚠️ Legal Considerations

- Screenshots are for internal analysis only
- Do not redistribute Procore's UI designs
- Building similar functionality is legal (ideas aren't patentable)
- Don't copy their exact visual design/branding
- Focus on functionality, create your own design system

## 🐛 Troubleshooting

### Authentication expires
Re-run `npm run auth` to refresh your session

### Screenshots are blank
Increase the wait time in the script:
```typescript
await page.waitForTimeout(3000); // Increase from 2000
```

### Modal capture fails
Some modals require specific data to open. Capture these manually.

### Pages timeout
Procore can be slow. Increase timeout:
```typescript
await page.goto(url, { timeout: 120000 }); // 2 minutes
```

## 📝 Next Steps After Capture

1. **Import to Figma** - Create reference boards
2. **Document Patterns** - Note common components/layouts
3. **Identify Scope** - Decide what to build vs. skip
4. **Design System** - Create your own component library
5. **Prototype** - Build clickable mockups
6. **Develop** - Start with MVP modules

---

Built for Alleato's construction software modernization initiative.
