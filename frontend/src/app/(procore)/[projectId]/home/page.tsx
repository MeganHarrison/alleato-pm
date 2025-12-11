'use client';

import * as React from 'react';
import { use } from 'react';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { AppShell } from '@/components/layout';
import {
  ProjectTeam,
  ProjectOverview,
  MyOpenItems,
  SidebarProjectAddress,
} from '@/components/project-home';
import {
  mockProjectTeam,
  mockProjectOverview,
  mockMyOpenItems,
} from '@/data/mock-project-home-data';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectInfo } from '@/types/project-home';

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectHomePage({ params }: PageProps) {
  const { projectId } = use(params);
  const [projectInfo, setProjectInfo] = React.useState<ProjectInfo | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProject = async () => {
      try {
        // Fetch project from API
        const response = await fetch(`/api/projects/${projectId}`);
        const p = await response.json();

        if (!response.ok || p.error) {
          throw new Error(p.error || 'Project not found');
        }

        // Transform API data to match ProjectInfo type
        const projectInfo: ProjectInfo = {
          id: p.id.toString(),
          name: p.name || 'Untitled Project',
          projectNumber: p['job number'] || p.id.toString(),
          address: p.address || '',
          city: p.address ? p.address.split(',')[0] || '' : '',
          state: p.state || '',
          zip: '',
          phone: '',
          status: p.archived ? 'Inactive' : 'Active',
          stage: p.phase || 'Unknown',
          projectType: p.category || 'General',
        };

        setProjectInfo(projectInfo);

        // Update document title
        document.title = `${projectInfo.projectNumber} - ${projectInfo.name} | Alleato OS`;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (isLoading) {
    return (
      <AppShell
        companyName="Alleato Group"
        projectName="Loading..."
        currentTool="Home"
        userInitials="BC"
      >
        <div className="flex flex-col min-h-[calc(100vh-48px)] bg-gray-50 p-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-48 w-full" />
        </div>
      </AppShell>
    );
  }

  if (error || !projectInfo) {
    return (
      <AppShell
        companyName="Alleato Group"
        projectName="Error"
        currentTool="Home"
        userInitials="BC"
      >
        <div className="flex flex-col min-h-[calc(100vh-48px)] bg-gray-50 items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
            <p className="text-gray-600">{error || 'The requested project could not be found.'}</p>
            <Link
              href="/company/home"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      companyName="Alleato Group"
      projectName={`${projectInfo.projectNumber} - ${projectInfo.name}`}
      currentTool="Home"
      userInitials="BC"
    >
      <div className="flex flex-col min-h-[calc(100vh-48px)] bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-900">
                {projectInfo.projectNumber} - {projectInfo.name}
              </h1>
              <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700">
                Synced
              </span>
            </div>
            <Link
              href={`/${projectId}/home/configure`}
              className="text-gray-500 hover:text-orange-600 p-2 rounded-md hover:bg-gray-100"
              title="Configure Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Main Panel */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Project Team */}
            <ProjectTeam team={mockProjectTeam} projectId={projectId} />

            {/* Project Overview */}
            <ProjectOverview items={mockProjectOverview} projectId={projectId} />

            {/* My Open Items */}
            <MyOpenItems items={mockMyOpenItems} projectId={projectId} />

            {/* Collapsible Sections */}
            <CollapsibleSection title="Recently Changed Items">
              <p className="text-sm text-gray-500 py-4 text-center">
                No recently changed items
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Today's Schedule">
              <p className="text-sm text-gray-500 py-4 text-center">
                No scheduled items for today
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Project Milestones">
              <p className="text-sm text-gray-500 py-4 text-center">
                No milestones configured
              </p>
            </CollapsibleSection>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-gray-200 bg-gray-50 p-4 space-y-4">
            <SidebarProjectAddress
              address={projectInfo.address}
              city={projectInfo.city}
              state={projectInfo.state}
              zip={projectInfo.zip}
            />

            <CollapsibleSidebarSection title="Project Weather" defaultOpen>
              <p className="text-sm text-gray-500 text-center py-2">
                Weather data unavailable
              </p>
              <Link
                href={`/${projectId}/weather`}
                className="text-sm text-blue-600 hover:underline block text-center"
              >
                Click for forecast
              </Link>
            </CollapsibleSidebarSection>

            <div className="bg-white rounded-md border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">Project Links</h3>
                <button className="text-sm text-blue-600 hover:underline">
                  + New
                </button>
              </div>
              <p className="text-sm text-gray-500">No links to display.</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// Collapsible Section Component
function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="bg-white rounded-md border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center gap-2 text-left hover:bg-gray-50"
      >
        <span
          className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}
        >
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      </button>
      {isOpen && <div className="px-6 pb-4">{children}</div>}
    </div>
  );
}

// Collapsible Sidebar Section
function CollapsibleSidebarSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="bg-white rounded-md border border-gray-200 p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 text-left"
      >
        <span
          className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}
        >
          <svg
            className="w-3 h-3 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
}
