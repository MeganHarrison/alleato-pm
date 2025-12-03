"""
Task Extraction Agent - First stage in the pipeline.
Transforms informal requirements into structured task lists.
"""
import asyncio
import os
import re
import json
from typing import Dict, List, Optional, Any
from pathlib import Path
from datetime import datetime

from agents import Agent, Runner, set_default_openai_api
from agents.mcp import MCPServerStdio


TASK_EXTRACTION_INSTRUCTIONS = """
You are the Task Extraction Agent, the first stage in the multi-agent pipeline.

Your role is to transform informal requirements (markdown concept files) into 
structured task lists that subsequent agents can execute.

Input: Markdown concept file with:
- Overview (informal description)
- Reference URLs
- Documents & Assets
- Context (project info, tech stack, constraints)
- Additional notes

Output: Structured task list with:
- Clear goal statement
- Detailed requirements (15-20 specific items)
- User stories with acceptance criteria
- Technical specifications
- Role-specific tasks for each agent
- Success metrics
- Constraints and risks

Structure the output to include sections for:
1. Goal - One clear sentence
2. High-level Requirements - Bullet list of features
3. Technical Specifications - Architecture, stack, integrations
4. User Stories - At least 5 with acceptance criteria
5. Agent Tasks:
   - Project Manager: Requirements documentation tasks
   - Designer: UI/UX deliverables
   - Frontend Developer: Components to build
   - Backend Developer: APIs to implement
   - Tester: Test scenarios to create
6. Constraints - Technical, business, time
7. Success Metrics - Measurable outcomes

Save the structured task list to the specified output file.
Use formal, specific language that eliminates ambiguity.
"""


class TaskExtractionAgent:
    """First agent in the pipeline - extracts structured tasks from informal concepts."""
    
    def __init__(self):
        self.output_dir = Path("outputs")
        self.output_dir.mkdir(exist_ok=True)
        self.session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    async def extract_tasks(self, concept_file: Path) -> Dict[str, Any]:
        """
        Extract structured tasks from a markdown concept file.
        
        Args:
            concept_file: Path to the markdown concept file
            
        Returns:
            Dictionary with extraction results and file paths
        """
        
        print(f"🔍 Task Extraction Agent starting...")
        print(f"📄 Input: {concept_file}")
        
        if not concept_file.exists():
            raise FileNotFoundError(f"Concept file not found: {concept_file}")
        
        # Read and parse concept file
        concept_content = concept_file.read_text()
        parsed = self._parse_concept_markdown(concept_content)
        
        async with MCPServerStdio(
            name="Codex CLI",
            params={"command": "npx", "args": ["-y", "codex", "mcp"]},
            client_session_timeout_seconds=1800,
        ) as codex_mcp_server:
            
            agent = Agent(
                name="Task Extraction Agent",
                instructions=TASK_EXTRACTION_INSTRUCTIONS,
                model="gpt-4o",
                mcp_servers=[codex_mcp_server],
            )
            
            # Build prompt with parsed content
            prompt = f"""
Extract and structure the following concept into a comprehensive task list:

CONCEPT CONTENT:
{concept_content}

PARSED INFORMATION:
- Primary Goal: {parsed.get('overview', '').split('.')[0]}
- Technical Context: {json.dumps(parsed.get('context', {}), indent=2)}
- References: {parsed.get('urls', [])}

Create a structured task list optimized for our multi-agent pipeline.
Save to: {self.output_dir}/task_list_{self.session_id}.md
"""
            
            # Run extraction
            await Runner.run(agent, prompt)
            
            output_file = self.output_dir / f"task_list_{self.session_id}.md"
            
            if output_file.exists():
                print(f"✅ Task extraction complete: {output_file}")
                return {
                    "status": "success",
                    "output_file": str(output_file),
                    "session_id": self.session_id
                }
            else:
                raise Exception("Task extraction failed - no output file created")
    
    def _parse_concept_markdown(self, content: str) -> Dict[str, Any]:
        """Parse markdown concept file into structured data."""
        
        sections = {
            "overview": r"## Overview\s*(.*?)(?=##|$)",
            "urls": r"## Reference URLs\s*(.*?)(?=##|$)",
            "context": r"## Context\s*(.*?)(?=##|$)",
            "notes": r"## Additional Notes\s*(.*?)(?=##|$)"
        }
        
        parsed = {}
        for name, pattern in sections.items():
            match = re.search(pattern, content, re.DOTALL)
            if match:
                parsed[name] = match.group(1).strip()
        
        # Extract URLs as list
        if "urls" in parsed:
            url_lines = parsed["urls"].split('\n')
            parsed["url_list"] = [
                line.strip()[2:] for line in url_lines 
                if line.strip().startswith('- ')
            ]
        
        return parsed


async def main():
    """Run task extraction as standalone script."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Extract tasks from concept file")
    parser.add_argument("--file", required=True, help="Path to concept markdown file")
    args = parser.parse_args()
    
    set_default_openai_api(os.getenv("OPENAI_API_KEY"))
    
    extractor = TaskExtractionAgent()
    result = await extractor.extract_tasks(Path(args.file))
    
    print(f"\n📊 Results: {result}")


if __name__ == "__main__":
    asyncio.run(main())