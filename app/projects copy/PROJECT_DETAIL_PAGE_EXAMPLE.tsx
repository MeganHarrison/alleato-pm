"use client";

/**
 * Example Project Detail Page Component
 *
 * This shows how to display risks, opportunities, and tasks for a specific project.
 * To use this:
 * 1. Rename this file to: ui/app/projects/[id]/page.tsx
 * 2. Ensure lib/projectIntelligence.ts exists (already created)
 * 3. The component will automatically fetch and display intelligence data
 */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getProjectIntelligence,
  type Risk,
  type Opportunity,
  type Task,
} from "@/lib/projectIntelligence";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = parseInt(params.id as string);

  const [risks, setRisks] = useState<Risk[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadIntelligence() {
      try {
        const data = await getProjectIntelligence(projectId);

        if (data.errors.risks || data.errors.opportunities || data.errors.tasks) {
          console.error("Intelligence fetch errors:", data.errors);
          setError("Failed to load some intelligence data");
        }

        setRisks(data.risks);
        setOpportunities(data.opportunities);
        setTasks(data.tasks);
      } catch (err) {
        console.error("Error loading intelligence:", err);
        setError("Failed to load project intelligence");
      } finally {
        setLoading(false);
      }
    }

    loadIntelligence();
  }, [projectId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
            <p className="mt-4 text-sm text-gray-600">Loading project intelligence...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/projects"
              className="text-sm text-violet-600 hover:text-violet-700 mb-2 inline-block"
            >
              ← Back to Projects
            </Link>
            <h1 className="text-2xl font-semibold text-zinc-900">
              Project {projectId}
            </h1>
            <p className="text-sm text-zinc-500">
              AI-extracted intelligence from meetings
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-2">
              <span className="text-red-600 font-semibold">{risks.length}</span>
              <span className="text-gray-600 ml-1">risks</span>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-2">
              <span className="text-green-600 font-semibold">{opportunities.length}</span>
              <span className="text-gray-600 ml-1">opportunities</span>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-2">
              <span className="text-blue-600 font-semibold">{tasks.length}</span>
              <span className="text-gray-600 ml-1">tasks</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
            {error}
          </div>
        )}

        {/* Risks Section */}
        <section className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-red-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-red-700 flex items-center gap-2">
              🚨 Risks
              <span className="text-sm font-normal text-red-600">
                ({risks.length} identified)
              </span>
            </h2>
          </div>
          <div className="p-6">
            {risks.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No risks identified yet. Intelligence will appear here as meetings are processed.
              </p>
            ) : (
              <div className="space-y-4">
                {risks.map((risk) => (
                  <div
                    key={risk.id}
                    className="border-l-4 border-red-500 bg-red-50/30 rounded-r-lg pl-4 pr-4 py-3 hover:bg-red-50/50 transition"
                  >
                    <p className="text-sm font-medium text-gray-900 leading-relaxed">
                      {risk.description}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                      {risk.category && (
                        <span className="text-gray-600">
                          <span className="font-medium">Category:</span> {risk.category}
                        </span>
                      )}
                      {risk.likelihood && (
                        <span className="text-gray-600">
                          <span className="font-medium">Likelihood:</span>{" "}
                          <span
                            className={
                              risk.likelihood === "high"
                                ? "text-red-700 font-medium"
                                : risk.likelihood === "medium"
                                ? "text-yellow-700 font-medium"
                                : "text-green-700"
                            }
                          >
                            {risk.likelihood}
                          </span>
                        </span>
                      )}
                      {risk.impact && (
                        <span className="text-gray-600">
                          <span className="font-medium">Impact:</span>{" "}
                          <span
                            className={
                              risk.impact === "high"
                                ? "text-red-700 font-medium"
                                : risk.impact === "medium"
                                ? "text-yellow-700 font-medium"
                                : "text-green-700"
                            }
                          >
                            {risk.impact}
                          </span>
                        </span>
                      )}
                      <span
                        className={`font-medium ${
                          risk.status === "open"
                            ? "text-red-700"
                            : risk.status === "mitigated"
                            ? "text-green-700"
                            : "text-gray-600"
                        }`}
                      >
                        Status: {risk.status}
                      </span>
                    </div>
                    {risk.mitigation_plan && (
                      <p className="text-xs text-gray-600 mt-2 bg-white/50 rounded px-2 py-1">
                        <span className="font-medium">Mitigation:</span> {risk.mitigation_plan}
                      </p>
                    )}
                    {risk.document_metadata && (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        From meeting: {risk.document_metadata.title}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Opportunities Section */}
        <section className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-green-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-green-700 flex items-center gap-2">
              💡 Opportunities
              <span className="text-sm font-normal text-green-600">
                ({opportunities.length} identified)
              </span>
            </h2>
          </div>
          <div className="p-6">
            {opportunities.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No opportunities identified yet. Intelligence will appear here as meetings are processed.
              </p>
            ) : (
              <div className="space-y-4">
                {opportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="border-l-4 border-green-500 bg-green-50/30 rounded-r-lg pl-4 pr-4 py-3 hover:bg-green-50/50 transition"
                  >
                    <p className="text-sm font-medium text-gray-900 leading-relaxed">
                      {opp.description}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                      {opp.type && (
                        <span className="text-gray-600">
                          <span className="font-medium">Type:</span> {opp.type}
                        </span>
                      )}
                      {opp.owner_name && (
                        <span className="text-gray-600">
                          <span className="font-medium">Owner:</span> {opp.owner_name}
                        </span>
                      )}
                      <span
                        className={`font-medium ${
                          opp.status === "open"
                            ? "text-green-700"
                            : opp.status === "approved"
                            ? "text-blue-700"
                            : "text-gray-600"
                        }`}
                      >
                        Status: {opp.status}
                      </span>
                    </div>
                    {opp.document_metadata && (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        From meeting: {opp.document_metadata.title}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Tasks Section */}
        <section className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-blue-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
              ✅ Tasks
              <span className="text-sm font-normal text-blue-600">
                ({tasks.length} tracked)
              </span>
            </h2>
          </div>
          <div className="p-6">
            {tasks.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No tasks assigned yet. Intelligence will appear here as meetings are processed.
              </p>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="border-l-4 border-blue-500 bg-blue-50/30 rounded-r-lg pl-4 pr-4 py-3 hover:bg-blue-50/50 transition"
                  >
                    <p className="text-sm font-medium text-gray-900 leading-relaxed">
                      {task.description}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                      <span className="text-gray-600">
                        <span className="font-medium">Assignee:</span>{" "}
                        {task.assignee_name || "Unassigned"}
                      </span>
                      {task.due_date && (
                        <span className="text-gray-600">
                          <span className="font-medium">Due:</span> {task.due_date}
                        </span>
                      )}
                      {task.priority && (
                        <span
                          className={
                            task.priority === "high" || task.priority === "urgent"
                              ? "text-red-700 font-medium"
                              : task.priority === "medium"
                              ? "text-yellow-700 font-medium"
                              : "text-gray-600"
                          }
                        >
                          <span className="font-medium">Priority:</span> {task.priority}
                        </span>
                      )}
                      <span
                        className={`font-medium ${
                          task.status === "open"
                            ? "text-blue-700"
                            : task.status === "in_progress"
                            ? "text-yellow-700"
                            : task.status === "done"
                            ? "text-green-700"
                            : "text-gray-600"
                        }`}
                      >
                        Status: {task.status}
                      </span>
                    </div>
                    {task.document_metadata && (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        From meeting: {task.document_metadata.title}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
