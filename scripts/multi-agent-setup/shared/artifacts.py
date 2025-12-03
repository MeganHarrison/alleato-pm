"""
Artifact management utilities for tracking workflow progress.
"""
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any


class ArtifactManager:
    """Manages artifacts and workflow status across agents."""
    
    def __init__(self, status_file: Path):
        self.status_file = status_file
        self.status = self._load_status()
    
    def _load_status(self) -> Dict[str, Any]:
        """Load existing status or create new."""
        if self.status_file.exists():
            with open(self.status_file, 'r') as f:
                return json.load(f)
        return {
            "workflow_id": datetime.now().isoformat(),
            "stages": {},
            "artifacts": {},
        }
    
    def save_status(self):
        """Save current status to file."""
        with open(self.status_file, 'w') as f:
            json.dump(self.status, f, indent=2)
    
    def mark_stage_complete(self, stage: str, artifacts: List[str]):
        """Mark a stage as complete with its artifacts."""
        self.status["stages"][stage] = {
            "completed_at": datetime.now().isoformat(),
            "status": "complete",
            "artifacts": artifacts
        }
        for artifact in artifacts:
            self.status["artifacts"][artifact] = {
                "created_by": stage,
                "created_at": datetime.now().isoformat()
            }
        self.save_status()
    
    def mark_stage_failed(self, stage: str, error: str):
        """Mark a stage as failed."""
        self.status["stages"][stage] = {
            "failed_at": datetime.now().isoformat(),
            "status": "failed",
            "error": error
        }
        self.save_status()
    
    def is_stage_complete(self, stage: str) -> bool:
        """Check if a stage is complete."""
        return (stage in self.status["stages"] and 
                self.status["stages"][stage]["status"] == "complete")
    
    def get_missing_dependencies(self, required_files: List[Path]) -> List[str]:
        """Check which required files are missing."""
        missing = []
        for file_path in required_files:
            if not file_path.exists():
                missing.append(str(file_path))
        return missing
    
    def get_workflow_summary(self) -> str:
        """Get a summary of the workflow status."""
        completed = [s for s, data in self.status["stages"].items() 
                    if data["status"] == "complete"]
        failed = [s for s, data in self.status["stages"].items() 
                 if data["status"] == "failed"]
        
        summary = f"Workflow ID: {self.status['workflow_id']}\n"
        summary += f"Completed stages: {', '.join(completed) or 'None'}\n"
        summary += f"Failed stages: {', '.join(failed) or 'None'}\n"
        summary += f"Total artifacts: {len(self.status['artifacts'])}"
        
        return summary


def read_artifact(file_path: Path) -> Optional[str]:
    """Safely read an artifact file."""
    if file_path.exists():
        return file_path.read_text()
    return None


def write_artifact(file_path: Path, content: str):
    """Write an artifact file, creating directories as needed."""
    file_path.parent.mkdir(parents=True, exist_ok=True)
    file_path.write_text(content)