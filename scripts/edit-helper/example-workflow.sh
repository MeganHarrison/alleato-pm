#!/bin/bash

# Example workflow showing the complete edit process

echo "
AI-Assisted Edit Workflow Example
=================================

This example shows how to:
1. Capture current code
2. Specify changes
3. Get AI assistance
4. Create a PR

Let's edit the main page to remove cards and use simple divs...
"

# Check if we're in the right directory
if [ ! -f "frontend/app/page.tsx" ]; then
    echo "❌ Please run this from the alleato-procore root directory"
    exit 1
fi

echo "Step 1: Capturing current page.tsx..."
./scripts/edit-helper/edit frontend/app/page.tsx

# Automatically add example changes to the template
cat > edit-request.md << 'EOF'
# Edit Request for AI Assistant

## Current Component/Page

**File Path:** `frontend/app/page.tsx`

### Current Code
[Code will be here from the capture]

## Visual Reference
**Screenshot:** `/figma-ready/01-Portfolio/company-portfolio.png`

## Required Changes
<!-- List your changes as specific bullet points -->
- [ ] Remove all Card components (Card, CardContent, CardHeader, CardTitle)
- [ ] Replace with standard div elements and headings
- [ ] Keep the same layout structure but use borders instead of cards
- [ ] Use h2 tags for phase titles instead of CardTitle
- [ ] Use p tags for descriptions instead of CardDescription
- [ ] Add border-t and pt-6 classes to separate sections

## Additional Context
Following the user's preference for cleaner, simpler layouts without card components.

## Constraints
- Use existing component library (ShadCN UI)
- Maintain current file structure
- Follow project patterns from CLAUDE.md
- Keep TypeScript types intact
- Keep all existing functionality (progress bars, checkboxes, badges)

---
**Instructions for AI:** Apply ONLY the changes listed above. Do not refactor unrelated code. Return the complete updated file.
EOF

echo "
✅ Template created with example changes!

Next steps:
1. Copy this to Claude Code:
   cat edit-request.md | pbcopy

2. Paste into Claude and get the updated code

3. Save Claude's response to the file

4. Create a PR:
   ./scripts/edit-helper/create-pr-from-ai.sh frontend/app/page.tsx

Press any key to view the template..."
read -n 1

cat edit-request.md