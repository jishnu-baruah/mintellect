import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`
}

export function getTrustScoreClass(score: number): string {
  if (score >= 0.8) return "high"
  if (score >= 0.5) return "medium"
  return "low"
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

