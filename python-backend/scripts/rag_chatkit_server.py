"""
RAG ChatKit Server implementation with full debugging support
"""
from __future__ import annotations

import asyncio
import time
import traceback
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, AsyncIterator, Dict, List, Optional
from uuid import uuid4

from agents import Runner, RunConfig, ToolCallItem, ToolCallOutputItem, trace
from chatkit.agents import stream_agent_response
from chatkit.server import ChatKitServer, StreamingResult
from chatkit.types import (
    AssistantMessageContent,
    AssistantMessageItem,
    ThreadItemDoneEvent,
    ThreadMetadata,
    ThreadStreamEvent,
    UserMessageItem,
    WidgetItem,
    Action,
)
from chatkit.store import NotFoundError
from fastapi import Request

from memory_store import MemoryStore
from alleato_agent_workflow.workflow import (
    run_workflow,
    WorkflowInput,
)
from alleato_agent_workflow.agents import (
    classification_agent,
    project_agent,
    internal_knowledge_base_agent,
    strategist_agent,
)
from alleato_agent_workflow.guardrails import (
    run_and_apply_guardrails,
    JAILBREAK_GUARDRAIL_CONFIG,
)


@dataclass
class AgentEvent:
    """Event from agent execution"""
    id: str
    type: str  # 'classification', 'tool_call', 'tool_output', 'handoff', 'error', 'rag_query', 'rag_result'
    agent: str
    content: str
    metadata: Optional[Dict[str, Any]] = None
    timestamp: float = field(default_factory=lambda: time.time() * 1000)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "type": self.type,
            "agent": self.agent,
            "content": self.content,
            "metadata": self.metadata,
            "timestamp": self.timestamp,
        }


@dataclass
class GuardrailCheck:
    """Result of a guardrail check"""
    id: str
    name: str
    input: str
    reasoning: str
    passed: bool
    timestamp: float = field(default_factory=lambda: time.time() * 1000)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "input": self.input,
            "reasoning": self.reasoning,
            "passed": self.passed,
            "timestamp": self.timestamp,
        }


@dataclass
class RagConversationState:
    """State for a RAG conversation with full event tracking"""
    input_items: List[Dict[str, Any]] = field(default_factory=list)
    current_agent: str = "classification"
    context: Dict[str, Any] = field(default_factory=dict)
    events: List[AgentEvent] = field(default_factory=list)
    guardrails: List[GuardrailCheck] = field(default_factory=list)
    last_classification: Optional[str] = None
    last_error: Optional[str] = None


class RagChatKitServer(ChatKitServer[dict[str, Any]]):
    """ChatKit server for RAG conversations with full debugging support"""

    def __init__(self) -> None:
        self.store = MemoryStore()
        super().__init__(self.store)
        self._state: Dict[str, RagConversationState] = {}

    def _state_for_thread(self, thread_id: str) -> RagConversationState:
        if thread_id not in self._state:
            self._state[thread_id] = RagConversationState()
        return self._state[thread_id]

    async def _ensure_thread(
        self, thread_id: str | None, context: dict[str, Any]
    ) -> ThreadMetadata:
        """Ensure thread exists or create new one"""
        if thread_id:
            try:
                return await self.store.load_thread(thread_id, context)
            except NotFoundError:
                pass

        new_thread = ThreadMetadata(
            id=self.store.generate_thread_id(context),
            created_at=datetime.now()
        )
        await self.store.save_thread(new_thread, context)
        self._state_for_thread(new_thread.id)
        return new_thread

    def _add_event(self, state: RagConversationState, event_type: str, agent: str, content: str, metadata: Optional[dict] = None):
        """Helper to add an event to state"""
        event = AgentEvent(
            id=uuid4().hex,
            type=event_type,
            agent=agent,
            content=content,
            metadata=metadata,
        )
        state.events.append(event)
        return event

    async def respond(
        self,
        thread: ThreadMetadata,
        input_user_message: UserMessageItem | None,
        context: dict[str, Any],
    ) -> AsyncIterator[ThreadStreamEvent]:
        """Handle user messages and stream responses with full event tracking"""

        state = self._state_for_thread(thread.id)
        state.last_error = None  # Clear previous errors

        # Extract user message
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

            # Add to conversation history
            state.input_items.append({"content": user_text, "role": "user"})

            # Log the incoming message
            self._add_event(state, "message", "user", user_text, {"message_type": "user_input"})

        # Run the RAG workflow
        if user_text:
            try:
                # Step 1: Run guardrails check
                self._add_event(state, "guardrail_check", "system", "Running input guardrails...")

                guardrails_result = await run_and_apply_guardrails(
                    user_text,
                    JAILBREAK_GUARDRAIL_CONFIG,
                    [],  # conversation history
                    {"input_as_text": user_text}
                )

                # Record guardrail results
                has_tripwire = guardrails_result.get("has_tripwire", False)
                state.guardrails.append(GuardrailCheck(
                    id=uuid4().hex,
                    name="Jailbreak Detection",
                    input=user_text[:100] + "..." if len(user_text) > 100 else user_text,
                    reasoning="Input checked for potential jailbreak attempts",
                    passed=not has_tripwire,
                ))

                if has_tripwire:
                    self._add_event(state, "guardrail_blocked", "system", "Request blocked by guardrails",
                                   {"reason": "jailbreak_detected"})

                    error_msg = AssistantMessageItem(
                        id=self.store.generate_item_id("message", thread, context),
                        thread_id=thread.id,
                        created_at=datetime.now(),
                        content=[AssistantMessageContent(
                            text="I'm sorry, but I can't process that request. Please rephrase your question."
                        )],
                    )
                    yield ThreadItemDoneEvent(item=error_msg)
                    return

                self._add_event(state, "guardrail_passed", "system", "Guardrails passed", {"passed": True})

                # Step 2: Classification
                self._add_event(state, "classification_start", "classification", f"Classifying query: {user_text[:50]}...")

                from agents import TResponseInputItem
                conversation_history: list[TResponseInputItem] = [
                    {
                        "role": "user",
                        "content": [{"type": "input_text", "text": user_text}]
                    }
                ]

                classification_result = await Runner.run(
                    classification_agent,
                    input=conversation_history,
                    run_config=RunConfig(trace_metadata={
                        "__trace_source__": "rag-chatkit-server",
                    })
                )

                classification = classification_result.final_output.model_dump()
                classification_type = classification.get("classification", "strategic")
                state.last_classification = classification_type
                state.current_agent = classification_type

                self._add_event(state, "classification_result", "classification",
                               f"Query classified as: {classification_type}",
                               {"classification": classification_type, "raw_output": classification})

                # Step 3: Route to specialist agent
                if classification_type == "project":
                    target_agent = project_agent
                    agent_name = "project"
                elif classification_type == "policy":
                    target_agent = internal_knowledge_base_agent
                    agent_name = "internal_knowledge"
                else:
                    target_agent = strategist_agent
                    agent_name = "strategist"

                self._add_event(state, "handoff", "classification",
                               f"Handing off to {agent_name} agent",
                               {"source_agent": "classification", "target_agent": agent_name})

                state.current_agent = agent_name

                # Add classification result to history
                conversation_history.extend([
                    item.to_input_item() for item in classification_result.new_items
                ])

                # Step 4: Run specialist agent
                self._add_event(state, "agent_start", agent_name, f"Running {agent_name} agent...")

                # Track tool calls during agent execution
                agent_start_time = time.time()

                specialist_result = await Runner.run(
                    target_agent,
                    input=conversation_history,
                    run_config=RunConfig(trace_metadata={
                        "__trace_source__": "rag-chatkit-server",
                    })
                )

                agent_duration = time.time() - agent_start_time

                # Extract and record tool calls from the result
                for item in specialist_result.new_items:
                    if isinstance(item, ToolCallItem):
                        tool_name = getattr(item.raw_item, "name", "unknown_tool")
                        tool_args = getattr(item.raw_item, "arguments", {})

                        # Parse arguments if they're a string
                        if isinstance(tool_args, str):
                            try:
                                import json
                                tool_args = json.loads(tool_args)
                            except:
                                pass

                        self._add_event(state, "tool_call", agent_name, tool_name,
                                       {"tool_name": tool_name, "tool_args": tool_args})

                    elif isinstance(item, ToolCallOutputItem):
                        output_preview = str(item.output)[:500] + "..." if len(str(item.output)) > 500 else str(item.output)
                        self._add_event(state, "tool_output", agent_name, "Tool returned result",
                                       {"tool_result": output_preview})

                # Get final response
                response_text = specialist_result.final_output_as(str)

                self._add_event(state, "agent_complete", agent_name,
                               f"Agent completed in {agent_duration:.2f}s",
                               {"duration_seconds": agent_duration, "response_length": len(response_text)})

                # Create assistant message
                assistant_msg = AssistantMessageItem(
                    id=self.store.generate_item_id("message", thread, context),
                    thread_id=thread.id,
                    created_at=datetime.now(),
                    content=[AssistantMessageContent(text=response_text)],
                )

                # Add to conversation history
                state.input_items.append({
                    "role": "assistant",
                    "content": response_text
                })

                # Stream the response
                yield ThreadItemDoneEvent(item=assistant_msg)

            except Exception as e:
                # Detailed error handling
                error_details = traceback.format_exc()
                state.last_error = str(e)

                self._add_event(state, "error", state.current_agent, f"Error: {str(e)}",
                               {"error_type": type(e).__name__, "traceback": error_details})

                error_msg = AssistantMessageItem(
                    id=self.store.generate_item_id("message", thread, context),
                    thread_id=thread.id,
                    created_at=datetime.now(),
                    content=[AssistantMessageContent(
                        text=f"I encountered an error: {str(e)}. Please check the Agent View panel for details."
                    )],
                )
                yield ThreadItemDoneEvent(item=error_msg)

    async def bootstrap(
        self,
        thread: ThreadMetadata,
        context: dict[str, Any],
    ) -> dict[str, Any]:
        """Bootstrap the conversation with initial state"""
        return await self.snapshot(thread.id if thread else None, context)

    async def snapshot(
        self,
        thread_id: str | None,
        context: dict[str, Any],
    ) -> dict[str, Any]:
        """Get current conversation state with all events"""
        thread = await self._ensure_thread(thread_id, context)
        state = self._state_for_thread(thread.id)

        return {
            "thread_id": thread.id,
            "current_agent": state.current_agent,
            "context": {
                **state.context,
                "last_classification": state.last_classification,
                "last_error": state.last_error,
            },
            "agents": [
                {
                    "name": "classification",
                    "description": "Classifies user queries into project, policy, or strategic categories",
                    "active": state.current_agent == "classification",
                    "handoffs": ["project", "internal_knowledge", "strategist"],
                },
                {
                    "name": "project",
                    "description": "Handles project-specific queries, tasks, decisions, and risks",
                    "active": state.current_agent == "project",
                    "handoffs": [],
                    "tools": ["search_meetings", "search_decisions", "search_risks", "search_opportunities",
                             "search_all_knowledge", "get_recent_meetings", "get_tasks_and_decisions",
                             "get_project_insights", "list_all_projects", "get_project_details"],
                },
                {
                    "name": "internal_knowledge",
                    "description": "Searches internal knowledge base for policies and procedures",
                    "active": state.current_agent == "internal_knowledge",
                    "handoffs": [],
                    "tools": ["search_meetings", "search_decisions", "search_all_knowledge"],
                },
                {
                    "name": "strategist",
                    "description": "Provides strategic insights and cross-project analysis",
                    "active": state.current_agent == "strategist",
                    "handoffs": [],
                    "tools": ["web_search_preview", "search_meetings", "search_decisions", "search_risks",
                             "search_opportunities", "search_all_knowledge", "get_recent_meetings",
                             "get_project_insights", "list_all_projects"],
                },
            ],
            "events": [e.to_dict() for e in state.events],
            "guardrails": [g.to_dict() for g in state.guardrails],
        }

    async def handle_request(self, request: Request) -> Any:
        """Handle incoming HTTP request"""
        payload = await request.body()
        return await self.process(payload, {"request": request})

    async def action(
        self,
        thread: ThreadMetadata,
        action: Action[str, Any],
        sender: WidgetItem | None,
        context: dict[str, Any],
    ) -> AsyncIterator[ThreadStreamEvent]:
        """Handle actions - not used in RAG chat"""
        if False:
            yield
