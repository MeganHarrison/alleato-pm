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
      placeholder: "Ask about meetings, decisions, or projects...",
    },
    // Enable history panel
    history: {
      enabled: true,
      showDelete: true,
      showRename: true,
    },
    // Enable header
    header: {
      enabled: true,
      title: {
        enabled: true,
      },
    },
    theme: {
      colorScheme: "light",
      radius: "round",
      density: "normal",
      color: {
        accent: {
          primary: "#ea580c",
          level: 1,
        },
      },
    },
    initialThread: initialThreadId ?? null,
    startScreen: {
      greeting: "Hi! I'm Alleato's AI Chief of Staff. I can help you understand patterns across meetings, track decisions and risks, and provide strategic insights. What would you like to know?",
      prompts: [
        {
          label: "Recent decisions",
          prompt: "What were the key decisions from last week's meetings?",
        },
        {
          label: "Project risks",
          prompt: "Show me risks identified in ASRS projects",
        },
        {
          label: "Pending tasks",
          prompt: "What tasks are pending for our current projects?",
        },
        {
          label: "Pattern analysis",
          prompt: "What patterns do you see in our project delays?",
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
      className="flex flex-col h-full flex-1 bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden"
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
