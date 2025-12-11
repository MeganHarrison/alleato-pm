"""
═══════════════════════════════════════════════════════════════════════════
RAG CHATKIT SERVER - Streaming Chat Interface with Progress & Sources
═══════════════════════════════════════════════════════════════════════════

ROLE: Handles real-time chat interactions with streaming responses and progress

CONTROLS:
- respond() → Main chat handler with streaming via Runner.run_streamed()
- Progress indicators: "Checking guardrails...", "Classifying...", "Searching..."
- Source extraction from tool outputs (meetings, decisions, risks)
- Real-time text streaming to frontend
- Event tracking and state management per conversation thread

EMITS:
- ProgressUpdateEvent: "Checking guardrails..." (lifesaver icon)
- ProgressUpdateEvent: "Classifying your question..." (compass icon)
- ProgressUpdateEvent: "Searching project data..." (search icon)
- ProgressUpdateEvent: "Searching meeting transcripts..." (calendar icon)
- ProgressUpdateEvent: "Finding relevant decisions..." (notebook icon)
- ProgressUpdateEvent: "Analyzing risks..." (bug icon)
- ProgressUpdateEvent: "Finalizing answer..." (check-circle icon)
- ThreadItemDoneEvent: Final response message

USES:
- alleato_agent_workflow.alleato_agent_workflow (agent orchestration)
- Runner.run_streamed() for async event streaming

USED BY: api.py via /chatkit endpoint

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
    ProgressUpdateEvent,  # ← For "Doing X..." steps
    WorkflowItem,
    Workflow,
    CustomTask,
    ThoughtTask,
    CustomSummary,
)
from chatkit.store import NotFoundError, AttachmentStore
from chatkit.types import Attachment, AttachmentCreateParams, FileAttachment, ImageAttachment
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
    type: str
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
class DocumentSource:
    """Source document for citations"""
    id: str
    title: str
    type: str  # 'meeting', 'decision', 'risk', 'opportunity'
    date: Optional[str] = None
    url: Optional[str] = None
    relevance: Optional[str] = None  # e.g., "85% match"
    snippet: Optional[str] = None


@dataclass
class RagConversationState:
    """State for a RAG conversation"""
    input_items: List[Dict[str, Any]] = field(default_factory=list)
    current_agent: str = "classification"
    context: Dict[str, Any] = field(default_factory=dict)
    events: List[AgentEvent] = field(default_factory=list)
    guardrails: List[GuardrailCheck] = field(default_factory=list)
    sources: List[DocumentSource] = field(default_factory=list)
    last_classification: Optional[str] = None
    last_error: Optional[str] = None


class InMemoryAttachmentStore(AttachmentStore[dict[str, Any]]):
    """Simple in-memory attachment store for file uploads"""

    def __init__(self):
        self._attachments: Dict[str, Attachment] = {}
        self._upload_urls: Dict[str, str] = {}

    def generate_attachment_id(self, mime_type: str, context: dict[str, Any]) -> str:
        return f"attach_{uuid4().hex[:12]}"

    async def create_attachment(
        self, input: AttachmentCreateParams, context: dict[str, Any]
    ) -> Attachment:
        """Create an attachment with upload URL for two-phase upload"""
        attachment_id = self.generate_attachment_id(input.mime_type, context)
        # Generate a presigned-style URL (in production, use S3/GCS presigned URLs)
        upload_url = f"/rag-chatkit/upload/{attachment_id}"
        self._upload_urls[attachment_id] = upload_url

        # Determine if it's an image or file based on mime type
        is_image = input.mime_type.startswith("image/")

        if is_image:
            attachment = ImageAttachment(
                id=attachment_id,
                name=input.filename,
                mime_type=input.mime_type,
                preview_url=upload_url,  # Will be updated after upload
                upload_url=upload_url,
            )
        else:
            attachment = FileAttachment(
                id=attachment_id,
                name=input.filename,
                mime_type=input.mime_type,
                upload_url=upload_url,
            )

        self._attachments[attachment_id] = attachment
        return attachment

    async def delete_attachment(self, attachment_id: str, context: dict[str, Any]) -> None:
        """Delete an attachment"""
        if attachment_id in self._attachments:
            del self._attachments[attachment_id]
        if attachment_id in self._upload_urls:
            del self._upload_urls[attachment_id]

    async def get_attachment(self, attachment_id: str, context: dict[str, Any]) -> Attachment | None:
        """Get an attachment by ID"""
        return self._attachments.get(attachment_id)


class RagChatKitServerStreaming(ChatKitServer[dict[str, Any]]):
    """ChatKit server with streaming, sources, and progress updates"""

    def __init__(self) -> None:
        self.store = MemoryStore()
        self.attachment_store_impl = InMemoryAttachmentStore()
        super().__init__(self.store, attachment_store=self.attachment_store_impl)
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

    def _extract_sources_from_tool_output(self, output: str) -> List[DocumentSource]:
        """Extract source citations from tool output"""
        sources = []

        # Look for [Source N] patterns
        import re
        source_pattern = r'\[Source (\d+)\]\s+\*\*([^*]+)\*\*\s+\((\d+)% match\)'
        matches = re.findall(source_pattern, output)

        for match in matches:
            source_num, title, relevance_pct = match
            sources.append(DocumentSource(
                id=f"source-{source_num}",
                title=title.strip(),
                type="meeting",  # Infer from context
                relevance=f"{relevance_pct}%",
            ))

        # Look for explicit source sections
        if "---" in output and "**Sources:**" in output:
            source_section = output.split("---")[-1]
            if "**Sources:**" in source_section:
                lines = source_section.split("\n")
                for line in lines:
                    if line.strip().startswith("-"):
                        # Parse "- [Source 1]: Title (date) - relevance"
                        parts = line.strip("- ").split(":")
                        if len(parts) >= 2:
                            source_id = parts[0].strip("[]")
                            rest = ":".join(parts[1:])
                            if "(" in rest and ")" in rest:
                                title_part = rest.split("(")[0].strip()
                                date_part = rest.split("(")[1].split(")")[0].strip()
                                relevance_part = rest.split("-")[-1].strip() if "-" in rest else None

                                sources.append(DocumentSource(
                                    id=source_id.lower().replace(" ", "-"),
                                    title=title_part,
                                    type="document",
                                    date=date_part,
                                    relevance=relevance_part,
                                ))

        return sources

    async def respond(
        self,
        thread: ThreadMetadata,
        input_user_message: UserMessageItem | None,
        context: dict[str, Any],
    ) -> AsyncIterator[ThreadStreamEvent]:
        """Handle user messages with streaming, progress updates, and sources"""

        state = self._state_for_thread(thread.id)
        state.last_error = None
        state.sources.clear()  # Reset sources for new message

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

                # PROGRESS: Classifying query
                yield ProgressUpdateEvent(
                    icon="compass",
                    text="Classifying your question..."
                )

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
                        "__trace_source__": "rag-chatkit-streaming",
                    })
                )

                classification = classification_result.final_output.model_dump()
                classification_type = classification.get("classification", "strategic")
                state.last_classification = classification_type
                state.current_agent = classification_type

                self._add_event(state, "classification_result", "classification",
                               f"Query classified as: {classification_type}",
                               {"classification": classification_type, "raw_output": classification})

                # PROGRESS: Routing to specialist
                if classification_type == "project":
                    target_agent = project_agent
                    agent_name = "project"
                    progress_text = "Searching project data..."
                    progress_icon = "search"
                elif classification_type == "policy":
                    target_agent = internal_knowledge_base_agent
                    agent_name = "internal_knowledge"
                    progress_text = "Searching company knowledge base..."
                    progress_icon = "book-open"
                else:
                    target_agent = strategist_agent
                    agent_name = "strategist"
                    progress_text = "Analyzing strategic patterns..."
                    progress_icon = "lightbulb"

                state.current_agent = agent_name
                conversation_history.extend([
                    item.to_input_item() for item in classification_result.new_items
                ])

                # Build workflow tasks list for collapsible thinking UI
                workflow_tasks = [
                    CustomTask(
                        id=uuid4().hex,
                        status_indicator="complete",
                        title="Checking guardrails",
                        icon="check-circle",
                        content="Input validated - no issues detected"
                    ),
                    CustomTask(
                        id=uuid4().hex,
                        status_indicator="complete",
                        title=f"Classifying query → {classification_type}",
                        icon="compass",
                        content=f"Routed to {agent_name} agent"
                    ),
                ]

                # STREAMING: Run agent with streaming
                agent_start_time = time.time()
                collected_output = []
                tool_outputs = []
                tool_call_tasks = []  # Track tool calls for workflow

                # Get streaming result (not awaitable, returns immediately)
                result = Runner.run_streamed(
                    target_agent,
                    input=conversation_history,
                    run_config=RunConfig(
                        trace_metadata={
                            "__trace_source__": "rag-chatkit-streaming",
                        },
                    )
                )

                # Stream events from result
                async for event in result.stream_events():
                    # Track tool calls
                    if event.type == "run_item_stream_event" and hasattr(event, 'item'):
                        item = event.item
                        if item.type == "tool_call_item" and hasattr(item, 'raw_item'):
                            raw = item.raw_item
                            if raw.type == "function_call":
                                tool_name = raw.name

                                # Add tool call to workflow tasks
                                tool_display_name = tool_name.replace("_", " ").title()
                                icon_map = {
                                    "search_meetings": "calendar",
                                    "search_decisions": "notebook",
                                    "search_risks": "bug",
                                    "search_opportunities": "lightbulb",
                                    "search_all_knowledge": "search",
                                    "get_recent_meetings": "calendar",
                                    "get_project_insights": "chart",
                                    "list_all_projects": "document",
                                    "get_project_details": "document",
                                }
                                tool_icon = icon_map.get(tool_name, "settings-slider")

                                tool_call_tasks.append(CustomTask(
                                    id=uuid4().hex,
                                    status_indicator="loading",
                                    title=tool_display_name,
                                    icon=tool_icon,
                                ))

                                self._add_event(state, "tool_call", agent_name, tool_name,
                                               {"tool": tool_name})

                    # Track text streaming
                    elif event.type == "raw_response_event":
                        raw_event = event.data
                        if raw_event.type == "response.content_part.delta":
                            if hasattr(raw_event, 'delta') and hasattr(raw_event.delta, 'text'):
                                collected_output.append(raw_event.delta.text)

                # Mark tool tasks as completed
                for task in tool_call_tasks:
                    task.status_indicator = "complete"

                # Extract sources from final output
                if result.final_output:
                    output_str = str(result.final_output)
                    sources = self._extract_sources_from_tool_output(output_str)
                    state.sources.extend(sources)

                # Add tool tasks to workflow
                workflow_tasks.extend(tool_call_tasks)

                # Add synthesis task
                workflow_tasks.append(CustomTask(
                    id=uuid4().hex,
                    status_indicator="complete",
                    title="Synthesizing response",
                    icon="check-circle",
                    content=f"Analyzed {len(tool_call_tasks)} data sources"
                ))

                # Emit the workflow item showing all thinking steps
                agent_duration = time.time() - agent_start_time
                workflow_item = WorkflowItem(
                    id=self.store.generate_item_id("workflow", thread, context),
                    thread_id=thread.id,
                    created_at=datetime.now(),
                    workflow=Workflow(
                        type="reasoning",
                        tasks=workflow_tasks,
                        summary=CustomSummary(
                            title=f"Analyzing your question",
                            icon=progress_icon,
                        ),
                        expanded=False,  # Collapsed by default
                    )
                )
                yield ThreadItemDoneEvent(item=workflow_item)

                agent_duration = time.time() - agent_start_time

                # Get response text from final_output or collected chunks
                if result.final_output:
                    response_text = str(result.final_output)
                elif collected_output:
                    response_text = "".join(collected_output)
                else:
                    response_text = "I couldn't generate a response."

                self._add_event(state, "agent_complete", agent_name,
                               f"Agent completed in {agent_duration:.2f}s",
                               {"duration": agent_duration, "sources": len(state.sources)})

                # Build assistant message with source annotations
                message_content = [AssistantMessageContent(text=response_text)]

                # TODO: Add source annotations/entity sources here
                # This would require the full annotation schema from ChatKit

                assistant_msg = AssistantMessageItem(
                    id=self.store.generate_item_id("message", thread, context),
                    thread_id=thread.id,
                    created_at=datetime.now(),
                    content=message_content,
                )

                state.input_items.append({
                    "role": "assistant",
                    "content": response_text
                })

                yield ThreadItemDoneEvent(item=assistant_msg)

                # Optionally: yield a Sources widget if we have sources
                if state.sources:
                    # Create a simple sources widget (implementation depends on ChatKit version)
                    pass

            except Exception as e:
                error_details = traceback.format_exc()
                state.last_error = str(e)

                self._add_event(state, "error", state.current_agent, f"Error: {str(e)}",
                               {"error_type": type(e).__name__, "traceback": error_details})

                error_msg = AssistantMessageItem(
                    id=self.store.generate_item_id("message", thread, context),
                    thread_id=thread.id,
                    created_at=datetime.now(),
                    content=[AssistantMessageContent(
                        text=f"I encountered an error: {str(e)}. Please check the logs for details."
                    )],
                )
                yield ThreadItemDoneEvent(item=error_msg)

    async def bootstrap(
        self,
        thread: ThreadMetadata,
        context: dict[str, Any],
    ) -> dict[str, Any]:
        """Bootstrap the conversation"""
        return await self.snapshot(thread.id if thread else None, context)

    async def snapshot(
        self,
        thread_id: str | None,
        context: dict[str, Any],
    ) -> dict[str, Any]:
        """Return current conversation state"""
        if not thread_id:
            return {
                "events": [],
                "guardrails": [],
                "sources": [],
                "current_agent": "classification",
            }

        state = self._state_for_thread(thread_id)
        return {
            "events": [e.to_dict() for e in state.events],
            "guardrails": [g.to_dict() for g in state.guardrails],
            "sources": [{"id": s.id, "title": s.title, "type": s.type, "date": s.date, "relevance": s.relevance}
                       for s in state.sources],
            "current_agent": state.current_agent,
            "last_classification": state.last_classification,
        }

    async def add_feedback(
        self,
        thread: ThreadMetadata,
        item_id: str,
        feedback: str,  # "positive" or "negative"
        context: dict[str, Any],
    ) -> None:
        """Handle user feedback (thumbs up/down)"""
        state = self._state_for_thread(thread.id)
        self._add_event(
            state,
            "feedback",
            "user",
            f"User gave {feedback} feedback on message {item_id}",
            {"item_id": item_id, "feedback": feedback}
        )
        # In production, you would store this feedback to improve the model
        print(f"[RAG Feedback] Thread {thread.id}: {feedback} feedback on item {item_id}")

    async def action(
        self,
        thread: ThreadMetadata,
        action: Action,
        sender: WidgetItem | None,
        context: dict[str, Any],
    ) -> AsyncIterator[ThreadStreamEvent]:
        """Handle custom actions - not used in this implementation"""
        # No custom actions implemented
        if False:
            yield
