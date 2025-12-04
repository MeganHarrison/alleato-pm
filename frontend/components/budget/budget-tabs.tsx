'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  href?: string;
}

interface BudgetTabsProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

const tabs: Tab[] = [
  { id: 'budget', label: 'Budget' },
  { id: 'budget-details', label: 'Budget Details' },
  { id: 'forecasting', label: 'Forecasting' },
  { id: 'snapshots', label: 'Project Status Snapshots' },
  { id: 'change-history', label: 'Change History' },
];

export function BudgetTabs({
  activeTab = 'budget',
  onTabChange,
}: BudgetTabsProps) {
  return (
    <div className="border-b bg-white">
      <nav className="flex px-6 gap-6" aria-label="Budget tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className={cn(
              'py-3 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
