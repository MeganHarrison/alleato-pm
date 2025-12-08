export interface BudgetLineItem {
  id: string;
  description: string;
  originalBudgetAmount: number;
  budgetModifications: number;
  approvedCOs: number;
  revisedBudget: number;
  jobToDateCostDetail: number;
  directCosts: number;
  pendingChanges: number;
  projectedBudget: number;
  committedCosts: number;
  pendingCostChanges: number;
  projectedCosts: number;
  children?: BudgetLineItem[];
  expanded?: boolean;
}

export interface BudgetView {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
}

export interface BudgetSnapshot {
  id: string;
  name: string;
  date?: Date;
  isCurrent?: boolean;
}

export interface BudgetGroup {
  id: string;
  name: string;
}

export interface BudgetFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan';
  value: string | number;
}

export interface BudgetSyncStatus {
  isSynced: boolean;
  lastJobCostUpdate?: string;
  lastDirectCostUpdate?: string;
  erpSystem?: string;
}

export interface BudgetGrandTotals {
  originalBudgetAmount: number;
  budgetModifications: number;
  approvedCOs: number;
  revisedBudget: number;
  jobToDateCostDetail: number;
  directCosts: number;
  pendingChanges: number;
  projectedBudget: number;
  committedCosts: number;
  pendingCostChanges: number;
  projectedCosts: number;
}
