import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

import { createClient } from "@/lib/supabase/server";

const MAX_RETRIEVAL_RESULTS = 4;

type DocumentRow = {
  id: string;
  title?: string | null;
  summary?: string | null;
  overview?: string | null;
  description?: string | null;
  project?: string | null;
  source?: string | null;
  url?: string | null;
  date?: string | null;
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

async function searchDocuments(query: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("document_metadata")
    .select("id,title,summary,overview,description,project,date,source,url")
    .ilike("content", `%${query}%`)
    .order("date", { ascending: false })
    .limit(MAX_RETRIEVAL_RESULTS);

  if (error) {
    console.error("Supabase document search failed:", error);
    return { hits: [], error: error.message };
  }

  const hits = (data ?? []).map((row: DocumentRow) => ({
    id: row.id,
    title: row.title ?? "Untitled document",
    summary:
      row.summary ??
      row.overview ??
      row.description ??
      "No snippet available.",
    project: row.project ?? null,
    source: row.source ?? row.url ?? null,
    url: row.url ?? row.source ?? null,
    date: row.date ?? null,
  }));

  return { hits, error: null };
}

function formatRetrieverContext(hits: DocumentHit[]) {
  if (!hits.length) {
    return "";
  }

  return hits
    .map(
      (hit, index) =>
        `${index + 1}. ${hit.title} - ${hit.summary} ${
          hit.project ? `(Project: ${hit.project})` : ""
        }`
    )
    .join("\n");
}

function flattenAssistantOutput(output: unknown): string {
  if (output === null || output === undefined) {
    return "";
  }
  if (typeof output === "string") {
    return output;
  }
  if (Array.isArray(output)) {
    return output.map(flattenAssistantOutput).join("\n");
  }
  if (typeof output === "object") {
    const maybeText = (output as Record<string, unknown>).text;
    if (typeof maybeText === "string" && maybeText.trim()) {
      return maybeText;
    }
    const nested = (output as Record<string, unknown>).content;
    if (nested) {
      return flattenAssistantOutput(nested);
    }
  }
  return "";
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => ({}));
  const message = typeof payload?.message === "string" ? payload.message.trim() : "";
  if (!message) {
    return NextResponse.json(
      { error: "The request body must include a `message` string." },
      { status: 400 }
    );
  }

  const { hits, error: searchError } = await searchDocuments(message);
  const retrievals = formatRetrieverContext(hits);
  const agentId = process.env.OPENAI_AGENT_ID ?? null;
  const apiKey = process.env.OPENAI_API_KEY ?? null;

  if (!apiKey) {
    return NextResponse.json(
      {
        response:
          "Missing OPENAI_API_KEY. Configure the backend with a valid key to power the agent.",
        retrieved: hits,
      },
      { status: 500 }
    );
  }

  if (!agentId) {
    return NextResponse.json({
      response:
        "Set OPENAI_AGENT_ID in your environment so the agent can accept requests.",
      retrieved: hits,
    });
  }

  const client = new OpenAI({ apiKey });

  const context = retrievals
    ? `\n\nRetriever context:\n${retrievals}\nWrite concise answers referencing the documents when relevant.`
    : "";

  try {
    const agentResponse = await client.agents.messages.create({
      agentId,
      input: {
        role: "user",
        content: `${message}${context}`,
      },
    });

    const assistantText = (agentResponse.output ?? [])
      .map((item) => flattenAssistantOutput(item?.content))
      .filter(Boolean)
      .join("\n\n");

    return NextResponse.json({
      response: assistantText || "The agent responded with no text.",
      retrieved: hits,
      responseId: agentResponse.id ?? null,
      error: searchError,
    });
  } catch (err) {
    console.error("Agents API error:", err);
    const detail =
      err instanceof Error ? err.message : "Unable to reach the agent.";
    return NextResponse.json(
      {
        response:
          "The agent call failed. Check the server logs for the OpenAI error.",
        retrieved: hits,
        error: detail,
      },
      { status: 502 }
    );
  }
}
