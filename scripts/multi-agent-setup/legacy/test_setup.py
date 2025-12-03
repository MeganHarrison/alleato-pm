"""
Test script to verify the multi-agent setup is working correctly.
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv(override=True)


def test_imports():
    """Test that all required modules can be imported."""
    print("Testing imports...")
    try:
        import asyncio
        print("✅ asyncio imported successfully")
        
        from agents import Agent, Runner, set_default_openai_api
        print("✅ agents module imported successfully")
        
        from agents.mcp import MCPServerStdio
        print("✅ MCP module imported successfully")
        
        from agents.extensions.handoff_prompt import RECOMMENDED_PROMPT_PREFIX
        print("✅ handoff prompt imported successfully")
        
        from openai.types.shared import Reasoning
        print("✅ openai types imported successfully")
        
        return True
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("\nPlease install dependencies with: pip install -r requirements.txt")
        return False


def test_environment():
    """Test that environment variables are set."""
    print("\nTesting environment...")
    
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        print(f"✅ OPENAI_API_KEY is set (length: {len(api_key)})")
        return True
    else:
        print("❌ OPENAI_API_KEY not found")
        print("\nPlease create a .env file with: OPENAI_API_KEY=your-api-key")
        return False


def test_node():
    """Test that Node.js and npx are available."""
    print("\nTesting Node.js availability...")
    
    import subprocess
    
    try:
        # Test node
        node_result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        if node_result.returncode == 0:
            print(f"✅ Node.js is installed: {node_result.stdout.strip()}")
        else:
            print("❌ Node.js not found")
            return False
            
        # Test npx
        npx_result = subprocess.run(["npx", "--version"], capture_output=True, text=True)
        if npx_result.returncode == 0:
            print(f"✅ npx is available: {npx_result.stdout.strip()}")
            return True
        else:
            print("❌ npx not found")
            return False
            
    except FileNotFoundError:
        print("❌ Node.js/npx not found in PATH")
        print("\nPlease install Node.js from: https://nodejs.org/")
        return False


def main():
    """Run all tests."""
    print("=== Multi-Agent Setup Test ===\n")
    
    tests_passed = 0
    total_tests = 3
    
    if test_imports():
        tests_passed += 1
        
    if test_environment():
        tests_passed += 1
        
    if test_node():
        tests_passed += 1
    
    print(f"\n=== Results: {tests_passed}/{total_tests} tests passed ===")
    
    if tests_passed == total_tests:
        print("\n✅ All tests passed! You're ready to run the multi-agent workflows.")
        print("\nTry running:")
        print("  - python single_agent_example.py")
        print("  - python multi_agent_workflow.py")
    else:
        print("\n❌ Some tests failed. Please fix the issues above before proceeding.")
        sys.exit(1)


if __name__ == "__main__":
    main()