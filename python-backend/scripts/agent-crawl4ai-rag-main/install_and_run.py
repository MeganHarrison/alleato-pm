#!/usr/bin/env python3
"""
Install dependencies and run the crawl script.
This script will install missing dependencies and then execute the crawl.
"""
import sys
import subprocess
import os
from pathlib import Path

def install_package(package):
    """Install a package using pip"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package, "--quiet"])
        return True
    except:
        return False

def main():
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    print("Installing required dependencies...")
    
    # Install python-dotenv
    if not install_package("python-dotenv"):
        print("Failed to install python-dotenv")
        return False
    
    # Try to install other dependencies
    print("Installing crawl4ai and other dependencies...")
    packages = [
        "python-dotenv",
        "crawl4ai==0.6.2",
        "mcp==1.7.1", 
        "supabase==2.15.1",
        "openai==1.71.0",
        "sentence-transformers"
    ]
    
    for pkg in packages:
        print(f"  Installing {pkg}...")
        install_package(pkg)
    
    print("\nDependencies installed. Running crawl script...")
    print("=" * 60)
    
    # Now run the actual script
    test_script = script_dir / "src" / "test_manual_crawl.py"
    
    # Add src to path
    sys.path.insert(0, str(script_dir / "src"))
    
    # Change to script directory
    os.chdir(script_dir)
    
    # Import and run
    try:
        import asyncio
        from dotenv import load_dotenv
        load_dotenv()
        
        from crawl4ai_mcp import smart_crawl_url, crawl4ai_lifespan
        
        class DummyRequestContext:
            lifespan_context = None
        
        class DummyCtx:
            request_context = DummyRequestContext()
        
        async def test():
            async with crawl4ai_lifespan(None) as lifespan_ctx:
                DummyCtx.request_context.lifespan_context = lifespan_ctx
                url = os.getenv("TEST_CRAWL_URL", "https://v2.support.procore.com")
                print(f"Crawling URL: {url}")
                result = await smart_crawl_url(DummyCtx(), url, max_depth=2)
                print(result)
        
        asyncio.run(test())
        
    except ImportError as e:
        print(f"Import error: {e}")
        print("\nSome dependencies may still be missing.")
        print("Try running: pip install -e .")
        return False
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

