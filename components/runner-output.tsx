"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AgentEvent } from "@/lib/types";
import {
  ArrowRightLeft,
  Wrench,
  WrenchIcon,
  RefreshCw,
  MessageSquareMore,
  Search,
  FileText,
  Clock,
  Shield,
  ShieldCheck,
  ShieldX,
  Brain,
  Play,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react";
import { PanelSection } from "./panel-section";

interface RunnerOutputProps {
  runnerEvents: AgentEvent[];
}

function formatEventName(type: string) {
  return (type.charAt(0).toUpperCase() + type.slice(1)).replace("_", " ");
}

function EventIcon({ type }: { type: string }) {
  const className = "h-4 w-4 text-zinc-600";
  switch (type) {
    case "handoff":
      return <ArrowRightLeft className={className} />;
    case "tool_call":
      return <Wrench className={className} />;
    case "tool_output":
      return <WrenchIcon className={className} />;
    case "context_update":
      return <RefreshCw className={className} />;
    case "rag_query_start":
      return <Search className={className} />;
    case "rag_retrieval_complete":
      return <FileText className={className} />;
    case "guardrail_check":
      return <Shield className="h-4 w-4 text-blue-600" />;
    case "guardrail_passed":
      return <ShieldCheck className="h-4 w-4 text-green-600" />;
    case "guardrail_blocked":
      return <ShieldX className="h-4 w-4 text-red-600" />;
    case "classification_start":
    case "classification_result":
      return <Brain className="h-4 w-4 text-purple-600" />;
    case "agent_start":
      return <Play className="h-4 w-4 text-blue-600" />;
    case "agent_complete":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    case "message":
      return <User className="h-4 w-4 text-gray-600" />;
    default:
      return null;
  }
}

function EventDetails({ event }: { event: AgentEvent }) {
  let details = null;
  const className =
    "border border-gray-100 text-xs p-2.5 rounded-md flex flex-col gap-2";
  switch (event.type) {
    case "handoff":
      details = event.metadata && (
        <div className={className}>
          <div className="text-gray-600">
            <span className="text-zinc-600 font-medium">From:</span>{" "}
            {event.metadata.source_agent}
          </div>
          <div className="text-gray-600">
            <span className="text-zinc-600 font-medium">To:</span>{" "}
            {event.metadata.target_agent}
          </div>
        </div>
      );
      break;
    case "tool_call":
      details = event.metadata && event.metadata.tool_args && (
        <div className={className}>
          <div className="text-xs text-zinc-600 mb-1 font-medium">
            Arguments
          </div>
          <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
            {JSON.stringify(event.metadata.tool_args, null, 2)}
          </pre>
        </div>
      );
      break;
    case "tool_output":
      details = event.metadata && event.metadata.tool_result && (
        <div className={className}>
          <div className="text-xs text-zinc-600 mb-1 font-medium">Result</div>
          <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
            {JSON.stringify(event.metadata.tool_result, null, 2)}
          </pre>
        </div>
      );
      break;
    case "context_update":
      details = event.metadata?.changes && (
        <div className={className}>
          {Object.entries(event.metadata.changes).map(([key, value]) => (
            <div key={key} className="text-xs">
              <div className="text-gray-600">
                <span className="text-zinc-600 font-medium">{key}:</span>{" "}
                {value ?? "null"}
              </div>
            </div>
          ))}
        </div>
      );
      break;
    case "rag_query_start":
      details = event.metadata && (
        <div className={className}>
          <div className="text-gray-600">
            <span className="text-zinc-600 font-medium">Query:</span>{" "}
            {event.metadata.query || "N/A"}
          </div>
        </div>
      );
      break;
    case "rag_retrieval_complete":
      details = event.metadata && (
        <div className={className}>
          <div className="text-gray-600">
            <span className="text-zinc-600 font-medium">Chunks:</span>{" "}
            {event.metadata.chunks_retrieved || 0}
          </div>
          <div className="text-gray-600">
            <span className="text-zinc-600 font-medium">Avg Score:</span>{" "}
            {event.metadata.avg_relevance_score
              ? (event.metadata.avg_relevance_score * 100).toFixed(1) + "%"
              : "N/A"}
          </div>
          <div className="text-gray-600">
            <span className="text-zinc-600 font-medium">Time:</span>{" "}
            {event.metadata.search_time_seconds
              ? (event.metadata.search_time_seconds * 1000).toFixed(0) + "ms"
              : "N/A"}
          </div>
          {event.metadata.source_files && (
            <div className="text-gray-600">
              <span className="text-zinc-600 font-medium">Sources:</span>{" "}
              <div className="mt-1">
                {event.metadata.source_files.slice(0, 3).map((file: string, idx: number) => (
                  <div key={idx} className="text-xs truncate ml-2">
                    • {file}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
      break;
    case "classification_result":
      details = event.metadata && (
        <div className={className}>
          <div className="text-gray-600">
            <span className="text-zinc-600 font-medium">Classification:</span>{" "}
            <span className="font-semibold text-purple-700">{event.metadata.classification}</span>
          </div>
        </div>
      );
      break;
    case "agent_complete":
      details = event.metadata && (
        <div className={className}>
          <div className="text-gray-600">
            <span className="text-zinc-600 font-medium">Duration:</span>{" "}
            {event.metadata.duration_seconds?.toFixed(2)}s
          </div>
          <div className="text-gray-600">
            <span className="text-zinc-600 font-medium">Response Length:</span>{" "}
            {event.metadata.response_length} chars
          </div>
        </div>
      );
      break;
    case "error":
      details = event.metadata && (
        <div className={`${className} bg-red-50 border-red-200`}>
          <div className="text-red-700">
            <span className="font-medium">Error Type:</span>{" "}
            {event.metadata.error_type}
          </div>
          {event.metadata.traceback && (
            <pre className="text-xs text-red-600 bg-red-100 p-2 rounded overflow-x-auto mt-2 max-h-40 overflow-y-auto">
              {event.metadata.traceback}
            </pre>
          )}
        </div>
      );
      break;
    case "message":
      details = event.metadata && (
        <div className={className}>
          <div className="text-gray-600">
            <span className="text-zinc-600 font-medium">Type:</span>{" "}
            {event.metadata.message_type}
          </div>
        </div>
      );
      break;
    default:
      return null;
  }

  return (
    <div className="mt-1 text-sm">
      {event.content && (
        <div className="text-gray-700 font-mono mb-2">{event.content}</div>
      )}
      {details}
    </div>
  );
}

function TimeBadge({ timestamp }: { timestamp: Date }) {
  const date =
    timestamp && typeof (timestamp as any)?.toDate === "function"
      ? (timestamp as any).toDate()
      : timestamp;
  const formattedDate = new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return (
    <Badge
      variant="outline"
      className="text-[10px] h-5 bg-white text-zinc-500 border-gray-200"
    >
      {formattedDate}
    </Badge>
  );
}

export function RunnerOutput({ runnerEvents }: RunnerOutputProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <PanelSection title="Runner Output" icon={<MessageSquareMore className="h-4 w-4 text-blue-600" />}>
        <ScrollArea className="h-[calc(100%-2rem)] rounded-md border border-gray-200 bg-gray-100 shadow-sm">
        <div className="p-4 space-y-3">
          {runnerEvents.length === 0 ? (
            <p className="text-center text-zinc-500 p-4">
              No runner events yet
            </p>
          ) : (
            runnerEvents.map((event) => (
              <Card
                key={event.id}
                className="border border-gray-200 bg-white shadow-sm rounded-lg"
              >
                <CardHeader className="flex flex-row justify-between items-center p-4">
                  <span className="font-medium text-gray-800 text-sm">
                    {event.agent}
                  </span>
                  <TimeBadge timestamp={event.timestamp} />
                </CardHeader>

                <CardContent className="flex items-start gap-3 p-4">
                  <div className="rounded-full p-2 bg-gray-100 flex items-center gap-2">
                    <EventIcon type={event.type} />
                    <div className="text-xs text-gray-600">
                      {formatEventName(event.type)}
                    </div>
                  </div>

                  <div className="flex-1">
                    <EventDetails event={event} />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        </ScrollArea>
      </PanelSection>
    </div>
  );
}
