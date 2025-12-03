"""
Frontend Developer Agent - Creates UI components and pages.
Reads design specs and implements using Next.js/React.
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


FRONTEND_INSTRUCTIONS = """
You are the Frontend Developer for the Alleato-Procore system.

Your role:
1. Read design specifications from the Designer
2. Read technical requirements from the Project Manager
3. Implement UI components using the project's tech stack

Tech Stack:
- Next.js 15 (App Router)
- React 19
- TypeScript
- ShadCN UI components
- Tailwind CSS
- React Hook Form + Zod for forms
- Zustand for state management

Deliverables (save to /frontend directory):
- Page components (app/[module]/page.tsx)
- UI components (components/[module]/)
- Form schemas (lib/schemas/)
- API integration (lib/api/)
- Types and interfaces

Guidelines:
- Follow Next.js App Router patterns
- Use Server Components by default
- Implement proper loading and error states
- Ensure responsive design (mobile-first)
- Follow existing project patterns
- Use ShadCN UI components from the project
- Implement proper TypeScript types

Use Codex to create files with: {"approval-policy":"never","sandbox":"workspace-write"}
"""


async def run_frontend_developer() -> dict:
    """Run the Frontend Developer agent."""
    
    artifacts = ArtifactManager(ARTIFACTS["status"])
    
    # Check dependencies
    required_files = [
        ARTIFACTS["requirements"],
        ARTIFACTS["tasks"],
        ARTIFACTS["design_spec"]
    ]
    missing = artifacts.get_missing_dependencies(required_files)
    
    if missing:
        print(f"✗ Missing required files: {missing}")
        print("Please run Project Manager and Designer agents first.")
        return {"status": "failed", "error": "Missing dependencies"}
    
    try:
        # Read artifacts
        requirements = read_artifact(ARTIFACTS["requirements"])
        tasks = read_artifact(ARTIFACTS["tasks"])
        design_spec = read_artifact(ARTIFACTS["design_spec"])
        
        async with MCPServerStdio(
            name="Codex CLI",
            params={"command": "npx", "args": ["-y", "codex", "mcp"]},
            client_session_timeout_seconds=AGENT_CONFIG["timeout_seconds"],
        ) as codex_mcp_server:
            
            print("Starting Frontend Developer agent...")
            
            frontend_dev = Agent(
                name="Frontend Developer",
                instructions=FRONTEND_INSTRUCTIONS,
                model=AGENT_CONFIG["model"],
                mcp_servers=[codex_mcp_server],
            )
            
            # Provide context
            context = f"""
Based on the following specifications, implement the frontend components:

REQUIREMENTS:
{requirements}

YOUR TASKS (Frontend section):
{tasks}

DESIGN SPECIFICATIONS:
{design_spec}

Create all necessary frontend components following the design specifications.
Ensure all components are properly typed and follow the project's patterns.
"""
            
            result = await Runner.run(frontend_dev, context)
            
            # Mark complete
            artifacts.mark_stage_complete(
                "frontend_developer",
                ["frontend/components", "frontend/pages", "frontend/lib"]
            )
            
            print("✓ Frontend Developer completed successfully")
            
            return {"status": "success"}
            
    except Exception as e:
        artifacts.mark_stage_failed("frontend_developer", str(e))
        print(f"✗ Frontend Developer failed: {e}")
        return {"status": "failed", "error": str(e)}


async def main():
    """Main entry point for standalone execution."""
    set_default_openai_api(os.getenv("OPENAI_API_KEY"))
    
    result = await run_frontend_developer()
    
    artifacts = ArtifactManager(ARTIFACTS["status"])
    print("\n" + artifacts.get_workflow_summary())
    
    sys.exit(0 if result["status"] == "success" else 1)


if __name__ == "__main__":
    asyncio.run(main())