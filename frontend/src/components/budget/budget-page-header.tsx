'use client';

import * as React from 'react';
import {
  Plus,
  ArrowRight,
  Unlock,
  Lock,
  Download,
  MoreVertical,
  MessageSquare,
  ChevronDown,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
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
import { useProject } from '@/contexts/project-context';

interface BudgetPageHeaderProps {
  title?: string;
  isSynced?: boolean;
  isLocked?: boolean;
  lockedAt?: string | null;
  lockedBy?: string | null;
  onCreateClick?: () => void;
  onResendToERP?: () => void;
  onLockBudget?: () => void;
  onUnlockBudget?: () => void;
  onExport?: (format: string) => void;
}

export function BudgetPageHeader({
  title = 'Budget',
  isSynced = true,
  isLocked = false,
  lockedAt,
  lockedBy,
  onCreateClick,
  onResendToERP,
  onLockBudget,
  onUnlockBudget,
  onExport,
}: BudgetPageHeaderProps) {
  const { selectedProject, isLoading } = useProject();
  const [showLockDialog, setShowLockDialog] = React.useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = React.useState(false);

  const handleLockConfirm = () => {
    onLockBudget?.();
    setShowLockDialog(false);
  };

  const handleUnlockConfirm = () => {
    onUnlockBudget?.();
    setShowUnlockDialog(false);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex items-center justify-between px-6 pb-4 border-b bg-white">
      {/* Left side - Title and Status */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          {/* Project Name - Displayed above page title */}
          {isLoading ? (
            <div className="h-4 w-40 bg-gray-200 animate-pulse rounded mb-1" />
          ) : selectedProject ? (
            <div className="text-sm font-medium text-muted-foreground mb-1">
              {selectedProject.number && (
                <span className="text-gray-600">
                  {selectedProject.number}
                  {' · '}
                </span>
              )}
              <span className="text-orange-600">{selectedProject.name}</span>
            </div>
          ) : null}

          {/* Page Title with Lock Status */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{title}</h1>
            {isLocked && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Locked
              </Badge>
            )}
          </div>
          {isLocked && lockedAt && (
            <p className="text-xs text-muted-foreground mt-1">
              Locked {formatDate(lockedAt)}{lockedBy ? ` by ${lockedBy}` : ''}
            </p>
          )}
        </div>

      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center gap-2">
        {/* Create Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-1" />
              Create
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onCreateClick}>
              Budget Line Item
            </DropdownMenuItem>
            <DropdownMenuItem>Budget Modification</DropdownMenuItem>
            <DropdownMenuItem>Change Order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Resend to ERP Button */}
        <Button
          variant="outline"
          onClick={onResendToERP}
          className="text-gray-700"
        >
          <ArrowRight className="w-4 h-4 mr-1" />
          Resend to ERP
        </Button>

        {/* Lock/Unlock Budget Button */}
        {isLocked ? (
          <Button
            variant="outline"
            onClick={() => setShowUnlockDialog(true)}
            className="text-gray-700"
          >
            <Unlock className="w-4 h-4 mr-1" />
            Unlock Budget
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => setShowLockDialog(true)}
            className="text-gray-700"
          >
            <Lock className="w-4 h-4 mr-1" />
            Lock Budget
          </Button>
        )}

        {/* Export Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-gray-700">
              <Download className="w-4 h-4 mr-1" />
              Export
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExport?.('pdf')}>
              Export to PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport?.('excel')}>
              Export to Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport?.('csv')}>
              Export to CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* More Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Configure Columns</DropdownMenuItem>
            <DropdownMenuItem>Budget Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Audit Log</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Chat/Converse Icon */}
        <Button variant="ghost" size="icon" className="text-gray-500">
          <MessageSquare className="w-5 h-5" />
        </Button>
      </div>

      {/* Lock Budget Confirmation Dialog */}
      <AlertDialog open={showLockDialog} onOpenChange={setShowLockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-500" />
              Lock Budget
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to lock the budget for this project?
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">What happens when you lock:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Budget line items cannot be added, edited, or deleted</li>
                      <li>Original budget amounts become read-only</li>
                      <li>Changes can only be made through approved change orders</li>
                      <li>Budget modifications require unlock permission</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLockConfirm} className="bg-orange-500 hover:bg-orange-600">
              Lock Budget
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unlock Budget Confirmation Dialog */}
      <AlertDialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Unlock className="w-5 h-5 text-blue-500" />
              Unlock Budget
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to unlock the budget for this project?
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">What happens when you unlock:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Budget line items can be added, edited, or deleted</li>
                      <li>Original budget amounts become editable</li>
                      <li>All users with budget permissions can make changes</li>
                      <li>Changes will be tracked in the audit log</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnlockConfirm} className="bg-blue-500 hover:bg-blue-600">
              Unlock Budget
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
