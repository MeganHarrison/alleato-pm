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
  mockBudgetLineItems,
  mockBudgetGrandTotals,
  mockBudgetViews,
  mockBudgetSnapshots,
  mockBudgetGroups,
  mockBudgetSyncStatus,
} from '@/data/mock-budget-data';

function BudgetPageContent() {
  const [activeTab, setActiveTab] = React.useState('budget');
  const [selectedView, setSelectedView] = React.useState('procore-standard');
  const [selectedSnapshot, setSelectedSnapshot] = React.useState('current');
  const [selectedGroup, setSelectedGroup] = React.useState('cost-code-tier-1');

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
    console.log('Toggle fullscreen clicked');
  };

  return (
    <AppShell
      companyName="Alleato Group"
      projectName="24-104 - Goodwill Bart"
      currentTool="Budget"
      userInitials="BC"
    >
      <div className="flex flex-col h-[calc(100vh-48px)]">
        {/* Page Header */}
        <div className="bg-white">
          <BudgetPageHeader
            title="Budget"
            isSynced={mockBudgetSyncStatus.isSynced}
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
          <BudgetStatusBanner syncStatus={mockBudgetSyncStatus} />
        </div>

        {/* Filter Controls */}
        <div className="mx-6 mt-4 bg-white rounded-md">
          <BudgetFilters
            views={mockBudgetViews}
            snapshots={mockBudgetSnapshots}
            groups={mockBudgetGroups}
            selectedView={selectedView}
            selectedSnapshot={selectedSnapshot}
            selectedGroup={selectedGroup}
            onViewChange={setSelectedView}
            onSnapshotChange={setSelectedSnapshot}
            onGroupChange={setSelectedGroup}
            onAddFilter={handleAddFilter}
            onAnalyzeVariance={handleAnalyzeVariance}
            onToggleFullscreen={handleToggleFullscreen}
          />
        </div>

        {/* Budget Table */}
        <div className="flex-1 overflow-hidden mx-6 mt-4 mb-6 bg-white rounded-md border border-gray-200">
          <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
            <BudgetTable
              data={mockBudgetLineItems}
              grandTotals={mockBudgetGrandTotals}
            />
          </Suspense>
        </div>
      </div>
    </AppShell>
  );
}

export default function BudgetPage() {
  return <BudgetPageContent />;
}
