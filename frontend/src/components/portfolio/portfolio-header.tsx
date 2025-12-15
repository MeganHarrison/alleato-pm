'use client';

import * as React from 'react';
import { Settings, ChevronDown, FileText, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PortfolioView } from '@/types/portfolio';
import { cn } from '@/lib/utils';

interface PortfolioHeaderProps {
  views: PortfolioView[];
  financialViews: PortfolioView[];
  activeView: string;
  onViewChange: (viewId: string) => void;
  onSettingsClick?: () => void;
  onExport?: (format: 'pdf' | 'csv') => void;
  onCreateProject?: () => void;
}

export function PortfolioHeader({
  views,
  financialViews,
  activeView,
  onViewChange,
  onSettingsClick,
  onExport,
  onCreateProject,
}: PortfolioHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      {/* Title row */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Portfolio</h1>
            <button
              onClick={onSettingsClick}
              className="p-1.5 hover:bg-gray-100 rounded text-gray-500"
              title="Settings"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

        </div>
      </div>

      {/* View tabs */}
      <div className="px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-0 sm:pb-0">
        <nav className="flex items-center gap-0 sm:gap-1 -mb-px overflow-x-auto">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => onViewChange(view.id)}
              className={cn(
                'px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                activeView === view.id
                  ? 'border-[hsl(var(--procore-orange))] text-[hsl(var(--procore-orange))]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              )}
            >
              {view.name}
            </button>
          ))}

          {/* Financial Views dropdown */}
          {financialViews.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors flex items-center gap-1 whitespace-nowrap',
                    financialViews.some((v) => v.id === activeView)
                      ? 'border-[hsl(var(--procore-orange))] text-[hsl(var(--procore-orange))]'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  )}
                >
                  <span className="hidden sm:inline">Financial Views</span>
                  <span className="sm:hidden">Financial</span>
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {financialViews.map((view) => (
                  <DropdownMenuItem
                    key={view.id}
                    onClick={() => onViewChange(view.id)}
                    className={activeView === view.id ? 'bg-accent' : ''}
                  >
                    {view.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Export and Create Project buttons */}
        <div className="flex items-center gap-2 flex-shrink-0 -mt-2 sm:mt-0">
          {/* Export dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-4">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline ml-1">Export</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onExport?.('pdf')}>
                Export to PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport?.('csv')}>
                Export to CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Create Project button */}
          <Button
            onClick={onCreateProject}
            className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange-hover))] text-white h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-4"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline ml-1">Create Project</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
