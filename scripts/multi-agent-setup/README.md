# Multi-Agent Pipeline System

A clear, numbered pipeline that transforms ideas into working code.

## 📋 Pipeline Stages

1. **01_task_extraction** - Converts informal concepts → structured tasks
2. **02_project_manager** - Creates requirements and coordinates work  
3. **03_designer** - Produces UI/UX specifications
4. **04_frontend_developer** - Builds React/Next.js components
5. **05_backend_developer** - Creates APIs and server logic
6. **06_tester** - Validates implementation with test plans

## 🚀 Quick Start

```bash
# Full pipeline from concept
python orchestrator.py --concept concepts/my-feature.md

# Use existing task list (skip extraction)
python orchestrator.py --task outputs/task_list_20241203.md

# Resume from failure
python orchestrator.py --resume

# Start from specific stage
python orchestrator.py --from-stage 03_designer
```

## 📁 Folder Structure

```
multi-agent-setup/
├── 01_task_extraction/      # First stage: concept → tasks
│   ├── agent.py            # Extraction logic
│   ├── templates/          # Concept templates
│   └── concepts/           # Your ideas go here
│
├── 02_project_manager/      # Creates requirements
│   └── agent.py
│
├── 03_designer/            # UI/UX design
│   └── agent.py
│
├── 04_frontend_developer/  # React/Next.js
│   └── agent.py
│
├── 05_backend_developer/   # APIs/Server
│   └── agent.py
│
├── 06_tester/             # Test plans
│   └── agent.py
│
├── orchestrator.py        # Runs the pipeline
├── shared/                # Shared utilities
│   ├── config.py         # Configuration
│   └── artifacts.py      # Output management
│
└── outputs/              # All generated code
```

## 💡 How It Works

### Step 1: Create a Concept
```markdown
# concepts/budget-tracker.md

## Overview
I need a budget tracking module that shows costs vs budget.

## Context
### Technical Stack
- **Frontend**: Next.js, React
- **Backend**: Supabase
```

### Step 2: Run the Pipeline
```bash
python orchestrator.py --concept concepts/budget-tracker.md
```

### Step 3: Get Your Code
Check `outputs/` for:
- Requirements documentation
- Design specifications  
- Frontend components
- Backend APIs
- Test plans

## 🔧 Running Individual Agents

Each agent can run standalone:

```bash
# Just extraction
python 01_task_extraction/agent.py --file concepts/my-feature.md

# Just designer (requires PM outputs)
python 03_designer/agent.py

# Just frontend (requires designer outputs)
python 04_frontend_developer/agent.py
```

## 📊 Pipeline Status

The system tracks progress in `outputs/workflow_status.json`:
- Which stages completed
- What files were created
- Any errors encountered

## ⚡ Key Features

- **30-minute timeouts** per agent (not 100 hours!)
- **Clear dependencies** - each stage knows what it needs
- **Resume capability** - never lose progress
- **Parallel execution** - frontend and backend can run together
- **Standalone operation** - debug individual agents

## 🛠️ Configuration

Edit `shared/config.py` to adjust:
- Model selection (gpt-4o by default)
- Timeout settings
- Output directories
- File naming patterns

## 📝 Creating Concepts

Use the template in `01_task_extraction/templates/CONCEPT_TEMPLATE.md`:

```bash
cp 01_task_extraction/templates/CONCEPT_TEMPLATE.md \
   01_task_extraction/concepts/my-feature.md
```

Fill out:
- Overview (what you want)
- Reference URLs (examples)
- Context (tech stack, constraints)

## 🐛 Troubleshooting

**Missing dependencies error**
- Check `outputs/workflow_status.json`
- Ensure previous stages completed
- Use `--resume` to continue

**Timeout errors**
- Break large concepts into smaller ones
- Run agents individually to debug

**No output files**
- Check agent logs for errors
- Verify API key is set
- Ensure write permissions

## 🎯 Example Flow

```
Input: "I need a commitments module for tracking contracts"
                    ↓
01_task_extraction: Structured requirements with user stories
                    ↓
02_project_manager: REQUIREMENTS.md, AGENT_TASKS.md
                    ↓
03_designer: UI mockups, component specs
                ↓       ↓
04_frontend_dev     05_backend_dev
                ↓       ↓
            06_tester: Test plans
```

Total time: ~20-30 minutes for complete pipeline