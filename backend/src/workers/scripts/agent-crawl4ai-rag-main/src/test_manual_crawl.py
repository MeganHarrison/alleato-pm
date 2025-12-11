import asyncio
import os
import sys
import subprocess

# Auto-install missing dependencies
def ensure_dependencies():
    """Install missing dependencies if needed"""
    try:
        from dotenv import load_dotenv
    except ImportError:
        print("Installing python-dotenv...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "python-dotenv", "--quiet"])
        from dotenv import load_dotenv
    
    try:
        from crawl4ai_mcp import smart_crawl_url, crawl4ai_lifespan
    except ImportError:
        print("Installing dependencies from pyproject.toml...")
        script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-e", script_dir, "--quiet"])
        from crawl4ai_mcp import smart_crawl_url, crawl4ai_lifespan
    
    return load_dotenv, smart_crawl_url, crawl4ai_lifespan

load_dotenv, smart_crawl_url, crawl4ai_lifespan = ensure_dependencies()

# Load .env variables
load_dotenv()

# Create dummy context
class DummyRequestContext:
    lifespan_context = None

class DummyCtx:
    request_context = DummyRequestContext()

async def test():
    async with crawl4ai_lifespan(None) as lifespan_ctx:
        DummyCtx.request_context.lifespan_context = lifespan_ctx

        # Load URL from .env or use default
        url = os.getenv("TEST_CRAWL_URL", "https://v2.support.procore.com")
        print(f"Crawling URL: {url}")

        result = await smart_crawl_url(DummyCtx(), url, max_depth=2)

        print(result)

# Run it
asyncio.run(test())