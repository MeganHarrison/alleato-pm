# Docs Viewer - Markdown Documentation Browser

A simple, elegant way to browse all your project's markdown documentation in the browser.

## Features

✨ **Auto-discovery** - Automatically finds and serves all `.md` files
📁 **File tree navigation** - Organized sidebar matching your folder structure
🎨 **Syntax highlighting** - Beautiful code blocks with language support
🌓 **Dark mode** - Toggle between light and dark themes
📱 **Responsive** - Works on desktop and mobile
🔍 **No configuration** - Just run and browse

## Quick Start

### Method 1: One-line command (Recommended)
```bash
./scripts/docs-viewer/start-docs.sh
```

Then open: http://localhost:3333

### Method 2: Manual setup
```bash
cd scripts/docs-viewer
npm install
npm start
```

### Method 3: Run from anywhere
```bash
cd scripts/docs-viewer
npm install -g .   # Install globally
docs-viewer /path/to/any/project
```

## How It Works

1. **Scans** the project directory for all markdown files
2. **Builds** a navigation tree based on folder structure
3. **Serves** each markdown file as a formatted HTML page
4. **Updates** automatically - just refresh to see new files

## File Organization

Your markdown files will appear in the sidebar organized by their folder structure:

```
📚 Alleato Documentation
├── README
├── CLAUDE
├── frontend/
│   ├── README
│   └── components/
│       └── README
├── scripts/
│   ├── edit-helper/
│   │   ├── README
│   │   └── SHOTTR_QUICK_GUIDE
│   └── multi-agent-setup/
│       ├── README
│       └── multi-agent-workflow-documentation
```

## URL Structure

Files are served with clean URLs:
- `/README.md` → http://localhost:3333/README
- `/scripts/edit-helper/README.md` → http://localhost:3333/scripts/edit-helper/README

## Customization

### Change Port
```bash
PORT=8080 npm start
```

### Serve Different Directory
```bash
node server.js /path/to/docs
```

### Add to package.json
```json
{
  "scripts": {
    "docs": "node scripts/docs-viewer/server.js"
  }
}
```

Then run with: `npm run docs`

## Features in Detail

### Navigation
- Collapsible sections for folders
- Active page highlighting
- Alphabetical sorting
- Clean, readable names

### Rendering
- GitHub-flavored markdown
- Tables support
- Code syntax highlighting
- Task lists
- Emoji support 

### Theme Support
- Light mode (default)
- Dark mode
- Persistent preference (localStorage)
- Smooth transitions

## Tips

1. **Homepage**: The root `README.md` is automatically served as the homepage
2. **Deep linking**: Share direct links to any documentation page
3. **Search**: Use browser's Ctrl+F to search within pages
4. **Print**: Pages are print-friendly with clean formatting

## Adding New Documentation

Just create a `.md` file anywhere in your project:
```bash
echo "# New Feature Docs" > docs/new-feature.md
```

Refresh the browser and it appears in the navigation!

## Troubleshooting

**Port already in use?**
```bash
PORT=4444 npm start
```

**Can't see a file?**
- Make sure it ends with `.md` or `.markdown`
- Check it's not in `.gitignore` or `node_modules`
- Refresh the browser

**Styles look wrong?**
- Clear browser cache
- Check network tab for 404s on CSS files

## Tech Stack

- **Express.js** - Web server
- **Marked** - Markdown parsing
- **Highlight.js** - Syntax highlighting
- **Vanilla JS** - No frontend framework needed

## Future Ideas

- [ ] Search functionality
- [ ] Export to PDF
- [ ] Edit mode
- [ ] Git integration (show last modified)
- [ ] Breadcrumb navigation
- [ ] Table of contents for long pages