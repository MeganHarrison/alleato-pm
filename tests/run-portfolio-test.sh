#!/bin/bash

# Portfolio Test Runner Script
# Checks if dev server is running and runs the comprehensive test

echo "🧪 Alleato-Procore Portfolio Test Runner"
echo "========================================"
echo ""

# Check if server is running on port 3000
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Dev server is running on http://localhost:3000"
    echo ""
    echo "🏃 Running comprehensive portfolio test..."
    echo ""
    node tests/portfolio-comprehensive-test.js
else
    echo "❌ Dev server is not running on http://localhost:3000"
    echo ""
    echo "Please start the dev server first:"
    echo "  cd frontend"
    echo "  npm run dev"
    echo ""
    echo "Then run this script again:"
    echo "  bash tests/run-portfolio-test.sh"
    exit 1
fi
