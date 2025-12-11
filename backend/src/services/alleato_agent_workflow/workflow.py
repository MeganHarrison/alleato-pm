"""
Main workflow orchestration for Alleato Agent.

This module contains the main workflow logic that:
1. Receives user input
2. Runs guardrails checks
3. Classifies the query
4. Routes to the appropriate specialist agent
5. Returns the response
"""

from pydantic import BaseModel
from agents import TResponseInputItem, Runner, RunConfig, trace

from .guardrails import (
    run_and_apply_guardrails,
    JAILBREAK_GUARDRAIL_CONFIG
)
from .agents import (
    classification_agent,
    project_agent,
    internal_knowledge_base_agent,
    strategist_agent
)


class WorkflowInput(BaseModel):
    """Input schema for the workflow."""
    input_as_text: str


async def run_workflow(workflow_input: WorkflowInput) -> dict:
    """
    Main workflow entrypoint.

    This function:
    1. Applies guardrails to the input
    2. Classifies the user's intent
    3. Routes to the appropriate specialist agent
    4. Returns the agent's response

    Args:
        workflow_input: WorkflowInput containing the user's message

    Returns:
        Dictionary containing the agent's response
    """
    with trace("Alleato PM"):
        state = {}
        workflow = workflow_input.model_dump()

        # Build initial conversation history
        conversation_history: list[TResponseInputItem] = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": workflow["input_as_text"]
                    }
                ]
            }
        ]

        # Run guardrails
        guardrails_input_text = workflow["input_as_text"]
        guardrails_result = await run_and_apply_guardrails(
            guardrails_input_text,
            JAILBREAK_GUARDRAIL_CONFIG,
            conversation_history,
            workflow
        )

        guardrails_hastripwire = guardrails_result["has_tripwire"]
        guardrails_anonymizedtext = guardrails_result["safe_text"]
        guardrails_output = (
            guardrails_hastripwire and guardrails_result["fail_output"]
        ) or guardrails_result["pass_output"]

        # If guardrails triggered, return early
        if guardrails_hastripwire:
            return guardrails_output

        # Classify the user's intent
        classification_agent_result_temp = await Runner.run(
            classification_agent,
            input=[*conversation_history],
            run_config=RunConfig(trace_metadata={
                "__trace_source__": "agent-builder",
                "workflow_id": "wf_69232d0b9f2081909919be0f25bf6dac09ba1809fcea54dd"
            })
        )

        conversation_history.extend([
            item.to_input_item()
            for item in classification_agent_result_temp.new_items
        ])

        classification_agent_result = {
            "output_text": classification_agent_result_temp.final_output.json(),
            "output_parsed": classification_agent_result_temp.final_output.model_dump()
        }

        classification = classification_agent_result["output_parsed"]["classification"]

        # Route to appropriate specialist agent
        if classification == "project":
            result = await _run_project_agent(conversation_history)
        elif classification == "policy":
            result = await _run_knowledge_base_agent(conversation_history)
        else:
            # Default to strategist for "strategic" and any other classification
            result = await _run_strategist_agent(conversation_history)

        return result


async def _run_project_agent(conversation_history: list) -> dict:
    """Run the project agent and return results."""
    project_result_temp = await Runner.run(
        project_agent,
        input=[*conversation_history],
        run_config=RunConfig(trace_metadata={
            "__trace_source__": "agent-builder",
            "workflow_id": "wf_69232d0b9f2081909919be0f25bf6dac09ba1809fcea54dd"
        })
    )

    conversation_history.extend([
        item.to_input_item()
        for item in project_result_temp.new_items
    ])

    return {
        "output_text": project_result_temp.final_output_as(str)
    }


async def _run_knowledge_base_agent(conversation_history: list) -> dict:
    """Run the internal knowledge base agent and return results."""
    kb_result_temp = await Runner.run(
        internal_knowledge_base_agent,
        input=[*conversation_history],
        run_config=RunConfig(trace_metadata={
            "__trace_source__": "agent-builder",
            "workflow_id": "wf_69232d0b9f2081909919be0f25bf6dac09ba1809fcea54dd"
        })
    )

    conversation_history.extend([
        item.to_input_item()
        for item in kb_result_temp.new_items
    ])

    return {
        "output_text": kb_result_temp.final_output_as(str)
    }


async def _run_strategist_agent(conversation_history: list) -> dict:
    """Run the strategist agent and return results."""
    strategist_result_temp = await Runner.run(
        strategist_agent,
        input=[*conversation_history],
        run_config=RunConfig(trace_metadata={
            "__trace_source__": "agent-builder",
            "workflow_id": "wf_69232d0b9f2081909919be0f25bf6dac09ba1809fcea54dd"
        })
    )

    conversation_history.extend([
        item.to_input_item()
        for item in strategist_result_temp.new_items
    ])

    return {
        "output_text": strategist_result_temp.final_output_as(str)
    }
