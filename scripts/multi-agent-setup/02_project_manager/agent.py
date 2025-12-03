"""
Project Manager Agent - Creates requirements and task breakdown.
Can be run independently to generate project documentation.
"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

from agents import Agent, Runner, set_default_openai_api
from agents.mcp import MCPServerStdio
from shared.config import AGENT_CONFIG, ARTIFACTS, CODEX_CONFIG
from shared.artifacts import ArtifactManager, write_artifact
import os


PROJECT_MANAGER_INSTRUCTIONS = """
You are the Project Manager for the Alleato-Procore system.

Objective:
Convert the input task into three foundational documents that will guide the team.

Deliverables:
1. REQUIREMENTS.md: Product goals, target users, key features, and constraints
2. AGENT_TASKS.md: Specific tasks for each role (Designer, Frontend, Backend, Tester)
3. TEST.md: Test scenarios and acceptance criteria

Guidelines:
- Be specific and detailed to minimize ambiguity
- Include technical constraints and integration points
- Define clear success criteria for each component
- Consider the existing Alleato-Procore architecture (Next.js, Supabase, ShadCN)

Use Codex to create files with the configuration: {"approval-policy":"never","sandbox":"workspace-write"}
"""


async def run_project_manager(task_description: str) -> dict:
    """Run the Project Manager agent to create initial documentation."""
    
    artifacts = ArtifactManager(ARTIFACTS["status"])
    
    try:
        # Initialize MCP server with reasonable timeout
        async with MCPServerStdio(
            name="Codex CLI",
            params={"command": "npx", "args": ["-y", "codex", "mcp"]},
            client_session_timeout_seconds=AGENT_CONFIG["timeout_seconds"],
        ) as codex_mcp_server:
            
            print("Starting Project Manager agent...")
            
            # Create the agent
            project_manager = Agent(
                name="Project Manager",
                instructions=PROJECT_MANAGER_INSTRUCTIONS,
                model=AGENT_CONFIG["model"],
                mcp_servers=[codex_mcp_server],
            )
            
            # Run the agent
            result = await Runner.run(
                project_manager,
                f"Create project documentation for the following task:\n\n{task_description}"
            )
            
            # Verify artifacts were created
            expected_files = [
                ARTIFACTS["requirements"],
                ARTIFACTS["tasks"],
                ARTIFACTS["test_plan"]
            ]
            
            missing = artifacts.get_missing_dependencies(expected_files)
            
            if missing:
                raise Exception(f"Missing expected files: {missing}")
            
            # Mark stage complete
            artifacts.mark_stage_complete(
                "project_manager",
                [str(f) for f in expected_files]
            )
            
            print("✓ Project Manager completed successfully")
            print(f"Created: REQUIREMENTS.md, AGENT_TASKS.md, TEST.md")
            
            return {
                "status": "success",
                "artifacts": expected_files
            }
            
    except Exception as e:
        artifacts.mark_stage_failed("project_manager", str(e))
        print(f"✗ Project Manager failed: {e}")
        return {
            "status": "failed",
            "error": str(e)
        }


async def main():
    """Main entry point when run as standalone script."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Run Project Manager agent")
    parser.add_argument("--task", required=True, help="Task description or path to task file")
    args = parser.parse_args()
    
    # Load task description
    task_path = Path(args.task)
    if task_path.exists():
        task_description = task_path.read_text()
    else:
        task_description = args.task
    
    # Set API key
    set_default_openai_api(os.getenv("OPENAI_API_KEY"))
    
    # Run the agent
    result = await run_project_manager(task_description)
    
    # Print summary
    artifacts = ArtifactManager(ARTIFACTS["status"])
    print("\n" + artifacts.get_workflow_summary())
    
    # Exit with appropriate code
    sys.exit(0 if result["status"] == "success" else 1)


if __name__ == "__main__":
    asyncio.run(main())