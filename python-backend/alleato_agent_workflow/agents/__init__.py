"""
Agents package for Alleato Agent Workflow.

This package contains all agent definitions:

**Unified Agent (Recommended):**
- Unified agent: Single intelligent agent with all tools (no classification needed)

**Legacy Specialized Agents (for backward compatibility):**
- Classification agent: Routes queries to appropriate specialists
- Project agent: Handles project-specific queries
- Knowledge Base agent: Handles internal policy/procedure queries
- Strategist agent: Handles high-level strategic analysis
"""

from .classification import classification_agent, ClassificationAgentSchema
from .project import project_agent
from .knowledge_base import internal_knowledge_base_agent
from .strategist import strategist_agent
from .unified import unified_agent

__all__ = [
    # Unified agent (recommended)
    'unified_agent',
    # Legacy specialized agents
    'classification_agent',
    'ClassificationAgentSchema',
    'project_agent',
    'internal_knowledge_base_agent',
    'strategist_agent'
]
