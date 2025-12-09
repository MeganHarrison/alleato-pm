import sys
import os
from pathlib import Path

# Set up paths
script_dir = Path(__file__).parent
src_dir = script_dir / "src"
sys.path.insert(0, str(script_dir))
sys.path.insert(0, str(src_dir))

# Change to script directory
os.chdir(script_dir)

# Now import and run
import asyncio
from dotenv import load_dotenv
from crawl4ai_mcp import smart_crawl_url, crawl4ai_lifespan

load_dotenv()

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

if __name__ == "__main__":
    asyncio.run(test())

