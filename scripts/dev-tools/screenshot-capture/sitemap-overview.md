# Enhanced Procore Sitemap Generator

This enhanced crawler generates a complete sitemap of Procore with organized page folders, screenshots, DOM snapshots, and comprehensive reports.

## 🚀 Quick Start

```bash
# Install dependencies (if needed)
npm install

# Run the enhanced sitemap crawler
npm run crawl:sitemap

# Or run directly
node scripts/enhanced-procore-crawl.js
```

## 📁 Output Structure

The crawler creates a complete sitemap with enhanced analysis for each page:

```
procore-sitemap/
├── README.md                     # Enhanced summary with analysis results
├── pages/                        # Individual page folders with analysis
│   ├── project_home/             # Each page gets its own folder
│   │   ├── screenshot.png        # Full page screenshot
│   │   ├── dom.html              # Complete DOM snapshot
│   │   ├── analysis.md           # 📋 Detailed page analysis (NEW!)
│   │   └── metadata.json         # Enhanced metadata with analysis data
│   ├── directory/
│   ├── commitments/
│   ├── budget/
│   └── ... (one folder per page)
└── reports/                      # Generated sitemap reports
    ├── sitemap-table.md          # Enhanced table with component counts
    ├── sitemap-list.md           # List format by category  
    └── detailed-report.json      # Complete JSON data with analysis
```

## 🔍 Enhanced Page Analysis (NEW!)

Each page folder now includes a comprehensive `analysis.md` file with:

### 📋 Complete Analysis Report
- **Summary & Insights**: Key observations about the page's purpose and functionality
- **Component Inventory**: Count and analysis of UI elements (buttons, forms, tables, etc.)
- **Table Structure**: Detailed breakdown of each table including headers and row counts
- **Form Analysis**: Field types, validation requirements, and workflow analysis
- **Related Database Tables**: Inferred data relationships and required database structure
- **Color Palette**: Sample of colors used on the page
- **Development Recommendations**: Specific guidance for rebuilding the functionality
- **Technical Implementation Notes**: Layout patterns, interactive elements, and architecture insights

### 🎯 Automated Insights
The analysis engine automatically detects:
- Data-heavy pages with multiple tables
- Form-intensive workflows
- Modal dialog usage patterns
- Navigation structures
- Grid/flexbox layouts
- Interactive element density

## 📊 Generated Reports

### 1. Enhanced Sitemap Table (`reports/sitemap-table.md`)
A comprehensive table with:
- Page names and categories
- Direct links to live Procore pages
- **Component counts** for each page
- **Table and form counts**
- Links to screenshots, DOM files, and analysis reports
- Success/failure status

### 2. Sitemap List (`reports/sitemap-list.md`) 
An organized list showing:
- Pages grouped by category (Project Management, Financials, etc.)
- Alphabetical listing of all pages
- Success indicators for each page

### 3. Detailed Analysis Report (`reports/detailed-report.json`)
Complete metadata including:
- Full page information with component analysis
- **Component analysis statistics**
- **Category breakdown with component counts**
- **Most component-rich pages**
- **Pages with tables and forms**
- Extracted links from each page
- Link analysis and statistics
- Generation timestamps

## 🎯 What Gets Crawled

The enhanced crawler captures all major Procore modules:

### Project Management
- Project Home
- Directory  
- Schedule
- Daily Log
- Drawings
- Photos
- Meetings
- Correspondence
- Forms

### Quality & Safety
- Punch List
- Inspections
- Incidents
- Observations

### Design Coordination  
- RFIs
- Submittals
- Coordination Issues

### Financials
- Prime Contracts
- Prime Contract Change Orders
- Commitments
- Commitment Change Orders
- Project Budget
- Change Events
- Invoicing

### Company Level
- Project List
- Portfolio
- Executive Dashboard
- Health Dashboard
- Map View
- Various Reports

## 🔧 Enhanced Features

### Individual Page Folders with Analysis
Every successfully crawled page gets its own folder containing:
- **screenshot.png**: Full-page screenshot
- **dom.html**: Complete HTML snapshot
- **analysis.md**: 📋 Comprehensive page analysis (NEW!)
- **metadata.json**: Enhanced metadata with analysis data

### Advanced Page Analysis (NEW!)
- **UI Component Detection**: Automatically counts buttons, forms, tables, modals, etc.
- **Table Structure Analysis**: Extracts table headers, row counts, and identifies actionable tables
- **Form Field Analysis**: Catalogs input types, validation requirements, and field names
- **Color Palette Extraction**: Samples colors used throughout the page
- **Layout Pattern Detection**: Identifies grid systems, flexbox usage, navigation patterns
- **Database Relationship Inference**: Suggests related tables based on page content and category
- **Development Insights**: Automatically generates recommendations for rebuilding functionality

### Comprehensive Link Analysis
- Extracts all links from each page
- Counts total links per page
- Identifies most linked pages
- Tracks unique URLs across the site

### Intelligent Insights Generation
- Detects data-heavy pages with reporting focus
- Identifies form-intensive workflows
- Recognizes modal dialog patterns
- Analyzes component complexity per category
- Provides category-specific development recommendations

### Error Handling
- Continues crawling even if individual pages fail
- Records failures in reports
- Provides detailed error information

### Organized Output
- Clean, readable folder names
- Categorized reporting with component analysis
- Multiple output formats (Markdown, JSON)
- Enhanced metadata with analysis statistics

## 🛠️ Configuration

The crawler can be customized by editing these variables in `enhanced-procore-crawl.js`:

```javascript
const OUTPUT_DIR = "./procore-sitemap";     // Output directory
const WAIT_TIME = 2000;                     // Page load wait time
const SCREENSHOT_DIR = "pages";             // Screenshots folder
const REPORTS_DIR = "reports";              // Reports folder
```

## 📈 Example Usage

### Running the Crawler
```bash
npm run crawl:sitemap
```

### Output Example
```
🚀 Starting Enhanced Procore Sitemap Generation
================================================

🔐 Checking authentication...
✅ Using existing session - skipping login.

📍 Base URL: https://us02.procore.com/562949954728542
🕷️  Starting comprehensive crawl...

[1/33] 📑 Project Home
    🔍 Analyzing page structure...
  ✓ Captured: Project Home (127 links, 24 components, 3 tables)
[2/33] 📑 Directory  
    🔍 Analyzing page structure...
  ✓ Captured: Directory (89 links, 18 components, 1 tables)
[3/33] 📑 Commitments
    🔍 Analyzing page structure...
  ✓ Captured: Commitments (156 links, 31 components, 2 tables)
...

🎉 ENHANCED CRAWL COMPLETE!
===========================
📁 Results saved to: /path/to/procore-sitemap
📊 31 pages successfully captured & analyzed
🧩 847 total UI components analyzed
📊 42 tables identified
📝 18 forms analyzed
📋 Enhanced sitemap table: reports/sitemap-table.md
📝 Sitemap list: reports/sitemap-list.md
📊 Detailed analysis report: reports/detailed-report.json
🔍 View README.md for complete summary
📋 Each page folder includes analysis.md with detailed insights!
```

## 🔍 Viewing Results

1. **Open the main README.md** in the output folder for an enhanced summary with analysis statistics
2. **Browse individual page folders** to see:
   - Screenshots and DOM snapshots
   - **📋 analysis.md files** with detailed page insights (NEW!)
   - Enhanced metadata with component counts
3. **Check reports/sitemap-table.md** for a complete table view with component analysis
4. **Use reports/sitemap-list.md** for organized category listings
5. **Analyze reports/detailed-report.json** for programmatic access to all analysis data

### 📋 Sample Analysis File Content

Each `analysis.md` file includes:
- **📊 Component breakdown**: "This Financials page contains 31 total UI components with 2 tables and 1 forms"
- **💡 Insights**: "Data-heavy page with multiple tables - likely used for reporting/management"
- **🧩 Component inventory table**: Detailed count of buttons, forms, tables, modals, etc.
- **📊 Table analysis**: Headers, row counts, and action capabilities for each table
- **🔗 Related database tables**: Suggested schema like `projects`, `contracts`, `budgets`, `vendors`
- **🚀 Development recommendations**: "Implement reusable table with sorting, filtering, pagination"

## 🆚 Comparison with Other Crawlers

| Feature | Simple Crawler | Deep Crawler | **Enhanced Sitemap** |
|---------|----------------|--------------|---------------------|
| Basic Screenshots | ✅ | ✅ | ✅ |
| DOM Snapshots | ✅ | ✅ | ✅ |
| Modal Crawling | ❌ | ✅ | ❌ |
| **Individual Page Folders** | ❌ | ❌ | **✅** |
| **Sitemap Table Generation** | ❌ | ❌ | **✅** |
| **Markdown Reports** | ❌ | ❌ | **✅** |
| **Link Analysis** | ❌ | ❌ | **✅** |
| **Page Analysis Reports** | ❌ | ❌ | **✅** |
| **Component Detection** | ❌ | ❌ | **✅** |
| **Table Structure Analysis** | ❌ | ❌ | **✅** |
| **Form Field Analysis** | ❌ | ❌ | **✅** |
| **Database Relationship Inference** | ❌ | ❌ | **✅** |
| **Development Recommendations** | ❌ | ❌ | **✅** |
| **Automated Insights** | ❌ | ❌ | **✅** |
| **Category-based Organization** | ❌ | ❌ | **✅** |

## 🚫 Authentication Required

The crawler uses the existing Procore session saved in the `user-data` directory. If you haven't logged in before:

1. The script will prompt you to log in manually
2. Your session will be saved automatically
3. Future runs will use the saved session

## 📝 Notes

- Each page gets a clean, sanitized folder name
- Screenshots are full-page captures
- DOM snapshots preserve the complete page state
- **🔍 analysis.md files provide comprehensive page insights** (NEW!)
- **Automated component and table analysis** for development planning (NEW!)
- **Database relationship inference** helps with schema design (NEW!)
- Link extraction helps understand site structure
- Reports provide both human-readable and machine-readable formats
- The crawler respects Procore's interface and waits appropriately between requests

## 🚀 Perfect for Development Planning

The enhanced analysis makes this crawler ideal for:
- **Competitive analysis** with detailed component breakdowns
- **Database schema planning** with inferred table relationships
- **Development estimation** with component complexity analysis
- **UI/UX research** with automated insights generation
- **Technical documentation** with comprehensive page reports