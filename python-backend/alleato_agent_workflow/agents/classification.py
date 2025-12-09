"""
═══════════════════════════════════════════════════════════════════════════
CLASSIFICATION AGENT - Query Routing & Intent Detection
═══════════════════════════════════════════════════════════════════════════

ROLE: First-stage agent that determines which specialist should handle the query

CONTROLS:
- Classifies queries into: "project", "policy", or "strategic"
- Returns structured output via ClassificationAgentSchema
- No tools available (classification only, no data retrieval)

CLASSIFICATION LOGIC:
- "project" → Queries about specific meetings, tasks, decisions, project status
  Examples: "What tasks are due?", "Status of Miami project?", "Recent decisions?"

- "policy" → Queries about company policies, procedures, documentation, SOPs
  Examples: "What's our PTO policy?", "How do we handle permits?", "HR guidelines?"

- "strategic" → High-level strategy, cross-project patterns, executive insights
  Examples: "Where are we losing time?", "Market trends?", "Strategic priorities?"

ROUTING FLOW:
1. User query → classification_agent (this file)
2. Returns classification string
3. alleato_agent_workflow.py routes to specialist:
   - "project" → project_agent
   - "policy" → internal_knowledge_base_agent
   - "strategic" → strategist_agent

USED BY: alleato_agent_workflow.py run_workflow() function

═══════════════════════════════════════════════════════════════════════════
"""

from pydantic import BaseModel
from agents import Agent, ModelSettings


class ClassificationAgentSchema(BaseModel):
    """Output schema for classification agent."""
    classification: str


CLASSIFICATION_INSTRUCTIONS = """Classify the user's intent into one of the following categories:

1. "project" - Any query about:
   - Specific meetings, tasks, or decisions
   - Project status updates or progress
   - Project-specific risks or blockers
   - Task assignments or deadlines
   - Team member responsibilities on projects

2. "policy" - Any query about:
   - Company policies or procedures
   - Internal documentation or SOPs
   - HR policies, benefits, or guidelines
   - Compliance requirements
   - Standard operating procedures

3. "strategic" - Any query about:
   - High-level business strategy
   - Cross-project analysis or patterns
   - Market analysis or competitive insights
   - Resource allocation across projects
   - Long-term planning or initiatives
   - Executive-level summaries

Classification Guidelines:
- Device-related return requests should route to "project"
- Retention or cancellation risks, including discount requests, should route to "strategic"
- When in doubt between project and strategic, consider: is this about ONE project (project) or PATTERNS across projects (strategic)?
- Policy questions are clearly about "how we do things" not "what we're doing"
"""

classification_agent = Agent(
    name="Classification agent",
    instructions=CLASSIFICATION_INSTRUCTIONS,
    model="gpt-4.1-mini",
    output_type=ClassificationAgentSchema,
    model_settings=ModelSettings(
        temperature=1,
        top_p=1,
        max_tokens=2048,
        store=True
    )
)
