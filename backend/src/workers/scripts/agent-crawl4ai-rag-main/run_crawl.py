#!/usr/bin/env python3
"""
Setup and run script for crawling Procore support site.
This script handles environment setup and runs the crawl.
"""
import sys
import subprocess
import os
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible (3.12 or 3.13)"""
    version = sys.version_info
    if version.major == 3 and 12 <= version.minor <= 13:
        print(f"✓ Python {version.major}.{version.minor} is compatible")
        return True
    else:
        print(f"✗ Python {version.major}.{version.minor} is not compatible (need 3.12 or 3.13)")
        return False

def run_setup():
    """Run the actual crawl script"""
    script_dir = Path(__file__).parent
    test_script = script_dir / "src" / "test_manual_crawl.py"
    
    if not test_script.exists():
        print(f"Error: {test_script} not found")
        return False
    
    print(f"\nRunning crawl script: {test_script}")
    print("=" * 60)
    
    try:
        # Run the script
        result = subprocess.run(
            [sys.executable, str(test_script)],
            cwd=str(script_dir),
            check=False
        )
        return result.returncode == 0
    except Exception as e:
        print(f"Error running script: {e}")
        return False

if __name__ == "__main__":
    print("Crawl4AI Procore Support Site Crawler")
    print("=" * 60)
    
    if not check_python_version():
        print("\nPlease use Python 3.12 or 3.13:")
        print("  python3.13 run_crawl.py")
        print("  or")
        print("  python3.12 run_crawl.py")
        sys.exit(1)
    
    # Check for .env file
    env_file = Path(__file__).parent / ".env"
    if not env_file.exists():
        print(f"\n⚠ Warning: .env file not found at {env_file}")
        print("The script will use default URL: https://v2.support.procore.com")
        print("Make sure Supabase and OpenAI credentials are set in environment variables.")
    
    success = run_setup()
    sys.exit(0 if success else 1)

