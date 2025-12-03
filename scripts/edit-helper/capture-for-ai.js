#!/usr/bin/env node

/**
 * Edit Helper: Capture page state for AI assistants
 * 
 * This script helps you quickly capture:
 * 1. Component/page code
 * 2. Screenshot reference
 * 3. A formatted template ready to paste into Claude/Codex
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const TEMPLATE_OUTPUT = 'edit-request.md';
const SCREENSHOTS_DIR = path.join(__dirname, '../../procore-screenshot-capture/figma-ready');

// Command line arguments
const args = process.argv.slice(2);
const filePath = args[0];
const screenshotRef = args[1];

if (!filePath) {
  console.log(`
Edit Helper - Capture for AI Assistants
======================================

Usage: node capture-for-ai.js <file-path> [screenshot-reference]

Examples:
  node capture-for-ai.js frontend/app/financial/commitments/page.tsx
  node capture-for-ai.js frontend/components/ui/button.tsx 06-Financials/financials-commitments.png

This will create an edit-request.md file ready to copy/paste into Claude or Codex.
  `);
  process.exit(0);
}

// Read the file content
let fileContent;
try {
  const fullPath = path.join(process.cwd(), filePath);
  fileContent = fs.readFileSync(fullPath, 'utf-8');
} catch (error) {
  console.error(`Error reading file: ${filePath}`);
  console.error(error.message);
  process.exit(1);
}

// Get file info
const fileName = path.basename(filePath);
const fileExt = path.extname(filePath).slice(1);

// Create the template
const template = `# Edit Request for AI Assistant

## Current Component/Page

**File Path:** \`${filePath}\`

### Current Code
\`\`\`${fileExt}
${fileContent}
\`\`\`

## Visual Reference
${screenshotRef ? `**Screenshot:** \`/figma-ready/${screenshotRef}\`` : '[Add screenshot reference or paste image here]'}

## Required Changes
<!-- List your changes as specific bullet points -->
- [ ] Change 1: 
- [ ] Change 2: 
- [ ] Change 3: 

## Additional Context
<!-- Add any Procore reference, design notes, or requirements -->

## Constraints
- Use existing component library (ShadCN UI)
- Maintain current file structure
- Follow project patterns from CLAUDE.md
- Keep TypeScript types intact

---
**Instructions for AI:** Apply ONLY the changes listed above. Do not refactor unrelated code. Return the complete updated file.
`;

// Write the template
fs.writeFileSync(TEMPLATE_OUTPUT, template);

console.log(`
✅ Edit request template created: ${TEMPLATE_OUTPUT}

Next steps:
1. Fill in the "Required Changes" section
2. Copy the entire content
3. Paste into Claude Code or Codex
4. The AI will return the updated code

To view the template:
  cat ${TEMPLATE_OUTPUT}

To copy to clipboard (macOS):
  cat ${TEMPLATE_OUTPUT} | pbcopy
`);

// List available screenshots if no screenshot was provided
if (!screenshotRef) {
  console.log('\nAvailable screenshots in figma-ready:');
  try {
    const screenshots = execSync(`find ${SCREENSHOTS_DIR} -name "*.png" | sed 's|.*/figma-ready/||' | sort`).toString();
    console.log(screenshots);
  } catch (error) {
    // Ignore if directory doesn't exist
  }
}