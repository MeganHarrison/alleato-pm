'use client';

import * as React from 'react';
import { use } from 'react';
import { Settings, Calendar, Clock, Users, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { AppShell } from '@/components/layout';
import {
  ProjectTeam,
  ProjectOverview,
  MyOpenItems,
  SidebarProjectAddress,
  ProgressReports,
  RecentPhotos,
} from '@/components/project-home';
import {
  projectTeam,
  projectOverview,
  myOpenItems,
} from '@/config/project-home';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectInfo } from '@/types/project-home';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface PageProps {
  params: Promise<{ projectId: string }>;
}

interface Meeting {
  id: string;
  title: string | null;
  date: string | null;
  duration_minutes: number | null;
  participants: string | null;
  summary: string | null;
  status: string | null;
  category: string | null;
  fireflies_link: string | null;
  url: string | null;
}

export default function ProjectHomePage({ params }: PageProps) {
  const { projectId } = use(params);
  const [projectInfo, setProjectInfo] = React.useState<ProjectInfo | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [meetings, setMeetings] = React.useState<Meeting[]>([]);
  const [meetingsLoading, setMeetingsLoading] = React.useState(true);

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

  // Fetch meetings for this project
  React.useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setMeetingsLoading(true);
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('document_metadata')
          .select('*')
          .eq('type', 'meeting')
          .eq('project_id', parseInt(projectId))
          .order('date', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching meetings:', error);
        } else {
          setMeetings(data || []);
        }
      } catch (err) {
        console.error('Error fetching meetings:', err);
      } finally {
        setMeetingsLoading(false);
      }
    };

    fetchMeetings();
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
            <ProjectTeam team={projectTeam} projectId={projectId} />

            {/* Project Overview */}
            <ProjectOverview items={projectOverview} projectId={projectId} />

            {/* My Open Items */}
            <MyOpenItems items={myOpenItems} projectId={projectId} />

            {/* Progress Reports */}
            <CollapsibleSection title="Progress Reports" defaultOpen={true}>
              <ProgressReports projectId={projectId} />
            </CollapsibleSection>

            {/* Recent Photos */}
            <CollapsibleSection title="Recent Photos" defaultOpen={true}>
              <RecentPhotos projectId={projectId} />
            </CollapsibleSection>

            {/* Project Meetings */}
            <CollapsibleSection title="Project Meetings" defaultOpen={true}>
              {meetingsLoading ? (
                <div className="space-y-3 p-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-2/3 mb-1" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : meetings.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No meetings recorded for this project
                </p>
              ) : (
                <div className="space-y-3">
                  {meetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                              {meeting.title || 'Untitled Meeting'}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              {meeting.date && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{format(new Date(meeting.date), 'MMM d, yyyy')}</span>
                                </div>
                              )}
                              {meeting.duration_minutes && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{meeting.duration_minutes}m</span>
                                </div>
                              )}
                            </div>
                            {meeting.summary && (
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {meeting.summary}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {meeting.status && (
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                              >
                                {meeting.status}
                              </Badge>
                            )}
                            {(meeting.url || meeting.fireflies_link) && (
                              <a
                                href={meeting.url || meeting.fireflies_link || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-2">
                    <Link
                      href="/meetings"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View all meetings →
                    </Link>
                  </div>
                </div>
              )}
            </CollapsibleSection>

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
