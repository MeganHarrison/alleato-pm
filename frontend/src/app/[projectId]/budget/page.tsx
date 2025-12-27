'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  BudgetPageHeader,
  BudgetTabs,
  BudgetFilters,
  BudgetTable,
  BudgetLineItemModal,
  BudgetModificationModal,
  VerticalMarkupSettings,
  CostCodesTab,
  OriginalBudgetEditModal,
  BudgetViewsManager,
} from '@/components/budget';
import { ImportBudgetModal } from '@/components/budget/ImportBudgetModal';
import type { BudgetLineItem } from '@/types/budget';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  budgetViews,
  budgetSnapshots,
  budgetGroups,
  budgetGrandTotals,
} from '@/config/budget';
import { useProjectTitle } from '@/hooks/useProjectTitle';
import {
  applyQuickFilter,
  loadQuickFilterPreference,
  saveQuickFilterPreference
} from '@/lib/budget-filters';
import type { QuickFilterType } from '@/components/budget/budget-filters';
import { applyGrouping, type GroupingType } from '@/lib/budget-grouping';

export default function ProjectBudgetPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  useProjectTitle('Budget');

  const [activeTab, setActiveTab] = React.useState('budget');
  const [selectedView, setSelectedView] = React.useState('procore-standard');
  const [selectedSnapshot, setSelectedSnapshot] = React.useState('current');
  const [selectedGroup, setSelectedGroup] = React.useState('cost-code-tier-1');
  const [budgetData, setBudgetData] = React.useState<BudgetLineItem[]>([]);
  const [quickFilter, setQuickFilter] = React.useState<QuickFilterType>('all');
  const [currentViewId, setCurrentViewId] = React.useState<string>('');
  const [grandTotals, setGrandTotals] = React.useState(budgetGrandTotals);
  const [loading, setLoading] = React.useState(true);
  const [showLineItemModal, setShowLineItemModal] = React.useState(false);
  const [showModificationModal, setShowModificationModal] = React.useState(false);
  const [showImportModal, setShowImportModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [selectedLineItem, setSelectedLineItem] = React.useState<BudgetLineItem | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [deleting, setDeleting] = React.useState(false);

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
      // Load saved quick filter preference
      const savedFilter = loadQuickFilterPreference(projectId);
      setQuickFilter(savedFilter);
    }
  }, [projectId, fetchLockStatus]);

  // Apply quick filter to budget data
  // Apply filtering and grouping to budget data
  const filteredData = React.useMemo(() => {
    // First apply quick filter
    const filtered = applyQuickFilter(budgetData, quickFilter);

    // Then apply grouping
    const grouped = applyGrouping(filtered, selectedGroup as GroupingType);

    return grouped;
  }, [budgetData, quickFilter, selectedGroup]);

  // Handle quick filter change
  const handleQuickFilterChange = React.useCallback((filter: QuickFilterType) => {
    setQuickFilter(filter);
    saveQuickFilterPreference(projectId, filter);
    toast.success(`Filter applied: ${filter === 'all' ? 'All Items' : filter.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`);
  }, [projectId]);

  const handleCreateClick = () => {
    if (isLocked) {
      toast.error('Budget is locked. Unlock to add new line items.');
      return;
    }
    // Navigate to bulk budget setup page
    router.push(`/${projectId}/budget/setup`);
  };

  const handleModificationClick = () => {
    if (isLocked) {
      toast.error('Budget is locked. Unlock to create modifications.');
      return;
    }
    setShowModificationModal(true);
  };

  const handleResendToERP = () => {
    // TODO: Implement ERP integration
    toast.info('ERP integration coming soon');
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

  const handleImport = () => {
    if (isLocked) {
      toast.error('Budget is locked. Unlock to import budget data.');
      return;
    }
    setShowImportModal(true);
  };

  const handleExport = (format: string) => {
    // TODO: Implement export functionality
    toast.info(`${format.toUpperCase()} export coming soon`);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleAddFilter = () => {
    // TODO: Implement advanced filtering
    toast.info('Advanced filtering coming soon');
  };

  const handleAnalyzeVariance = () => {
    // TODO: Implement variance analysis
    toast.info('Variance analysis coming soon');
  };

  const handleToggleFullscreen = () => {
    // TODO: Implement fullscreen mode
    toast.info('Fullscreen mode coming soon');
  };

  const handleLineItemSuccess = React.useCallback(() => {
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
  }, [projectId]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S: Refresh data
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleLineItemSuccess();
        toast.success('Budget data refreshed');
      }

      // Ctrl+E or Cmd+E: Open create line item modal (if not locked)
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        if (isLocked) {
          toast.error('Budget is locked. Unlock to add new line items.');
        } else {
          router.push(`/${projectId}/budget/setup`);
        }
      }

      // Escape: Close any open modals
      if (e.key === 'Escape') {
        setShowLineItemModal(false);
        setShowModificationModal(false);
        setShowImportModal(false);
        setShowEditModal(false);
        setShowDeleteDialog(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, projectId, router, handleLineItemSuccess]);

  const handleModificationSuccess = () => {
    // Refresh budget data after creating modification
    handleLineItemSuccess();
  };

  const handleEditLineItem = (lineItem: BudgetLineItem) => {
    if (isLocked) {
      toast.error('Budget is locked. Unlock to edit line items.');
      return;
    }
    setSelectedLineItem(lineItem);
    setShowEditModal(true);
  };

  const handleSelectionChange = React.useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  const handleDeleteSelected = () => {
    if (isLocked) {
      toast.error('Budget is locked. Unlock to delete line items.');
      return;
    }
    if (selectedIds.length === 0) return;
    setShowDeleteDialog(true);
  };

  const confirmDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    setDeleting(true);
    try {
      // Delete all selected items
      const deletePromises = selectedIds.map((id) =>
        fetch(`/api/projects/${projectId}/budget/lines/${id}`, {
          method: 'DELETE',
        })
      );

      const results = await Promise.all(deletePromises);
      const allSuccessful = results.every((r) => r.ok);

      if (allSuccessful) {
        toast.success(`${selectedIds.length} line item(s) deleted successfully`);
        setSelectedIds([]);
        handleLineItemSuccess(); // Refresh data
      } else {
        toast.error('Some items could not be deleted');
      }
    } catch (error) {
      console.error('Error deleting line items:', error);
      toast.error('Failed to delete line items');
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleEditSave = async (data: {
    unitQty: number;
    uom: string;
    unitCost: number;
    originalBudget: number;
  }) => {
    if (!selectedLineItem) return;

    try {
      const response = await fetch(
        `/api/projects/${projectId}/budget/lines/${selectedLineItem.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            unit_qty: data.unitQty,
            uom: data.uom,
            unit_cost: data.unitCost,
            original_budget_amount: data.originalBudget,
          }),
        }
      );

      if (response.ok) {
        toast.success('Line item updated successfully');
        handleLineItemSuccess(); // Refresh data
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update line item');
      }
    } catch (error) {
      console.error('Error updating line item:', error);
      toast.error('Failed to update line item');
    }
  };

  return (
    <>
      <BudgetPageHeader
        title="Budget"
        isLocked={isLocked}
        lockedAt={lockedAt}
        lockedBy={lockedBy}
        onCreateClick={handleCreateClick}
        onModificationClick={handleModificationClick}
        onResendToERP={handleResendToERP}
        onLockBudget={handleLockBudget}
        onUnlockBudget={handleUnlockBudget}
        onImport={handleImport}
        onExport={handleExport}
      />

      <BudgetTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="flex flex-1 flex-col gap-4 px-4 sm:px-6 lg:px-12 py-6 bg-muted/30">
        {activeTab === 'settings' ? (
          <div className="flex-1 rounded-lg border bg-white shadow-sm">
            <VerticalMarkupSettings projectId={projectId} />
          </div>
        ) : activeTab === 'cost-codes' ? (
          <div className="flex-1 rounded-lg border bg-white shadow-sm p-6">
            <CostCodesTab projectId={projectId} />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
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
                onQuickFilterChange={handleQuickFilterChange}
                activeQuickFilter={quickFilter}
              />
              <BudgetViewsManager
                projectId={projectId}
                currentViewId={currentViewId}
                onViewChange={setCurrentViewId}
              />
            </div>

            {/* Selection action bar */}
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-sm text-blue-700 font-medium">
                  {selectedIds.length} item(s) selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                  disabled={isLocked}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete Selected
                </Button>
              </div>
            )}

            <div className="flex-1">
              <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    Loading budget data for project {projectId}...
                  </div>
                ) : (
                  <BudgetTable
                    data={filteredData}
                    grandTotals={grandTotals}
                    onEditLineItem={handleEditLineItem}
                    onSelectionChange={handleSelectionChange}
                  />
                )}
              </Suspense>
            </div>
          </>
        )}
      </div>

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
      <ImportBudgetModal
        open={showImportModal}
        onOpenChange={setShowImportModal}
        projectId={projectId}
        onSuccess={handleLineItemSuccess}
      />

      {/* Edit Original Budget Modal */}
      {selectedLineItem && (
        <OriginalBudgetEditModal
          open={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedLineItem(null);
          }}
          lineItem={{
            id: selectedLineItem.id,
            description: selectedLineItem.description,
            costCode: selectedLineItem.costCode,
            originalBudgetAmount: selectedLineItem.originalBudgetAmount,
            unitQty: selectedLineItem.unitQty,
            uom: selectedLineItem.uom,
            unitCost: selectedLineItem.unitCost,
          }}
          projectId={projectId}
          onSave={handleEditSave}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Line Items</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} selected line item(s)?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteSelected}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
