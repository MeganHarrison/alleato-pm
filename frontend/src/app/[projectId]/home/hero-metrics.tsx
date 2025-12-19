'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

interface HeroMetricsProps {
  totalBudget: number
  committed: number
  spent: number
  forecastedCost: number
  changeOrdersTotal: number
  activeTasks: number
}

export function HeroMetrics({
  totalBudget,
  committed,
  spent,
  forecastedCost,
  changeOrdersTotal,
  activeTasks
}: HeroMetricsProps) {
  // Calculate key metrics
  const remainingBudget = totalBudget - spent
  const budgetUtilization = totalBudget > 0 ? (spent / totalBudget) * 100 : 0
  const variance = totalBudget - forecastedCost
  const variancePercent = totalBudget > 0 ? (variance / totalBudget) * 100 : 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-6 mb-20">
      {/* Primary Metric - Budget Remaining */}
      <div className="w-full border border-neutral-200 bg-white p-4 transition-all duration-300 hover:border-brand hover:shadow-sm md:w-1/3 md:p-6">
        <div className="space-y-3">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-500">
            Budget Remaining
          </p>
          <div className="space-y-1">
            <p className="text-4xl md:text-5xl font-light tabular-nums tracking-tight text-brand">
              {formatCurrency(remainingBudget)}
            </p>
            <div className="flex items-baseline gap-3 text-sm text-neutral-600">
              <span className="font-medium tabular-nums">
                {budgetUtilization.toFixed(1)}% utilized
              </span>
              <span className="text-neutral-400">•</span>
              <span className="tabular-nums">
                {formatCurrency(spent)} of {formatCurrency(totalBudget)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Variance */}
      <div className="w-full border border-neutral-200 bg-white p-4 transition-all duration-300 hover:border-brand hover:shadow-sm md:w-1/3 md:p-6">
        <div className="space-y-3">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-500">
            Forecast Variance
          </p>
          <div className="space-y-2">
            <p className={`text-3xl md:text-4xl font-light tabular-nums tracking-tight ${
              variance >= 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              {variance >= 0 ? '+' : ''}{formatCurrency(variance)}
            </p>
            <div className="flex items-center gap-1.5">
              {variance >= 0 ? (
                <>
                  <TrendingUp className="h-3.5 w-3.5 text-green-700" />
                  <span className="text-xs font-medium text-green-700 tabular-nums">
                    {variancePercent.toFixed(1)}% under
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3.5 w-3.5 text-red-700" />
                  <span className="text-xs font-medium text-red-700 tabular-nums">
                    {Math.abs(variancePercent).toFixed(1)}% over
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Orders */}
      <div className="w-full border border-neutral-200 bg-white p-4 transition-all duration-300 hover:border-brand hover:shadow-sm md:w-1/3 md:p-6">
        <div className="space-y-3">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-500">
            Change Orders
          </p>
          <div className="space-y-1">
            <p className="text-3xl md:text-4xl font-light tabular-nums tracking-tight text-neutral-900">
              {changeOrdersTotal}
            </p>
            <p className="text-xs text-neutral-500">
              Approved
            </p>
          </div>
        </div>
      </div>


    </div>
  )
}
