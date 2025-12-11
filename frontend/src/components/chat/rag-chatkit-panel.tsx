"use client";

import { ChatKit, useChatKit } from "@openai/chatkit-react";

type RagChatKitPanelProps = {
  initialThreadId?: string | null;
  onThreadChange?: (threadId: string | null) => void;
  onResponseEnd?: () => void;
};

const CHATKIT_DOMAIN_KEY =
  process.env.NEXT_PUBLIC_CHATKIT_DOMAIN_KEY ?? "domain_pk_localhost_dev";

export function RagChatKitPanel({
  initialThreadId,
  onThreadChange,
  onResponseEnd,
}: RagChatKitPanelProps) {
  const chatkit = useChatKit({
    api: {
      url: "/rag-chatkit",
      domainKey: CHATKIT_DOMAIN_KEY,
    },
    composer: {
      placeholder: "Message Alleato AI...",
    },
    // Enable history panel with ChatGPT-like styling
    history: {
      enabled: true,
      showDelete: true,
      showRename: true,
    },
    // Minimal header like ChatGPT
    header: {
      enabled: false,
    },
    theme: {
      colorScheme: "light",
      radius: "round",
      density: "spacious",
      color: {
        accent: {
          primary: "#10a37f",
          level: 1,
        },
      },
    },
    initialThread: initialThreadId ?? null,
    startScreen: {
      greeting: "",
      prompts: [
        {
          label: "📋 Create Budget Report",
          prompt: "I want you to create a detailed budget summary report for the current quarter, including variance analysis and forecasts.",
        },
        {
          label: "🔍 Analyze Project Delays",
          prompt: "Analyze patterns in project delays across all active construction projects and identify common bottlenecks.",
        },
        {
          label: "✅ Review RFI Status",
          prompt: "Show me all open RFIs across my projects, prioritized by age and criticality to project timeline.",
        },
        {
          label: "📊 Executive Summary",
          prompt: "Generate an executive dashboard summary showing key metrics across all projects including budget health, schedule status, and risk indicators.",
        },
      ],
    },
    // Enable feedback and retry
    threadItemActions: {
      feedback: true,
      retry: true,
    },
    // Event handlers
    onThreadChange: ({ threadId }) => onThreadChange?.(threadId ?? null),
    onResponseEnd: () => onResponseEnd?.(),
    onError: ({ error }) => {
      console.error("[ChatKit] Error:", error);
    },
  });

  return (
    <div
      className="flex flex-col h-full flex-1 w-full bg-white overflow-hidden"
      data-testid="rag-chatkit-panel"
    >
      <ChatKit
        control={chatkit.control}
        className="block h-full w-full"
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
