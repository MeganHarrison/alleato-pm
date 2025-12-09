'use client';

import * as React from 'react';
import {
  Search,
  ChevronDown,
  List,
  LayoutGrid,
  BarChart3,
  Map,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { PortfolioViewType } from '@/types/portfolio';
import { cn } from '@/lib/utils';

interface PortfolioFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewType: PortfolioViewType;
  onViewTypeChange: (type: PortfolioViewType) => void;
  onClearFilters?: () => void;
  stageFilter: string | null;
  onStageFilterChange: (value: string | null) => void;
  typeFilter: string | null;
  onTypeFilterChange: (value: string | null) => void;
  stageOptions: string[];
  typeOptions: string[];
  stageLabel?: string;
  typeLabel?: string;
  hideViewToggle?: boolean;
}

export function PortfolioFilters({
  searchQuery,
  onSearchChange,
  viewType,
  onViewTypeChange,
  onClearFilters,
  stageFilter,
  onStageFilterChange,
  typeFilter,
  onTypeFilterChange,
  stageOptions,
  typeOptions,
  stageLabel = 'Project Stage',
  typeLabel = 'Project Type',
  hideViewToggle = false,
}: PortfolioFiltersProps) {

  const viewTypes: { value: PortfolioViewType; icon: React.ElementType; label: string }[] = [
    { value: 'list', icon: List, label: 'List View' },
    { value: 'thumbnails', icon: LayoutGrid, label: 'Thumbnails View' },
    { value: 'overview', icon: BarChart3, label: 'Overview' },
    { value: 'map', icon: Map, label: 'Map View' },
  ];

  const activeFiltersCount =
    [stageFilter, typeFilter].filter((value) => value && value.length > 0).length;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      {/* Left side - Search and filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-64 h-9"
          />
        </div>

        {/* Filters dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9">
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-[hsl(var(--procore-orange))] text-white rounded">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[14rem]">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>{stageLabel}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="min-w-[10rem]">
                {stageOptions.length ? (
                  stageOptions.map((stage) => (
                    <DropdownMenuItem key={stage} onClick={() => onStageFilterChange(stage)}>
                      {stage}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No {stageLabel.toLowerCase()} found</DropdownMenuItem>
                )}
                {stageFilter && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onStageFilterChange(null)}>
                      Clear {stageLabel.toLowerCase()} filter
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>{typeLabel}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="min-w-[10rem]">
                {typeOptions.length ? (
                  typeOptions.map((type) => (
                    <DropdownMenuItem key={type} onClick={() => onTypeFilterChange(type)}>
                      {type}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No {typeLabel.toLowerCase()} found</DropdownMenuItem>
                )}
                {typeFilter && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onTypeFilterChange(null)}>
                      Clear {typeLabel.toLowerCase()} filter
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>


        {/* Active filter pills */}
        {(stageFilter || typeFilter) && (
          <div className="flex flex-wrap items-center gap-2 border-l pl-3 ml-1">
            {stageFilter && (
              <button
                onClick={() => onStageFilterChange(null)}
                className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
              >
                {stageLabel}: {stageFilter}
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {typeFilter && (
              <button
                onClick={() => onTypeFilterChange(null)}
                className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
              >
                {typeLabel}: {typeFilter}
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Clear all button */}
        {(activeFiltersCount > 0 || searchQuery) && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* Right side - View type toggles */}
      {!hideViewToggle && (
        <div className="flex items-center gap-1 border rounded-md p-0.5">
          {viewTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => onViewTypeChange(type.value)}
                className={cn(
                  'p-2 rounded transition-colors',
                  viewType === type.value
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                )}
                title={type.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
