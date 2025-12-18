'use client';

import * as React from 'react';
import {
  PortfolioHeader,
  PortfolioFilters,
  ProjectsTable,
} from '@/components/portfolio';
import { PortfolioViewType, StatusFilter, Project } from '@/types/portfolio';
import { portfolioViews, financialViews } from '@/config/portfolio';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const router = useRouter();
  const [activeView, setActiveView] = React.useState('projects');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('active');
  const [viewType, setViewType] = React.useState<PortfolioViewType>('list');
  const [phaseFilter, setPhaseFilter] = React.useState<string | null>('current');
  const [categoryFilter, setCategoryFilter] = React.useState<string | null>(null);
  const [clientFilter, setClientFilter] = React.useState<string | null>(null);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);

  const parseProjectsResponse = React.useCallback(async (response: Response) => {
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch (error) {
        console.error('Failed to parse projects JSON:', error);
        return null;
      }
    }

    const fallbackBody = await response.text();
    console.error('Projects API returned non-JSON response:', fallbackBody.slice(0, 200));
    return null;
  }, []);

  // Fetch projects from Supabase
  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        // Add filters to params
        if (searchQuery) params.append('search', searchQuery);
        if (statusFilter === 'active') params.append('archived', 'false');
        else if (statusFilter === 'inactive') params.append('archived', 'true');

        const response = await fetch(`/api/projects?${params.toString()}`);
        const result = await parseProjectsResponse(response);

        if (!result) {
          setProjects([]);
          return;
        }

        if (response.ok) {
          // Map Supabase data to our Project interface
          const mappedProjects: Project[] = (result.data || []).map((p: any) => ({
            id: p.id.toString(),
            name: p.name || 'Untitled Project',
            jobNumber: p['job number'] || p.id.toString(),
            client: p.client || '',
            startDate: p['start date'] || null,
            state: p.state || '',
            phase: p.phase || '',
            estRevenue: p['est revenue'] || null,
            estProfit: p['est profit'] || null,
            category: p.category || '',
            // Legacy fields for backward compatibility
            projectNumber: p['job number'] || p.id.toString(),
            address: p.address || '',
            city: p.address ? p.address.split(',')[0] || '' : '',
            zip: '',
            phone: '',
            status: p.archived ? 'Inactive' : 'Active',
            stage: p.phase || 'Unknown',
            type: p.category || 'General',
            notes: p.summary || '',
            isFlagged: false
          }));

          setProjects(mappedProjects);
        } else {
          console.error('Failed to fetch projects:', result?.error || response.statusText);
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [searchQuery, statusFilter, parseProjectsResponse]);

  // Extract unique phase, category, and client options from projects
  const phaseOptions = React.useMemo(() => {
    const phases = new Set(projects.map(p => p.phase).filter((p): p is string => Boolean(p)));
    return Array.from(phases).sort();
  }, [projects]);

  const categoryOptions = React.useMemo(() => {
    const categories = new Set(projects.map(p => p.category).filter((c): c is string => Boolean(c)));
    return Array.from(categories).sort();
  }, [projects]);

  const clientOptions = React.useMemo(() => {
    const clients = new Set(projects.map(p => p.client).filter((c): c is string => Boolean(c)));
    return Array.from(clients).sort();
  }, [projects]);

  // Filter projects based on phase, category, and client (search and status are handled server-side)
  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) => {
      // Phase filter (case insensitive)
      if (phaseFilter && phaseFilter !== 'all' && project.phase?.toLowerCase() !== phaseFilter.toLowerCase()) return false;

      // Category filter
      if (categoryFilter && project.category !== categoryFilter) return false;

      // Client filter
      if (clientFilter && project.client !== clientFilter) return false;

      return true;
    });
  }, [projects, phaseFilter, categoryFilter, clientFilter]);

  const handleViewChange = (viewId: string) => {
    setActiveView(viewId);
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    console.log('Export to', format);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('active');
    setPhaseFilter('current');
    setCategoryFilter(null);
    setClientFilter(null);
  };

  const handleProjectClick = (project: Project) => {
    console.log('Project clicked:', project.id, project.name);
    router.push(`/${project.id}/home`);
  };

  const handleCreateProject = () => {
    console.log('Create project clicked');
    router.push('/project-form');
  };

  const handleCreateTestProject = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `Test Project ${new Date().toISOString().split('T')[0]}` }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to create test project:', error);
        alert('Failed to create test project. Check console for details.');
        return;
      }

      const result = await response.json();
      console.log('Test project created:', result);

      // Refresh projects list
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter === 'active') params.append('archived', 'false');
      else if (statusFilter === 'inactive') params.append('archived', 'true');

      const refreshResponse = await fetch(`/api/projects?${params.toString()}`);
      const refreshResult = await parseProjectsResponse(refreshResponse);

      if (refreshResult?.data) {
        const mappedProjects: Project[] = refreshResult.data.map((p: any) => ({
          id: p.id.toString(),
          name: p.name || 'Untitled Project',
          jobNumber: p['job number'] || p.id.toString(),
          client: p.client || '',
          startDate: p['start date'] || null,
          state: p.state || '',
          phase: p.phase || '',
          estRevenue: p['est revenue'] || null,
          estProfit: p['est profit'] || null,
          category: p.category || '',
          projectNumber: p['job number'] || p.id.toString(),
          address: p.address || '',
          city: p.address ? p.address.split(',')[0] || '' : '',
          zip: '',
          phone: '',
          status: p.archived ? 'Inactive' : 'Active',
          stage: p.phase || 'Unknown',
          type: p.category || 'General',
          notes: p.summary || '',
          isFlagged: false
        }));
        setProjects(mappedProjects);
      }

      // Navigate to the newly created project
      router.push(`/${result.project.id}/home`);
    } catch (error) {
      console.error('Error creating test project:', error);
      alert('Failed to create test project. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-50px)] min-h-0 bg-neutral-50 rounded-lg overflow-hidden">

      {/* Portfolio Header with tabs */}
      <PortfolioHeader
        views={portfolioViews}
        financialViews={financialViews}
        activeView={activeView}
        onViewChange={handleViewChange}
        onSettingsClick={handleSettingsClick}
        onExport={handleExport}
        onCreateProject={handleCreateProject}
        onCreateTestProject={handleCreateTestProject}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Filters */}
        <PortfolioFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewType={viewType}
          onViewTypeChange={setViewType}
          phaseFilter={phaseFilter}
          onPhaseFilterChange={setPhaseFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          clientFilter={clientFilter}
          onClientFilterChange={setClientFilter}
          phaseOptions={phaseOptions}
          categoryOptions={categoryOptions}
          clientOptions={clientOptions}
          onClearFilters={handleClearFilters}
        />

        {/* Projects count */}
        <div className="px-4 py-2 text-xs sm:text-sm text-gray-600 bg-white border-b border-gray-200">
          <span className="font-medium">{filteredProjects.length}</span> project{filteredProjects.length !== 1 ? 's' : ''} found
        </div>

        {/* Projects Table */}
        <div className="flex-1 overflow-hidden bg-white">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading projects...</div>
            </div>
          ) : (
            <ProjectsTable
              data={filteredProjects}
              onProjectClick={handleProjectClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}
