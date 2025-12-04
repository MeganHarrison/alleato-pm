'use client';

import * as React from 'react';
import { Plus, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PortfolioSidebarProps {
  customReports: { id: string; name: string }[];
  onCreateProject?: () => void;
  onReportClick?: (reportId: string) => void;
}

export function PortfolioSidebar({
  customReports,
  onCreateProject,
  onReportClick,
}: PortfolioSidebarProps) {
  const [isReportsExpanded, setIsReportsExpanded] = React.useState(true);

  return (
    <div className="w-64 bg-white border-l border-gray-200 flex flex-col">
      {/* Create Project button */}
      <div className="p-4 border-b border-gray-200">
        <Button
          onClick={onCreateProject}
          className="w-full bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange-hover))] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Project
        </Button>
      </div>

      {/* Custom Reports section */}
      <div className="flex-1 overflow-auto">
        <button
          onClick={() => setIsReportsExpanded(!isReportsExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <span>Custom Reports</span>
          <ChevronRight
            className={cn(
              'w-4 h-4 text-gray-400 transition-transform',
              isReportsExpanded && 'rotate-90'
            )}
          />
        </button>

        {isReportsExpanded && (
          <div className="px-2 pb-2">
            {customReports.length > 0 ? (
              customReports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => onReportClick?.(report.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
                >
                  <FileText className="w-4 h-4 text-gray-400" />
                  {report.name}
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-gray-500">
                No custom reports yet
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          {customReports.length} custom report{customReports.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
