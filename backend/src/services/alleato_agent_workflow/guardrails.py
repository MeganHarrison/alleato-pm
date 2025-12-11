"""
═══════════════════════════════════════════════════════════════════════════
GUARDRAILS - Input/Output Safety & Security Checks
═══════════════════════════════════════════════════════════════════════════

ROLE: Protects the RAG system from jailbreaks, PII leaks, and inappropriate content

CONTROLS:
- run_guardrails_on_input() → Checks user input before processing
- Detects jailbreak attempts, PII in queries, moderation violations
- Scrubs conversation history for sensitive information

GUARDRAIL CHECKS:
1. Jailbreak detection → Prevents prompt injection and system manipulation
2. PII detection → Identifies personally identifiable information in queries
3. Moderation → Filters inappropriate or harmful content
4. Context relevance → Ensures queries are business-related

CONFIGURATION:
- Uses guardrails library (optional dependency)
- Falls back gracefully if guardrails not installed
- Shared OpenAI client for LLM-based guardrail evaluation

USED BY:
- alleato_agent_workflow.py via run_and_apply_guardrails()
- Called BEFORE query classification and routing
- Shown as "Checking guardrails..." progress event in UI

TRIPWIRES: When guardrail triggered, returns error message to user without processing query

═══════════════════════════════════════════════════════════════════════════
"""

import os
from types import SimpleNamespace
from openai import AsyncOpenAI

# Try to import guardrails, but make it optional
try:
    from guardrails.runtime import load_config_bundle, instantiate_guardrails, run_guardrails
    GUARDRAILS_AVAILABLE = True
except ImportError:
    GUARDRAILS_AVAILABLE = False
    print("Warning: Guardrails not available. Continuing without guardrail protection.")


# Shared client for guardrails
try:
    client = AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    ctx = SimpleNamespace(guardrail_llm=client)
except Exception as e:
    print(f"Warning: Could not initialize OpenAI client: {e}")
    client = None
    ctx = SimpleNamespace(guardrail_llm=None)


# Default guardrail configuration
JAILBREAK_GUARDRAIL_CONFIG = {
    "guardrails": [
        {"name": "Jailbreak", "config": {"model": "gpt-5-nano", "confidence_threshold": 0.7}}
    ]
}


def guardrails_has_tripwire(results) -> bool:
    """Check if any guardrail result has a tripwire triggered."""
    return any(
        (hasattr(r, "tripwire_triggered") and (r.tripwire_triggered is True))
        for r in (results or [])
    )


def get_guardrail_safe_text(results, fallback_text: str) -> str:
    """
    Extract safe/anonymized text from guardrail results.

    Args:
        results: List of guardrail results
        fallback_text: Text to return if no safe text found

    Returns:
        Safe text from results or fallback
    """
    for r in (results or []):
        info = (r.info if hasattr(r, "info") else None) or {}
        if isinstance(info, dict) and ("checked_text" in info):
            return info.get("checked_text") or fallback_text

    # Check for PII anonymized text
    pii = next(
        (
            (r.info if hasattr(r, "info") else {})
            for r in (results or [])
            if isinstance((r.info if hasattr(r, "info") else None) or {}, dict)
            and ("anonymized_text" in ((r.info if hasattr(r, "info") else None) or {}))
        ),
        None
    )
    if isinstance(pii, dict) and ("anonymized_text" in pii):
        return pii.get("anonymized_text") or fallback_text

    return fallback_text


async def scrub_conversation_history(history, config):
    """Scrub PII from conversation history."""
    if not GUARDRAILS_AVAILABLE:
        return

    try:
        guardrails_list = (config or {}).get("guardrails") or []
        pii = next((g for g in guardrails_list if (g or {}).get("name") == "Contains PII"), None)
        if not pii:
            return

        pii_only = {"guardrails": [pii]}
        for msg in (history or []):
            content = (msg or {}).get("content") or []
            for part in content:
                if isinstance(part, dict) and part.get("type") == "input_text" and isinstance(part.get("text"), str):
                    res = await run_guardrails(
                        ctx,
                        part["text"],
                        "text/plain",
                        instantiate_guardrails(load_config_bundle(pii_only)),
                        suppress_tripwire=True,
                        raise_guardrail_errors=True
                    )
                    part["text"] = get_guardrail_safe_text(res, part["text"])
    except Exception:
        pass


async def scrub_workflow_input(workflow, input_key: str, config):
    """Scrub PII from a specific workflow input field."""
    if not GUARDRAILS_AVAILABLE:
        return

    try:
        guardrails_list = (config or {}).get("guardrails") or []
        pii = next((g for g in guardrails_list if (g or {}).get("name") == "Contains PII"), None)
        if not pii:
            return

        if not isinstance(workflow, dict):
            return

        value = workflow.get(input_key)
        if not isinstance(value, str):
            return

        pii_only = {"guardrails": [pii]}
        res = await run_guardrails(
            ctx,
            value,
            "text/plain",
            instantiate_guardrails(load_config_bundle(pii_only)),
            suppress_tripwire=True,
            raise_guardrail_errors=True
        )
        workflow[input_key] = get_guardrail_safe_text(res, value)
    except Exception:
        pass


async def run_and_apply_guardrails(input_text: str, config, history, workflow) -> dict:
    """
    Run guardrails on input text and return results.

    Args:
        input_text: The text to check
        config: Guardrails configuration
        history: Conversation history to potentially scrub
        workflow: Workflow dict to potentially scrub

    Returns:
        Dictionary with:
        - results: Raw guardrail results
        - has_tripwire: Boolean if any tripwire triggered
        - safe_text: Anonymized/safe version of text
        - fail_output: Structured failure info if tripwire triggered
        - pass_output: Structured pass info with safe text
    """
    if not GUARDRAILS_AVAILABLE:
        return {
            "results": [],
            "has_tripwire": False,
            "safe_text": input_text,
            "fail_output": None,
            "pass_output": {"safe_text": input_text}
        }

    results = await run_guardrails(
        ctx,
        input_text,
        "text/plain",
        instantiate_guardrails(load_config_bundle(config)),
        suppress_tripwire=True,
        raise_guardrail_errors=True
    )

    guardrails_list = (config or {}).get("guardrails") or []
    mask_pii = next(
        (g for g in guardrails_list
         if (g or {}).get("name") == "Contains PII"
         and ((g or {}).get("config") or {}).get("block") is False),
        None
    ) is not None

    if mask_pii:
        await scrub_conversation_history(history, config)
        await scrub_workflow_input(workflow, "input_as_text", config)
        await scrub_workflow_input(workflow, "input_text", config)

    has_tripwire = guardrails_has_tripwire(results)
    safe_text = get_guardrail_safe_text(results, input_text)
    fail_output = build_guardrail_fail_output(results or [])
    pass_output = {"safe_text": (get_guardrail_safe_text(results, input_text) or input_text)}

    return {
        "results": results,
        "has_tripwire": has_tripwire,
        "safe_text": safe_text,
        "fail_output": fail_output,
        "pass_output": pass_output
    }


def build_guardrail_fail_output(results) -> dict:
    """
    Build structured failure output from guardrail results.

    Returns dictionary with status of each guardrail type:
    - pii, moderation, jailbreak, hallucination, nsfw, url_filter,
      custom_prompt_check, prompt_injection
    """
    def _get(name: str):
        for r in (results or []):
            info = (r.info if hasattr(r, "info") else None) or {}
            gname = (info.get("guardrail_name") if isinstance(info, dict) else None) or \
                    (info.get("guardrailName") if isinstance(info, dict) else None)
            if gname == name:
                return r
        return None

    guardrail_names = [
        "Contains PII", "Moderation", "Jailbreak", "Hallucination Detection",
        "NSFW Text", "URL Filter", "Custom Prompt Check", "Prompt Injection Detection"
    ]
    pii, mod, jb, hal, nsfw, url, custom, pid = [_get(name) for name in guardrail_names]

    def _tripwire(r):
        return bool(r and r.tripwire_triggered) if r else False

    def _info(r):
        return r.info if r and hasattr(r, "info") else {}

    jb_info = _info(jb)
    hal_info = _info(hal)
    nsfw_info = _info(nsfw)
    url_info = _info(url)
    custom_info = _info(custom)
    pid_info = _info(pid)
    mod_info = _info(mod)
    pii_info = _info(pii)

    detected_entities = pii_info.get("detected_entities") if isinstance(pii_info, dict) else {}
    pii_counts = []
    if isinstance(detected_entities, dict):
        for k, v in detected_entities.items():
            if isinstance(v, list):
                pii_counts.append(f"{k}:{len(v)}")

    flagged_categories = (mod_info.get("flagged_categories") if isinstance(mod_info, dict) else None) or []

    return {
        "pii": {
            "failed": (len(pii_counts) > 0) or _tripwire(pii),
            "detected_counts": pii_counts
        },
        "moderation": {
            "failed": _tripwire(mod) or (len(flagged_categories) > 0),
            "flagged_categories": flagged_categories
        },
        "jailbreak": {"failed": _tripwire(jb)},
        "hallucination": {
            "failed": _tripwire(hal),
            "reasoning": (hal_info.get("reasoning") if isinstance(hal_info, dict) else None),
            "hallucination_type": (hal_info.get("hallucination_type") if isinstance(hal_info, dict) else None),
            "hallucinated_statements": (hal_info.get("hallucinated_statements") if isinstance(hal_info, dict) else None),
            "verified_statements": (hal_info.get("verified_statements") if isinstance(hal_info, dict) else None)
        },
        "nsfw": {"failed": _tripwire(nsfw)},
        "url_filter": {"failed": _tripwire(url)},
        "custom_prompt_check": {"failed": _tripwire(custom)},
        "prompt_injection": {"failed": _tripwire(pid)},
    }
