"""
Shared configuration for modular agent architecture.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(override=True)

# Base directories
BASE_DIR = Path(__file__).parent.parent
ARTIFACTS_DIR = BASE_DIR / "artifacts"
LOGS_DIR = BASE_DIR / "logs"

# Ensure directories exist
ARTIFACTS_DIR.mkdir(exist_ok=True)
LOGS_DIR.mkdir(exist_ok=True)

# Agent configuration
AGENT_CONFIG = {
    "model": "gpt-4o",
    "timeout_seconds": 1800,  # 30 minutes per agent instead of 100 hours!
}

# File paths for artifacts
ARTIFACTS = {
    "requirements": ARTIFACTS_DIR / "REQUIREMENTS.md",
    "tasks": ARTIFACTS_DIR / "AGENT_TASKS.md",
    "test_plan": ARTIFACTS_DIR / "TEST.md",
    "design_spec": ARTIFACTS_DIR / "design" / "design_spec.md",
    "frontend": ARTIFACTS_DIR / "frontend",
    "backend": ARTIFACTS_DIR / "backend",
    "test_results": ARTIFACTS_DIR / "tests" / "TEST_RESULTS.md",
    "status": ARTIFACTS_DIR / "workflow_status.json",
}

# Codex MCP configuration
CODEX_CONFIG = {
    "approval_policy": "never",
    "sandbox": "workspace-write"
}

# Ensure subdirectories exist
for path in ARTIFACTS.values():
    if path.suffix == "":  # It's a directory
        path.mkdir(exist_ok=True, parents=True)