"""
Tester Agent - Creates test plans and validates implementation.
Ensures all requirements are met and components work correctly.
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


TESTER_INSTRUCTIONS = """
You are the Tester for the Alleato-Procore system.

Your role:
1. Read all requirements and implementation artifacts
2. Create comprehensive test plans
3. Generate test cases for all components
4. Validate that implementations meet requirements

Testing Scope:
- Unit tests for utilities and helpers
- Integration tests for API routes
- Component tests for UI elements
- End-to-end test scenarios
- Performance considerations
- Security validations

Tech Stack for Testing:
- Jest for unit tests
- React Testing Library for components
- Playwright for E2E tests (optional)
- Supertest for API testing

Deliverables (save to /tests directory):
- TEST_PLAN.md - Comprehensive test strategy
- test_cases.md - Detailed test cases
- unit/ - Unit test files
- integration/ - Integration test files
- e2e/ - End-to-end test scenarios

Test Plan Should Include:
- Test objectives and scope
- Test scenarios for each requirement
- Edge cases and error conditions
- Performance benchmarks
- Security considerations
- Data validation tests

Guidelines:
- Map each requirement to test cases
- Include positive and negative test scenarios
- Consider edge cases and error states
- Validate data integrity
- Check responsive design on different devices
- Ensure accessibility standards

Use Codex to create files with: {"approval-policy":"never","sandbox":"workspace-write"}
"""


async def run_tester() -> dict:
    """Run the Tester agent."""
    
    artifacts = ArtifactManager(ARTIFACTS["status"])
    
    # Check dependencies - tester needs to see everything
    required_files = [
        ARTIFACTS["requirements"],
        ARTIFACTS["test_plan"],
        ARTIFACTS["design_spec"]
    ]
    missing = artifacts.get_missing_dependencies(required_files[:2])  # At least need requirements and test plan
    
    if missing:
        print(f"✗ Missing required files: {missing}")
        print("Please run Project Manager agent first.")
        return {"status": "failed", "error": "Missing dependencies"}
    
    try:
        # Read all available artifacts
        requirements = read_artifact(ARTIFACTS["requirements"])
        test_plan = read_artifact(ARTIFACTS["test_plan"])
        design_spec = read_artifact(ARTIFACTS["design_spec"]) if ARTIFACTS["design_spec"].exists() else "Not available"
        
        # Check what was implemented
        frontend_exists = (ARTIFACTS["frontend"] / "components").exists()
        backend_exists = (ARTIFACTS["backend"] / "api").exists()
        
        async with MCPServerStdio(
            name="Codex CLI",
            params={"command": "npx", "args": ["-y", "codex", "mpc"]},
            client_session_timeout_seconds=AGENT_CONFIG["timeout_seconds"],
        ) as codex_mcp_server:
            
            print("Starting Tester agent...")
            
            tester = Agent(
                name="Tester",
                instructions=TESTER_INSTRUCTIONS,
                model=AGENT_CONFIG["model"],
                mcp_servers=[codex_mcp_server],
            )
            
            # Provide context
            context = f"""
Based on the project requirements and implementations, create a comprehensive test plan:

REQUIREMENTS:
{requirements}

TEST OBJECTIVES:
{test_plan}

DESIGN SPECIFICATIONS:
{design_spec}

IMPLEMENTATION STATUS:
- Frontend components: {"Implemented" if frontend_exists else "Not implemented"}
- Backend APIs: {"Implemented" if backend_exists else "Not implemented"}

Create:
1. A comprehensive TEST_PLAN.md
2. Detailed test cases covering all requirements
3. Sample test files for critical components
4. Performance and security test considerations

Ensure every requirement has corresponding test cases.
"""
            
            result = await Runner.run(tester, context)
            
            # Mark complete
            artifacts.mark_stage_complete(
                "tester",
                ["tests/TEST_PLAN.md", "tests/test_cases.md"]
            )
            
            print("✓ Tester completed successfully")
            
            return {"status": "success"}
            
    except Exception as e:
        artifacts.mark_stage_failed("tester", str(e))
        print(f"✗ Tester failed: {e}")
        return {"status": "failed", "error": str(e)}


async def main():
    """Main entry point for standalone execution."""
    set_default_openai_api(os.getenv("OPENAI_API_KEY"))
    
    result = await run_tester()
    
    artifacts = ArtifactManager(ARTIFACTS["status"])
    print("\n" + artifacts.get_workflow_summary())
    
    sys.exit(0 if result["status"] == "success" else 1)


if __name__ == "__main__":
    asyncio.run(main())