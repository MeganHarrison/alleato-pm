
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const taskPhases = [
  {
    id: "phase-0",
    title: "Phase 0: Strategy & Scope",
    description: "Define What You're Building",
    tasks: [
      { id: "0.1.1", text: "List all Procore modules currently enabled", completed: false },
      { id: "0.1.2", text: "Categorize into: Daily critical, Nice-to-have, Unnecessary", completed: false },
      { id: "0.1.3", text: "Finalize V1 scope (RFIs, COs, Meetings, Budget, Directory, Field Logs, Project Home)", completed: false },
      { id: "0.2.1", text: "Explicitly list everything not included in V1", completed: false },
      { id: "0.2.2", text: "Freeze scope to avoid creeping complexity", completed: false },
      { id: "0.3.1", text: "Document Procore login credentials and project access", completed: true },
      { id: "0.3.2", text: "Map current Procore project structure", completed: false }
    ]
  },
  {
    id: "phase-1",
    title: "Phase 1: System Deconstruction",
    description: "Screens + DOM Capture",
    tasks: [
      { id: "1.1.1", text: "Install Playwright + dependencies", completed: true },
      { id: "1.1.2", text: "Configure persistent login", completed: true },
      { id: "1.1.3", text: "Run deep crawler across 1-2 representative projects", completed: true },
      { id: "1.1.4", text: "Capture: screenshots, DOM, modal content, list/table views, tool navigation", completed: true },
      { id: "1.2.1", text: "Structure results by module in /procore-crawl/*", completed: true },
      { id: "1.2.2", text: "Extract unique screens per module", completed: true },
      { id: "1.3.1", text: "Upload all screenshots to Figma", completed: false },
      { id: "1.3.2", text: "Organize frames by module and view state", completed: true },
      { id: "1.4.1", text: "Create automated screenshot capture scripts", completed: true },
      { id: "1.4.2", text: "Set up Supabase integration for capture tracking", completed: true },
      { id: "1.4.3", text: "Organize captures into /figma-ready/ directory", completed: true }
    ]
  },
  {
    id: "phase-2",
    title: "Phase 2: Spec Development",
    description: "What the System MUST Do",
    tasks: [
      { id: "2.1.1", text: "Identify all fields (from DOM)", completed: false },
      { id: "2.1.2", text: "Identify all workflows", completed: false },
      { id: "2.1.3", text: "Identify all lifecycle states (statuses)", completed: false },
      { id: "2.1.4", text: "Identify required vs optional fields", completed: false },
      { id: "2.1.5", text: "Identify notifications / approvals", completed: false },
      { id: "2.1.6", text: "Identify cross-module dependencies", completed: false },
      { id: "2.2.1", text: "Feed each DOM + screenshot into AI", completed: false },
      { id: "2.2.2", text: "Extract: Entities, Attributes, Relationships, User actions, Permissions, Status transitions, Validation logic", completed: false },
      { id: "2.3.1", text: "Prepare V1 spec document for all modules", completed: false }
    ]
  },
  {
    id: "phase-3",
    title: "Phase 3: Architecture",
    description: "Technical Plan",
    tasks: [
      { id: "3.1.1", text: "Select tech stack: Next.js 15 + App Router", completed: true },
      { id: "3.1.2", text: "ShadCN UI + Tailwind", completed: true },
      { id: "3.1.3", text: "Supabase (DB, Auth, Storage, RLS)", completed: true },
      { id: "3.1.4", text: "Cloudflare R2 (optional for heavy files)", completed: false },
      { id: "3.1.5", text: "OpenAI for AI automation", completed: true },
      { id: "3.1.6", text: "Supabase MCP server", completed: false },
      { id: "3.2.1", text: "Create ERD (Database Schema)", completed: true },
      { id: "3.3.1", text: "Define roles (PM, Super, Sub, Owner Rep, Internal Admin)", completed: true },
      { id: "3.3.2", text: "Setup RLS on all key tables", completed: true },
      { id: "3.3.3", text: "Define project-level access", completed: true },
      { id: "3.4.1", text: "Configure environment variables and secrets", completed: true },
      { id: "3.4.2", text: "Set up financial module database tables", completed: true },
      { id: "3.4.3", text: "Implement authentication UI components", completed: true }
    ]
  },
  {
    id: "phase-4",
    title: "Phase 4: UX/UI Design",
    description: "Modern Replacement",
    tasks: [
      { id: "4.1.1", text: "Create design system in Figma", completed: false },
      { id: "4.1.2", text: "Layout grid", completed: false },
      { id: "4.1.3", text: "Typography scale", completed: false },
      { id: "4.1.4", text: "Components: Tables, Buttons, Inputs, Status chips, Tabs, Drawer/modal, Cards", completed: true },
      { id: "4.2.1", text: "Project shell (sidebar, header, context bar)", completed: false },
      { id: "4.2.2", text: "List + detail pattern", completed: false },
      { id: "4.2.3", text: "Form layouts", completed: false },
      { id: "4.2.4", text: "Dashboard template", completed: false },
      { id: "4.3.1", text: "Module designs for all V1 modules", completed: false }
    ]
  },
  {
    id: "phase-5",
    title: "Phase 5: Vertical Slice Development",
    description: "Shipping Real Usable Features",
    tasks: [
      { id: "5.1.1", text: "Slice 1: Project Shell - Supabase auth", completed: true },
      { id: "5.1.2", text: "Slice 1: Project listing", completed: false },
      { id: "5.1.3", text: "Slice 1: Project dashboard", completed: false },
      { id: "5.1.4", text: "Slice 1: Directory management", completed: false },
      { id: "5.1.5", text: "Slice 1: Permission enforcement", completed: false },
      { id: "5.2.1", text: "Slice 2: RFIs - List view", completed: false },
      { id: "5.2.2", text: "Slice 2: Create/edit RFI", completed: false },
      { id: "5.2.3", text: "Slice 2: AI features", completed: false },
      { id: "5.3.1", text: "Slice 3: Change Orders", completed: false },
      { id: "5.4.1", text: "Slice 4: Meetings + Action Items", completed: false },
      { id: "5.5.1", text: "Slice 5: Budget Summary", completed: false },
      { id: "5.6.1", text: "Slice 6: Field Logs", completed: false },
      { id: "5.7.1", text: "Implement Commitments module UI", completed: false },
      { id: "5.7.2", text: "Implement Change Orders module UI", completed: false },
      { id: "5.7.3", text: "Implement Invoicing module UI", completed: false },
      { id: "5.7.4", text: "Implement Prime Contracts module UI", completed: false },
      { id: "5.7.5", text: "Connect financial modules to database", completed: false },
      { id: "5.7.6", text: "Add data validation and business logic", completed: false },
      { id: "5.7.7", text: "Implement real-time updates with Supabase", completed: false }
    ]
  },
  {
    id: "phase-6",
    title: "Phase 6: Parallel Testing",
    description: "Internal Rollout",
    tasks: [
      { id: "6.1.1", text: "Select one pilot project", completed: false },
      { id: "6.1.2", text: "Mirror key items from Procore into Alleato OS", completed: false },
      { id: "6.2.1", text: "Run both systems in parallel", completed: false },
      { id: "6.3.1", text: "Gather feedback", completed: false }
    ]
  },
  {
    id: "phase-6a",
    title: "Phase 6a: Data Migration & Import",
    description: "Transfer Data from Procore",
    tasks: [
      { id: "6a.1.1", text: "Create Procore data export tools", completed: false },
      { id: "6a.1.2", text: "Build data transformation scripts", completed: false },
      { id: "6a.1.3", text: "Implement bulk import functionality", completed: false },
      { id: "6a.1.4", text: "Validate imported data integrity", completed: false },
      { id: "6a.1.5", text: "Create rollback procedures", completed: false }
    ]
  },
  {
    id: "phase-7",
    title: "Phase 7-10: Expansion & AI",
    description: "Replace Procore Module-by-Module",
    tasks: [
      { id: "7.1.1", text: "Decommission RFIs in Procore", completed: false },
      { id: "7.2.1", text: "Decommission COs in Procore", completed: false },
      { id: "7.3.1", text: "Decommission Meetings", completed: false },
      { id: "7.4.1", text: "Expand to next project(s)", completed: false },
      { id: "8.1.1", text: "Add advanced permission controls", completed: false },
      { id: "8.2.1", text: "Audit logs", completed: false },
      { id: "8.3.1", text: "Integrations", completed: false },
      { id: "8.4.1", text: "Reporting layer", completed: false },
      { id: "9.1.1", text: "AI Superpowers implementation", completed: false },
      { id: "10.1.1", text: "Official sunset of Procore", completed: false }
    ]
  }
];

export default function Home() {
  const totalTasks = taskPhases.reduce((sum, phase) => sum + phase.tasks.length, 0);
  const completedTasks = taskPhases.reduce(
    (sum, phase) => sum + phase.tasks.filter(task => task.completed).length,
    0
  );
  const progress = Math.round((completedTasks / totalTasks) * 100);

  return (
    <main className="min-h-screen flex flex-col items-center">
        <div className="flex-1 flex flex-col gap-8 w-full max-w-7xl px-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Alleato OS - Task List</h1>
            <p className="text-muted-foreground">
              Comprehensive task tracking for the Procore replacement project
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Overall Progress</h3>
            <div className="text-muted-foreground mb-4">
              {completedTasks} of {totalTasks} tasks completed
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="space-y-8 pb-20">
            {taskPhases.map((phase) => {
              const phaseCompleted = phase.tasks.filter(t => t.completed).length;
              const phaseProgress = Math.round((phaseCompleted / phase.tasks.length) * 100);

              return (
                <div key={phase.id} className="border-t pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">{phase.title}</h2>
                      <p className="text-muted-foreground">{phase.description}</p>
                    </div>
                    <Badge variant={phaseProgress === 100 ? "default" : phaseProgress > 0 ? "secondary" : "outline"}>
                      {phaseCompleted}/{phase.tasks.length} tasks
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          phaseProgress === 100 ? 'bg-green-600' : 
                          phaseProgress > 0 ? 'bg-blue-600' : 'bg-gray-400'
                        }`}
                        style={{ width: `${phaseProgress}%` }}
                      ></div>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      {phase.tasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-3 py-1">
                          <Checkbox 
                            checked={task.completed} 
                            disabled 
                            className="mt-0.5"
                          />
                          <label 
                            className={`text-sm flex-1 ${
                              task.completed ? 'line-through text-muted-foreground' : ''
                            }`}
                          >
                            {task.text}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
    </main>
  );
}