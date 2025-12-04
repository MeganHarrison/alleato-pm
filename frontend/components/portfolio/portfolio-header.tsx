'use client';

import * as React from 'react';
import { Settings, ChevronDown, FileText } from 'lucide-react';
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
}

export function PortfolioHeader({
  views,
  financialViews,
  activeView,
  onViewChange,
  onSettingsClick,
  onExport,
}: PortfolioHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      {/* Title row */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900">Portfolio</h1>
          <button
            onClick={onSettingsClick}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-500"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Export dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9">
                <FileText className="w-4 h-4 mr-2" />
                Export
                <ChevronDown className="w-4 h-4 ml-2" />
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
        </div>
      </div>

      {/* View tabs */}
      <div className="px-6">
        <nav className="flex items-center gap-1 -mb-px">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => onViewChange(view.id)}
              className={cn(
                'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                activeView === view.id
                  ? 'border-[hsl(var(--procore-orange))] text-[hsl(var(--procore-orange))]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              )}
            >
              {view.name}
            </button>
          ))}

          {/* Financial Views dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1',
                  financialViews.some((v) => v.id === activeView)
                    ? 'border-[hsl(var(--procore-orange))] text-[hsl(var(--procore-orange))]'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                )}
              >
                Financial Views
                <ChevronDown className="w-4 h-4" />
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
        </nav>
      </div>
    </div>
  );
}
