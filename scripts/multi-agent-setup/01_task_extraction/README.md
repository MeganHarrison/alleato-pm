# Phase 1: Task Refinement

Transform your ideas into structured tasks that AI agents can execute.

## Quick Start

```bash
# 1. Create your concept
cp templates/CONCEPT_TEMPLATE.md concepts/my-feature.md

# 2. Edit with your requirements
vim concepts/my-feature.md

# 3. Refine it
./refine.sh concepts/my-feature.md
```

## What It Does

Takes this:
```
"I need a commitments module like Procore for tracking contracts"
```

And produces this:
```
Goal: Build comprehensive commitments management module...
Requirements: [15 detailed requirements]
User Stories: [10 stories with acceptance criteria]
Technical Specs: [Complete architecture details]
```

## Directory Structure

```
1-task-refinement/
├── refine.py          # Main script
├── refine.sh          # Easy wrapper
├── templates/         # Start here
├── concepts/          # Your ideas go here
├── examples/          # Sample concepts
└── outputs/           # Generated tasks
```

## Examples

See `examples/` for:
- `commitments-module.md` - Detailed financial module
- `simple-task.md` - Basic CRUD feature

## Next Step

After refinement, take your task to Phase 2:
```bash
cd ../2-modular-agents
python orchestrator.py --task ../1-task-refinement/outputs/refined_task_*.md
```

## Advanced Usage

For the full pipeline architecture and detailed documentation, see:
- [Complete Guide](MARKDOWN_CONCEPT_GUIDE.md)
- [Before/After Examples](BEFORE_AFTER_EXAMPLE.md)