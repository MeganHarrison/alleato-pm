# Folder Organization Guide

## 🗂️ New Structure

```
multi-agent-setup/
│
├── quick-start.sh         # 🚀 START HERE - Interactive setup
├── README.md             # Main documentation
├── requirements.txt      # Python dependencies
│
├── 1-task-refinement/    # Phase 1: Turn ideas into tasks
│   ├── refine.py        # Main refinement script
│   ├── refine.sh        # Easy wrapper script
│   ├── templates/       # Concept templates (start here!)
│   ├── concepts/        # Your ideas go here
│   ├── examples/        # Sample concepts
│   └── outputs/         # Generated task lists
│
├── 2-modular-agents/     # Phase 2: Turn tasks into code
│   ├── orchestrator.py  # Runs all agents
│   ├── agents/          # Individual AI agents
│   ├── shared/          # Utilities
│   └── outputs/         # Generated code
│
├── examples/            # Complete examples
│   ├── commitments-module/
│   └── simple-game/
│
├── docs/               # All documentation
│   ├── architecture.md
│   ├── monolithic-vs-modular.md
│   └── task-refinement-solution.md
│
└── legacy/             # Old monolithic approach
    └── multi_agent_workflow.py
```

## 🎯 Quick Navigation

### "I want to..."

**Start fresh with a new feature:**
```bash
./quick-start.sh  # Interactive guide
```

**Create a concept manually:**
```bash
cp 1-task-refinement/templates/CONCEPT_TEMPLATE.md \
   1-task-refinement/concepts/my-feature.md
```

**Refine an idea:**
```bash
cd 1-task-refinement
./refine.sh concepts/my-feature.md
```

**Run agents:**
```bash
cd 2-modular-agents
python orchestrator.py --task ../1-task-refinement/outputs/refined_task_*.md
```

## 📝 Key Files

### Templates & Examples
- `1-task-refinement/templates/CONCEPT_TEMPLATE.md` - Start here!
- `1-task-refinement/examples/commitments-module.md` - Detailed example
- `1-task-refinement/examples/simple-task.md` - Basic example

### Main Scripts
- `quick-start.sh` - Interactive setup and demo
- `1-task-refinement/refine.py` - Concept → Task converter
- `2-modular-agents/orchestrator.py` - Task → Code executor

### Documentation
- `README.md` - Complete overview
- `docs/architecture.md` - System design
- `docs/monolithic-vs-modular.md` - Why modular is better

## 🚦 Workflow

1. **Define** your concept in markdown
2. **Refine** it to a structured task list
3. **Execute** with specialized agents
4. **Receive** working code

## ⚡ Tips

- Use `quick-start.sh` for the easiest experience
- Check `examples/` for patterns to follow
- Each phase can be run independently
- Agents have 30-minute timeouts (not 100 hours!)
- You can resume failed workflows