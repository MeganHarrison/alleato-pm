#!/usr/bin/env python3
"""Direct execution - no shell dependencies"""
import sys
import os
from pathlib import Path

# Force paths
base = Path(__file__).parent
os.chdir(base)
sys.path.insert(0, str(base / "src"))

# Try to run directly
try:
    import asyncio
    from dotenv import load_dotenv
    load_dotenv()
    
    from crawl4ai_mcp import smart_crawl_url, crawl4ai_lifespan
    
    class DummyRequestContext:
        lifespan_context = None
    class DummyCtx:
        request_context = DummyRequestContext()
    
    async def run():
        async with crawl4ai_lifespan(None) as ctx:
            DummyCtx.request_context.lifespan_context = ctx
            url = os.getenv("TEST_CRAWL_URL", "https://v2.support.procore.com")
            print(f"Crawling: {url}")
            result = await smart_crawl_url(DummyCtx(), url, max_depth=2)
            print(result)
    
    asyncio.run(run())
except ImportError as e:
    print(f"IMPORT ERROR: {e}")
    print("\nDependencies not installed. Run:")
    print("  uv venv --python 3.13")
    print("  source .venv/bin/activate")
    print("  uv pip install -e .")
    sys.exit(1)
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

