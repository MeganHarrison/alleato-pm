# Edit Helper - AI-Assisted Code Editing Workflow

This toolset streamlines the process of communicating edits to AI assistants (Claude Code, Codex) and automatically creating PRs from their output.

## Quick Start

### 🎯 Method 1: Visual Editing with Shottr (Recommended - Fastest)
1. **Screenshot** the UI you want to change
2. **Annotate** with arrows, circles, and text in Shottr
3. **Copy** (`⌘C`) the annotated screenshot
4. **Paste** into Claude with: `Apply these changes to [filename]`
5. **Apply** the returned code and create a PR

*See the [Visual Editing with Shottr](#-visual-editing-with-shottr-fastest-method) section below for detailed instructions.*

**Example Time Comparison:**
- **Old way**: "Move the testimonials section that's currently below the features cards to above them, and change the padding on the hero title from 40px to 80px, and remove all the Card components replacing them with regular divs" (typing time: ~30 seconds)
- **New way**: [Annotated screenshot with arrows and labels] (annotation time: ~5 seconds)

### 📝 Method 2: Text-Based Editing (Traditional)

### 1. Capture current code for AI editing:
```bash
./scripts/edit-helper/edit frontend/app/financial/commitments/page.tsx

# Or with a screenshot reference:
./scripts/edit-helper/edit frontend/components/ui/button.tsx 06-Financials/financials-commitments.png
```

This creates an `edit-request.md` file with:
- Current code
- Screenshot reference (if provided)
- Template for changes
- Instructions for the AI

### 2. Copy and paste into Claude/Codex:
- Fill in the "Required Changes" section
- Press 'c' to copy to clipboard
- Paste into Claude Code or Codex
- Get the updated code back

### 3. Apply the changes and create a PR:
- Save the AI's code to the original file
- Run: `./scripts/edit-helper/create-pr-from-ai.sh frontend/app/financial/commitments/page.tsx`
- The script will create a branch, commit, and open a PR

## 🚀 Visual Editing with Shottr (Fastest Method)

### Why Use Shottr?
Instead of typing out UI changes, you can **show** the AI exactly what you want using annotated screenshots. This is 10x faster than describing changes in text.

### Step-by-Step Shottr Workflow

1. **Take Screenshot with Shottr**
   - Use Shottr's hotkey to capture the area you want to edit
   - Or capture the full window/screen

2. **Annotate Your Changes**
   - **Red arrows/circles** = Remove these elements
   - **Blue arrows** = Move from → to
   - **Text labels** = Add specific values ("mt-8", "text-blue-500", "80px")
   - **Rectangles** = Highlight sections
   - **Numbers** = Show sequence (1→2→3)

3. **Copy the Annotated Screenshot**
   - Press `⌘C` (Cmd+C) in Shottr
   - Or click the "Copy" button

4. **Paste into Claude with Minimal Text**
   ```
   File: frontend/app/page.tsx
   
   [Paste screenshot here with ⌘V]
   
   Apply the visual changes marked in the screenshot.
   Keep all existing functionality.
   ```

5. **Get Updated Code from Claude**
   - Claude will analyze the screenshot and return the complete updated file
   - Copy the code from Claude's response

6. **Apply to Your File**
   - Open the file in your editor
   - Select all (`⌘A`) and paste (`⌘V`)

7. **Create PR** (Optional)
   ```bash
   ./scripts/edit-helper/create-pr-from-ai.sh frontend/app/page.tsx
   ```

### Example Annotations

| Change Type | How to Annotate |
|-------------|----------------|
| Remove element | Red circle with X or "REMOVE" label |
| Move element | Blue arrow from current → new position |
| Change spacing | Label: "padding: 80px" or "mt-8" |
| Change color | Label: "blue-500" pointing to element |
| Change text | Cross out old, write new text |
| Change width | Label: "max-w-6xl" or "500px" |

### Speed Run (30 seconds total)
1. **Shottr**: Capture → Annotate → `⌘C`
2. **Claude**: Paste + "Apply changes to [filename]"
3. **Copy** code → **Paste** in file → Done!

### Pro Tips
- Use consistent colors for different action types
- Include Tailwind classes in your labels
- For complex changes, show before/after screenshots
- The screenshot does 90% of the communication - minimal text needed
- See [SHOTTR_QUICK_GUIDE.md](./SHOTTR_QUICK_GUIDE.md) for keyboard shortcuts and color conventions

## Workflow Example (Text-Based Method)

```bash
# Step 1: Capture current state
cd /path/to/alleato-procore
./scripts/edit-helper/edit frontend/app/page.tsx

# Step 2: Edit the template
vim edit-request.md
# Add your specific changes like:
# - [ ] Remove card components and use divs
# - [ ] Increase spacing to 80px
# - [ ] Change button color to blue

# Step 3: Copy to clipboard
cat edit-request.md | pbcopy

# Step 4: Paste into Claude Code, get updated code

# Step 5: Save AI's response to the file
# Copy the code from Claude and paste into the file

# Step 6: Create PR automatically
./scripts/edit-helper/create-pr-from-ai.sh frontend/app/page.tsx
```

## Features

### Edit Helper (`edit`)
- Captures current file content
- Lists available screenshots from Procore captures
- Creates formatted template for AI
- Quick actions: copy, view, edit

### PR Creator (`create-pr-from-ai.sh`)
- Creates feature branch with timestamp
- Commits changes with AI attribution
- Opens PR with template
- Adds "ai-generated" label
- Opens PR in browser

## Combining Both Methods

For complex edits, combine visual and text approaches:

```
File: frontend/app/financial/commitments/page.tsx

[Paste annotated screenshot]

Additional requirements:
- Use Supabase client from '@/lib/supabase/client'
- Add loading states with Suspense
- Include error boundaries

Apply the visual changes and these technical requirements.
```

## Tips

### For Visual Editing (Shottr)
1. **Use consistent annotation colors**: Red=Remove, Blue=Move, Green=Add
2. **Label with code values**: Use exact Tailwind classes ("mt-8", "text-blue-500")
3. **Show context**: Include enough of the UI so AI understands the layout
4. **Multiple changes**: Number them (1, 2, 3) to show order

### For Text-Based Editing
1. **Be specific with changes**: List atomic changes as bullet points
2. **Reference screenshots**: Use the Procore screenshots in `/figma-ready`
3. **Use constraints**: Tell the AI what NOT to change
4. **Check diffs**: Review the git diff before creating the PR

### General Tips
- **Test locally** before creating a PR
- **Use the PR script** to maintain consistent commit messages
- **Keep PRs focused** - one logical change per PR

## Advanced Usage

### Batch Edits
Process multiple files by creating a shell loop:
```bash
for file in frontend/app/financial/**/page.tsx; do
    ./scripts/edit-helper/edit "$file"
    # Edit and process each file
done
```

### Custom Templates
Modify `capture-for-ai.js` to create module-specific templates for different types of edits.

### Integration with VSCode
Add these scripts to your VSCode tasks.json for quick access:
```json
{
  "label": "Capture for AI Edit",
  "type": "shell",
  "command": "${workspaceFolder}/scripts/edit-helper/edit ${file}"
}
```

## Requirements

### Required
- Node.js (for the capture script)
- GitHub CLI (`gh`) for PR creation
- macOS with `pbcopy` (or modify for Linux with `xclip`)

### Recommended
- **Shottr** (free) - For visual screenshot annotations
  - Download from: https://shottr.cc/
  - Alternative: CleanShot X ($29) or macOS Preview (built-in)
- Claude.ai account (or other AI coding assistant)

## Future Enhancements
- Direct API integration with Claude/OpenAI
- Automatic screenshot capture
- VSCode extension
- Batch PR creation

---

## The Fastest Way: Screenshot + Annotations

### Step 1: Take a screenshot
- Use `Cmd + Shift + 4` on Mac
- Or use CleanShot X / Skitch

### Step 2: Annotate directly on the image
- Draw arrows to show movements
- Circle elements to remove
- Add text labels for spacing ("80px", "mt-8")
- Cross out things to delete

### Step 3: Paste into Claude with minimal text

```
File: frontend/app/page.tsx

[Paste annotated screenshot]

Apply the visual changes shown in the screenshot.
Keep all functionality, just change the UI as marked.
```

### Common Annotation Patterns

#### Moving Elements
Draw an arrow from current position to new position

#### Removing Elements  
Draw an X or circle with "REMOVE" label

#### Spacing Changes
Add text label: "padding: 80px" or "mt-8"

#### Color Changes
Add label: "blue-500" with arrow pointing to element

#### Text Changes
Cross out old text, write new text next to it

### Example Annotations

1. **Remove cards**: Circle all Card components and write "replace with div"
2. **Change spacing**: Arrow pointing to gap with "80px" 
3. **Move section**: Draw curved arrow from testimonials to new position
4. **Change color**: Point to button and write "blue-500"

### Why This Works

- **Visual is faster than text** - One annotated screenshot replaces paragraphs of description
- **Claude understands annotations** - It can interpret arrows, circles, text labels
- **No ambiguity** - You're showing exactly what you want
- **Natural workflow** - Similar to giving feedback to a designer

### Pro Tips

1. **Use consistent annotations**:
   - Red = Remove
   - Blue = Move  
   - Green = Add
   - Yellow = Change

2. **Label with code values**:
   - Use Tailwind classes: "mt-8", "text-blue-500"
   - Use exact pixels: "80px", "width: 500px"

3. **Show before/after if complex**:
   - Left side: current state with annotations
   - Right side: Figma/Procore reference

This is genuinely the fastest way to communicate UI changes to AI assistants that support image input (like Claude).