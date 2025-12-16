import { useCallback } from 'react'

interface FormatCurrencyOptions {
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  showCents?: boolean
  nullValue?: string
}

export function useFormatCurrency() {
  return useCallback((
    amount: number | null | undefined, 
    options: FormatCurrencyOptions = {}
  ): string => {
    const {
      minimumFractionDigits = 2,
      maximumFractionDigits = 2,
      showCents = true,
      nullValue = '--'
    } = options

    if (amount === null || amount === undefined) {
      return nullValue
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: showCents ? minimumFractionDigits : 0,
      maximumFractionDigits: showCents ? maximumFractionDigits : 0,
    }).format(amount)
  }, [])
}