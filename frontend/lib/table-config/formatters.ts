import { format } from "date-fns"

/**
 * Format a number as currency (USD)
 */
export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "-"
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "-"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num)
}

/**
 * Format a date string
 */
export function formatDate(
  value: string | Date | null | undefined,
  formatStr: string = "MMM d, yyyy"
): string {
  if (!value) return "-"
  try {
    const date = typeof value === "string" ? new Date(value) : value
    return format(date, formatStr)
  } catch {
    return "-"
  }
}

/**
 * Format a number with optional decimal places
 */
export function formatNumber(
  value: number | string | null | undefined,
  decimals: number = 0
): string {
  if (value === null || value === undefined || value === "") return "-"
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "-"
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

/**
 * Format a number as percentage
 */
export function formatPercent(
  value: number | string | null | undefined,
  decimals: number = 1
): string {
  if (value === null || value === undefined || value === "") return "-"
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "-"
  return `${num.toFixed(decimals)}%`
}

/**
 * Format an array as comma-separated string
 */
export function formatArray(value: string[] | null | undefined): string {
  if (!value || !Array.isArray(value) || value.length === 0) return "-"
  return value.join(", ")
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(value: string | null | undefined, maxLength: number = 50): string {
  if (!value) return "-"
  if (value.length <= maxLength) return value
  return `${value.substring(0, maxLength)}...`
}
