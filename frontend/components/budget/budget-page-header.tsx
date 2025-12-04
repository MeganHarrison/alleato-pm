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
  return (
    <div className="flex items-center justify-between px-6 pb-4border-b bg-white">
      {/* Left side - Title and Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>

        {isSynced && (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-700 border-gray-300 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            ERP - Synced
          </Badge>
        )}
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
