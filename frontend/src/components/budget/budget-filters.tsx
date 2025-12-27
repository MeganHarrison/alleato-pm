'use client';

import * as React from 'react';
import { ChevronDown, Plus, Maximize2, Minimize2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { BudgetView, BudgetSnapshot, BudgetGroup } from '@/types/budget';
import { Badge } from '@/components/ui/badge';

export type QuickFilterType = 'over-budget' | 'under-budget' | 'no-activity' | 'all';

interface BudgetFiltersProps {
  views: BudgetView[];
  snapshots: BudgetSnapshot[];
  groups: BudgetGroup[];
  selectedView: string;
  selectedSnapshot: string;
  selectedGroup: string;
  onViewChange: (viewId: string) => void;
  onSnapshotChange: (snapshotId: string) => void;
  onGroupChange: (groupId: string) => void;
  onAddFilter?: () => void;
  onAnalyzeVariance?: () => void;
  onToggleFullscreen?: () => void;
  onQuickFilterChange?: (filter: QuickFilterType) => void;
  activeQuickFilter?: QuickFilterType;
  isFullscreen?: boolean;
}

export function BudgetFilters({
  views,
  snapshots,
  groups,
  selectedView,
  selectedSnapshot,
  selectedGroup,
  onViewChange,
  onSnapshotChange,
  onGroupChange,
  onAddFilter,
  onAnalyzeVariance,
  onToggleFullscreen,
  onQuickFilterChange,
  activeQuickFilter = 'all',
  isFullscreen = false,
}: BudgetFiltersProps) {
  const selectedViewName =
    views.find((v) => v.id === selectedView)?.name || 'Select View';
  const selectedSnapshotName =
    snapshots.find((s) => s.id === selectedSnapshot)?.name || 'Select Snapshot';
  const selectedGroupName =
    groups.find((g) => g.id === selectedGroup)?.name || 'Select Group';

  const quickFilterLabels = {
    'all': 'All Items',
    'over-budget': 'Over Budget',
    'under-budget': 'Under Budget',
    'no-activity': 'No Activity',
  };

  return (
    <div className="flex items-center justify-between py-4">
      {/* Left side - Filter controls */}
      <div className="flex items-center gap-4">
        {/* View Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">View</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 min-w-[200px] justify-between">
                {selectedViewName}
                <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              {views.map((view) => (
                <DropdownMenuItem
                  key={view.id}
                  onClick={() => onViewChange(view.id)}
                  className={selectedView === view.id ? 'bg-accent' : ''}
                >
                  {view.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Snapshot Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Snapshot</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 min-w-[120px] justify-between">
                {selectedSnapshotName}
                <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              {snapshots.map((snapshot) => (
                <DropdownMenuItem
                  key={snapshot.id}
                  onClick={() => onSnapshotChange(snapshot.id)}
                  className={selectedSnapshot === snapshot.id ? 'bg-accent' : ''}
                >
                  {snapshot.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Group Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Group</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 min-w-[150px] justify-between">
                {selectedGroupName}
                <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[180px]">
              {groups.map((group) => (
                <DropdownMenuItem
                  key={group.id}
                  onClick={() => onGroupChange(group.id)}
                  className={selectedGroup === group.id ? 'bg-accent' : ''}
                >
                  {group.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2 border-l pl-4 ml-2">
          <span className="text-sm text-gray-500">Quick Filter</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={activeQuickFilter !== 'all' ? 'default' : 'outline'}
                className="h-9 min-w-[140px] justify-between"
              >
                <Filter className="w-4 h-4 mr-2" />
                {quickFilterLabels[activeQuickFilter]}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[180px]">
              <DropdownMenuItem
                onClick={() => onQuickFilterChange?.('all')}
                className={activeQuickFilter === 'all' ? 'bg-accent' : ''}
              >
                All Items
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onQuickFilterChange?.('over-budget')}
                className={activeQuickFilter === 'over-budget' ? 'bg-accent' : ''}
              >
                <span className="text-red-600 mr-2">●</span>
                Over Budget
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onQuickFilterChange?.('under-budget')}
                className={activeQuickFilter === 'under-budget' ? 'bg-accent' : ''}
              >
                <span className="text-green-600 mr-2">●</span>
                Under Budget
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onQuickFilterChange?.('no-activity')}
                className={activeQuickFilter === 'no-activity' ? 'bg-accent' : ''}
              >
                <span className="text-gray-400 mr-2">●</span>
                No Activity
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Filter Section */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-9"
            onClick={onAddFilter}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Filter
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="h-9"
          onClick={onAnalyzeVariance}
        >
          Analyze Variance
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
