#!/bin/bash

# Color output for better visibility
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Starting Alleato Python Backend${NC}"
echo -e "${BLUE}================================${NC}\n"

# Check if we're in the right directory
if [ ! -f "api.py" ]; then
  echo -e "${RED}Error: Must run from python-backend directory${NC}"
  exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
  echo -e "${YELLOW}Virtual environment not found. Creating...${NC}"
  python3 -m venv venv
  echo -e "${GREEN}✓ Virtual environment created${NC}\n"
fi

# Activate virtual environment
echo -e "${BLUE}Activating virtual environment...${NC}"
source venv/bin/activate
echo -e "${GREEN}✓ Virtual environment activated${NC}\n"

# Install/update dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo -e "${GREEN}✓ Dependencies installed${NC}\n"

# Check for .env file
if [ ! -f "../.env" ]; then
  echo -e "${YELLOW}Warning: No .env file found in root directory${NC}"
  echo -e "${YELLOW}Make sure OPENAI_API_KEY and SUPABASE credentials are set${NC}\n"
fi

# Start the server with detailed logging
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Starting FastAPI server on http://localhost:8051${NC}"
echo -e "${GREEN}================================${NC}\n"
echo -e "${YELLOW}Logging enabled - you'll see:${NC}"
echo -e "  • Request/response details"
echo -e "  • Agent handoffs and tool calls"
echo -e "  • Error stack traces"
echo -e "\n${YELLOW}Press Ctrl+C to stop${NC}\n"

# Run with uvicorn and detailed logging
uvicorn api:app \
  --host 0.0.0.0 \
  --port 8051 \
  --reload \
  --log-level debug \
  --access-log
