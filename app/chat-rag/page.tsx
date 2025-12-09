"use client";

import { useCallback, useEffect, useState } from "react";
import { AgentPanel } from "@/components/agent-panel";
import { RagChatKitPanel } from "@/components/rag-chatkit-panel";
import type { Agent, AgentEvent, GuardrailCheck } from "@/lib/types";

async function fetchRagBootstrapState() {
  try {
    const res = await fetch("/api/rag-chatkit/bootstrap");
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchRagThreadState(threadId: string) {
  try {
    const res = await fetch(`/api/rag-chatkit/state?thread_id=${threadId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default function RagHome() {
  const [agents, setAgents] = useState<Agent[]>([
    { name: "classification", description: "Classifies user queries", handoffs: ["project", "internal_knowledge", "strategist"], tools: [], input_guardrails: [] },
    { name: "project", description: "Handles project-related queries", handoffs: [], tools: [], input_guardrails: [] },
    { name: "internal_knowledge", description: "Searches internal knowledge base", handoffs: [], tools: [], input_guardrails: [] },
    { name: "strategist", description: "Provides strategic insights", handoffs: [], tools: [], input_guardrails: [] },
  ]);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [currentAgent, setCurrentAgent] = useState<string>("classification");
  const [guardrails, setGuardrails] = useState<GuardrailCheck[]>([]);
  const [context, setContext] = useState<Record<string, any>>({});
  const [threadId, setThreadId] = useState<string | null>(null);
  const [initialThreadId, setInitialThreadId] = useState<string | null>(null);

  const hydrateState = useCallback(
    async (id: string | null) => {
      if (!id) return;
      const data = await fetchRagThreadState(id);
      if (!data) return;

      setCurrentAgent(data.current_agent || "classification");
      setContext(data.context || {});
      if (Array.isArray(data.events)) {
        setEvents(
          data.events.map((e: any) => ({
            ...e,
            timestamp: new Date(e.timestamp ?? Date.now()),
          }))
        );
      }
      if (Array.isArray(data.guardrails)) {
        setGuardrails(
          data.guardrails.map((g: any) => ({
            ...g,
            timestamp: new Date(g.timestamp ?? Date.now()),
          }))
        );
      }
    },
    []
  );

  useEffect(() => {
    if (threadId) {
      void hydrateState(threadId);
    }
  }, [threadId, hydrateState]);

  useEffect(() => {
    (async () => {
      const bootstrap = await fetchRagBootstrapState();
      if (!bootstrap) return;
      setInitialThreadId(bootstrap.thread_id || null);
      setThreadId(bootstrap.thread_id || null);
      if (bootstrap.current_agent) setCurrentAgent(bootstrap.current_agent);
      if (bootstrap.context) setContext(bootstrap.context);
      if (Array.isArray(bootstrap.events)) {
        setEvents(
          bootstrap.events.map((e: any) => ({
            ...e,
            timestamp: new Date(e.timestamp ?? Date.now()),
          }))
        );
      }
      if (Array.isArray(bootstrap.guardrails)) {
        setGuardrails(
          bootstrap.guardrails.map((g: any) => ({
            ...g,
            timestamp: new Date(g.timestamp ?? Date.now()),
          }))
        );
      }
    })();
  }, []);

  const handleThreadChange = useCallback((id: string | null) => {
    setThreadId(id);
  }, []);

  const handleResponseEnd = useCallback(() => {
    void hydrateState(threadId);
  }, [hydrateState, threadId]);

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] gap-2 bg-gray-100 -m-6 p-2">
      <AgentPanel
        agents={agents}
        currentAgent={currentAgent}
        events={events}
        guardrails={guardrails}
        context={context}
      />
      <RagChatKitPanel
        initialThreadId={initialThreadId}
        onThreadChange={handleThreadChange}
        onResponseEnd={handleResponseEnd}
      />
    </div>
  );
}