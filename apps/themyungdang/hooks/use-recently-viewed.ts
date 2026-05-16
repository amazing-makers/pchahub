'use client'

import { useCallback, useEffect, useState } from 'react'

const RV_KEY   = 'tmyd-recently-viewed'
const RV_EVENT = 'tmyd-rv-change'
const MAX_ITEMS = 10

// ── Storage helpers ────────────────────────────────────────────────────────────

function readRecent(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(RV_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function writeRecent(ids: string[]) {
  try {
    localStorage.setItem(RV_KEY, JSON.stringify(ids))
    window.dispatchEvent(new CustomEvent(RV_EVENT))
  } catch {
    /* ignore quota errors */
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Recently-viewed listing IDs, stored in localStorage.
 * Ordered from most-recent to oldest. Capped at MAX_ITEMS.
 *
 * Usage:
 *   const { recentIds, markViewed } = useRecentlyViewed()
 *
 *   // In a listing detail page, call once on mount:
 *   useEffect(() => { markViewed(listingId) }, [listingId])
 */
export function useRecentlyViewed() {
  const [recentIds, setRecentIds] = useState<string[]>([])
  const [hydrated,  setHydrated]  = useState(false)

  useEffect(() => {
    // Hydrate from localStorage
    setRecentIds(readRecent())
    setHydrated(true)

    const handler = () => setRecentIds(readRecent())
    window.addEventListener(RV_EVENT, handler)
    return () => window.removeEventListener(RV_EVENT, handler)
  }, [])

  const markViewed = useCallback((id: string) => {
    setRecentIds(prev => {
      // Remove existing occurrence (if any), prepend, cap length
      const next = [id, ...prev.filter(x => x !== id)].slice(0, MAX_ITEMS)
      writeRecent(next)
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    writeRecent([])
    setRecentIds([])
  }, [])

  return { recentIds, markViewed, clearHistory, hydrated }
}
