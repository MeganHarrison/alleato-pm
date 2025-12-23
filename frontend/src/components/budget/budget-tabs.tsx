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
    <div>
      <nav className="flex gap-6 overflow-x-auto whitespace-nowrap" aria-label="Budget tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange?.(tab.id)}
            className={cn(
              'py-3 text-xs font-medium border-b-2 transition-colors md:text-sm',
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
