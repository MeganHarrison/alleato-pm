import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { InfoIcon, FileText, ListChecks, Rocket, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

async function UserDetails() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
      {JSON.stringify(data.claims, null, 2)}
    </pre>
  );
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <h1 className="font-bold text-3xl mb-4">Alleato OS Dashboard</h1>
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          Welcome to Alleato OS - Your modern construction management platform
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/protected/planning/rebuild-plan" className="hover:no-underline">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Rocket className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>Procore Rebuild Plan</CardTitle>
                  <CardDescription>
                    Track the progress of building our Procore alternative
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Phase 1: Documentation</span>
                  <span className="font-semibold text-yellow-600">70% Complete</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Overall Progress</span>
                  <span className="font-semibold">4 Phases</span>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Mission: Build a modern alternative that captures 80% of Procore&apos;s value at 10% of the cost
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/protected/planning/task-list" className="hover:no-underline">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <ListChecks className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>Task List</CardTitle>
                  <CardDescription>
                    Comprehensive task tracking for all project phases
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Total Tasks</span>
                  <span className="font-semibold">100+ items</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Active Phase</span>
                  <span className="font-semibold text-green-600">Phase 1 & 2</span>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  From strategy & scope definition to full implementation and deployment
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">V1</p>
              <p className="text-sm text-muted-foreground">Target Release</p>
            </div>
            <div className="text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">7</p>
              <p className="text-sm text-muted-foreground">Core Modules</p>
            </div>
            <div className="text-center">
              <ListChecks className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <p className="text-2xl font-bold">10</p>
              <p className="text-sm text-muted-foreground">Phases Planned</p>
            </div>
            <div className="text-center">
              <Rocket className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold">80/10</p>
              <p className="text-sm text-muted-foreground">Value/Cost Ratio</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">User Session</h2>
        <Suspense fallback={<p>Loading user details...</p>}>
          <UserDetails />
        </Suspense>
      </div>
    </div>
  );
}
