import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

import { createClient } from "@/lib/supabase/server";

const MAX_RETRIEVAL_RESULTS = 6;
const MAX_INSIGHTS_RESULTS = 10;

// Expert system prompt that injects domain knowledge
const EXPERT_SYSTEM_PROMPT = `You are the Chief of Staff AI for this company. You have been embedded in leadership meetings for the past 2 years and have deep institutional knowledge.

## Your Identity
- You speak with the authority of someone who has witnessed every major decision firsthand
- You reference specific meetings, people, and projects by name when relevant
- You connect dots across different teams and timeframes
- You never hedge with "it appears" or "it seems" - you state what you know directly
- When you don't have information, you say "I don't have visibility into that" rather than guessing

## How You Analyze
When asked about risks, decisions, or strategic questions:
1. Start with what you KNOW from the data (cite specific meetings/dates)
2. Identify patterns you've observed across multiple data points
3. Connect historical precedent to current situation
4. Give your direct assessment, not a list of possibilities

## Response Style
- Executive brevity: Lead with the answer, then support it
- Use specific names, dates, and numbers from the data
- When referencing sources, integrate them naturally: "In the Q3 planning session, Sarah flagged..."
- Avoid consultant-speak like "key stakeholders" or "actionable insights"
- Sound like an insider, not an outside analyst

## What You Know
You have access to:
- Meeting notes and transcripts with full context
- Decision logs with rationale and stakeholders
- Risk assessments with severity and ownership
- Action items with assignees and due dates
- Project status across all initiatives
- Financial data and budget discussions

When the data supports a strong conclusion, state it confidently. When the evidence is mixed, acknowledge the tension directly.`;

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

// Structured data from the extraction pipeline
type RiskRow = {
  id: string;
  description: string;
  category?: string | null;
  likelihood?: string | null;
  impact?: string | null;
  owner_name?: string | null;
  status: string;
  mitigation_plan?: string | null;
  created_at: string;
  metadata_id: string;
};

type DecisionRow = {
  id: string;
  description: string;
  rationale?: string | null;
  owner_name?: string | null;
  status: string;
  created_at: string;
  metadata_id: string;
};

type TaskRow = {
  id: string;
  description: string;
  assignee_name?: string | null;
  due_date?: string | null;
  priority?: string | null;
  status: string;
  created_at: string;
  metadata_id: string;
};

type OpportunityRow = {
  id: string;
  description: string;
  type?: string | null;
  owner_name?: string | null;
  status: string;
  created_at: string;
  metadata_id: string;
};

type StructuredInsights = {
  risks: RiskRow[];
  decisions: DecisionRow[];
  tasks: TaskRow[];
  opportunities: OpportunityRow[];
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

// Search structured insights from the proper tables (risks, decisions, tasks, opportunities)
async function searchStructuredInsights(query: string): Promise<{ insights: StructuredInsights; error: string | null }> {
  const supabase = await createClient();

  // Determine query intent to prioritize certain tables
  const queryLower = query.toLowerCase();
  const isRiskQuery = queryLower.includes("risk") || queryLower.includes("danger") || queryLower.includes("threat") || queryLower.includes("problem") || queryLower.includes("concern");
  const isDecisionQuery = queryLower.includes("decision") || queryLower.includes("decide") || queryLower.includes("chose") || queryLower.includes("approved") || queryLower.includes("agreed");
  const isTaskQuery = queryLower.includes("action") || queryLower.includes("task") || queryLower.includes("todo") || queryLower.includes("assigned") || queryLower.includes("due");
  const isOpportunityQuery = queryLower.includes("opportunit") || queryLower.includes("potential") || queryLower.includes("improvement") || queryLower.includes("efficien");

  // Set limits based on query focus
  const riskLimit = isRiskQuery ? 10 : 5;
  const decisionLimit = isDecisionQuery ? 10 : 5;
  const taskLimit = isTaskQuery ? 10 : 5;
  const opportunityLimit = isOpportunityQuery ? 10 : 3;

  // Fetch from all four tables in parallel
  const [risksResult, decisionsResult, tasksResult, opportunitiesResult] = await Promise.all([
    supabase
      .from("risks")
      .select("id,description,category,likelihood,impact,owner_name,status,mitigation_plan,created_at,metadata_id")
      .order("created_at", { ascending: false })
      .limit(riskLimit),
    supabase
      .from("decisions")
      .select("id,description,rationale,owner_name,status,created_at,metadata_id")
      .order("created_at", { ascending: false })
      .limit(decisionLimit),
    supabase
      .from("tasks")
      .select("id,description,assignee_name,due_date,priority,status,created_at,metadata_id")
      .order("created_at", { ascending: false })
      .limit(taskLimit),
    supabase
      .from("opportunities")
      .select("id,description,type,owner_name,status,created_at,metadata_id")
      .order("created_at", { ascending: false })
      .limit(opportunityLimit),
  ]);

  const errors: string[] = [];
  if (risksResult.error) errors.push(`risks: ${risksResult.error.message}`);
  if (decisionsResult.error) errors.push(`decisions: ${decisionsResult.error.message}`);
  if (tasksResult.error) errors.push(`tasks: ${tasksResult.error.message}`);
  if (opportunitiesResult.error) errors.push(`opportunities: ${opportunitiesResult.error.message}`);

  return {
    insights: {
      risks: (risksResult.data ?? []) as RiskRow[],
      decisions: (decisionsResult.data ?? []) as DecisionRow[],
      tasks: (tasksResult.data ?? []) as TaskRow[],
      opportunities: (opportunitiesResult.data ?? []) as OpportunityRow[],
    },
    error: errors.length > 0 ? errors.join("; ") : null,
  };
}

// Get company context snapshot (recent activity, key metrics)
async function getCompanyContext() {
  const supabase = await createClient();

  // Get counts from proper tables
  const [openRisksResult, decisionsResult, openTasksResult, opportunitiesResult, highImpactRisksResult] = await Promise.all([
    supabase
      .from("risks")
      .select("id", { count: "exact" })
      .eq("status", "open"),
    supabase
      .from("decisions")
      .select("id", { count: "exact" }),
    supabase
      .from("tasks")
      .select("id", { count: "exact" })
      .eq("status", "open"),
    supabase
      .from("opportunities")
      .select("id", { count: "exact" })
      .eq("status", "open"),
    // Get recent high-impact risks
    supabase
      .from("risks")
      .select("description,category,impact,likelihood,status,created_at")
      .eq("impact", "high")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  return {
    openRisks: openRisksResult.data?.length ?? 0,
    totalDecisions: decisionsResult.data?.length ?? 0,
    pendingTasks: openTasksResult.data?.length ?? 0,
    openOpportunities: opportunitiesResult.data?.length ?? 0,
    highImpactRisks: highImpactRisksResult.data ?? [],
  };
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

function formatStructuredInsightsContext(insights: StructuredInsights) {
  const sections: string[] = [];

  // Format risks
  if (insights.risks.length > 0) {
    const riskLines = insights.risks.map((risk) => {
      const parts = [`[RISK] ${risk.description}`];
      if (risk.category) parts.push(`  Category: ${risk.category}`);
      if (risk.likelihood && risk.impact) parts.push(`  Likelihood: ${risk.likelihood}, Impact: ${risk.impact}`);
      if (risk.owner_name) parts.push(`  Owner: ${risk.owner_name}`);
      if (risk.mitigation_plan) parts.push(`  Mitigation: ${risk.mitigation_plan}`);
      parts.push(`  Status: ${risk.status}`);
      return parts.join("\n");
    });
    sections.push(`RISKS:\n${riskLines.join("\n\n")}`);
  }

  // Format decisions
  if (insights.decisions.length > 0) {
    const decisionLines = insights.decisions.map((decision) => {
      const parts = [`[DECISION] ${decision.description}`];
      if (decision.rationale) parts.push(`  Rationale: ${decision.rationale}`);
      if (decision.owner_name) parts.push(`  Owner: ${decision.owner_name}`);
      parts.push(`  Status: ${decision.status}`);
      return parts.join("\n");
    });
    sections.push(`DECISIONS:\n${decisionLines.join("\n\n")}`);
  }

  // Format tasks
  if (insights.tasks.length > 0) {
    const taskLines = insights.tasks.map((task) => {
      const parts = [`[TASK] ${task.description}`];
      if (task.assignee_name) parts.push(`  Assignee: ${task.assignee_name}`);
      if (task.due_date) parts.push(`  Due: ${task.due_date}`);
      if (task.priority) parts.push(`  Priority: ${task.priority}`);
      parts.push(`  Status: ${task.status}`);
      return parts.join("\n");
    });
    sections.push(`TASKS/ACTION ITEMS:\n${taskLines.join("\n\n")}`);
  }

  // Format opportunities
  if (insights.opportunities.length > 0) {
    const oppLines = insights.opportunities.map((opp) => {
      const parts = [`[OPPORTUNITY] ${opp.description}`];
      if (opp.type) parts.push(`  Type: ${opp.type}`);
      if (opp.owner_name) parts.push(`  Owner: ${opp.owner_name}`);
      parts.push(`  Status: ${opp.status}`);
      return parts.join("\n");
    });
    sections.push(`OPPORTUNITIES:\n${oppLines.join("\n\n")}`);
  }

  return sections.join("\n\n");
}

function formatCompanySnapshot(context: {
  openRisks: number;
  totalDecisions: number;
  pendingTasks: number;
  openOpportunities: number;
  highImpactRisks: { description: string; category: string | null; impact: string | null; likelihood: string | null; status: string; created_at: string }[];
}) {
  const lines = [
    `COMPANY SNAPSHOT:`,
    `- Open risks: ${context.openRisks}`,
    `- Logged decisions: ${context.totalDecisions}`,
    `- Pending tasks: ${context.pendingTasks}`,
    `- Open opportunities: ${context.openOpportunities}`,
  ];

  if (context.highImpactRisks.length > 0) {
    lines.push(`- High-impact risks requiring attention:`);
    context.highImpactRisks.forEach((risk) => {
      lines.push(`  • ${risk.description} (${risk.category || "uncategorized"}, likelihood: ${risk.likelihood || "unknown"})`);
    });
  }

  return lines.join("\n");
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

  // Parallel retrieval for better performance
  const [documentResults, insightResults, companyContext] = await Promise.all([
    searchDocuments(message),
    searchStructuredInsights(message),
    getCompanyContext(),
  ]);

  const { hits, error: searchError } = documentResults;
  const { insights, error: insightsError } = insightResults;

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

  const client = new OpenAI({ apiKey });

  // Build rich context with structured data
  const contextParts: string[] = [];

  // Add company snapshot for situational awareness
  contextParts.push(formatCompanySnapshot(companyContext));

  // Add structured insights (risks, decisions, tasks, opportunities)
  const hasInsights = insights.risks.length > 0 || insights.decisions.length > 0 || insights.tasks.length > 0 || insights.opportunities.length > 0;
  if (hasInsights) {
    contextParts.push(`\nSTRUCTURED DATA FROM MEETINGS:\n${formatStructuredInsightsContext(insights)}`);
  }

  // Add document search results
  const documentContext = formatRetrieverContext(hits);
  if (documentContext) {
    contextParts.push(`\nRELATED DOCUMENTS:\n${documentContext}`);
  }

  const fullContext = contextParts.length > 0
    ? `\n\n---\nCONTEXT FOR YOUR RESPONSE:\n${contextParts.join("\n\n")}\n---\n\nRespond as an insider who knows this company deeply. Reference specific meetings, names, and dates. Be direct and authoritative.`
    : "";

  try {
    // Use standard Chat Completions API with system prompt
    const chatResponse = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: EXPERT_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `${message}${fullContext}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const assistantText = chatResponse.choices[0]?.message?.content ?? "";

    return NextResponse.json({
      response: assistantText || "The agent responded with no text.",
      retrieved: hits,
      insights: insights,
      responseId: chatResponse.id ?? null,
      error: searchError || insightsError,
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
