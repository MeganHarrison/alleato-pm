'use client';

import * as React from 'react';
import { ChevronDown, Plus, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BudgetView, BudgetSnapshot, BudgetGroup } from '@/types/budget';

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
}: BudgetFiltersProps) {
  const selectedViewName =
    views.find((v) => v.id === selectedView)?.name || 'Select View';
  const selectedSnapshotName =
    snapshots.find((s) => s.id === selectedSnapshot)?.name || 'Select Snapshot';
  const selectedGroupName =
    groups.find((g) => g.id === selectedGroup)?.name || 'Select Group';

  return (
    <div className="flex items-center justify-between px-4 py-4 bg-white">
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

        {/* Filter Section */}
        <div className="flex items-center gap-2 border-l pl-4 ml-2">
          <span className="text-sm text-gray-500">Filter</span>
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
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
