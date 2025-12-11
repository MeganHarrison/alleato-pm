#!/bin/bash

echo "🧹 Cleaning build artifacts..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo

echo "🔍 Searching for invalid CSS patterns..."
grep -r "spacing(var(--gap))" . --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" --exclude-dir=node_modules --exclude-dir=.next 2>/dev/null

echo "✅ Clean complete. You can now run 'npm run dev' again."