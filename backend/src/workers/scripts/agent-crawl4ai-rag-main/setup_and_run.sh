#!/bin/bash
# Setup script for crawl4ai test

set -e

cd "$(dirname "$0")"

echo "Setting up environment..."

# Check for Python 3.12 or 3.13
if command -v python3.13 &> /dev/null; then
    PYTHON_CMD="python3.13"
    echo "✓ Found Python 3.13"
elif command -v python3.12 &> /dev/null; then
    PYTHON_CMD="python3.12"
    echo "✓ Found Python 3.12"
else
    echo "Installing Python 3.13 with uv..."
    if ! command -v uv &> /dev/null; then
        echo "Error: uv is not installed. Install it with: pip install uv"
        exit 1
    fi
    uv python install 3.13
    PYTHON_CMD=".venv/bin/python"  # Will be set after venv creation
fi

# Create or recreate venv with correct Python version
if [ -d ".venv" ]; then
    echo "Removing existing .venv..."
    rm -rf .venv
fi

echo "Creating virtual environment with $PYTHON_CMD..."
if command -v uv &> /dev/null; then
    uv venv --python "$PYTHON_CMD"
else
    $PYTHON_CMD -m venv .venv
fi

echo "Activating virtual environment..."
source .venv/bin/activate

echo "Installing dependencies..."
if command -v uv &> /dev/null; then
    uv pip install -e .
else
    pip install -e .
fi

echo "Running crawl4ai-setup..."
if command -v crawl4ai-setup &> /dev/null; then
    crawl4ai-setup
else
    echo "Warning: crawl4ai-setup not found, skipping..."
fi

echo ""
echo "Running test_manual_crawl.py..."
echo "=================================="
python src/test_manual_crawl.py

