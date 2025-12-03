"""
Backend Developer Agent - Creates API routes and server logic.
Implements business logic and database operations.
"""
import asyncio
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

from agents import Agent, Runner, set_default_openai_api
from agents.mcp import MCPServerStdio
from shared.config import AGENT_CONFIG, ARTIFACTS
from shared.artifacts import ArtifactManager, read_artifact
import os


BACKEND_INSTRUCTIONS = """
You are the Backend Developer for the Alleato-Procore system.

Your role:
1. Read technical requirements from the Project Manager
2. Read API specifications from tasks
3. Implement server-side logic and API endpoints

Tech Stack:
- Next.js API Routes (App Router)
- TypeScript
- Supabase (PostgreSQL with Row Level Security)
- Zod for validation

Deliverables (save to appropriate directories):
- API routes (app/api/[module]/route.ts)
- Database queries (lib/db/[module].ts)
- Server actions (lib/actions/[module].ts)
- Type definitions (types/[module].ts)
- Validation schemas (lib/validations/[module].ts)

Guidelines:
- Use Next.js App Router API conventions
- Implement proper error handling
- Use Supabase client for database operations
- Implement Row Level Security (RLS) policies
- Validate all inputs with Zod
- Return consistent API responses
- Handle authentication with Supabase Auth
- Follow RESTful principles

Database Operations:
- Use Supabase client (already configured in project)
- Respect existing schema (don't modify tables)
- Use proper error handling for database operations
- Implement pagination where appropriate

Use Codex to create files with: {"approval-policy":"never","sandbox":"workspace-write"}
"""


async def run_backend_developer() -> dict:
    """Run the Backend Developer agent."""
    
    artifacts = ArtifactManager(ARTIFACTS["status"])
    
    # Check dependencies
    required_files = [
        ARTIFACTS["requirements"],
        ARTIFACTS["tasks"]
    ]
    missing = artifacts.get_missing_dependencies(required_files)
    
    if missing:
        print(f"✗ Missing required files: {missing}")
        print("Please run Project Manager agent first.")
        return {"status": "failed", "error": "Missing dependencies"}
    
    try:
        # Read artifacts
        requirements = read_artifact(ARTIFACTS["requirements"])
        tasks = read_artifact(ARTIFACTS["tasks"])
        
        async with MCPServerStdio(
            name="Codex CLI",
            params={"command": "npx", "args": ["-y", "codex", "mcp"]},
            client_session_timeout_seconds=AGENT_CONFIG["timeout_seconds"],
        ) as codex_mcp_server:
            
            print("Starting Backend Developer agent...")
            
            backend_dev = Agent(
                name="Backend Developer",
                instructions=BACKEND_INSTRUCTIONS,
                model=AGENT_CONFIG["model"],
                mcp_servers=[codex_mcp_server],
            )
            
            # Provide context
            context = f"""
Based on the following specifications, implement the backend API and logic:

REQUIREMENTS:
{requirements}

YOUR TASKS (Backend section):
{tasks}

Key considerations:
- Use existing Supabase schema (commitments, change_orders, etc.)
- Implement proper authentication checks
- Handle errors gracefully
- Return consistent JSON responses
- Use TypeScript for type safety

Create all necessary API routes and server logic.
"""
            
            result = await Runner.run(backend_dev, context)
            
            # Mark complete
            artifacts.mark_stage_complete(
                "backend_developer",
                ["app/api", "lib/db", "lib/actions", "types"]
            )
            
            print("✓ Backend Developer completed successfully")
            
            return {"status": "success"}
            
    except Exception as e:
        artifacts.mark_stage_failed("backend_developer", str(e))
        print(f"✗ Backend Developer failed: {e}")
        return {"status": "failed", "error": str(e)}


async def main():
    """Main entry point for standalone execution."""
    set_default_openai_api(os.getenv("OPENAI_API_KEY"))
    
    result = await run_backend_developer()
    
    artifacts = ArtifactManager(ARTIFACTS["status"])
    print("\n" + artifacts.get_workflow_summary())
    
    sys.exit(0 if result["status"] == "success" else 1)


if __name__ == "__main__":
    asyncio.run(main())