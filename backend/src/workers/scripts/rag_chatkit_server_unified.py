"""
═══════════════════════════════════════════════════════════════════════════
RAG CHATKIT SERVER - UNIFIED AGENT (No Classification)
═══════════════════════════════════════════════════════════════════════════

ROLE: Streaming chat interface using unified agent (no classification step)

CONTROLS:
- respond() → Main chat handler with direct unified agent execution
- Progress indicators based on tool usage (not classification)
- Source extraction from tool outputs
- Real-time text streaming to frontend

DIFFERENCES FROM CLASSIFIED VERSION:
- ⚡ Faster: No classification call (saves 200-500ms per query)
- 💰 Cheaper: One fewer LLM call per query
- 🎯 More flexible: Handles hybrid queries across categories
- Simpler: One agent vs four (classification + 3 specialists)

EMITS:
- ProgressUpdateEvent: "Checking guardrails..." (lifesaver icon)
- ProgressUpdateEvent: "Analyzing your question..." (compass icon)
- ProgressUpdateEvent: Tool-specific progress based on what's called:
  - "Searching meeting transcripts..." (calendar icon)
  - "Finding relevant decisions..." (notebook icon)
  - "Analyzing risks..." (bug icon)
  - "Searching project data..." (search icon)
  - "Researching market trends..." (globe icon)
- ProgressUpdateEvent: "Finalizing answer..." (check-circle icon)
- ThreadItemDoneEvent: Final response message

USES:
- alleato_agent_workflow.agents.unified_agent (single multi-tool agent)
- Runner.run_streamed() for async event streaming

USED BY: api.py via /chatkit endpoint (configurable)

═══════════════════════════════════════════════════════════════════════════
"""
from __future__ import annotations

import asyncio
import json
import time
import traceback
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, AsyncIterator, Dict, List, Optional

from chatkit.server import ChatKitServer
from chatkit.types import (
    AssistantMessageContent,
    AssistantMessageItem,
    ProgressUpdateEvent,
    ThreadItemDoneEvent,
    ThreadMetadata,
    ThreadStreamEvent,
    UserMessageContent,
    UserMessageItem,
)

from agents import Runner, RunConfig
from src.services.memory_store import MemoryStore

# Import unified agent and guardrails
from alleato_agent_workflow.guardrails import (
    run_and_apply_guardrails,
    guardrails_has_tripwire,
    JAILBREAK_GUARDRAIL_CONFIG,
)
from alleato_agent_workflow.agents import unified_agent


@dataclass
class ConversationState:
    """State for a single conversation thread."""
    thread_id: str
    created_at: datetime
    input_items: List[Dict[str, Any]] = field(default_factory=list)
    events: List[Dict[str, Any]] = field(default_factory=list)
    sources: List[Dict[str, Any]] = field(default_factory=list)
    agent_name: str = "unified"  # Always unified agent


class RagChatKitServerUnified(ChatKitServer[dict[str, Any]]):
    """ChatKit server using unified agent (no classification)."""

    def __init__(self) -> None:
        self.store = MemoryStore()
        super().__init__(self.store)
        # Store conversation state per thread
        self._states: Dict[str, ConversationState] = {}

    def _get_or_create_state(self, thread_id: str) -> ConversationState:
        """Get existing state or create new one."""
        if thread_id not in self._states:
            self._states[thread_id] = ConversationState(
                thread_id=thread_id,
                created_at=datetime.now()
            )
        return self._states[thread_id]

    def _add_event(
        self,
        state: ConversationState,
        event_type: str,
        agent: str,
        message: str,
        metadata: Optional[Dict[str, Any]] = None
    ):
        """Add event to state for debugging/tracking."""
        event = {
            "timestamp": datetime.now().isoformat(),
            "type": event_type,
            "agent": agent,
            "message": message,
            "metadata": metadata or {}
        }
        state.events.append(event)

    def _extract_sources_from_tool_output(self, output: str) -> List[Dict[str, Any]]:
        """Extract [Source N] references from tool outputs."""
        import re
        sources = []

        # Find all [Source N] patterns
        source_refs = re.findall(r'\[Source (\d+)\]', output)

        for ref_num in source_refs:
            # Try to find the context around this source
            pattern = rf'\[Source {ref_num}\][^\[]*'
            matches = re.findall(pattern, output, re.DOTALL)

            if matches:
                context = matches[0][:200].strip()
                sources.append({
                    "ref": f"[Source {ref_num}]",
                    "context": context,
                    "number": int(ref_num)
                })

        return sources

    async def respond(
        self,
        thread: ThreadMetadata,
        input_user_message: UserMessageItem | None,
        context: dict[str, Any]
    ) -> AsyncIterator[ThreadStreamEvent]:
        """
        Handle user message with unified agent (no classification).

        Flow:
        1. Guardrails check
        2. Direct execution with unified_agent (no classification step)
        3. Stream progress based on tool calls
        4. Extract sources from output
        5. Return final response
        """
        state = self._get_or_create_state(thread.id)

        # Extract user text
        user_text = ""
        if input_user_message is not None:
            for content_item in input_user_message.content:
                if hasattr(content_item, 'text'):
                    user_text = content_item.text
                    break
                elif hasattr(content_item, 'type') and content_item.type == 'input_text':
                    user_text = getattr(content_item, 'text', '')
                    break
                elif isinstance(content_item, dict):
                    user_text = content_item.get('text', '')
                    break

        if user_text:
            state.input_items.append({"content": user_text, "role": "user"})
            self._add_event(state, "message", "user", user_text, {"message_type": "user_input"})

        if user_text:
            try:
                # PROGRESS: Checking guardrails
                yield ProgressUpdateEvent(
                    icon="lifesaver",
                    text="Checking guardrails..."
                )

                guardrails_result = await run_and_apply_guardrails(
                    user_text,
                    JAILBREAK_GUARDRAIL_CONFIG,
                    [],
                    {"input_as_text": user_text}
                )

                self._add_event(state, "guardrails", "system",
                               f"Guardrails check completed",
                               {"has_tripwire": guardrails_has_tripwire(guardrails_result)})

                if guardrails_has_tripwire(guardrails_result):
                    error_msg = AssistantMessageItem(
                        id=f"error-{thread.id}",
                        thread_id=thread.id,
                        created_at=datetime.now(),
                        content=[AssistantMessageContent(
                            text="I'm sorry, but I can't process that request. Please rephrase your question."
                        )],
                    )
                    yield ThreadItemDoneEvent(item=error_msg)
                    return

                # PROGRESS: Analyzing query (instead of "Classifying")
                yield ProgressUpdateEvent(
                    icon="compass",
                    text="Analyzing your question..."
                )

                from agents import TResponseInputItem
                conversation_history: list[TResponseInputItem] = [
                    {
                        "role": "user",
                        "content": [{"type": "input_text", "text": user_text}]
                    }
                ]

                self._add_event(state, "query_analysis", "unified",
                               "Starting unified agent execution",
                               {"query": user_text})

                # STREAMING: Run unified agent directly (no classification)
                agent_start_time = time.time()
                collected_output = []
                tool_outputs = []

                # Get streaming result
                result = Runner.run_streamed(
                    unified_agent,
                    input=conversation_history,
                    run_config=RunConfig(
                        trace_metadata={
                            "__trace_source__": "rag-chatkit-unified",
                        },
                    )
                )

                # Stream events from result
                async for event in result.stream_events():
                    # Track tool calls and emit progress
                    if event.type == "run_item_stream_event" and hasattr(event, 'item'):
                        item = event.item
                        if item.type == "tool_call_item" and hasattr(item, 'raw_item'):
                            raw = item.raw_item
                            if raw.type == "function_call":
                                tool_name = raw.name

                                # Emit progress for specific tools
                                if "search_meetings" in tool_name:
                                    yield ProgressUpdateEvent(
                                        icon="calendar",
                                        text="Searching meeting transcripts..."
                                    )
                                elif "search_decisions" in tool_name:
                                    yield ProgressUpdateEvent(
                                        icon="notebook",
                                        text="Finding relevant decisions..."
                                    )
                                elif "search_risks" in tool_name:
                                    yield ProgressUpdateEvent(
                                        icon="bug",
                                        text="Analyzing risks..."
                                    )
                                elif "search_opportunities" in tool_name:
                                    yield ProgressUpdateEvent(
                                        icon="lightbulb",
                                        text="Identifying opportunities..."
                                    )
                                elif "search_all_knowledge" in tool_name:
                                    yield ProgressUpdateEvent(
                                        icon="search",
                                        text="Searching all knowledge..."
                                    )
                                elif "get_recent_meetings" in tool_name:
                                    yield ProgressUpdateEvent(
                                        icon="calendar",
                                        text="Retrieving recent meetings..."
                                    )
                                elif "get_project" in tool_name:
                                    yield ProgressUpdateEvent(
                                        icon="document",
                                        text="Loading project details..."
                                    )
                                elif "get_tasks" in tool_name:
                                    yield ProgressUpdateEvent(
                                        icon="check-circle",
                                        text="Retrieving tasks..."
                                    )
                                elif "list_all_projects" in tool_name:
                                    yield ProgressUpdateEvent(
                                        icon="cube",
                                        text="Loading project portfolio..."
                                    )
                                elif "web_search" in tool_name:
                                    yield ProgressUpdateEvent(
                                        icon="globe",
                                        text="Researching market trends..."
                                    )

                                self._add_event(state, "tool_call", "unified", tool_name,
                                               {"tool": tool_name})

                    # Track text streaming
                    elif event.type == "raw_response_event":
                        raw_event = event.data
                        if raw_event.type == "response.content_part.delta":
                            if hasattr(raw_event, 'delta') and hasattr(raw_event.delta, 'text'):
                                collected_output.append(raw_event.delta.text)

                # Extract sources from final output
                if result.final_output:
                    output_str = str(result.final_output)
                    sources = self._extract_sources_from_tool_output(output_str)
                    state.sources.extend(sources)

                # PROGRESS: Finalizing response
                yield ProgressUpdateEvent(
                    icon="check-circle",
                    text="Finalizing answer..."
                )

                agent_duration = time.time() - agent_start_time

                # Get response text from final_output or collected chunks
                if result.final_output:
                    response_text = str(result.final_output)
                elif collected_output:
                    response_text = "".join(collected_output)
                else:
                    response_text = "I couldn't generate a response."

                self._add_event(state, "agent_complete", "unified",
                               f"Agent completed in {agent_duration:.2f}s",
                               {"duration": agent_duration, "sources": len(state.sources)})

                # Build assistant message with source annotations
                message_content = [AssistantMessageContent(text=response_text)]

                # Create response message
                response = AssistantMessageItem(
                    id=f"msg-{thread.id}-{int(time.time())}",
                    thread_id=thread.id,
                    created_at=datetime.now(),
                    content=message_content,
                )

                # Emit final message
                yield ThreadItemDoneEvent(item=response)

            except Exception as e:
                print(f"Error in unified agent respond: {e}")
                traceback.print_exc()

                error_msg = AssistantMessageItem(
                    id=f"error-{thread.id}",
                    thread_id=thread.id,
                    created_at=datetime.now(),
                    content=[AssistantMessageContent(
                        text=f"I encountered an error processing your request: {str(e)}"
                    )],
                )
                yield ThreadItemDoneEvent(item=error_msg)

    async def bootstrap(
        self,
        thread: ThreadMetadata,
        context: dict[str, Any],
    ) -> dict[str, Any]:
        """Bootstrap the conversation with initial state."""
        thread_id = thread.id if thread else None
        return await self.snapshot(thread_id, context)

    async def snapshot(self, thread_id: str | None, context: dict[str, Any]) -> dict[str, Any]:
        """Return current conversation state."""
        if thread_id is None:
            # Return default state for new conversations
            return {
                "thread_id": None,
                "current_agent": "unified",
                "sources": [],
                "events": [],
                "input_count": 0,
            }

        state = self._get_or_create_state(thread_id)

        return {
            "thread_id": thread_id,
            "current_agent": state.agent_name,
            "sources": state.sources,
            "events": state.events[-10:],  # Last 10 events
            "input_count": len(state.input_items),
        }
