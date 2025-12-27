'use client';

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
  { id: 'cost-codes', label: 'Cost Codes' },
  { id: 'forecasting', label: 'Forecasting' },
  { id: 'snapshots', label: 'Project Status Snapshots' },
  { id: 'change-history', label: 'Change History' },
  { id: 'settings', label: 'Settings' },
];

export function BudgetTabs({
  activeTab = 'budget',
  onTabChange,
}: BudgetTabsProps) {
  return (
    <div className="border-b bg-white">
      <div className="px-4 sm:px-6 lg:px-12">
        <nav className="-mb-px flex space-x-8" aria-label="Budget tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange?.(tab.id)}
              className={cn(
                'group inline-flex items-center gap-2 border-b-2 py-4 px-1 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'border-brand text-brand'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              )}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
