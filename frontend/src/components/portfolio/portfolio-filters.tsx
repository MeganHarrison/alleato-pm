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
  // Primary filter (phase for projects, stage for other pages)
  phaseFilter?: string | null;
  onPhaseFilterChange?: (value: string | null) => void;
  phaseOptions?: string[];
  // Secondary filter (category for projects, type for other pages)
  categoryFilter?: string | null;
  onCategoryFilterChange?: (value: string | null) => void;
  categoryOptions?: string[];
  // Tertiary filter (client for projects)
  clientFilter?: string | null;
  onClientFilterChange?: (value: string | null) => void;
  clientOptions?: string[];
  // Legacy props for backwards compatibility
  statusFilter?: any;
  onStatusFilterChange?: (value: any) => void;
  stageFilter?: string | null;
  onStageFilterChange?: (value: string | null) => void;
  stageOptions?: string[];
  stageLabel?: string;
  typeFilter?: string | null;
  onTypeFilterChange?: (value: string | null) => void;
  typeOptions?: string[];
  typeLabel?: string;
  hideViewToggle?: boolean;
}

export function PortfolioFilters({
  searchQuery,
  onSearchChange,
  viewType,
  onViewTypeChange,
  onClearFilters,
  phaseFilter,
  onPhaseFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  clientFilter,
  onClientFilterChange,
  phaseOptions,
  categoryOptions,
  clientOptions,
  hideViewToggle = false,
}: PortfolioFiltersProps) {

  const viewTypes: { value: PortfolioViewType; icon: React.ElementType; label: string }[] = [
    { value: 'list', icon: List, label: 'List View' },
    { value: 'thumbnails', icon: LayoutGrid, label: 'Thumbnails View' },
    { value: 'overview', icon: BarChart3, label: 'Overview' },
    { value: 'map', icon: Map, label: 'Map View' },
  ];

  const activeFiltersCount =
    [phaseFilter, categoryFilter, clientFilter].filter((value) => value && value.length > 0).length;

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

        {/* Client Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9">
              Client
              {clientFilter && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-[hsl(var(--procore-orange))] text-white rounded">
                  1
                </span>
              )}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[12rem]">
            {clientOptions.length ? (
              clientOptions.map((client) => (
                <DropdownMenuItem key={client} onClick={() => onClientFilterChange(client)}>
                  {client}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No clients found</DropdownMenuItem>
            )}
            {clientFilter && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onClientFilterChange(null)}>
                  Clear filter
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Phase Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9">
              Phase
              {phaseFilter && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-[hsl(var(--procore-orange))] text-white rounded">
                  1
                </span>
              )}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[12rem]">
            {phaseOptions.length ? (
              phaseOptions.map((phase) => (
                <DropdownMenuItem key={phase} onClick={() => onPhaseFilterChange(phase)}>
                  {phase}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No phases found</DropdownMenuItem>
            )}
            {phaseFilter && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onPhaseFilterChange(null)}>
                  Clear filter
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Category Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9">
              Category
              {categoryFilter && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-[hsl(var(--procore-orange))] text-white rounded">
                  1
                </span>
              )}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[12rem]">
            {categoryOptions.length ? (
              categoryOptions.map((category) => (
                <DropdownMenuItem key={category} onClick={() => onCategoryFilterChange(category)}>
                  {category}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No categories found</DropdownMenuItem>
            )}
            {categoryFilter && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onCategoryFilterChange(null)}>
                  Clear filter
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active filter pills */}
        {(clientFilter || phaseFilter || categoryFilter) && (
          <div className="flex flex-wrap items-center gap-2 border-l pl-3 ml-1">
            {clientFilter && (
              <button
                onClick={() => onClientFilterChange(null)}
                className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
              >
                Client: {clientFilter}
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {phaseFilter && (
              <button
                onClick={() => onPhaseFilterChange(null)}
                className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
              >
                Phase: {phaseFilter}
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {categoryFilter && (
              <button
                onClick={() => onCategoryFilterChange(null)}
                className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
              >
                Category: {categoryFilter}
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
