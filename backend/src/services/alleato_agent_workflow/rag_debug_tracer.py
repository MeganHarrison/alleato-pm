"""
═══════════════════════════════════════════════════════════════════════════
RAG DEBUG TRACER - Comprehensive Operation Tracing
═══════════════════════════════════════════════════════════════════════════

ROLE: Captures detailed traces of RAG operations for debugging and analysis

CONTROLS:
- TraceEvent dataclass → Records individual trace events
- RagTracer class → Manages trace collection per conversation thread
- Trace event types: query, embedding, vector_search, retrieval, tool_call, reasoning

CAPTURED DATA:
- Timestamps and durations for all operations
- Query text and generated embeddings
- Vector search parameters and results
- Tool calls with inputs and outputs
- Agent reasoning steps
- Source documents retrieved

STORAGE: In-memory traces per thread_id, accessible for debugging

USED BY:
- rag_chatkit_server_streaming.py (captures traces during streaming)
- Development/debugging to understand RAG behavior
- Not exposed to end users (internal debugging only)

OUTPUT: Structured trace logs with timing data for performance analysis

═══════════════════════════════════════════════════════════════════════════
"""

import json
import time
from datetime import datetime
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field
from uuid import uuid4

from agents import function_tool


@dataclass
class TraceEvent:
    """Single trace event"""
    id: str
    timestamp: float
    event_type: str  # 'query', 'embedding', 'vector_search', 'retrieval', 'tool_call', 'reasoning'
    agent: str
    data: Dict[str, Any]
    duration_ms: Optional[float] = None

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "timestamp": self.timestamp,
            "event_type": self.event_type,
            "agent": self.agent,
            "data": self.data,
            "duration_ms": self.duration_ms,
        }


class RAGDebugTracer:
    """Global tracer for RAG operations"""

    def __init__(self):
        self.events: List[TraceEvent] = []
        self.enabled = True
        self._session_id = uuid4().hex[:8]

    def trace(self, event_type: str, agent: str, data: Dict[str, Any], duration_ms: Optional[float] = None):
        """Record a trace event"""
        if not self.enabled:
            return

        event = TraceEvent(
            id=uuid4().hex[:8],
            timestamp=time.time() * 1000,
            event_type=event_type,
            agent=agent,
            data=data,
            duration_ms=duration_ms,
        )
        self.events.append(event)

        # Print trace in real-time for debugging
        self._print_trace(event)

    def _print_trace(self, event: TraceEvent):
        """Print trace event to console"""
        timestamp = datetime.fromtimestamp(event.timestamp / 1000).strftime("%H:%M:%S.%f")[:-3]
        duration = f" ({event.duration_ms:.2f}ms)" if event.duration_ms else ""

        print(f"\n[RAG TRACE {timestamp}] {event.event_type.upper()} - {event.agent}{duration}")

        # Pretty print data
        for key, value in event.data.items():
            if isinstance(value, (list, dict)):
                value_str = json.dumps(value, indent=2)[:500]
                if len(str(value)) > 500:
                    value_str += "..."
            else:
                value_str = str(value)[:500]
            print(f"  {key}: {value_str}")

    def get_session_traces(self) -> List[Dict]:
        """Get all traces for current session"""
        return [event.to_dict() for event in self.events]

    def clear(self):
        """Clear all traces"""
        self.events.clear()
        self._session_id = uuid4().hex[:8]

    def get_summary(self) -> Dict[str, Any]:
        """Get summary statistics"""
        if not self.events:
            return {"total_events": 0}

        by_type = {}
        for event in self.events:
            by_type[event.event_type] = by_type.get(event.event_type, 0) + 1

        total_duration = sum(e.duration_ms or 0 for e in self.events)

        return {
            "session_id": self._session_id,
            "total_events": len(self.events),
            "events_by_type": by_type,
            "total_duration_ms": total_duration,
            "start_time": self.events[0].timestamp if self.events else None,
            "end_time": self.events[-1].timestamp if self.events else None,
        }


# Global tracer instance
_tracer = RAGDebugTracer()


def get_tracer() -> RAGDebugTracer:
    """Get the global tracer instance"""
    return _tracer


@function_tool
def rag_trace(event_type: str, agent: str, data_json: str) -> str:
    """
    Internal tracing tool for RAG operations.
    Call this during retrieval to record debug information.

    Args:
        event_type: Type of event (query, embedding, vector_search, retrieval, etc.)
        agent: Name of the agent making the trace
        data_json: Event data as JSON string (query text, results, errors, etc.)

    Returns:
        Confirmation message
    """
    import json
    try:
        data = json.loads(data_json)
    except:
        data = {"raw": data_json}
    _tracer.trace(event_type, agent, data)
    return f"Traced {event_type} event"


@function_tool
def get_rag_traces() -> str:
    """
    Get all RAG traces for debugging.
    Use this to inspect what queries were made and what results were retrieved.

    Returns:
        JSON string of all trace events
    """
    traces = _tracer.get_session_traces()
    summary = _tracer.get_summary()

    return json.dumps({
        "summary": summary,
        "traces": traces[-20:],  # Last 20 events
    }, indent=2)


def trace_query(agent: str, query: str, metadata: Optional[dict] = None):
    """Helper to trace a query"""
    data = {"query": query}
    if metadata:
        data.update(metadata)
    _tracer.trace("query", agent, data)


def trace_embedding(agent: str, query: str, embedding_vector: list, model: str = "text-embedding-3-small"):
    """Helper to trace embedding generation"""
    _tracer.trace("embedding", agent, {
        "query": query,
        "model": model,
        "embedding_dims": len(embedding_vector),
        "embedding_sample": embedding_vector[:5],  # First 5 dims
    })


def trace_vector_search(agent: str, query: str, table: str, results_count: int,
                       similarity_threshold: Optional[float] = None,
                       filters: Optional[dict] = None):
    """Helper to trace vector search"""
    data = {
        "query": query,
        "table": table,
        "results_count": results_count,
    }
    if similarity_threshold:
        data["similarity_threshold"] = similarity_threshold
    if filters:
        data["filters"] = filters
    _tracer.trace("vector_search", agent, data)


def trace_retrieval(agent: str, operation: str, results: Any, metadata: Optional[dict] = None):
    """Helper to trace document retrieval"""
    data = {
        "operation": operation,
        "results_type": type(results).__name__,
    }

    if isinstance(results, list):
        data["results_count"] = len(results)
        if results and isinstance(results[0], dict):
            data["sample_keys"] = list(results[0].keys())
    elif isinstance(results, dict):
        data["keys"] = list(results.keys())

    if metadata:
        data.update(metadata)

    _tracer.trace("retrieval", agent, data)


def trace_tool_call(agent: str, tool_name: str, args: dict, start_time: float):
    """Helper to trace tool calls"""
    duration_ms = (time.time() - start_time) * 1000
    _tracer.trace("tool_call", agent, {
        "tool_name": tool_name,
        "args": args,
    }, duration_ms=duration_ms)


def trace_reasoning(agent: str, step: str, reasoning: str):
    """Helper to trace reasoning steps"""
    _tracer.trace("reasoning", agent, {
        "step": step,
        "reasoning": reasoning[:500],  # Truncate long reasoning
    })


def trace_error(agent: str, error: Exception, context: Optional[dict] = None):
    """Helper to trace errors"""
    data = {
        "error_type": type(error).__name__,
        "error_message": str(error),
    }
    if context:
        data["context"] = context
    _tracer.trace("error", agent, data)
