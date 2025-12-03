"""
Task Refiner V2 - Uses markdown concept files for input.
Implements OpenAI's best practices for prompt engineering and task decomposition.
"""
import asyncio
import json
import re
from typing import Dict, List, Optional, Any, Tuple
from pathlib import Path
from datetime import datetime

from agents import Agent, Runner, set_default_openai_api
from agents.mcp import MCPServerStdio


TASK_STRUCTURING_INSTRUCTIONS = """
You are the Task Structuring Agent, responsible for transforming extracted information
into a well-structured task list optimized for multi-agent workflows.

You will receive parsed information from a concept markdown file and must produce a 
comprehensive task list that:
1. Clearly defines the goal and scope
2. Breaks down work into logical phases
3. Specifies deliverables for each agent role
4. Includes acceptance criteria
5. Identifies technical constraints
6. Provides enough detail to eliminate ambiguity

Use the following template structure:

```
Goal: [Clear, concise statement of the primary objective]

High-level Requirements:
- [Requirement 1 - specific and measurable]
- [Requirement 2 - specific and measurable]
- [Additional requirements...]

Technical Specifications:
- Technology Stack: [List specific technologies]
- Architecture: [Describe architectural patterns]
- Integrations: [External systems or APIs]
- Performance: [Any performance requirements]

User Stories:
1. As a [user type], I want [feature] so that [benefit]
   - Acceptance Criteria:
     - [Specific criterion 1]
     - [Specific criterion 2]

Roles and Responsibilities:
- Designer: [Specific design deliverables]
- Frontend Developer: [Specific frontend deliverables]
- Backend Developer: [Specific backend deliverables]
- Tester: [Specific testing deliverables]

Constraints:
- [Technical constraints]
- [Business constraints]
- [Time constraints]

Success Metrics:
- [How success will be measured]
- [Specific KPIs or outcomes]

Risk Mitigation:
- [Potential risks and mitigation strategies]
```

Focus on creating actionable, specific tasks that leave no room for interpretation.
Save the structured task list to the specified output file.
"""


class MarkdownConceptParser:
    """Parses markdown concept files into structured data."""
    
    @staticmethod
    def parse_concept_file(file_path: Path) -> Dict[str, Any]:
        """Parse a markdown concept file into structured sections."""
        
        if not file_path.exists():
            raise FileNotFoundError(f"Concept file not found: {file_path}")
        
        content = file_path.read_text()
        
        # Define section patterns
        sections = {
            "overview": r"## Overview\s*(.*?)(?=##|$)",
            "reference_urls": r"## Reference URLs\s*(.*?)(?=##|$)",
            "documents": r"## Documents & Assets\s*(.*?)(?=##|$)",
            "context": r"## Context\s*(.*?)(?=##|$)",
            "additional_notes": r"## Additional Notes\s*(.*?)(?=##|$)"
        }
        
        parsed = {}
        
        # Extract each section
        for section_name, pattern in sections.items():
            match = re.search(pattern, content, re.DOTALL)
            if match:
                parsed[section_name] = match.group(1).strip()
        
        # Parse specific subsections
        if "context" in parsed:
            parsed["context_parsed"] = MarkdownConceptParser._parse_context_section(parsed["context"])
        
        # Extract URLs as list
        if "reference_urls" in parsed:
            parsed["urls_list"] = MarkdownConceptParser._extract_urls(parsed["reference_urls"])
        
        # Extract documents as list
        if "documents" in parsed:
            parsed["documents_list"] = MarkdownConceptParser._extract_list_items(parsed["documents"])
        
        return parsed
    
    @staticmethod
    def _parse_context_section(context_text: str) -> Dict[str, Dict[str, str]]:
        """Parse the context section into subsections."""
        
        subsections = {
            "project_info": r"### Project Information\s*(.*?)(?=###|$)",
            "tech_stack": r"### Technical Stack\s*(.*?)(?=###|$)",
            "existing_system": r"### Existing System\s*(.*?)(?=###|$)",
            "constraints": r"### Constraints & Requirements\s*(.*?)(?=###|$)",
            "business": r"### Business Context\s*(.*?)(?=###|$)"
        }
        
        parsed_context = {}
        
        for subsection_name, pattern in subsections.items():
            match = re.search(pattern, context_text, re.DOTALL)
            if match:
                # Parse key-value pairs
                text = match.group(1).strip()
                parsed_context[subsection_name] = MarkdownConceptParser._parse_key_values(text)
        
        return parsed_context
    
    @staticmethod
    def _parse_key_values(text: str) -> Dict[str, str]:
        """Parse key-value pairs from text like '- **Key**: Value'."""
        
        pairs = {}
        lines = text.split('\n')
        
        for line in lines:
            match = re.match(r'- \*\*(.+?)\*\*:\s*(.+)', line.strip())
            if match:
                key = match.group(1).strip().lower().replace(' ', '_')
                value = match.group(2).strip()
                pairs[key] = value
        
        return pairs
    
    @staticmethod
    def _extract_urls(text: str) -> List[str]:
        """Extract URLs from markdown list."""
        urls = []
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if line.startswith('- '):
                url = line[2:].strip()
                if url.startswith('http'):
                    urls.append(url)
        
        return urls
    
    @staticmethod
    def _extract_list_items(text: str) -> List[str]:
        """Extract items from markdown list."""
        items = []
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if line.startswith('- ') and len(line) > 2:
                items.append(line[2:].strip())
        
        return items


class TaskRefinerV2:
    """
    Enhanced task refiner that works with markdown concept files.
    """
    
    def __init__(self):
        self.output_dir = Path("outputs")
        self.output_dir.mkdir(exist_ok=True)
        self.session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.parser = MarkdownConceptParser()
    
    async def refine_from_file(self, concept_file: Path) -> Dict[str, Any]:
        """
        Refine a task from a markdown concept file.
        
        Args:
            concept_file: Path to the markdown concept file
        
        Returns:
            Refined task list and metadata
        """
        
        print(f"\n🚀 Task Refinement from Concept File")
        print(f"📄 Input: {concept_file}")
        print(f"🔖 Session: {self.session_id}")
        print("="*60)
        
        results = {
            "session_id": self.session_id,
            "timestamp": datetime.now().isoformat(),
            "input_file": str(concept_file),
            "stages": {}
        }
        
        try:
            # Parse the concept file
            print("\n📖 Parsing concept file...")
            parsed_concept = self.parser.parse_concept_file(concept_file)
            results["parsed_concept"] = parsed_concept
            
            # Extract key information
            overview = parsed_concept.get("overview", "")
            urls = parsed_concept.get("urls_list", [])
            documents = parsed_concept.get("documents_list", [])
            context = parsed_concept.get("context_parsed", {})
            additional_notes = parsed_concept.get("additional_notes", "")
            
            # Build structured information for task generation
            extracted_info = {
                "primary_goal": self._extract_primary_goal(overview),
                "detailed_description": overview,
                "reference_urls": urls,
                "documents": documents,
                "project_context": context.get("project_info", {}),
                "technical_stack": context.get("tech_stack", {}),
                "existing_system": context.get("existing_system", {}),
                "constraints": context.get("constraints", {}),
                "business_context": context.get("business", {}),
                "additional_notes": additional_notes
            }
            
            results["stages"]["extraction"] = {
                "status": "success",
                "extracted_info": extracted_info
            }
            
            # Generate structured task list
            print("\n🏗️ Structuring task list...")
            structured_task = await self._generate_structured_task(extracted_info)
            results["stages"]["structuring"] = structured_task
            
            # Save outputs
            final_output = self.output_dir / f"refined_task_{self.session_id}.md"
            with open(final_output, 'w') as f:
                f.write(structured_task.get("task_list", ""))
            
            # Save parsed data for reference
            parsed_output = self.output_dir / f"parsed_concept_{self.session_id}.json"
            with open(parsed_output, 'w') as f:
                json.dump(extracted_info, f, indent=2)
            
            results["outputs"] = {
                "task_list": str(final_output),
                "parsed_data": str(parsed_output)
            }
            results["status"] = "success"
            
            print(f"\n✨ Task refinement complete!")
            print(f"📄 Task list: {final_output}")
            print(f"📊 Parsed data: {parsed_output}")
            
            return results
            
        except Exception as e:
            results["status"] = "error"
            results["error"] = str(e)
            print(f"\n❌ Task refinement failed: {e}")
            return results
    
    async def _generate_structured_task(self, extracted_info: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a structured task list from extracted information."""
        
        async with MCPServerStdio(
            name="Codex CLI",
            params={"command": "npx", "args": ["-y", "codex", "mcp"]},
            client_session_timeout_seconds=1800,
        ) as codex_mcp_server:
            
            agent = Agent(
                name="Task Structuring Agent",
                instructions=TASK_STRUCTURING_INSTRUCTIONS,
                model="gpt-4o",
                mcp_servers=[codex_mcp_server],
            )
            
            # Build comprehensive input prompt
            input_prompt = f"""
Please create a comprehensive task list from the following concept information:

PRIMARY GOAL:
{extracted_info['primary_goal']}

DETAILED DESCRIPTION:
{extracted_info['detailed_description']}

REFERENCE SYSTEMS:
{chr(10).join('- ' + url for url in extracted_info['reference_urls'])}

PROJECT CONTEXT:
{json.dumps(extracted_info['project_context'], indent=2)}

TECHNICAL STACK:
{json.dumps(extracted_info['technical_stack'], indent=2)}

EXISTING SYSTEM:
{json.dumps(extracted_info['existing_system'], indent=2)}

CONSTRAINTS & REQUIREMENTS:
{json.dumps(extracted_info['constraints'], indent=2)}

BUSINESS CONTEXT:
{json.dumps(extracted_info['business_context'], indent=2)}

ADDITIONAL NOTES:
{extracted_info['additional_notes']}

Create a detailed task list that can be used by our multi-agent system.
Save the output to: {self.output_dir}/structured_task_{self.session_id}.md
"""
            
            # Run structuring
            result = await Runner.run(agent, input_prompt)
            
            # Read the generated task list
            task_file = self.output_dir / f"structured_task_{self.session_id}.md"
            if task_file.exists():
                task_list = task_file.read_text()
                return {
                    "status": "success",
                    "task_list": task_list
                }
            else:
                return {
                    "status": "error",
                    "error": "Structured task list was not created"
                }
    
    def _extract_primary_goal(self, overview: str) -> str:
        """Extract the primary goal from the overview text."""
        
        if not overview:
            return "Goal not specified"
        
        # Look for the first sentence that contains action words
        sentences = overview.split('.')
        for sentence in sentences:
            sentence = sentence.strip()
            if any(word in sentence.lower() for word in ['build', 'create', 'implement', 'develop', 'need']):
                return sentence
        
        # Fallback to first sentence
        return sentences[0].strip() if sentences else overview[:100]


async def main():
    """Main entry point for the enhanced task refiner."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Refine tasks from markdown concept files",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python task_refiner_v2.py --file concepts/commitments-module.md
  python task_refiner_v2.py --file ~/ideas/new-feature.md --debug
        """
    )
    
    parser.add_argument(
        "--file", 
        required=True,
        type=Path,
        help="Path to markdown concept file"
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Show debug information"
    )
    
    args = parser.parse_args()
    
    # Set API key
    set_default_openai_api(os.getenv("OPENAI_API_KEY"))
    
    # Run refinement
    refiner = TaskRefinerV2()
    result = await refiner.refine_from_file(args.file)
    
    # Display summary
    if result["status"] == "success":
        print("\n📊 Summary:")
        print(f"✓ Successfully refined task from: {args.file}")
        print(f"✓ Output files created:")
        for key, path in result.get("outputs", {}).items():
            print(f"  - {key}: {path}")
        
        if args.debug:
            print("\n🔍 Debug - Extracted Information:")
            print(json.dumps(result["stages"]["extraction"]["extracted_info"], indent=2))
    else:
        print(f"\n❌ Refinement failed: {result.get('error')}")
        return 1
    
    return 0


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)