'use client';

import * as React from 'react';
import { Suspense } from 'react';
import {
  PortfolioHeader,
  PortfolioFilters,
  ProjectsTable,
  PortfolioSidebar,
} from '@/components/portfolio';
import {
  mockProjects,
  mockPortfolioViews,
  mockFinancialViews,
  mockCustomReports,
} from '@/data/mock-portfolio-data';
import { PortfolioViewType, StatusFilter, Project } from '@/types/portfolio';
import { useRouter } from 'next/navigation';

function PortfolioPageContent() {
  const router = useRouter();
  const [activeView, setActiveView] = React.useState('projects');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('active');
  const [viewType, setViewType] = React.useState<PortfolioViewType>('list');
  const [activeFiltersCount, setActiveFiltersCount] = React.useState(0);

  // Filter projects based on search and status
  const filteredProjects = React.useMemo(() => {
    return mockProjects.filter((project) => {
      // Status filter
      if (statusFilter === 'active' && project.status !== 'Active') return false;
      if (statusFilter === 'inactive' && project.status !== 'Inactive') return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          project.name.toLowerCase().includes(query) ||
          project.projectNumber.toLowerCase().includes(query) ||
          project.city.toLowerCase().includes(query) ||
          project.address.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [searchQuery, statusFilter]);

  const handleViewChange = (viewId: string) => {
    setActiveView(viewId);
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    console.log('Export to', format);
  };

  const handleAddFilter = () => {
    setActiveFiltersCount((prev) => prev + 1);
    console.log('Add filter clicked');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setActiveFiltersCount(0);
  };

  const handleProjectClick = (project: Project) => {
    router.push(`/projects/${project.id}/home`);
  };

  const handleCreateProject = () => {
    console.log('Create project clicked');
  };

  const handleReportClick = (reportId: string) => {
    console.log('Report clicked:', reportId);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] min-h-0 bg-gray-50 rounded-lg overflow-hidden">

      {/* Portfolio Header with tabs */}
      <PortfolioHeader
        views={mockPortfolioViews}
        financialViews={mockFinancialViews}
        activeView={activeView}
        onViewChange={handleViewChange}
        onSettingsClick={handleSettingsClick}
        onExport={handleExport}
      />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Filters */}
          <PortfolioFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            viewType={viewType}
            onViewTypeChange={setViewType}
            activeFiltersCount={activeFiltersCount}
            onAddFilter={handleAddFilter}
            onClearFilters={handleClearFilters}
          />

          {/* Projects count */}
          <div className="px-4 py-2 text-sm text-gray-600 bg-white border-b border-gray-200">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
          </div>

          {/* Projects Table */}
          <div className="flex-1 overflow-hidden bg-white">
            <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
              <ProjectsTable
                data={filteredProjects}
                onProjectClick={handleProjectClick}
              />
            </Suspense>
          </div>
        </div>

        {/* Sidebar */}
        <PortfolioSidebar
          customReports={mockCustomReports}
          onCreateProject={handleCreateProject}
          onReportClick={handleReportClick}
        />
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  return <PortfolioPageContent />;
}
