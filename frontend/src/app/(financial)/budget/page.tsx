'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { AppShell } from '@/components/layout';
import {
  BudgetPageHeader,
  BudgetTabs,
  BudgetStatusBanner,
  BudgetFilters,
  BudgetTable,
} from '@/components/budget';
import {
  budgetLineItems,
  budgetGrandTotals,
  budgetViews,
  budgetSnapshots,
  budgetGroups,
  budgetSyncStatus,
} from '@/config/budget';
import { ProjectGuard } from '@/components/project-guard';
import { useProject } from '@/contexts/project-context';
import { useProjectTitle } from '@/hooks/useProjectTitle';

function BudgetPageContent() {
  const { selectedProject } = useProject();
  useProjectTitle('Budget'); // Set page title with project name
  const [activeTab, setActiveTab] = React.useState('budget');
  const [selectedView, setSelectedView] = React.useState('procore-standard');
  const [selectedSnapshot, setSelectedSnapshot] = React.useState('current');
  const [selectedGroup, setSelectedGroup] = React.useState('cost-code-tier-1');
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const handleCreateClick = () => {
    console.log('Create clicked');
    // Navigate to create new budget line item
    window.location.href = '/budget/line-item/new';
  };

  const handleResendToERP = () => {
    console.log('Resend to ERP clicked');
  };

  const handleUnlockBudget = () => {
    console.log('Unlock Budget clicked');
  };

  const handleExport = (format: string) => {
    console.log('Export to', format);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleAddFilter = () => {
    console.log('Add filter clicked');
  };

  const handleAnalyzeVariance = () => {
    console.log('Analyze variance clicked');
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Fullscreen mode - show only filters and table
  if (isFullscreen) {
    return (
      <ProjectGuard message={`Please select a project to view budget for ${selectedProject?.name || 'this project'}.`}>
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* Filter Controls - Sticky at top */}
          <div className="bg-white border-b shadow-sm">
            <BudgetFilters
              views={budgetViews}
              snapshots={budgetSnapshots}
              groups={budgetGroups}
              selectedView={selectedView}
              selectedSnapshot={selectedSnapshot}
              selectedGroup={selectedGroup}
              onViewChange={setSelectedView}
              onSnapshotChange={setSelectedSnapshot}
              onGroupChange={setSelectedGroup}
              onAddFilter={handleAddFilter}
              onAnalyzeVariance={handleAnalyzeVariance}
              onToggleFullscreen={handleToggleFullscreen}
              isFullscreen={isFullscreen}
            />
          </div>

          {/* Budget Table - Takes full remaining space */}
          <div className="flex-1 overflow-hidden bg-white">
            <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
              <BudgetTable
                data={budgetLineItems}
                grandTotals={budgetGrandTotals}
              />
            </Suspense>
          </div>
        </div>
      </ProjectGuard>
    );
  }

  // Normal mode
  return (
    <ProjectGuard message={`Please select a project to view budget for ${selectedProject?.name || 'this project'}.`}>
      <AppShell
        companyName="Alleato Group"
        projectName={selectedProject?.name || "24-104 - Goodwill Bart"}
        currentTool="Budget"
        userInitials="BC"
      >
        <div className="flex flex-col h-[calc(100vh-48px)]">
          {/* Page Header */}
          <div className="bg-white">
            <BudgetPageHeader
              title="Budget"
              isSynced={budgetSyncStatus.isSynced}
              onCreateClick={handleCreateClick}
              onResendToERP={handleResendToERP}
              onUnlockBudget={handleUnlockBudget}
              onExport={handleExport}
            />

            {/* Tab Navigation */}
            <BudgetTabs activeTab={activeTab} onTabChange={handleTabChange} />
          </div>

          {/* Status Banner */}
          <div className="mx-6 mt-4">
            <BudgetStatusBanner syncStatus={budgetSyncStatus} />
          </div>

          {/* Filter Controls */}
          <div className="mx-6 mt-4 bg-white rounded-md">
            <BudgetFilters
              views={budgetViews}
              snapshots={budgetSnapshots}
              groups={budgetGroups}
              selectedView={selectedView}
              selectedSnapshot={selectedSnapshot}
              selectedGroup={selectedGroup}
              onViewChange={setSelectedView}
              onSnapshotChange={setSelectedSnapshot}
              onGroupChange={setSelectedGroup}
              onAddFilter={handleAddFilter}
              onAnalyzeVariance={handleAnalyzeVariance}
              onToggleFullscreen={handleToggleFullscreen}
              isFullscreen={isFullscreen}
            />
          </div>

          {/* Budget Table */}
          <div className="flex-1 overflow-hidden mx-6 mt-4 mb-6 bg-white rounded-md border border-gray-200">
            <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
              <BudgetTable
                data={budgetLineItems}
                grandTotals={budgetGrandTotals}
              />
            </Suspense>
          </div>
        </div>
      </AppShell>
    </ProjectGuard>
  );
}

export default function BudgetPage() {
  return <BudgetPageContent />;
}
