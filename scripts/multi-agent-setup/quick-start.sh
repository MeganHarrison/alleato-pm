#!/bin/bash
#
# Quick Start Script - Get up and running in minutes!
#

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    Multi-Agent Workflow Quick Start    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is required but not installed${NC}"
    exit 1
fi

# Find pip command
PIP_CMD=""
if command -v pip3 &> /dev/null; then
    PIP_CMD="pip3"
elif command -v pip &> /dev/null; then
    PIP_CMD="pip"
else
    # Try python3 -m pip
    if python3 -m pip --version &> /dev/null; then
        PIP_CMD="python3 -m pip"
    else
        echo -e "${RED}❌ pip is not installed${NC}"
        echo "Please install pip:"
        echo "  python3 -m ensurepip --upgrade"
        echo "Or use your system package manager"
        exit 1
    fi
fi

echo -e "${GREEN}✓ Found Python: $(python3 --version)${NC}"
echo -e "${GREEN}✓ Found pip: $($PIP_CMD --version | cut -d' ' -f1-2)${NC}"

# Check API Key
if [ -z "$OPENAI_API_KEY" ]; then
    echo ""
    echo -e "${YELLOW}⚠️  OpenAI API key not found${NC}"
    echo ""
    read -p "Enter your OpenAI API key (or press Enter to skip): " api_key
    if [ ! -z "$api_key" ]; then
        export OPENAI_API_KEY=$api_key
        echo -e "${GREEN}✓ API key set for this session${NC}"
    else
        echo -e "${YELLOW}Note: You'll need to set OPENAI_API_KEY before running agents${NC}"
    fi
else
    echo -e "${GREEN}✓ OpenAI API key found${NC}"
fi

# Check virtual environment
if [ -z "$VIRTUAL_ENV" ]; then
    echo ""
    echo -e "${YELLOW}📌 No virtual environment detected${NC}"
    echo "Recommended: Create a virtual environment first:"
    echo "  python3 -m venv .venv"
    echo "  source .venv/bin/activate"
    echo ""
    read -p "Continue without virtual environment? (y/N): " continue_anyway
    if [ "$continue_anyway" != "y" ] && [ "$continue_anyway" != "Y" ]; then
        echo ""
        echo "To create and activate a virtual environment:"
        echo -e "${BLUE}python3 -m venv .venv${NC}"
        echo -e "${BLUE}source .venv/bin/activate${NC}"
        echo -e "${BLUE}./quick-start.sh${NC}"
        exit 0
    fi
fi

# Install dependencies if needed
echo ""
echo -e "${BLUE}Checking dependencies...${NC}"
if ! python3 -c "import agents" 2>/dev/null; then
    echo -e "${YELLOW}📦 Installing required packages...${NC}"
    $PIP_CMD install -r requirements.txt
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${BLUE}Choose an option:${NC}"
echo "1) Run the complete example (Commitments Module)"
echo "2) Create your own concept file"
echo "3) View documentation"
echo "4) Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo -e "\n${BLUE}Running Commitments Module Example...${NC}\n"
        
        # Check if example exists
        if [ ! -f "1-task-refinement/examples/commitments-module.md" ]; then
            echo -e "${RED}Example file not found!${NC}"
            echo "Looking for: 1-task-refinement/examples/commitments-module.md"
            exit 1
        fi
        
        # Run task refinement
        cd 1-task-refinement
        echo "Step 1: Refining concept into structured task..."
        python3 refine.py --file examples/commitments-module.md
        
        # Get latest refined task
        TASK_FILE=$(ls -t outputs/refined_task_*.md 2>/dev/null | head -1)
        
        if [ -z "$TASK_FILE" ]; then
            echo -e "${RED}No refined task found!${NC}"
            exit 1
        fi
        
        echo -e "${GREEN}✓ Task refined: $TASK_FILE${NC}"
        
        # Run agents
        cd ../2-modular-agents
        echo ""
        echo "Step 2: Executing with AI agents..."
        python3 orchestrator.py --task "../1-task-refinement/$TASK_FILE"
        
        echo -e "\n${GREEN}✅ Example complete!${NC}"
        echo "Check 2-modular-agents/outputs/ for generated code"
        ;;
        
    2)
        echo -e "\n${BLUE}Creating new concept file...${NC}\n"
        read -p "Enter concept name (e.g., user-auth): " concept_name
        
        # Validate concept name
        if [ -z "$concept_name" ]; then
            echo -e "${RED}Concept name cannot be empty${NC}"
            exit 1
        fi
        
        # Copy template
        cp 1-task-refinement/templates/CONCEPT_TEMPLATE.md \
           "1-task-refinement/concepts/${concept_name}.md"
        
        echo -e "${GREEN}✅ Created: 1-task-refinement/concepts/${concept_name}.md${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Edit the concept file with your requirements"
        echo "2. Run: cd 1-task-refinement && ./refine.sh concepts/${concept_name}.md"
        echo "3. Run: cd ../2-modular-agents && python3 orchestrator.py --task [refined-task]"
        ;;
        
    3)
        echo -e "\n${BLUE}📚 Documentation:${NC}\n"
        echo "• Main README: README.md"
        echo "• Architecture: docs/architecture.md"
        echo "• Task Refinement: 1-task-refinement/README.md"
        echo "• Agent Execution: 2-modular-agents/README.md"
        echo ""
        echo "Run 'cat README.md' to get started"
        ;;
        
    4)
        echo -e "\n${GREEN}Goodbye!${NC}"
        exit 0
        ;;
        
    *)
        echo -e "\n${RED}Invalid choice${NC}"
        exit 1
        ;;
esac