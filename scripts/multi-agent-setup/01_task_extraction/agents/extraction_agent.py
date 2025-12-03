"""
Extraction Agent - Processes diverse input formats and extracts key information.
Based on OpenAI's ADaPT (As-Needed Decomposition and Planning) approach.
"""
import asyncio
import os
from typing import Dict, List, Optional, Any
from pathlib import Path
import json

from agents import Agent, Runner, set_default_openai_api
from agents.mcp import MCPServerStdio


EXTRACTION_AGENT_INSTRUCTIONS = """
You are the Extraction Agent, the first stage in the task refinement pipeline.

Your role is to process various input formats and extract all relevant information
that will be needed to create a comprehensive task list.

Input Processing Capabilities:
1. **Free-form Text**: Extract intentions, requirements, and constraints
2. **URLs**: Fetch and analyze web content (use WebFetch tool)
3. **Documents**: Parse and extract key information
4. **Code References**: Understand existing codebase context
5. **Screenshots**: Analyze UI/UX patterns and functionality

Extraction Guidelines:
- Be exhaustive - capture ALL potentially relevant information
- Preserve original context and nuance
- Identify implicit requirements not explicitly stated
- Note uncertainties or ambiguities for later clarification
- Extract technical details, business logic, and user needs

Output Format:
Create a structured JSON document with:
{
    "raw_inputs": {
        "text": "original text inputs",
        "urls": ["list of URLs provided"],
        "documents": ["list of documents"],
        "context": {}
    },
    "extracted_information": {
        "primary_goal": "main objective",
        "features": ["list of identified features"],
        "technical_requirements": ["technical details found"],
        "business_requirements": ["business logic identified"],
        "constraints": ["limitations or constraints"],
        "references": ["external systems or patterns to follow"],
        "uncertainties": ["ambiguous or unclear points"]
    },
    "metadata": {
        "extraction_timestamp": "ISO timestamp",
        "confidence_scores": {},
        "requires_clarification": []
    }
}

Use Codex MCP to save the extraction results.
"""


class ExtractionAgent:
    """Handles the extraction phase of task refinement."""
    
    def __init__(self):
        self.output_dir = Path("task-refinement-outputs")
        self.output_dir.mkdir(exist_ok=True)
    
    async def process(
        self,
        text: Optional[str] = None,
        urls: Optional[List[str]] = None,
        documents: Optional[List[str]] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Process various inputs and extract structured information.
        
        Args:
            text: Free-form text description
            urls: List of URLs to analyze
            documents: List of document paths
            context: Additional context (project info, tech stack, etc.)
        
        Returns:
            Extracted information in structured format
        """
        
        # Build the input prompt
        input_prompt = self._build_input_prompt(text, urls, documents, context)
        
        async with MCPServerStdio(
            name="Codex CLI",
            params={"command": "npx", "args": ["-y", "codex", "mcp"]},
            client_session_timeout_seconds=1800,  # 30 minutes
        ) as codex_mcp_server:
            
            print("🔍 Extraction Agent: Processing inputs...")
            
            # Create the extraction agent
            agent = Agent(
                name="Extraction Agent",
                instructions=EXTRACTION_AGENT_INSTRUCTIONS,
                model="gpt-4o",
                mcp_servers=[codex_mcp_server],
                tools=["web_fetch"] if urls else []
            )
            
            # Run extraction
            result = await Runner.run(agent, input_prompt)
            
            # Save extraction results
            output_file = self.output_dir / "extraction_results.json"
            
            print("✓ Extraction complete. Results saved to:", output_file)
            
            return self._parse_extraction_results(output_file)
    
    def _build_input_prompt(
        self,
        text: Optional[str],
        urls: Optional[List[str]],
        documents: Optional[List[str]],
        context: Optional[Dict[str, Any]]
    ) -> str:
        """Build the input prompt for the extraction agent."""
        
        prompt_parts = ["Please extract all relevant information from the following inputs:"]
        
        if text:
            prompt_parts.append(f"\n## Free-form Description:\n{text}")
        
        if urls:
            prompt_parts.append(f"\n## URLs to Analyze:\n" + "\n".join(f"- {url}" for url in urls))
        
        if documents:
            prompt_parts.append(f"\n## Documents to Process:\n" + "\n".join(f"- {doc}" for doc in documents))
        
        if context:
            prompt_parts.append(f"\n## Additional Context:\n{json.dumps(context, indent=2)}")
        
        prompt_parts.append(f"\n\nSave your extraction results to: {self.output_dir}/extraction_results.json")
        
        return "\n".join(prompt_parts)
    
    def _parse_extraction_results(self, output_file: Path) -> Dict[str, Any]:
        """Parse and validate extraction results."""
        try:
            if output_file.exists():
                with open(output_file, 'r') as f:
                    return json.load(f)
            else:
                raise FileNotFoundError(f"Extraction results not found at {output_file}")
        except Exception as e:
            print(f"Error parsing extraction results: {e}")
            return {
                "status": "error",
                "error": str(e)
            }


async def main():
    """Standalone execution for testing."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Run Extraction Agent")
    parser.add_argument("--text", help="Free-form text input")
    parser.add_argument("--urls", nargs="*", help="URLs to analyze")
    parser.add_argument("--documents", nargs="*", help="Document paths")
    parser.add_argument("--context", help="JSON context")
    
    args = parser.parse_args()
    
    # Parse context if provided
    context = json.loads(args.context) if args.context else None
    
    # Set API key
    set_default_openai_api(os.getenv("OPENAI_API_KEY"))
    
    # Run extraction
    extractor = ExtractionAgent()
    result = await extractor.process(
        text=args.text,
        urls=args.urls,
        documents=args.documents,
        context=context
    )
    
    # Display results
    print("\n📋 Extraction Results:")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    asyncio.run(main())