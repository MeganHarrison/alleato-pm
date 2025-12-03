#!/bin/bash

# Start the documentation viewer

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/../.."

echo "📚 Starting Alleato Documentation Viewer..."
echo ""

# Check if node_modules exists
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
    echo "Installing dependencies..."
    cd "$SCRIPT_DIR"
    npm install
    echo ""
fi

# Start the server
cd "$SCRIPT_DIR"
echo "Serving docs from: $PROJECT_ROOT"
echo ""
node server.js "$PROJECT_ROOT"