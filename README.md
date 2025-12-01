# Codex + Agents SDK Multi-Agent Workflow Template

This repository provides a ready-to-use starter template for building deterministic, auditable multi-agent workflows using:

- Codex CLI (via MCP server)
- OpenAI Agents SDK
- Multi-agent orchestration (PM → Designer → FE → BE → Tester)

---

## File Structure

```tsx
├── .gitignore
├── .env.example
├── README.md
│
├── codex_mcp.py
├── multi_agent_workflow.py
│
├── design/              # Designer outputs
├── frontend/            # Frontend outputs
├── backend/             # Backend outputs
└── tests/               # Tester outputs
```

## Execution Steps

### 1. Create and Activate a Virtual Environment

```
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install Dependencies

```
pip install --upgrade openai openai-agents python-dotenv
```

### 3. Add Your OpenAI API Key

Copy the example file:
```
cp .env.example .env
```

Open .env and add:
```
OPENAI_API_KEY=your_api_key_here
```

### 4. Generate Your Project Task List

Before running the multi-agent workflow, you must provide a **task_list**.

You can:

#### Option A — Use ChatGPT / Codex to Generate It

Example prompt:

```
Generate a structured task_list for multi_agent_workflow.py.
Include: Goal, High-level requirements, Roles, Constraints, Deliverables.
```

#### Option B — Use a Global Slash Command

Run `/tasklist` global slash command:

```bash
/tasklist project_name="My Project" description="..." features=["..."] constraints=["..."] > task_list.txt
```

Then update `multi_agent_workflow.py` to read from `task_list.txt`

### 5. Run the Codex MCP Server (Test It)

This confirms Codex is correctly installed and available.

```bash
python codex_mcp.py
```

Expected output:

```
Codex MCP server started.
```

Then terminate with **CTRL+C**.

### 6. Run the Multi-Agent Workflow

This runs:

- Project Manager
- Designer
- Frontend Developer
- Backend Developer
- Tester

All coordinated via Codex MCP.

```bash
python multi_agent_workflow.py
```

### 7. Inspect the Generated Files

```bash
ls -R
```

You should now see:

- REQUIREMENTS.md
- AGENT_TASKS.md
- TEST.md

And inside each folder:

#### `/design`

- design_spec.md
- wireframe.md (optional)

#### `/frontend`

- index.html
- styles.css
- main.js

#### `/backend`

- server.js
- package.json

#### `/tests`

- TEST_PLAN.md
- test.sh (optional)

### 8. Review the Workflow Trace (Highly Recommended)

Visit: https://platform.openai.com/trace

You’ll see:
- all handoffs
- Codex MCP tool calls
- reasoning steps
- file writes
- prompt chains

This is your audit trail.

---

**🎉 You’re Ready to Build**

Every time you start a new project:

1. Generate a new **task_list**
2. Paste it into `multi_agent_workflow.py`
3. Run the workflow
4. Review generated files
5. (Optional) Commit the outputs into your repo

This template gives your team a deterministic, fully auditable multi-agent pipeline.
