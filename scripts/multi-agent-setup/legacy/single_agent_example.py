"""
Single Agent Example: Game Designer and Developer
This is a simple example showing two agents working together to create a game.
"""

import asyncio
import os
from dotenv import load_dotenv

from agents import Agent, Runner, set_default_openai_api
from agents.mcp import MCPServerStdio

# Load environment variables
load_dotenv(override=True)
set_default_openai_api(os.getenv("OPENAI_API_KEY"))


async def main() -> None:
    """
    Main function that sets up the MCP server and runs the single agent example.
    """
    # Initialize Codex MCP Server
    async with MCPServerStdio(
        name="Codex CLI",
        params={
            "command": "npx",
            "args": ["-y", "codex", "mcp"],
        },
        client_session_timeout_seconds=360000,
    ) as codex_mcp_server:
        print("Codex MCP server started...")
        
        # Define Developer Agent
        developer_agent = Agent(
            name="Game Developer",
            instructions=(
                "You are an expert in building simple games using basic html + css + javascript with no dependencies. "
                "Save your work in a file called index.html in the current directory. "
                "Always call codex with \"approval-policy\": \"never\" and \"sandbox\": \"workspace-write\""
            ),
            mcp_servers=[codex_mcp_server],
        )
        
        # Define Designer Agent
        designer_agent = Agent(
            name="Game Designer",
            instructions=(
                "You are an indie game connoisseur. Come up with an idea for a single page html + css + javascript game "
                "that a developer could build in about 50 lines of code. "
                "Format your request as a 3 sentence design brief for a game developer and call the Game Developer coder with your idea."
            ),
            model="gpt-5",
            handoffs=[developer_agent],
        )
        
        # Run the agents
        print("Starting game design and development...")
        result = await Runner.run(designer_agent, "Implement a fun new game!")
        
        print("\n✅ Game creation complete!")
        print(f"Final output: {result.final_output}")
        print("\nCheck your current directory for 'index.html' to play the game!")


if __name__ == "__main__":
    # Handle both Jupyter/notebook and regular Python environments
    try:
        # Check if we're in a notebook/Jupyter environment
        asyncio.get_running_loop()
        # If yes, use await directly (in notebooks)
        await main()
    except RuntimeError:
        # If not, use asyncio.run() (regular Python scripts)
        asyncio.run(main())