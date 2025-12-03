"""
Pipeline Orchestrator - Coordinates all agents in sequence.
Manages the flow from concept to working code.
"""
import asyncio
import os
from pathlib import Path
from typing import Dict, Optional
import argparse
import json
from datetime import datetime

from agents import set_default_openai_api
from shared.artifacts import ArtifactManager
from shared.config import ARTIFACTS

# Import all agents
from new_structure.01_task_extraction.agent import TaskExtractionAgent
from new_structure.02_project_manager.agent import run_project_manager
from new_structure.03_designer.agent import run_designer  
from new_structure.04_frontend_developer.agent import run_frontend_developer
from new_structure.05_backend_developer.agent import run_backend_developer
from new_structure.06_tester.agent import run_tester


class PipelineOrchestrator:
    """Orchestrates the complete multi-agent pipeline."""
    
    def __init__(self):
        self.artifacts = ArtifactManager(ARTIFACTS["status"])
        self.stages = {
            "01_task_extraction": {
                "name": "Task Extraction",
                "function": self._run_extraction,
                "dependencies": []
            },
            "02_project_manager": {
                "name": "Project Manager", 
                "function": run_project_manager,
                "dependencies": ["01_task_extraction"]
            },
            "03_designer": {
                "name": "Designer",
                "function": run_designer,
                "dependencies": ["02_project_manager"]
            },
            "04_frontend_developer": {
                "name": "Frontend Developer",
                "function": run_frontend_developer,
                "dependencies": ["03_designer"]
            },
            "05_backend_developer": {
                "name": "Backend Developer",
                "function": run_backend_developer,
                "dependencies": ["02_project_manager"]
            },
            "06_tester": {
                "name": "Tester",
                "function": run_tester,
                "dependencies": ["04_frontend_developer", "05_backend_developer"]
            }
        }
    
    async def _run_extraction(self, concept_file: Path) -> Dict:
        """Run task extraction agent."""
        extractor = TaskExtractionAgent()
        return await extractor.extract_tasks(concept_file)
    
    async def run_pipeline(
        self,
        concept_file: Optional[Path] = None,
        task_file: Optional[Path] = None,
        start_from: Optional[str] = None,
        resume: bool = False
    ):
        """
        Run the complete pipeline or resume from a specific stage.
        
        Args:
            concept_file: Path to concept markdown (for full pipeline)
            task_file: Path to existing task list (skip extraction)
            start_from: Stage to start from
            resume: Resume from last incomplete stage
        """
        
        print(f"\n🚀 Multi-Agent Pipeline")
        print(f"{'='*50}")
        print(f"Session: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Determine stages to run
        stages_to_run = list(self.stages.keys())
        
        if task_file and not concept_file:
            # Skip extraction if task file provided
            stages_to_run = stages_to_run[1:]
        
        if resume:
            # Find first incomplete stage
            for stage in stages_to_run:
                if not self.artifacts.is_stage_complete(stage):
                    start_from = stage
                    break
        
        if start_from:
            if start_from in stages_to_run:
                idx = stages_to_run.index(start_from)
                stages_to_run = stages_to_run[idx:]
            else:
                print(f"❌ Unknown stage: {start_from}")
                return
        
        print(f"Stages to run: {', '.join(stages_to_run)}")
        print(f"{'='*50}\n")
        
        # Run stages
        for stage_id in stages_to_run:
            stage = self.stages[stage_id]
            
            print(f"\n{'─'*50}")
            print(f"🔄 Stage {stage_id}: {stage['name']}")
            print(f"{'─'*50}")
            
            # Check dependencies
            deps_met = all(
                self.artifacts.is_stage_complete(dep) 
                for dep in stage['dependencies']
            )
            
            if not deps_met:
                print(f"❌ Dependencies not met for {stage['name']}")
                missing = [
                    dep for dep in stage['dependencies']
                    if not self.artifacts.is_stage_complete(dep)
                ]
                print(f"   Missing: {', '.join(missing)}")
                break
            
            # Run stage
            try:
                if stage_id == "01_task_extraction":
                    if not concept_file:
                        print("❌ Concept file required for extraction")
                        break
                    result = await stage['function'](concept_file)
                else:
                    result = await stage['function']()
                
                if result.get("status") != "success":
                    print(f"❌ Stage failed: {result.get('error', 'Unknown error')}")
                    break
                    
            except Exception as e:
                print(f"❌ Stage failed with exception: {e}")
                self.artifacts.mark_stage_failed(stage_id, str(e))
                break
        
        # Summary
        print(f"\n{'='*50}")
        print("Pipeline Summary")
        print(f"{'='*50}")
        print(self.artifacts.get_workflow_summary())
        
        # Show outputs location
        print(f"\n📁 Outputs location: {Path('outputs').absolute()}")


async def main():
    """Main entry point for the orchestrator."""
    parser = argparse.ArgumentParser(
        description="Run the multi-agent pipeline",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Full pipeline from concept
  python orchestrator.py --concept concepts/commitments-module.md
  
  # Skip extraction, use existing task file  
  python orchestrator.py --task outputs/task_list_20241203.md
  
  # Resume from failure
  python orchestrator.py --resume
  
  # Start from specific stage
  python orchestrator.py --task outputs/task_list.md --from-stage 03_designer
        """
    )
    
    parser.add_argument(
        "--concept",
        type=Path,
        help="Path to concept markdown file (starts full pipeline)"
    )
    parser.add_argument(
        "--task",
        type=Path,
        help="Path to existing task file (skips extraction)"
    )
    parser.add_argument(
        "--from-stage",
        help="Start from specific stage (01-06)"
    )
    parser.add_argument(
        "--resume",
        action="store_true",
        help="Resume from last incomplete stage"
    )
    
    args = parser.parse_args()
    
    # Validate inputs
    if not args.concept and not args.task and not args.resume:
        parser.error("Provide either --concept, --task, or --resume")
    
    # Set API key
    set_default_openai_api(os.getenv("OPENAI_API_KEY"))
    
    # Run pipeline
    orchestrator = PipelineOrchestrator()
    await orchestrator.run_pipeline(
        concept_file=args.concept,
        task_file=args.task,
        start_from=args.from_stage,
        resume=args.resume
    )


if __name__ == "__main__":
    asyncio.run(main())