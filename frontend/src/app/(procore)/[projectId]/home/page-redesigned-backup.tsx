'use client';

import * as React from 'react';
import { use } from 'react';
import { 
  Settings, 
  Calendar, 
  Clock, 
  Users, 
  ExternalLink, 
  FileText,
  DollarSign,
  ClipboardCheck,
  HelpCircle,
  Receipt,
  FileEdit,
  Image,
  Plus,
  ChevronRight,
  Building,
  Briefcase,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { AppShell } from '@/components/layout';
import {
  SidebarProjectAddress,
  ProgressReports,
  RecentPhotos,
  ProjectStatsCards,
} from '@/components/project-home';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectInfo } from '@/types/project-home';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { projectTools, quickActions } from '@/config/project-home';

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

// Recent item types for the activity feed
interface RecentItem {
  id: string;
  type: 'rfi' | 'submittal' | 'change-order' | 'meeting' | 'daily-log' | 'task' | 'invoice';
  title: string;
  description?: string;
  date: Date;
  status?: string;
  user?: string;
  link: string;
}

export default function ProjectHomePageRedesigned({ params }: PageProps) {
  const { projectId } = use(params);
  const [projectInfo, setProjectInfo] = React.useState<ProjectInfo | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [meetings, setMeetings] = React.useState<Meeting[]>([]);
  const [meetingsLoading, setMeetingsLoading] = React.useState(true);

  // Mock recent items - in production these would come from various tables
  const recentItems: RecentItem[] = [
    {
      id: '1',
      type: 'rfi',
      title: 'RFI #045 - Mechanical Room Ventilation',
      description: 'Clarification needed on exhaust fan specifications',
      date: new Date(Date.now() - 1000 * 60 * 30),
      status: 'Open',
      user: 'John Smith',
      link: `/${projectId}/rfis/045`,
    },
    {
      id: '2',
      type: 'change-order',
      title: 'CO #012 - Additional Structural Support',
      description: 'Owner requested changes to support beams',
      date: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'Pending',
      user: 'Maria Garcia',
      link: `/${projectId}/change-orders/012`,
    },
    {
      id: '3',
      type: 'submittal',
      title: 'Submittal #089 - Glass Curtain Wall Shop Drawings',
      description: 'Submitted for architect review',
      date: new Date(Date.now() - 1000 * 60 * 60 * 4),
      status: 'In Review',
      user: 'Tom Wilson',
      link: `/${projectId}/submittals/089`,
    },
    {
      id: '4',
      type: 'invoice',
      title: 'Invoice #2024-006 - Progress Payment #6',
      description: 'Monthly progress billing',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: 'Submitted',
      user: 'Finance Team',
      link: `/${projectId}/invoicing/2024-006`,
    },
    {
      id: '5',
      type: 'daily-log',
      title: 'Daily Log - December 10, 2024',
      description: '42 workers on site, concrete pour completed',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: 'Complete',
      user: 'Site Manager',
      link: `/${projectId}/daily-log/2024-12-10`,
    },
  ];

  React.useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        const p = await response.json();

        if (!response.ok || p.error) {
          throw new Error(p.error || 'Project not found');
        }

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
        document.title = `${projectInfo.projectNumber} - ${projectInfo.name} | Alleato OS`;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

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
          .limit(5);

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

  const getItemIcon = (type: RecentItem['type']) => {
    switch (type) {
      case 'rfi':
        return <HelpCircle className="w-4 h-4" />;
      case 'submittal':
        return <ClipboardCheck className="w-4 h-4" />;
      case 'change-order':
        return <FileEdit className="w-4 h-4" />;
      case 'meeting':
        return <Users className="w-4 h-4" />;
      case 'daily-log':
        return <Calendar className="w-4 h-4" />;
      case 'task':
        return <CheckCircle className="w-4 h-4" />;
      case 'invoice':
        return <Receipt className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusBadgeVariant = (status?: string) => {
    if (!status) return 'default';
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('open') || lowerStatus.includes('pending')) return 'warning';
    if (lowerStatus.includes('complete') || lowerStatus.includes('approved')) return 'success';
    if (lowerStatus.includes('overdue') || lowerStatus.includes('rejected')) return 'destructive';
    return 'default';
  };

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
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {projectInfo.name}
                </h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>Job #{projectInfo.projectNumber}</span>
                  <Badge variant="success">Active</Badge>
                  <span>{projectInfo.stage}</span>
                  <span>{projectInfo.projectType}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Quick Actions */}
                {quickActions.slice(0, 3).map((action) => (
                  <Link key={action.id} href={action.href.replace('[projectId]', projectId)}>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Plus className="w-4 h-4" />
                      {action.label}
                    </Button>
                  </Link>
                ))}
                <Link
                  href={`/${projectId}/home/configure`}
                  className="text-gray-500 hover:text-orange-600 p-2 rounded-md hover:bg-gray-100"
                  title="Configure Settings"
                >
                  <Settings className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Key Project Stats */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h2>
            <ProjectStatsCards projectId={projectId} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Recent Activity and Documents */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Activity Feed */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates across all project areas</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200">
                    {recentItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.link}
                        className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                          {getItemIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                {item.title}
                              </h4>
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-0.5">
                                  {item.description}
                                </p>
                              )}
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                <span>{format(item.date, 'MMM d, h:mm a')}</span>
                                {item.user && <span>by {item.user}</span>}
                              </div>
                            </div>
                            {item.status && (
                              <Badge variant={getStatusBadgeVariant(item.status)}>
                                {item.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                  <div className="p-4 border-t">
                    <Link
                      href={`/${projectId}/activity`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View all activity →
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Tabbed Content - Progress Reports, Photos, Meetings */}
              <Card>
                <Tabs defaultValue="progress" className="w-full">
                  <TabsList className="w-full justify-start px-6 pt-6">
                    <TabsTrigger value="progress">Progress Reports</TabsTrigger>
                    <TabsTrigger value="photos">Recent Photos</TabsTrigger>
                    <TabsTrigger value="meetings">Meetings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="progress" className="px-6 pb-6">
                    <ProgressReports projectId={projectId} />
                  </TabsContent>
                  <TabsContent value="photos" className="px-6 pb-6">
                    <RecentPhotos projectId={projectId} />
                  </TabsContent>
                  <TabsContent value="meetings" className="px-6 pb-6">
                    {meetingsLoading ? (
                      <div className="space-y-3">
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
                                  <h4 className="text-sm font-medium text-gray-900">
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
                        ))}
                        <div className="text-center pt-2">
                          <Link
                            href={`/${projectId}/meetings`}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View all meetings →
                          </Link>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Right Column - Quick Navigation and Project Info */}
            <div className="space-y-6">
              {/* Project Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <SidebarProjectAddress
                    address={projectInfo.address}
                    city={projectInfo.city}
                    state={projectInfo.state}
                    zip={projectInfo.zip}
                  />
                  <div className="pt-3 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Start Date</span>
                      <span className="font-medium">Jan 15, 2024</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Est. Completion</span>
                      <span className="font-medium">Dec 20, 2024</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">340 Days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Navigation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Project Tools</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 gap-0.5">
                    {projectTools
                      .filter(tool => tool.isConfigured && tool.id !== 'home')
                      .slice(0, 10)
                      .map((tool) => (
                        <Link
                          key={tool.id}
                          href={tool.href.replace('[projectId]', projectId)}
                          className="flex flex-col items-center justify-center p-4 hover:bg-gray-50 transition-colors border-r border-b last:border-r-0 even:border-r-0"
                        >
                          <div className="text-gray-600 mb-1">
                            {tool.icon === 'FileSignature' && <FileText className="w-5 h-5" />}
                            {tool.icon === 'DollarSign' && <DollarSign className="w-5 h-5" />}
                            {tool.icon === 'FileText' && <FileText className="w-5 h-5" />}
                            {tool.icon === 'Users' && <Users className="w-5 h-5" />}
                            {tool.icon === 'HelpCircle' && <HelpCircle className="w-5 h-5" />}
                            {tool.icon === 'Calendar' && <Calendar className="w-5 h-5" />}
                            {tool.icon === 'ClipboardCheck' && <ClipboardCheck className="w-5 h-5" />}
                            {tool.icon === 'Receipt' && <Receipt className="w-5 h-5" />}
                            {tool.icon === 'FileEdit' && <FileEdit className="w-5 h-5" />}
                            {tool.icon === 'Image' && <Image className="w-5 h-5" />}
                          </div>
                          <span className="text-xs font-medium text-gray-900 text-center">
                            {tool.name}
                          </span>
                          {tool.itemCount !== undefined && (
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {tool.itemCount}
                            </Badge>
                          )}
                        </Link>
                      ))}
                  </div>
                  <div className="p-4 border-t">
                    <Link
                      href={`/${projectId}/tools`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View all tools →
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Key Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Key Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Building className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">ABC Development Corp</p>
                        <p className="text-xs text-gray-600">Owner</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Smith & Associates</p>
                        <p className="text-xs text-gray-600">Architect</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">John Smith</p>
                        <p className="text-xs text-gray-600">Project Manager</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t">
                    <Link
                      href={`/${projectId}/directory`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View full directory →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}