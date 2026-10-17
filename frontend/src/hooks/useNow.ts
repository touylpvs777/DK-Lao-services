import { useEffect, useState } from 'react'

/** The current time, refreshed on an interval (default every 30 s). */
export function useNow(intervalMs = 30_000): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs])
  return now
}

function dateLocale(language: string): string {
  if (language === 'lo') return 'lo-LA'
  if (language === 'th') return 'th-TH'
  return 'en-GB'
}

export function formatClock(date: Date): string {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function formatLongDate(date: Date, language: string): string {
  return date.toLocaleDateString(dateLocale(language), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatShortDate(date: Date, language: string): string {
  return date.toLocaleDateString(dateLocale(language), { weekday: 'short', day: 'numeric', month: 'short' })
}
