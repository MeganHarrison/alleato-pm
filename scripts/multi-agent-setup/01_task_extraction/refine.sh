#!/bin/bash
#
# Simple wrapper for task refinement from markdown concepts
#

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if file argument provided
if [ $# -eq 0 ]; then
    echo -e "${RED}Error: No concept file provided${NC}"
    echo "Usage: ./refine.sh <concept-file.md>"
    echo ""
    echo "Examples:"
    echo "  ./refine.sh concepts/commitments-module.md"
    echo "  ./refine.sh ~/ideas/new-feature.md"
    echo ""
    echo "Create a new concept from template:"
    echo "  cp templates/CONCEPT_TEMPLATE.md concepts/my-feature.md"
    echo "  ./refine.sh concepts/my-feature.md"
    exit 1
fi

CONCEPT_FILE=$1

# Check if file exists
if [ ! -f "$CONCEPT_FILE" ]; then
    echo -e "${RED}Error: File not found: $CONCEPT_FILE${NC}"
    exit 1
fi

# Check for API key
if [ -z "$OPENAI_API_KEY" ]; then
    echo -e "${RED}Error: OPENAI_API_KEY not set${NC}"
    echo "Run: export OPENAI_API_KEY=your-key-here"
    exit 1
fi

echo -e "${BLUE}🚀 Task Refinement${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "📄 Input: ${GREEN}$CONCEPT_FILE${NC}"
echo ""

# Run the refiner
python task_refiner_v2.py --file "$CONCEPT_FILE"

# Check if successful
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Refinement complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review the refined task list:"
    echo "   cat task-refinement-outputs/refined_task_*.md | less"
    echo ""
    echo "2. Run with multi-agent system:"
    echo "   cd ../modular-agents"
    echo "   python orchestrator.py --task ../task-refinement/task-refinement-outputs/refined_task_*.md"
else
    echo -e "${RED}❌ Refinement failed${NC}"
    exit 1
fi