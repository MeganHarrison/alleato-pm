# Documentation Folder

This folder contains all project documentation that will be automatically committed and deployed to Vercel.

## Auto-Commit Setup

Any files added or changed in this folder can be automatically committed and pushed to GitHub using the docs watcher script.

### Usage

**Option 1: Run the watcher manually**
```bash
npm run watch:docs
```

This will:
- Watch the `docs/` folder for any changes
- Wait 5 seconds after the last change (debounce)
- Automatically stage, commit, and push changes to GitHub
- Trigger Vercel redeployment

**Option 2: Run in the background**
```bash
npm run watch:docs &
```

**Stop the watcher:**
Press `Ctrl+C` or kill the process

### What Gets Auto-Committed

- ✅ New files added to docs/
- ✅ Changes to existing files
- ✅ Deleted files
- ✅ All file types (markdown, images, PDFs, etc.)

### Commit Message Format

Auto-commits will have this format:
```
docs: auto-update documentation

Updated X file(s) at YYYY-MM-DD HH:MM:SS

Files changed:
  - docs/file1.md
  - docs/file2.md

[skip ci]
```

The `[skip ci]` tag prevents CI/CD pipelines from running on documentation-only updates.

### Manual Commits

You can still manually commit documentation changes if preferred:
```bash
git add docs/
git commit -m "docs: your custom message"
git push
```

### Troubleshooting

**Watcher not starting:**
- Make sure chokidar is installed: `npm install`
- Check if the script exists: `ls scripts/watch-docs.js`

**Changes not being committed:**
- Make sure you have git configured
- Check you have push access to the repository
- Verify you're on the correct branch

**Multiple commits being created:**
- The watcher uses a 5-second debounce to batch changes
- If you're seeing too many commits, you may want to increase the `DEBOUNCE_MS` value in `scripts/watch-docs.js`
