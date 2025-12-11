'use client';

import * as React from 'react';
import {
  PortfolioHeader,
  PortfolioFilters,
  ProjectsTable,
} from '@/components/portfolio';
import {
  mockPortfolioViews,
  mockFinancialViews,
} from '@/data/mock-portfolio-data';
import { PortfolioViewType, StatusFilter, Project } from '@/types/portfolio';
import { useRouter } from 'next/navigation';

function PortfolioPageContent() {
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
        const result = await response.json();

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
          console.error('Failed to fetch projects:', result.error);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [searchQuery, statusFilter]);

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
    router.push('/create-project');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-50px)] min-h-0 bg-gray-50 rounded-lg overflow-hidden">

      {/* Portfolio Header with tabs */}
      <PortfolioHeader
        views={mockPortfolioViews}
        financialViews={mockFinancialViews}
        activeView={activeView}
        onViewChange={handleViewChange}
        onSettingsClick={handleSettingsClick}
        onExport={handleExport}
        onCreateProject={handleCreateProject}
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
        <div className="px-4 py-2 text-sm text-gray-600 bg-white border-b border-gray-200">
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

export default function PortfolioPage() {
  return <PortfolioPageContent />;
}
