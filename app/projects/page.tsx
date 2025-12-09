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
  const [stageFilter, setStageFilter] = React.useState<string | null>('current');
  const [typeFilter, setTypeFilter] = React.useState<string | null>(null);
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
          const mappedProjects: Project[] = (result.data || []).map((p: { id: { toString: () => string }; name?: string; 'job number'?: string; address?: string; state?: string; archived?: boolean; phase?: string; category?: string; description?: string }) => ({
            id: p.id.toString(),
            name: p.name || 'Untitled Project',
            projectNumber: p['job number'] || p.id.toString(),
            address: p.address || '',
            city: p.address ? p.address.split(',')[0] || '' : '',
            state: p.state || '',
            zip: '',
            phone: '',
            status: p.archived ? 'Inactive' : 'Active',
            stage: p.state || p.phase || 'Unknown',
            type: p.category || 'General',
            notes: p.description || '',
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
  
  // Extract unique stage and type options from projects
  const stageOptions = React.useMemo(() => {
    const stages = new Set(projects.map(p => p.stage).filter(Boolean));
    return Array.from(stages).sort();
  }, [projects]);

  const typeOptions = React.useMemo(() => {
    const types = new Set(projects.map(p => p.type).filter(Boolean));
    return Array.from(types).sort();
  }, [projects]);

  // Filter projects based on stage and type (search and status are handled server-side)
  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) => {
      // Stage filter (case insensitive)
      if (stageFilter && stageFilter !== 'all' && project.stage.toLowerCase() !== stageFilter.toLowerCase()) return false;

      // Type filter
      if (typeFilter && project.type !== typeFilter) return false;

      return true;
    });
  }, [projects, stageFilter, typeFilter]);

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
    setStageFilter('current');
    setTypeFilter(null);
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
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          viewType={viewType}
          onViewTypeChange={setViewType}
          stageFilter={stageFilter}
          onStageFilterChange={setStageFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          stageOptions={stageOptions}
          typeOptions={typeOptions}
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
