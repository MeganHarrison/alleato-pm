# CLAUDE.md

This file provides context for Claude when working with this repository.

## Project Overview

This is a **Multi-Agent Workflow Template** demonstrating autonomous software development using coordinated AI agents. The project orchestrates five specialized roles (Project Manager, Designer, Frontend Developer, Backend Developer, Tester) to collaboratively build software from a task list.

The template includes a concrete example: building a "Bug Busters" browser game where players click moving bugs to earn points.

## Technology Stack

| Layer | Technology |
|-------|------------|
| Orchestration | Python 3.x, asyncio |
| AI Framework | OpenAI Agents SDK |
| Code Generation | Codex CLI via MCP (Model Context Protocol) |
| Environment | python-dotenv |
| Browser Automation | Playwright (JavaScript/Node.js) |
| AI Model | GPT-5 |

## Project Structure

```
alleato-procore/
├── multi_agent_workflow.py    # Main orchestration engine (5 agents, handoff chains)
├── codex_mcp.py               # MCP server startup/verification script
├── TASK_LIST.md               # Input task list (populate before running)
├── scripts/
│   └── playwright-procore-screenshots.js  # Procore browser automation
├── design/                    # Designer agent outputs
├── frontend/                  # Frontend developer outputs
├── backend/                   # Backend developer outputs
├── tests/                     # Tester agent outputs
├── .env.example               # Environment template (OPENAI_API_KEY)
└── .github/ISSUE_TEMPLATE/    # Bug report and feature request templates
```

## Key Commands

```bash
# Setup virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install --upgrade openai openai-agents python-dotenv

# Configure environment
cp .env.example .env
# Add OPENAI_API_KEY to .env

# Test Codex MCP Server
python codex_mcp.py

# Run the multi-agent workflow
python multi_agent_workflow.py

# For Playwright screenshots (Node.js)
npm install playwright
node scripts/playwright-procore-screenshots.js
```

## Agent Workflow Architecture

The workflow follows a gated, sequential handoff pattern:

1. **Project Manager** → Creates `REQUIREMENTS.md`, `TEST.md`, `AGENT_TASKS.md`
2. **Designer** → Creates `design_spec.md` (waits for PM outputs)
3. **Frontend Developer** ↔ **Backend Developer** (parallel, wait for design)
4. **Tester** → Validates all deliverables exist before testing

All agents connect to Codex MCP server for autonomous file operations with `approval-policy: never`.

## Code Conventions

### Python Patterns
- Async/await for all main functions using `asyncio.run()`
- Context managers for MCP server: `async with MCPServerStdio(...)`
- Type hints from `openai-agents` SDK
- f-strings with triple quotes for multi-line agent instructions
- Handoff chains linking agents: `handoffs=[next_agent]`

### Agent Configuration
- Each agent has detailed `instructions` parameter (system prompt)
- Tool integration via `tools=[WebSearchTool()]`
- MCP integration: `mcp_servers=[codex_mcp_server]`
- Model specification: `model="gpt-5"`
- PM uses reasoning: `ModelSettings(reasoning=Reasoning(effort="medium"))`

### JavaScript Patterns
- ES6 modules: `import { chromium } from "playwright"`
- Async IIFE pattern for main execution
- Environment variables for credentials: `process.env.PROCORE_EMAIL`

## Key Files

| File | Purpose | Lines |
|------|---------|-------|
| `multi_agent_workflow.py` | Main orchestration with 5 agents, handoffs, and workflow logic | ~185 |
| `codex_mcp.py` | MCP server verification script | ~22 |
| `scripts/playwright-procore-screenshots.js` | Procore platform screenshot automation | ~99 |

## Environment Variables

| Variable | Purpose | File |
|----------|---------|------|
| `OPENAI_API_KEY` | OpenAI API authentication | `.env` |
| `PROCORE_EMAIL` | Procore login (screenshot script) | Environment |
| `PROCORE_PASSWORD` | Procore password (screenshot script) | Environment |

## Generated Outputs

The workflow produces these artifacts:
- `REQUIREMENTS.md` - Product goals, users, features, constraints
- `AGENT_TASKS.md` - Role-specific deliverables and technical notes
- `TEST.md` - Tasks with owner tags and acceptance criteria
- `design/design_spec.md` - UI/UX specifications
- `frontend/` - Frontend implementation files
- `backend/` - Backend implementation files
- `tests/` - Test plans and validation scripts

## Development Notes

- **No requirements.txt** - Dependencies documented in README.md
- **No linting/formatting configs** - Manual code review
- **Audit traces** - All operations traceable via platform.openai.com/trace
- **MCP Timeout** - Set to 360000 seconds for long operations
- **Runner max turns** - Set to 30 for orchestration loop

## Common Tasks

### Adding a New Agent
1. Define agent with `Agent(name=..., instructions=..., model="gpt-5", mcp_servers=[codex_mcp_server])`
2. Add to appropriate handoff chain
3. Update gating logic if needed

### Modifying Task List
1. Edit `TASK_LIST.md` or the embedded `task_list` variable in `multi_agent_workflow.py`
2. Run workflow: `python multi_agent_workflow.py`

### Debugging Agent Behavior
1. Check OpenAI trace platform for detailed execution logs
2. Review console output for handoff transitions
3. Inspect generated files in output directories

## Important Architectural Decisions

1. **Autonomous file management** - Codex MCP with `approval-policy: never`
2. **Gated workflow** - File existence checks enforce sequential progression
3. **Parallel execution** - Frontend and Backend developers work simultaneously
4. **Model uniformity** - All agents use GPT-5 (easily configurable)
5. **Separation of concerns** - Dedicated output directories per agent role
