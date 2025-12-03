#!/bin/bash

# Create PR from AI-generated code changes
# This script helps automate the PR creation after getting code from Claude/Codex

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Install it with: brew install gh"
    echo "Then authenticate with: gh auth login"
    exit 1
fi

# Get the file path from argument or prompt
FILE_PATH="$1"
if [ -z "$FILE_PATH" ]; then
    read -p "Enter the file path that was edited: " FILE_PATH
fi

if [ ! -f "$FILE_PATH" ]; then
    echo "❌ File not found: $FILE_PATH"
    exit 1
fi

# Generate branch name
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
FILE_NAME=$(basename "$FILE_PATH" | sed 's/\.[^.]*$//')
BRANCH_NAME="ai-edit/${FILE_NAME}-${TIMESTAMP}"

echo -e "${BLUE}Creating PR for AI-generated changes...${NC}"
echo -e "File: ${YELLOW}$FILE_PATH${NC}"
echo -e "Branch: ${YELLOW}$BRANCH_NAME${NC}"
echo ""

# Get edit description
echo "Enter a description of the changes (press Enter twice when done):"
DESCRIPTION=""
while IFS= read -r line; do
    [ -z "$line" ] && break
    DESCRIPTION="${DESCRIPTION}${line}\n"
done

# Create and switch to new branch
echo -e "${BLUE}Creating new branch...${NC}"
git checkout -b "$BRANCH_NAME"

# Stage the changed file
echo -e "${BLUE}Staging changes...${NC}"
git add "$FILE_PATH"

# Show diff
echo -e "${BLUE}Changes to be committed:${NC}"
git diff --cached --stat
echo ""
read -p "Continue with commit? [Y/n] " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]] && [ -n "$REPLY" ]; then
    git checkout -
    git branch -d "$BRANCH_NAME"
    echo "❌ Cancelled"
    exit 1
fi

# Commit changes
COMMIT_MSG="Update ${FILE_NAME}

${DESCRIPTION}

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

git commit -m "$COMMIT_MSG"

# Push branch
echo -e "${BLUE}Pushing to remote...${NC}"
git push -u origin "$BRANCH_NAME"

# Create PR
echo -e "${BLUE}Creating pull request...${NC}"
PR_BODY="## Summary
${DESCRIPTION}

## Changes
- Updated \`$FILE_PATH\`

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [x] UI/UX improvement
- [ ] Refactoring

## Testing
- [ ] Tested locally
- [ ] Screenshots attached (if UI changes)

---
🤖 Generated with [Claude Code](https://claude.ai/code)"

PR_URL=$(gh pr create \
    --title "Update ${FILE_NAME}" \
    --body "$PR_BODY" \
    --label "ai-generated" \
    2>&1)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Pull request created successfully!${NC}"
    echo -e "PR URL: ${BLUE}$PR_URL${NC}"
    
    # Offer to open in browser
    read -p "Open PR in browser? [Y/n] " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]] || [ -z "$REPLY" ]; then
        gh pr view --web
    fi
else
    echo "❌ Failed to create PR"
    echo "You can create it manually with: gh pr create"
fi