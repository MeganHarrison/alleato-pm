# Markdown Concept Files Guide

## Overview

Instead of complex command-line arguments, you can now define your entire task concept in a structured markdown file and run:

```bash
python task_refiner_v2.py --file concepts/my-feature.md
```

## Benefits of Markdown Concepts

1. **Easier to Edit**: Write in your favorite editor, not the command line
2. **Version Control**: Track changes to your requirements over time
3. **Reusable Templates**: Create templates for common feature types
4. **Better Organization**: Keep all related information in one place
5. **Richer Content**: Use markdown formatting, lists, and structure

## Quick Start

### 1. Copy the Template

```bash
cp templates/CONCEPT_TEMPLATE.md concepts/my-feature.md
```

### 2. Fill Out Your Concept

Edit `concepts/my-feature.md` with your requirements:

```markdown
# Task Concept: My Feature

## Overview
Describe what you want to build...

## Reference URLs
- https://example.com/similar-feature
- https://competitor.com/their-version

## Documents & Assets
- /path/to/screenshots/ui-mockup.png
- /path/to/docs/requirements.pdf
```

### 3. Run the Refiner

```bash
python task_refiner_v2.py --file concepts/my-feature.md
```

### 4. Get Your Refined Task

Find your structured task list in:
- `task-refinement-outputs/refined_task_[timestamp].md`
- `task-refinement-outputs/parsed_concept_[timestamp].json`

## Template Sections Explained

### Overview Section
Your main description. Be as detailed or brief as you like. The refiner will extract:
- Primary goal (first action-oriented sentence)
- Key features and requirements
- User needs and context

### Reference URLs
Include any URLs that show similar features or patterns you want to follow:
- Competitor products
- Documentation pages
- Design inspiration
- API references

### Documents & Assets  
List file paths to any supporting materials:
- Screenshots (the refiner can analyze these)
- PDF specifications
- Existing code files
- Design mockups

### Context Subsections

#### Project Information
Basic metadata about your project:
- Project name
- Development phase (POC, MVP, Production)
- Target user types

#### Technical Stack
Your technology choices:
- Frontend frameworks
- Backend services
- Database systems
- Third-party integrations

#### Existing System
What already exists that this feature must work with:
- Related modules or features
- Database schema
- API patterns
- UI components

#### Constraints & Requirements
Technical and business constraints:
- Performance targets
- Security requirements
- Compliance needs
- Device/browser support

#### Business Context
Business-level information:
- Timeline/deadlines
- Budget considerations
- Success metrics
- Stakeholder needs

### Additional Notes
Any other helpful context, edge cases, or special considerations.

## Examples

### Minimal Example

```markdown
# Task Concept: User Profile

## Overview
Add user profiles where users can update their name, email, and profile picture.

## Context

### Technical Stack
- **Frontend**: Next.js
- **Backend**: Supabase
```

### Detailed Example

See `concepts/commitments-module.md` for a comprehensive example with all sections filled out.

## Tips for Better Results

1. **Be Specific About UI/UX**: Describe how things should look and behave
2. **Include Edge Cases**: Mention error states, empty states, loading states  
3. **Reference Existing Patterns**: Link to similar features you like
4. **Specify Performance Needs**: Load times, data limits, offline behavior
5. **List Integration Points**: How this connects to other parts of the system

## Workflow Integration

### With Multi-Agent System

```bash
# Step 1: Create your concept
vim concepts/new-feature.md

# Step 2: Refine it
python task_refiner_v2.py --file concepts/new-feature.md

# Step 3: Execute with agents
python ../modular-agents/orchestrator.py \
  --task task-refinement-outputs/refined_task_*.md
```

### Creating Templates

Create reusable templates for common features:

```bash
# CRUD module template
cp templates/CONCEPT_TEMPLATE.md templates/CRUD_MODULE_TEMPLATE.md
# Edit to include standard CRUD requirements

# Dashboard template  
cp templates/CONCEPT_TEMPLATE.md templates/DASHBOARD_TEMPLATE.md
# Edit to include standard dashboard patterns

# Use templates
cp templates/CRUD_MODULE_TEMPLATE.md concepts/invoices-module.md
```

## Troubleshooting

### "Concept file not found"
- Check the file path is correct
- Use absolute paths if needed

### Missing sections in output
- Ensure markdown headers match exactly (## Overview, not # Overview)
- Check for proper spacing between sections

### Poor quality task lists
- Add more detail to the Overview section
- Include specific examples in Additional Notes
- Reference similar systems in URLs section

## Advanced Usage

### Including Code Examples

```markdown
## Additional Notes
The API should follow this pattern:

\```typescript
interface Commitment {
  id: string;
  vendorId: string;
  amount: number;
  status: 'draft' | 'approved' | 'complete';
}
\```
```

### Linking Multiple Concepts

```markdown
## Overview
Build an invoicing module that integrates with the commitments module 
(see concepts/commitments-module.md).
```

### Using Environment Variables

```markdown
## Context

### Technical Stack
- **Frontend**: ${FRONTEND_FRAMEWORK}
- **Backend**: ${BACKEND_SERVICE}
```

Then set environment variables before running the refiner.