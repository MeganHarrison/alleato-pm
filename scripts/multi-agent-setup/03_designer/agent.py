"""
Designer Agent - Creates UI/UX specifications.
Reads requirements and creates design documentation.
"""
import asyncio
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

from agents import Agent, Runner, set_default_openai_api
from agents.mcp import MCPServerStdio
from shared.config import AGENT_CONFIG, ARTIFACTS, CODEX_CONFIG
from shared.artifacts import ArtifactManager, read_artifact
import os


DESIGNER_INSTRUCTIONS = """
You are the UI/UX Designer for the Alleato-Procore system.

Your role:
1. Read REQUIREMENTS.md and AGENT_TASKS.md created by the Project Manager
2. Create a comprehensive design specification
3. Focus on user experience while maintaining familiarity for Procore users

Deliverables (save to /design directory):
- design_spec.md: Complete UI/UX specification including:
  - Visual hierarchy and layout
  - Component specifications
  - User interaction flows
  - Responsive design considerations
  - Accessibility requirements

Design principles:
- Modern, clean interface using ShadCN UI components
- Maintain familiar patterns for construction industry users
- Mobile-first responsive design
- Clear visual feedback and loading states
- Consistent use of color for status indicators

Use Codex to create files with: {"approval-policy":"never","sandbox":"workspace-write"}
"""


async def run_designer() -> dict:
    """Run the Designer agent to create design specifications."""
    
    artifacts = ArtifactManager(ARTIFACTS["status"])
    
    # Check dependencies
    required_files = [ARTIFACTS["requirements"], ARTIFACTS["tasks"]]
    missing = artifacts.get_missing_dependencies(required_files)
    
    if missing:
        print(f"✗ Missing required files: {missing}")
        print("Please run the Project Manager agent first.")
        return {"status": "failed", "error": "Missing dependencies"}
    
    try:
        # Read existing artifacts
        requirements = read_artifact(ARTIFACTS["requirements"])
        tasks = read_artifact(ARTIFACTS["tasks"])
        
        async with MCPServerStdio(
            name="Codex CLI",
            params={"command": "npx", "args": ["-y", "codex", "mcp"]},
            client_session_timeout_seconds=AGENT_CONFIG["timeout_seconds"],
        ) as codex_mcp_server:
            
            print("Starting Designer agent...")
            
            designer = Agent(
                name="Designer",
                instructions=DESIGNER_INSTRUCTIONS,
                model=AGENT_CONFIG["model"],
                mcp_servers=[codex_mcp_server],
            )
            
            # Provide context from previous artifacts
            context = f"""
Here are the project requirements and your specific tasks:

REQUIREMENTS.md:
{requirements}

AGENT_TASKS.md (Designer section):
{tasks}

Please create the design specification based on these requirements.
"""
            
            result = await Runner.run(designer, context)
            
            # Verify design_spec.md was created
            if not ARTIFACTS["design_spec"].exists():
                raise Exception("design_spec.md was not created")
            
            artifacts.mark_stage_complete(
                "designer",
                [str(ARTIFACTS["design_spec"])]
            )
            
            print("✓ Designer completed successfully")
            print(f"Created: {ARTIFACTS['design_spec']}")
            
            return {
                "status": "success",
                "artifacts": [ARTIFACTS["design_spec"]]
            }
            
    except Exception as e:
        artifacts.mark_stage_failed("designer", str(e))
        print(f"✗ Designer failed: {e}")
        return {
            "status": "failed",
            "error": str(e)
        }


async def main():
    """Main entry point when run as standalone script."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Run Designer agent")
    parser.add_argument("--skip-check", action="store_true", 
                       help="Skip dependency check (for testing)")
    args = parser.parse_args()
    
    set_default_openai_api(os.getenv("OPENAI_API_KEY"))
    
    result = await run_designer()
    
    artifacts = ArtifactManager(ARTIFACTS["status"])
    print("\n" + artifacts.get_workflow_summary())
    
    sys.exit(0 if result["status"] == "success" else 1)


if __name__ == "__main__":
    asyncio.run(main())