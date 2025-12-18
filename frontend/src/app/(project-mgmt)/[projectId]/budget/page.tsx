'use client';

import * as React from 'react';
import { Suspense } from 'react';
import {
  BudgetPageHeader,
  BudgetTabs,
  BudgetFilters,
  BudgetTable,
  BudgetLineItemModal,
  BudgetModificationModal,
  VerticalMarkupSettings,
} from '@/components/budget';
import {
  budgetViews,
  budgetSnapshots,
  budgetGroups,
  budgetSyncStatus,
  budgetGrandTotals,
} from '@/config/budget';
import { useParams, useRouter } from 'next/navigation';
import { useProjectTitle } from '@/hooks/useProjectTitle';
import { toast } from 'sonner';
import { PageContainer } from '@/components/layout/PageContainer';

export default function ProjectBudgetPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  useProjectTitle('Budget');

  const [activeTab, setActiveTab] = React.useState('budget');
  const [selectedView, setSelectedView] = React.useState('procore-standard');
  const [selectedSnapshot, setSelectedSnapshot] = React.useState('current');
  const [selectedGroup, setSelectedGroup] = React.useState('cost-code-tier-1');
  const [budgetData, setBudgetData] = React.useState<any[]>([]);
  const [grandTotals, setGrandTotals] = React.useState<any>(budgetGrandTotals);
  const [loading, setLoading] = React.useState(true);
  const [showLineItemModal, setShowLineItemModal] = React.useState(false);
  const [showModificationModal, setShowModificationModal] = React.useState(false);

  // Budget lock state
  const [isLocked, setIsLocked] = React.useState(false);
  const [lockedAt, setLockedAt] = React.useState<string | null>(null);
  const [lockedBy, setLockedBy] = React.useState<string | null>(null);

  // Fetch budget lock status
  const fetchLockStatus = React.useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/budget/lock`);
      if (response.ok) {
        const data = await response.json();
        setIsLocked(data.isLocked || false);
        setLockedAt(data.lockedAt);
        setLockedBy(data.lockedBy);
      }
    } catch (error) {
      console.error('Error fetching lock status:', error);
    }
  }, [projectId]);

  // Fetch budget data
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch budget data and lock status in parallel
        const [budgetResponse] = await Promise.all([
          fetch(`/api/projects/${projectId}/budget`),
          fetchLockStatus(),
        ]);

        if (budgetResponse.ok) {
          const budgetDataResponse = await budgetResponse.json();
          setBudgetData(budgetDataResponse.lineItems || []);
          setGrandTotals(budgetDataResponse.grandTotals || budgetGrandTotals);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId, fetchLockStatus]);

  const handleCreateClick = () => {
    if (isLocked) {
      toast.error('Budget is locked. Unlock to add new line items.');
      return;
    }
    console.log('Create clicked for project:', projectId);
    // Navigate to line item creation page instead of modal
    router.push(`/${projectId}/budget/line-item/new`);
  };

  const handleModificationClick = () => {
    if (isLocked) {
      toast.error('Budget is locked. Unlock to create modifications.');
      return;
    }
    console.log('Modification clicked for project:', projectId);
    setShowModificationModal(true);
  };

  const handleResendToERP = () => {
    console.log('Resend to ERP clicked');
  };

  const handleLockBudget = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/budget/lock`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setIsLocked(true);
        setLockedAt(data.data.budget_locked_at);
        setLockedBy(data.data.budget_locked_by);
        toast.success('Budget locked successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to lock budget');
      }
    } catch (error) {
      console.error('Error locking budget:', error);
      toast.error('Failed to lock budget');
    }
  };

  const handleUnlockBudget = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/budget/lock`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsLocked(false);
        setLockedAt(null);
        setLockedBy(null);
        toast.success('Budget unlocked successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to unlock budget');
      }
    } catch (error) {
      console.error('Error unlocking budget:', error);
      toast.error('Failed to unlock budget');
    }
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

  const handleLineItemSuccess = () => {
    // Refresh budget data after creating line items
    const fetchData = async () => {
      try {
        const budgetResponse = await fetch(`/api/projects/${projectId}/budget`);
        if (budgetResponse.ok) {
          const budgetDataResponse = await budgetResponse.json();
          setBudgetData(budgetDataResponse.lineItems || []);
          setGrandTotals(budgetDataResponse.grandTotals || budgetGrandTotals);
        }
      } catch (error) {
        console.error('Error refreshing budget data:', error);
      }
    };
    fetchData();
  };

  const handleModificationSuccess = () => {
    // Refresh budget data after creating modification
    handleLineItemSuccess();
  };

  return (
    <div className="flex flex-1 flex-col bg-muted/30">
      <BudgetPageHeader
        title="Budget"
        isSynced={budgetSyncStatus.isSynced}
        isLocked={isLocked}
        lockedAt={lockedAt}
        lockedBy={lockedBy}
        onCreateClick={handleCreateClick}
        onModificationClick={handleModificationClick}
        onResendToERP={handleResendToERP}
        onLockBudget={handleLockBudget}
        onUnlockBudget={handleUnlockBudget}
        onExport={handleExport}
      />

      <BudgetTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <PageContainer className="flex flex-1 flex-col gap-4 py-6" maxWidth="full">
        {activeTab === 'settings' ? (
          <div className="flex-1 rounded-lg border bg-white shadow-sm">
            <VerticalMarkupSettings projectId={projectId} />
          </div>
        ) : (
          <>
            <div className="rounded-lg border bg-white shadow-sm">
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
              />
            </div>

            <div className="flex-1 rounded-lg border bg-white shadow-sm">
              <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    Loading budget data for project {projectId}...
                  </div>
                ) : (
                  <BudgetTable data={budgetData} grandTotals={grandTotals} />
                )}
              </Suspense>
            </div>
          </>
        )}
      </PageContainer>

      <BudgetLineItemModal
        open={showLineItemModal}
        onOpenChange={setShowLineItemModal}
        projectId={projectId}
        onSuccess={handleLineItemSuccess}
      />
      <BudgetModificationModal
        open={showModificationModal}
        onOpenChange={setShowModificationModal}
        projectId={projectId}
        onSuccess={handleModificationSuccess}
      />
    </div>
  );
}
