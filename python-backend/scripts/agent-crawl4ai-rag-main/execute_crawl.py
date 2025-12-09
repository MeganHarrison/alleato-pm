#!/usr/bin/env python3
"""
Execute the crawl script with proper error handling and setup checks.
"""
import sys
import os
import subprocess
from pathlib import Path

# Add src to path
script_dir = Path(__file__).parent
src_dir = script_dir / "src"
sys.path.insert(0, str(src_dir))

def main():
    print("=" * 60)
    print("Procore Support Site Crawler")
    print("=" * 60)
    print(f"Python version: {sys.version}")
    print(f"Working directory: {script_dir}")
    print()
    
    # Check Python version
    if sys.version_info < (3, 12) or sys.version_info >= (3, 14):
        print(f"⚠ Warning: Python {sys.version_info.major}.{sys.version_info.minor} may have compatibility issues")
        print("Recommended: Python 3.12 or 3.13")
        print()
    
    # Check for .env file
    env_file = script_dir / ".env"
    if env_file.exists():
        print(f"✓ Found .env file")
    else:
        print(f"⚠ .env file not found - using environment variables")
        print("Required: SUPABASE_URL, SUPABASE_SERVICE_KEY, OPENAI_API_KEY")
        print()
    
    # Try to import and run
    try:
        print("Loading crawl4ai_mcp module...")
        from crawl4ai_mcp import smart_crawl_url, crawl4ai_lifespan
        print("✓ Module loaded successfully")
        print()
        
        # Import the test function logic
        import asyncio
        from dotenv import load_dotenv
        
        # Load .env
        load_dotenv(env_file if env_file.exists() else None)
        
        # Create dummy context classes
        class DummyRequestContext:
            lifespan_context = None
        
        class DummyCtx:
            request_context = DummyRequestContext()
        
        async def run_crawl():
            print("Initializing crawler...")
            async with crawl4ai_lifespan(None) as lifespan_ctx:
                DummyCtx.request_context.lifespan_context = lifespan_ctx
                
                url = os.getenv("TEST_CRAWL_URL", "https://v2.support.procore.com")
                print(f"🌐 Crawling URL: {url}")
                print(f"📊 Max depth: 2")
                print()
                print("Starting crawl (this may take several minutes)...")
                print("-" * 60)
                
                result = await smart_crawl_url(DummyCtx(), url, max_depth=2)
                
                print("-" * 60)
                print("Crawl completed!")
                print()
                print("Results:")
                print(result)
        
        # Run the async function
        asyncio.run(run_crawl())
        
    except ImportError as e:
        print(f"✗ Import error: {e}")
        print()
        print("Dependencies may not be installed. Try:")
        print("  uv pip install -e .")
        print("  or")
        print("  pip install -e .")
        sys.exit(1)
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()

