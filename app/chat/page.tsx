"use client";

import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";

const STARTER_PROMPTS = [
  {
    label: "Summarize today's meetings",
    prompt: "Summarize the action items and highlights from today's meetings.",
  },
  {
    label: "Search documents",
    prompt: "Find references to the latest construction standards in our documents.",
  },
  {
    label: "Show next milestones",
    prompt: "What are the next project milestones and who owns them?",
  },
];

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type DocumentHit = {
  id: string;
  title: string;
  summary: string;
  project?: string | null;
  source?: string | null;
  url?: string | null;
  date?: string | null;
};

const INITIAL_ASSISTANT = `Hi there! Ask me about meetings, documents, or workflows and I'll surface the context and insights you need.`;

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "assistant-welcome", role: "assistant", text: INITIAL_ASSISTANT },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);
  const [retrievedDocs, setRetrievedDocs] = useState<DocumentHit[]>([]);
  const scrollTargetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollTargetRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  });

  const sendMessage = useCallback(
    async (messageText: string) => {
      const trimmed = messageText.trim();
      if (!trimmed || status === "loading") {
        return;
      }

      const nextMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        text: trimmed,
      };
      const nextMessages = [...messages, nextMessage];
      setMessages(nextMessages);
      setInputValue("");
      setStatus("loading");
      setError(null);

      try {
        // Use the simple RAG endpoint that doesn't require ChatKit streaming protocol
        console.log('[Chat Debug] Sending message to /rag-chat-simple:', trimmed);
        console.log('[Chat Debug] Message history length:', nextMessages.length);

        const response = await fetch("/api/rag-chat-simple", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            history: nextMessages.map((m) => ({ role: m.role, text: m.text })),
          }),
        });

        console.log('[Chat Debug] Response status:', response.status, response.statusText);
        console.log('[Chat Debug] Response headers:', Object.fromEntries(response.headers.entries()));

        const payload = await response.json().catch(() => null);
        console.log('[Chat Debug] Response payload:', payload);

        if (!response.ok) {
          const detail =
            payload?.error ||
            payload?.response ||
            "The assistant is temporarily unavailable. Please try again.";
          throw new Error(detail);
        }

        const assistantResponse =
          payload?.response?.trim() ?? "The assistant returned no content.";
        setMessages((current) => [
          ...current,
          { id: `assistant-${Date.now()}`, role: "assistant", text: assistantResponse },
        ]);
        setRetrievedDocs(payload?.retrieved ?? []);
        setError(payload?.error ?? null);
      } catch (err) {
        console.error('[Chat Debug] Error occurred:', err);
        const failureMessage =
          err instanceof Error ? err.message : "Something went wrong.";
        setError(failureMessage);
      } finally {
        console.log('[Chat Debug] Request completed, setting status to idle');
        setStatus("idle");
      }
    },
    [messages, status]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(inputValue);
  };

  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const renderMessageBubble = (message: Message) => {
    const isAssistant = message.role === "assistant";
    return (
      <div
        key={message.id}
        className={`rounded-2xl p-4 text-sm leading-relaxed ${
          isAssistant
            ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
            : "bg-slate-900 text-white dark:bg-slate-700 dark:text-white/90 self-end"
        }`}
      >
        {message.text}
      </div>
    );
  };

  return (
    <section className="flex min-h-screen w-full items-start justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6">
      <div className="w-full max-w-5xl space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Conversational AI
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Alleato chat assistant
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Send one-off questions to the agent backed by Agents SDK + RAG. The UI
            will show discovery hits and keep the conversation organized.
          </p>
        </header>

        {error && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm shadow-amber-900/10 dark:border-amber-500/40 dark:bg-amber-900/10 dark:text-amber-100">
            {error}
          </div>
        )}

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg shadow-black/5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-[480px] flex-col gap-4 overflow-hidden">
            <div className="flex-1 space-y-3 overflow-y-auto py-2">
              {messages.map((message) => renderMessageBubble(message))}
              {status === "loading" && (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Assistant is thinking...
                </div>
              )}
              <div ref={scrollTargetRef} />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="chat-input" className="sr-only">
            Send a message to the agent
          </label>
          <textarea
            id="chat-input"
            name="chat-input"
            aria-label="Chat input"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            rows={3}
            placeholder="Ask the Alleato agent anything…"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
          />
          <div className="flex items-center justify-between gap-3">
            <button
              type="submit"
              disabled={status === "loading" || !inputValue.trim()}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {status === "loading" ? "Sending…" : "Send message"}
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Agent powered by `client.agents.messages.create()`
            </span>
          </div>
        </form>

        <div className="flex flex-wrap gap-2">
          {STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt.label}
              type="button"
              onClick={() => handlePromptClick(prompt.prompt)}
              className="rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 transition hover:border-slate-400 hover:text-slate-700 dark:border-slate-800 dark:text-slate-300"
            >
              {prompt.label}
            </button>
          ))}
        </div>

        {retrievedDocs.length > 0 && (
          <section className="space-y-2 rounded-2xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Retrieved documents
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {retrievedDocs.map((doc) => (
                <article
                  key={doc.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-950"
                >
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {doc.title}
                  </p>
                  {doc.summary && (
                    <p className="mt-2 text-slate-600 dark:text-slate-300">
                      {doc.summary}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                    {doc.project && <span>Project: {doc.project}</span>}
                    {doc.date && (
                      <span>
                        Date:{" "}
                        {Number.isNaN(Date.parse(doc.date))
                          ? doc.date
                          : new Date(doc.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex text-xs font-semibold text-slate-700 underline underline-offset-2 dark:text-slate-200"
                    >
                      Open source document
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
