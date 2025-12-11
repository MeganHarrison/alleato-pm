#!/usr/bin/env python3
"""
Complete setup and execution script for crawling Procore support site.
This script handles everything: environment setup, dependency installation, and execution.
"""
import sys
import os
import subprocess
import shutil
from pathlib import Path

def run_command(cmd, check=True, shell=False):
    """Run a command and return the result"""
    try:
        if isinstance(cmd, str) and not shell:
            cmd = cmd.split()
        result = subprocess.run(
            cmd,
            shell=shell,
            check=check,
            capture_output=True,
            text=True
        )
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def main():
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    print("=" * 70)
    print("PROCORE SUPPORT SITE CRAWLER - COMPLETE SETUP & EXECUTION")
    print("=" * 70)
    print()
    
    # Step 1: Check for uv
    print("Step 1: Checking for uv...")
    has_uv, _, _ = run_command("uv --version", check=False)
    if not has_uv:
        print("  Installing uv...")
        success, out, err = run_command([sys.executable, "-m", "pip", "install", "uv"], check=False)
        if not success:
            print(f"  ✗ Failed to install uv: {err}")
            return False
    print("  ✓ uv is available")
    print()
    
    # Step 2: Install Python 3.13 if needed
    print("Step 2: Setting up Python 3.13...")
    success, out, err = run_command("uv python install 3.13", check=False)
    if success:
        print("  ✓ Python 3.13 installed/available")
    else:
        print(f"  ⚠ Note: {err.strip() if err else 'Python 3.13 setup'}")
    print()
    
    # Step 3: Create/update venv
    print("Step 3: Creating virtual environment...")
    if (script_dir / ".venv").exists():
        print("  Removing existing .venv...")
        shutil.rmtree(script_dir / ".venv")
    
    success, out, err = run_command("uv venv --python 3.13", check=False)
    if not success:
        # Try with python3.13 directly
        success, out, err = run_command("uv venv --python python3.13", check=False)
    if not success:
        # Try with python3.12
        success, out, err = run_command("uv venv --python python3.12", check=False)
    
    if success:
        print("  ✓ Virtual environment created")
    else:
        print(f"  ✗ Failed to create venv: {err}")
        return False
    print()
    
    # Step 4: Install dependencies
    print("Step 4: Installing dependencies...")
    venv_python = script_dir / ".venv" / "bin" / "python"
    if not venv_python.exists():
        venv_python = script_dir / ".venv" / "Scripts" / "python.exe"  # Windows
    
    if venv_python.exists():
        success, out, err = run_command([str(venv_python), "-m", "pip", "install", "-e", "."], check=False)
        if success:
            print("  ✓ Dependencies installed")
        else:
            print(f"  ✗ Failed to install dependencies: {err}")
            return False
    else:
        print("  ✗ Virtual environment Python not found")
        return False
    print()
    
    # Step 5: Run crawl4ai-setup
    print("Step 5: Running crawl4ai-setup...")
    crawl4ai_setup = script_dir / ".venv" / "bin" / "crawl4ai-setup"
    if crawl4ai_setup.exists():
        success, out, err = run_command([str(crawl4ai_setup)], check=False)
        if success:
            print("  ✓ crawl4ai-setup completed")
        else:
            print(f"  ⚠ crawl4ai-setup warning: {err.strip() if err else 'non-zero exit'}")
    else:
        print("  ⚠ crawl4ai-setup not found, skipping...")
    print()
    
    # Step 6: Run the crawl script
    print("Step 6: Running crawl script...")
    print("-" * 70)
    
    test_script = script_dir / "src" / "test_manual_crawl.py"
    if not test_script.exists():
        print(f"  ✗ Script not found: {test_script}")
        return False
    
    # Set up environment
    env = os.environ.copy()
    env["PYTHONPATH"] = str(script_dir / "src") + os.pathsep + env.get("PYTHONPATH", "")
    
    success, out, err = run_command([str(venv_python), str(test_script)], check=False, env=env)
    
    print(out)
    if err:
        print("STDERR:", err)
    
    if success:
        print("-" * 70)
        print("✓ Crawl completed successfully!")
        return True
    else:
        print("-" * 70)
        print("✗ Crawl failed")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

