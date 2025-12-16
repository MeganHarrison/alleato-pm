'use client';

import * as React from 'react';
import {
  Plus,
  ArrowRight,
  Unlock,
  Download,
  MoreVertical,
  MessageSquare,
  ChevronDown,
  RefreshCw,
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
import { useProject } from '@/contexts/project-context';

interface BudgetPageHeaderProps {
  title?: string;
  isSynced?: boolean;
  onCreateClick?: () => void;
  onResendToERP?: () => void;
  onUnlockBudget?: () => void;
  onExport?: (format: string) => void;
}

export function BudgetPageHeader({
  title = 'Budget',
  isSynced = true,
  onCreateClick,
  onResendToERP,
  onUnlockBudget,
  onExport,
}: BudgetPageHeaderProps) {
  const { selectedProject, isLoading } = useProject();

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

          {/* Page Title */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
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

        {/* Unlock Budget Button */}
        <Button
          variant="outline"
          onClick={onUnlockBudget}
          className="text-gray-700"
        >
          <Unlock className="w-4 h-4 mr-1" />
          Unlock Budget
        </Button>

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
    </div>
  );
}
