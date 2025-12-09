"""
MCP (Model Context Protocol) and Web Search tool configurations.

This module defines the external tool connections used by agents:
- Supabase MCP tools for RAG data access
- Web search for external research
"""

from agents import HostedMCPTool, WebSearchTool


# Primary Supabase MCP connection for RAG
mcp = HostedMCPTool(tool_config={
    "type": "mcp",
    "server_label": "Supabase",
    "allowed_tools": [],
    "authorization": "sbp_c9f4a689e3ea92657771323f0aa31fab6f552b4e",
    "require_approval": "never",
    "server_description": "Alleato's Supabase for RAG",
    "server_url": "https://mcp.supabase.com/mcp?project_ref=lgveqfnpkxvzbnnwuled"
})

# Secondary Supabase MCP connection
mcp1 = HostedMCPTool(tool_config={
    "type": "mcp",
    "server_label": "Supabase",
    "allowed_tools": [],
    "authorization": "sbp_c9f4a689e3ea92657771323f0aa31fab6f552b4e",
    "require_approval": "never",
    "server_description": "Alleato Supabase",
    "server_url": "https://mcp.supabase.com/mcp?project_ref=lgveqfnpkxvzbnnwuled"
})

# Web search tool for external research
web_search_preview = WebSearchTool(
    search_context_size="medium",
    user_location={
        "type": "approximate"
    }
)
