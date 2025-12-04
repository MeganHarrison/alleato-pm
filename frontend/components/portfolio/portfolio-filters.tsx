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
} from '@/components/ui/dropdown-menu';
import { PortfolioViewType, StatusFilter } from '@/types/portfolio';
import { cn } from '@/lib/utils';

interface PortfolioFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  viewType: PortfolioViewType;
  onViewTypeChange: (type: PortfolioViewType) => void;
  activeFiltersCount: number;
  onAddFilter?: () => void;
  onClearFilters?: () => void;
}

export function PortfolioFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewType,
  onViewTypeChange,
  activeFiltersCount,
  onAddFilter,
  onClearFilters,
}: PortfolioFiltersProps) {
  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const viewTypes: { value: PortfolioViewType; icon: React.ElementType; label: string }[] = [
    { value: 'list', icon: List, label: 'List View' },
    { value: 'thumbnails', icon: LayoutGrid, label: 'Thumbnails View' },
    { value: 'overview', icon: BarChart3, label: 'Overview' },
    { value: 'map', icon: Map, label: 'Map View' },
  ];

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      {/* Left side - Search and filters */}
      <div className="flex items-center gap-3">
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

        {/* Add Filters dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9">
              Add Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-[hsl(var(--procore-orange))] text-white rounded">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={onAddFilter}>
              Project Stage
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAddFilter}>
              Project Type
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAddFilter}>
              My Role
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAddFilter}>
              Region
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status filter pills */}
        <div className="flex items-center gap-1 border-l pl-3 ml-1">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onStatusFilterChange(option.value)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-full transition-colors',
                statusFilter === option.value
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Clear all button */}
        {(activeFiltersCount > 0 || statusFilter !== 'all' || searchQuery) && (
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
    </div>
  );
}
